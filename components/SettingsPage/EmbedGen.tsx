import React from "react";

import { SettingsProps } from "./base";

import { ValidAccent } from "../ColorMap";

import { LocaleMap } from "../../i18n";

interface EmbedGenProps extends SettingsProps {
    id: string;
}

interface EmbedGenState {
    genUrl: string;
    accent: typeof ValidAccent[number];
    lang?: keyof typeof LocaleMap & string;
    isDark: boolean;
}

function generateEmbedUrl(base: string, id: string, accent: string, lang: string, dark: boolean) {
    let finalURL = base + `/embed?id=${id}`;
    if (accent !== "green") {
        finalURL += `&accent=${accent}`;
    }
    if (lang !== "id") {
        finalURL += `&lang=${lang}`;
    }
    if (dark) {
        finalURL += "&dark=true";
    }
    return finalURL;
}

class EmbedGenSettings extends React.Component<EmbedGenProps, EmbedGenState> {
    constructor(props: EmbedGenProps) {
        super(props);
        this.setAccentColor = this.setAccentColor.bind(this);
        this.setEmbedLang = this.setEmbedLang.bind(this);
        this.setDarkMode = this.setDarkMode.bind(this);
        this.state = {
            genUrl: "",
            accent: "green",
            lang: "id",
            isDark: false,
        };
    }

    componentDidMount() {
        const windowURL = window.location.origin;
        this.setState({
            genUrl: generateEmbedUrl(
                windowURL,
                this.props.id,
                this.state.accent,
                this.state.lang,
                this.state.isDark
            ),
        });
    }

    setAccentColor(aksen: string) {
        const { genUrl } = this.state;
        const windowURL = window.location.origin;
        const generateNewURL = generateEmbedUrl(
            windowURL,
            this.props.id,
            aksen,
            this.state.lang,
            this.state.isDark
        );

        this.setState({ accent: aksen as typeof ValidAccent[number] });
        if (genUrl !== generateNewURL) {
            this.setState({ genUrl: generateNewURL });
        }
    }

    setEmbedLang(lang: string) {
        const { genUrl } = this.state;
        const windowURL = window.location.origin;
        const generateNewURL = generateEmbedUrl(
            windowURL,
            this.props.id,
            this.state.accent,
            lang,
            this.state.isDark
        );

        this.setState({ lang: lang as keyof typeof LocaleMap });
        if (genUrl !== generateNewURL) {
            this.setState({ genUrl: generateNewURL });
        }
    }

    setDarkMode(dark: boolean) {
        const { genUrl } = this.state;
        const windowURL = window.location.origin;
        const generateNewURL = generateEmbedUrl(
            windowURL,
            this.props.id,
            this.state.accent,
            this.state.lang,
            dark
        );

        this.setState({ isDark: dark });
        if (genUrl !== generateNewURL) {
            this.setState({ genUrl: generateNewURL });
        }
    }

    render() {
        const accentToName = {
            green: "Hijau",
            blue: "Biru",
            yellow: "Kuning",
            red: "Merah",
            indigo: "Indigo",
            purple: "Ungu",
            pink: "Pink",
            none: "Tidak ada",
        };

        const langToName = {
            id: "Indonesia",
            en: "English",
            su: "Sunda",
            jv: "Jawa",
            jp: "日本語",
        };

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;

        return (
            <>
                <div className="flex flex-col py-1">
                    <h3 className="font-semibold dark:text-white mb-2 text-lg">Website Embed</h3>
                    <div className="text-sm font-semibold text-blue-400">
                        Buat URL untuk embed daftar utang di Website anda!
                    </div>
                    <div className="text-sm font-semibold text-blue-400">
                        Info lebih lanjut:{" "}
                        <a
                            className="text-yellow-500 no-underline hover:underline hover:opacity-70"
                            href="https://naoti.me/docs/integrasi/website/#mengatur-ukuran-iframe"
                        >
                            Dokumentasi
                        </a>
                    </div>
                    <div className="flex flex-col md:flex-row pb-2 gap-2">
                        <div className="flex flex-col w-full md:w-1/2">
                            <div className="flex flex-col mt-2">
                                <input
                                    value={this.state.genUrl}
                                    onFocus={(ev) => ev.target.select()}
                                    className="form-input block w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border-2 dark:border-gray-800 focus:border-yellow-500 dark:focus:border-yellow-500 transition duration-200 overflow-ellipsis"
                                    readOnly
                                />
                            </div>
                            <div className="flex flex-col mt-4">
                                <label className="text-sm font-medium dark:text-white">Aksen Warna</label>
                                <select
                                    className="form-select mt-1 block w-full bg-gray-200"
                                    value={this.state.accent}
                                    onChange={(ev) => outerThis.setAccentColor(ev.target.value)}
                                >
                                    {Object.keys(accentToName).map((res) => {
                                        return (
                                            <option key={`aksen-pilih-${res}`} value={res}>
                                                {accentToName[res]}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="flex flex-col mt-4">
                                <label className="text-sm font-medium dark:text-white">Bahasa</label>
                                <select
                                    className="form-select mt-1 block w-full bg-gray-200"
                                    value={this.state.lang}
                                    onChange={(ev) => outerThis.setEmbedLang(ev.target.value)}
                                >
                                    {Object.keys(langToName).map((res) => {
                                        return (
                                            <option key={`lang-pilih-${res}`} value={res}>
                                                {langToName[res]}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="flex flex-row mt-4">
                                <input
                                    type="checkbox"
                                    className="form-checkbox border-2"
                                    checked={this.state.isDark}
                                    onChange={(ev) => outerThis.setDarkMode(ev.target.checked)}
                                />
                                <span className="text-sm ml-2 font-medium dark:text-white">Mode Gelap</span>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <label className="text-base font-medium dark:text-white ml-1">Pratinjau</label>
                            <iframe src={this.state.genUrl} className="w-full mt-2" />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default EmbedGenSettings;
