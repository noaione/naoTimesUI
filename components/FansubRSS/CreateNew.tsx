import axios from "axios";
import React from "react";
import Router from "next/router";

import SelectAsync from "react-select/async";
import { ActionMeta } from "react-select";
import LoadingCircle from "../LoadingCircle";
import { parseFeed } from "../../lib/utils";
import SampleViewer from "./SampleViewer";

function matchFilterProper(data: any, inputValue: string) {
    const matchRe = new RegExp(`(${inputValue})`, "i");
    const dataID = data.id;
    const dataName = data.name;
    return Boolean(dataID.match(matchRe)) || Boolean(dataName.match(matchRe));
}

const loadChannel = (inputValue: string, callback: Function) => {
    axios
        .get("/api/fsrss/channelfind", { responseType: "json" })
        .then((res) => {
            const results = res.data;
            const properResults = results.results.filter((e: any) => matchFilterProper(e, inputValue));
            callback(properResults);
        })
        .catch((err) => {
            console.error(err);
            callback([]);
        });
};

function optionValueChannel(data: any) {
    const { id, name } = data;
    return `#${name} (${id})`;
}

interface FansubRSSCreateNewProps {
    id: string;
    onErrorModal(errorText: string): void;
}

interface FansubRSSCreateNewState {
    url?: string;
    kanal?: string;
    isSubmit?: boolean;
    validating?: boolean;
    isValid?: boolean;
    sample?: any[];
}

class FansubRSSCreateNew extends React.Component<FansubRSSCreateNewProps, FansubRSSCreateNewState> {
    constructor(props: FansubRSSCreateNewProps) {
        super(props);
        this.submitNewRSS = this.submitNewRSS.bind(this);
        this.validateRSS = this.validateRSS.bind(this);
        this.onChannelSelection = this.onChannelSelection.bind(this);

        this.state = {
            url: "",
            kanal: "",
            isSubmit: false,
            isValid: false,
            validating: false,
            sample: [],
        };
    }

    async submitNewRSS() {
        if (this.state.isSubmit || !this.state.isValid) {
            return;
        }

        if (this.state.url.trim().length < 1) {
            this.props.onErrorModal("Mohon masukan URL RSS terlebih dahulu!");
            return;
        }
        if (this.state.kanal.trim().length < 1) {
            this.props.onErrorModal("Mohon pilih #kanal terlebih dahulu!");
            return;
        }

        this.setState({ isSubmit: true });
        const bodyBag = {
            channel: this.state.kanal,
            url: this.state.url,
            sample: this.state.sample,
        };

        const apiRes = await fetch("/api/fsrss/new", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyBag),
            method: "POST",
        });

        const jsonRes = await apiRes.json();
        if (jsonRes.success) {
            Router.push(`/admin/fansubrss/${jsonRes.id}`);
        } else {
            this.props.onErrorModal(jsonRes.message);
            this.setState({ isSubmit: false });
        }
    }

    async validateRSS() {
        if (this.state.validating || this.state.isValid) {
            return;
        }
        if (this.state.url.trim().length < 1) {
            return;
        }

        this.setState({ validating: true });
        const [success, result] = await parseFeed(this.state.url);
        if (!success || !result) {
            this.props.onErrorModal("Gagal memvalidasi URL, mohon coba lagi");
            this.setState({ validating: false });
            return;
        }

        if (result.results.length > 0) {
            this.setState({ isValid: true, validating: false, sample: result.results });
            return;
        }

        this.setState({ validating: false });
    }

    onChannelSelection(data: any, action: ActionMeta<any>) {
        if (!["select-option", "clear"].includes(action.action)) {
            return;
        }
        if (action.action === "select-option") {
            const { id } = data;
            this.setState({
                kanal: id,
            });
        } else if (action.action === "clear") {
            this.setState({
                kanal: "",
            });
        }
    }

    render() {
        const { isSubmit, isValid } = this.state;

        let canSubmit = false;
        if (isValid && !isSubmit) {
            canSubmit = true;
        }

        return (
            <>
                <div className="grid gap-2 grid-cols-1">
                    <div className="flex flex-col p-5 bg-white dark:bg-gray-700 rounded shadow-md">
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <label className="font-semibold dark:text-white text-sm">RSS URI</label>
                                <input
                                    className="form-darkable w-full lg:w-1/2 mt-1"
                                    value={this.state.url}
                                    onChange={(ev) => this.setState({ url: ev.target.value, isValid: false })}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mt-2">
                            <label className="font-semibold dark:text-white text-sm">#kanal</label>
                            <SelectAsync
                                className="w-full lg:w-1/2 mt-1 rounded-lg"
                                inputId="discord-channel-selector-input"
                                cacheOptions
                                defaultOptions
                                loadOptions={loadChannel}
                                getOptionLabel={optionValueChannel}
                                filterOption={() => true}
                                onChange={this.onChannelSelection}
                                classNamePrefix="rselect"
                                placeholder="Pilih #kanal..."
                                isClearable
                            />
                        </div>
                        <div className="flex flex-row gap-2 mt-4">
                            <button
                                className={`flex flex-row px-3 py-2 rounded-lg ${
                                    this.state.validating
                                        ? "bg-blue-400 cursor-not-allowed opacity-60"
                                        : "bg-blue-500 hover:bg-blue-600 opacity-100"
                                } transition duration-200 text-white justify-center items-center focus:outline-none`}
                                onClick={this.validateRSS}
                            >
                                {this.state.validating && <LoadingCircle className="mt-0 ml-0 mr-2" />}
                                <span className="font-semibold">Validasi</span>
                            </button>
                            <button
                                className={`flex flex-row px-3 py-2 rounded-lg ${
                                    !canSubmit
                                        ? "bg-green-400 cursor-not-allowed opacity-60"
                                        : "bg-green-500 hover:bg-green-600 opacity-100"
                                } transition duration-200 text-white justify-center items-center focus:outline-none`}
                                onClick={this.submitNewRSS}
                            >
                                {this.state.isSubmit && <LoadingCircle className="mt-0 ml-0 mr-2" />}
                                <span className="font-semibold">Tambah</span>
                            </button>
                        </div>
                        {this.state.sample.length > 0 && (
                            <div className="flex flex-col mt-4">
                                <SampleViewer sample={this.state.sample[0]} animate={true} />
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }
}

export default FansubRSSCreateNew;
