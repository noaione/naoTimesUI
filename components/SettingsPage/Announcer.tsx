import { toString } from "lodash";
import React from "react";
import LoadingCircle from "../LoadingCircle";

interface AnnouncerProps {
    announcerId?: string;
    onErrorModal(errString: string): void;
}

interface AnnouncerState {
    announcerId?: string;
    oldAnnouncer?: string;
    isSubmitting: boolean;
}

class AnnouncerSettings extends React.Component<AnnouncerProps, AnnouncerState> {
    constructor(props: AnnouncerProps) {
        super(props);
        this.submitNew = this.submitNew.bind(this);
        this.state = {
            announcerId: this.props.announcerId,
            oldAnnouncer: this.props.announcerId,
            isSubmitting: false,
        };
    }

    async submitNew() {
        if (this.state.isSubmitting) {
            return;
        }
        if (this.state.announcerId === this.state.oldAnnouncer) {
            return;
        }
        this.setState({ isSubmitting: true });
        const stringfied = toString(this.state.announcerId);

        const bodyBag = {
            channelid: toString(this.state.announcerId),
        };
        const apiRes = await fetch("/api/showtimes/settings/announcer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyBag),
        });

        const jsonRes = await apiRes.json();
        if (jsonRes.code === 200) {
            this.setState({ oldAnnouncer: stringfied, announcerId: stringfied, isSubmitting: false });
        } else {
            this.setState({ isSubmitting: false });
            this.props.onErrorModal(jsonRes.message as string);
        }
    }

    render() {
        const { oldAnnouncer, isSubmitting } = this.state;

        const IDTextData =
            typeof oldAnnouncer === "string" ? `ID: ${oldAnnouncer}` : "Tidak ada kanal #announcer";

        return (
            <>
                <div className="flex flex-col py-1">
                    <h3 className="font-semibold dark:text-white mb-2 text-lg">Ubah Kanal #announcer</h3>
                    <div className="flex flex-col">
                        <span className="dark:text-white">{IDTextData}</span>
                    </div>
                    <div className="flex flex-row pb-2">
                        <div className="flex flex-col">
                            <div className="w-full mt-2 mb-1">
                                <input
                                    type="number"
                                    className="form-input w-96 py-1 rounded-lg border-2 transition-colors duration-200 ease-in-out border-gray-200 focus:border-yellow-600 focus:outline-none"
                                    placeholder="xxxxxxxxxxxxxx"
                                    onChange={(ev) =>
                                        this.setState({ announcerId: toString(ev.target.value) })
                                    }
                                />
                            </div>
                            <div className="flex mt-2">
                                <button
                                    onClick={this.submitNew}
                                    className={`rounded text-white px-4 py-2 ${
                                        isSubmitting
                                            ? "bg-blue-500 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    } transition-colors duration-200 flex flex-row items-center focus:outline-none`}
                                >
                                    {isSubmitting && <LoadingCircle className="ml-0 mt-0" />}
                                    <span className={isSubmitting ? "mt-0.5 font-semibold" : "font-semibold"}>
                                        Ubah
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default AnnouncerSettings;
