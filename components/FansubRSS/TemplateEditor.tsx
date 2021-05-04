import { cloneDeep, Dictionary, toString } from "lodash";
import { DateTime } from "luxon";
import React from "react";
import Router from "next/router";

import { RGBColor, SketchPicker } from "react-color";

import LoadingCircle from "../LoadingCircle";
import PreviewGen from "./PreviewGenerator";
import { combineRGB, extractRGB } from "./PreviewGenerator/color";
import { IEmbed } from "./PreviewGenerator/embed";

import { FansubRSSEmbed, FansubRSSFeeds } from "../../lib/fsrss";
import { isNone, Nullable } from "../../lib/utils";

function matchPattern(regex: RegExp, match: string) {
    let m: RegExpExecArray;
    const matchedTexts = [];
    while ((m = regex.exec(match)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match) => {
            matchedTexts.push(match);
        });
    }
    const filterDupes = [];
    matchedTexts.forEach((r) => {
        if (!filterDupes.includes(r)) {
            filterDupes.push(r);
        }
    });
    return matchedTexts;
}

function parseMessage(message?: string, entryData?: any) {
    if (!message && !entryData) {
        return null;
    }
    const matches = matchPattern(/({[^{}]+})/gim, message);
    const filteredMatches = [...new Set(matches)] as string[];
    const msgFmtData = filteredMatches.map((r) => r.replace("{", "").replace("}", ""));

    msgFmtData.forEach((rep) => {
        const match = entryData[rep] ?? "?????";
        if (Array.isArray(match)) {
            const mergedString = match.map((r) => toString(r));
            message = message.replaceAll("{" + rep + "}", mergedString.join(", "));
        } else {
            message = message.replaceAll("{" + rep + "}", match);
        }
    });
    return message.replaceAll("\\n", "\n");
}

function parseEmbed(embedData?: any, entryData?: any): Nullable<IEmbed> {
    if (!embedData && !entryData) {
        return null;
    }
    if (!embedData) {
        return null;
    }

    let enableTimestamp = false;
    const filtered: Dictionary<any> = {};
    for (const [key, v] of Object.entries(embedData)) {
        if (!v) {
            continue;
        }
        if (typeof v === "boolean") {
            if (key === "timestamp") {
                enableTimestamp = v;
            }
            continue;
        }
        if (typeof v === "number") {
            filtered[key] = v;
            continue;
        }
        filtered[key] = parseMessage(v as string, entryData);
    }

    const newEmbedFormat: IEmbed = {};
    if (typeof filtered.title === "string") {
        newEmbedFormat.title = filtered.title;
    }
    if (typeof filtered.description === "string") {
        newEmbedFormat.description = filtered.description;
    }
    if (typeof filtered.url === "string") {
        newEmbedFormat.url = filtered.url;
    }
    if (typeof filtered.color === "number") {
        newEmbedFormat.color = filtered.color;
    }
    if (typeof filtered.thumbnail === "string") {
        newEmbedFormat.thumbnail = {
            url: filtered.thumbnail,
        };
    }
    if (typeof filtered.image === "string") {
        newEmbedFormat.image = {
            url: filtered.image,
        };
    }

    if (typeof filtered.footer === "string") {
        if (typeof filtered.footer_img === "string") {
            newEmbedFormat.footer = {
                text: filtered.footer,
                icon_url: filtered.footer_img,
            };
        } else {
            newEmbedFormat.footer = {
                text: filtered.footer,
            };
        }
    }
    if (enableTimestamp) {
        newEmbedFormat.timestamp = DateTime.now().toMillis();
    }

    if (Object.keys(newEmbedFormat).length < 1) {
        return null;
    }
    return newEmbedFormat;
}

const defaultEmbedData: FansubRSSEmbed = {
    title: null,
    description: null,
    url: null,
    thumbnail: null,
    image: null,
    footer: null,
    footer_img: null,
    color: null,
    timestamp: false,
};

interface TemplateEngineState {
    message?: string;
    embed?: FansubRSSEmbed;
    darkMode: boolean;
    compactMode: boolean;
    showColPick: boolean;
    rawCol: RGBColor;
    isSubmit: boolean;
}

interface TemplateEngineProps {
    settings: FansubRSSFeeds;
    samples: any;
    onErrorModal(errorText: string): void;
}

function messageVerify(message?: string) {
    if (!message) {
        return null;
    }

    if (message.trim().length < 1) {
        return null;
    }
    return message;
}

function verifyEmbed(embedObject?: FansubRSSEmbed) {
    if (!embedObject) {
        return {};
    }
    const keys = Object.keys(embedObject);
    if (keys.length < 1) {
        return {};
    }
    const realValid = [];
    for (let i = 0; i < keys.length; i++) {
        const elem = embedObject[keys[i]];
        if (typeof elem === "string") {
            const msgParsed = messageVerify(elem);
            if (msgParsed !== null) {
                realValid.push(keys[i]);
            }
        } else if (typeof elem === "number" || typeof elem === "boolean") {
            realValid.push(keys[i]);
        }
    }

    if (realValid.length < 1) {
        return {};
    }
    const actuallyCorrect: FansubRSSEmbed = cloneDeep(defaultEmbedData);
    realValid.forEach((key) => {
        const elem = embedObject[key];
        actuallyCorrect[key] = elem;
    });

    return actuallyCorrect;
}

class TemplateEngine extends React.Component<TemplateEngineProps, TemplateEngineState> {
    constructor(props) {
        super(props);
        this.updateEmbed = this.updateEmbed.bind(this);
        this.submitNewTemplate = this.submitNewTemplate.bind(this);
        const realEmbed = isNone(this.props.settings.embed)
            ? cloneDeep(defaultEmbedData)
            : cloneDeep(this.props.settings.embed);
        const defaultColor: RGBColor = { r: 79, g: 84, b: 92 };
        const realColor = typeof realEmbed.color === "number" ? extractRGB(realEmbed.color) : defaultColor;
        this.state = {
            darkMode: true,
            compactMode: false,
            showColPick: false,
            rawCol: realColor,
            message: this.props.settings.message,
            isSubmit: false,
            embed: realEmbed,
        };
    }

    async submitNewTemplate() {
        if (this.state.isSubmit) {
            return;
        }
        this.setState({ isSubmit: true });

        const bodyBag = {
            id: this.props.settings.id,
            changes: {
                message: messageVerify(this.state.message),
                embed: verifyEmbed(this.state.embed),
            },
        };

        const apiRes = await fetch("/api/fsrss/update", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyBag),
            method: "POST",
        });

        const jsonRes = await apiRes.json();
        if (jsonRes.success) {
            Router.reload();
        } else {
            this.props.onErrorModal(jsonRes.message);
        }
    }

    updateEmbed(key: keyof FansubRSSEmbed, value: any) {
        const { embed } = this.state;
        const newAAA = {};
        newAAA[key] = value;
        const updatedEmbed = Object.assign({}, embed, newAAA);
        this.setState({ embed: updatedEmbed });
    }

    render() {
        const { message, embed } = this.state;
        const { samples } = this.props;

        const contentData = {
            content: parseMessage(message, samples),
            embed: parseEmbed(embed, samples),
        };

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;

        return (
            <>
                <div className="flex flex-col lg:flex-row w-full gap-4">
                    <div className="flex flex-col w-full lg:w-1/2 gap-3">
                        <div className="flex flex-col">
                            <label className="text-lg font-semibold dark:text-white mb-2">Pesan</label>
                            <input
                                className="form-input rounded-lg dark:bg-gray-800 dark:text-gray-100"
                                value={this.state.message}
                                onChange={(ev) => this.setState({ message: ev.target.value })}
                            />
                        </div>
                        <label className="text-lg font-semibold dark:text-white">Embed</label>
                        <div className="flex flex-col -mt-2">
                            <label className="text-sm font-semibold dark:text-white mb-2">Judul</label>
                            <input
                                className="form-input rounded-lg dark:bg-gray-800 dark:text-gray-100"
                                value={this.state.embed.title}
                                onChange={(ev) => outerThis.updateEmbed("title", ev.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold dark:text-white mb-2">Deskripsi</label>
                            <textarea
                                className="form-textarea rounded-lg dark:bg-gray-800 dark:text-gray-100"
                                value={this.state.embed.description}
                                onChange={(ev) => outerThis.updateEmbed("description", ev.target.value)}
                            />
                        </div>
                        <div className="flex flex-col -mt-2">
                            <label className="text-sm font-semibold dark:text-white mb-2">URL</label>
                            <input
                                className="form-input rounded-lg dark:bg-gray-800 dark:text-gray-100"
                                value={this.state.embed.url}
                                onChange={(ev) => outerThis.updateEmbed("url", ev.target.value)}
                            />
                        </div>
                        <label className="text-sm font-semibold dark:text-white">Gambar dan Thumbnail</label>
                        <div className="flex flex-col md:flex-row w-full gap-2">
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold dark:text-white mb-2">Gambar</label>
                                <input
                                    className="form-input rounded-lg dark:bg-gray-800 dark:text-gray-100"
                                    value={this.state.embed.image}
                                    onChange={(ev) => outerThis.updateEmbed("image", ev.target.value)}
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold dark:text-white mb-2">
                                    Thumbnail
                                </label>
                                <input
                                    className="form-input rounded-lg dark:bg-gray-800 dark:text-gray-100"
                                    value={this.state.embed.thumbnail}
                                    onChange={(ev) => outerThis.updateEmbed("thumbnail", ev.target.value)}
                                />
                            </div>
                        </div>
                        <label className="text-sm font-semibold dark:text-white">Footer</label>
                        <div className="flex flex-col md:flex-row w-full gap-2">
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold dark:text-white mb-2">Teks</label>
                                <input
                                    className="form-input rounded-lg dark:bg-gray-800 dark:text-gray-100"
                                    value={this.state.embed.footer}
                                    onChange={(ev) => outerThis.updateEmbed("footer", ev.target.value)}
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="text-sm font-semibold dark:text-white mb-2">Ikon</label>
                                <input
                                    className="form-input rounded-lg dark:bg-gray-800 dark:text-gray-100"
                                    value={this.state.embed.footer_img}
                                    onChange={(ev) => outerThis.updateEmbed("footer_img", ev.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox rounded"
                                checked={this.state.embed.timestamp}
                                onChange={(ev) => outerThis.updateEmbed("timestamp", ev.target.checked)}
                            />
                            <span className="dark:text-white ml-2">Tambah timestamp</span>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold dark:text-white mb-2">Aksen Warna</label>
                            <div className="flex flex-row gap-2">
                                <input
                                    className="form-input rounded-lg dark:bg-gray-800 dark:text-gray-100 w-full"
                                    value={combineRGB(
                                        this.state.rawCol.r,
                                        this.state.rawCol.g,
                                        this.state.rawCol.b
                                    ).toString()}
                                    readOnly
                                />
                                <button
                                    className={`rounded px-4 bg-blue-500 hover:bg-blue-600 text-white`}
                                    onClick={() =>
                                        outerThis.setState({ showColPick: !outerThis.state.showColPick })
                                    }
                                >
                                    {this.state.showColPick ? "Tutup" : "Pilih"}
                                </button>
                            </div>
                            <div className="relative">
                                {this.state.showColPick && (
                                    <SketchPicker
                                        className="block z-20 mt-2"
                                        color={this.state.rawCol}
                                        disableAlpha
                                        onChange={(col, _e) => {
                                            outerThis.updateEmbed(
                                                "color",
                                                combineRGB(col.rgb.r, col.rgb.g, col.rgb.b)
                                            );
                                            outerThis.setState({ rawCol: col.rgb });
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <button
                                className={`flex flex-row px-3 py-2 rounded-lg ${
                                    this.state.isSubmit
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600"
                                } transition duration-200 text-white justify-center items-center`}
                                onClick={this.submitNewTemplate}
                            >
                                {this.state.isSubmit && <LoadingCircle className="mt-0 ml-0 mr-2" />}
                                <span className="font-semibold">Ubah</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col w-full lg:w-1/2">
                        <label className="text-lg font-semibold dark:text-white mb-2">Pratinjau</label>
                        <PreviewGen
                            data={contentData}
                            darkTheme={this.state.darkMode}
                            compactMode={this.state.compactMode}
                        />
                        <div className="flex flex-row mt-2 gap-2">
                            <div className="flex flex-row items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox rounded"
                                    checked={this.state.darkMode}
                                    onChange={(ev) => outerThis.setState({ darkMode: ev.target.checked })}
                                />
                                <span className="dark:text-white ml-2">Mode Gelap</span>
                            </div>
                            <div className="flex flex-row items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox rounded"
                                    checked={this.state.compactMode}
                                    onChange={(ev) => outerThis.setState({ compactMode: ev.target.checked })}
                                />
                                <span className="dark:text-white ml-2">Compact?</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default TemplateEngine;
