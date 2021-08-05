import React, { useState } from "react";
import Router from "next/router";
import AcceptIcon from "mdi-react/CheckAllIcon";
import DenyIcon from "mdi-react/CloseIcon";
import GoBackIcon from "mdi-react/ArrowLeftIcon";

import LoadingCircle from "@/components/LoadingCircle";

interface CollabTargetConfirmProps {
    konfirmId: string;
    sourceId: string;
    targetId: string;
    animeId: string;
    onError?: (errorText: string) => void;
}

interface CollabConfirmBtnProps {
    onClick?: () => void;
    type: "yes" | "no";
    disabled?: boolean;
}

type CollabTargetConfirmBtnProps = CollabTargetConfirmProps & CollabConfirmBtnProps;

interface CollabTargetConfirmState {
    isSubmitting: boolean;
}

class CollabTargetConfirmButton extends React.Component<
    CollabTargetConfirmBtnProps,
    CollabTargetConfirmState
> {
    constructor(props: CollabTargetConfirmBtnProps) {
        super(props);
        this.showError = this.showError.bind(this);
        this.submitProcess = this.submitProcess.bind(this);
        this.state = {
            isSubmitting: false,
        };
    }

    showError(errorText: string) {
        if (typeof this.props.onError === "function") {
            this.props.onError(errorText);
        }
    }

    async submitProcess() {
        if (this.state.isSubmitting) {
            return;
        }
        this.setState({ isSubmitting: true });
        if (typeof this.props.onClick === "function") {
            this.props.onClick();
        }
        let apiRoute = "/api/showtimes/proyek/collab/confirm";
        if (this.props.type === "no") {
            apiRoute = `/api/showtimes/proyek/collab/${this.props.animeId}/cancel`;
        }

        const dataToSent = {
            id: this.props.konfirmId,
            serverId: this.props.targetId,
        };
        try {
            const result = await fetch(apiRoute, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSent),
            });
            const jsonResult = await result.json();
            if (jsonResult.success) {
                if (this.props.type === "no") {
                    Router.push("/admin/proyek/kolaborasi");
                } else {
                    Router.push(`/admin/proyek/${this.props.animeId}/kolaborasi`);
                }
            } else {
                this.showError(jsonResult.message || "Terjadi kesalahan yang tidak diketahui...");
                if (typeof this.props.onClick === "function") {
                    this.props.onClick();
                }
            }
        } catch (error) {
            // callback to error modal.
            console.log(error);
            if (error instanceof Error) {
                this.showError("Terjadi kesalahan internal:\n" + error.toString());
            } else {
                this.showError("Terjadi kesalahan internal yang tidak diketahui!");
            }
            if (typeof this.props.onClick === "function") {
                this.props.onClick();
            }
        }
        this.setState({ isSubmitting: false });
    }

    render() {
        const { isSubmitting } = this.state;
        const { type, disabled } = this.props;
        const YES = type === "yes";

        let isDisabled = false;
        if (isSubmitting || disabled) {
            isDisabled = true;
        }

        const COLOR = {
            yes: "bg-green-600 hover:bg-green-700",
            no: "bg-red-600 hover:bg-red-700",
        };
        const COLORDISABLE = {
            yes: "bg-green-500",
            no: "bg-red-500",
        };

        return (
            <button
                className={`flex flex-row px-3 py-2 rounded-lg text-white transition duration-200 ease-in-out items-center ${
                    isDisabled ? COLORDISABLE[type] : COLOR[type]
                } ${isDisabled ? "cursor-not-allowed" : ""} ${isSubmitting ? "animate-pulse" : ""}`}
                disabled={isDisabled}
                onClick={this.submitProcess}
            >
                {isDisabled ? (
                    <LoadingCircle className="ml-0 mr-2 mt-0" />
                ) : (
                    <>
                        {YES ? (
                            <AcceptIcon className="font-bold mr-1" />
                        ) : (
                            <DenyIcon className="font-bold mr-1" />
                        )}
                    </>
                )}
                <span className="font-semibold mt-0.5">{YES ? "Terima" : "Tolak"}</span>
            </button>
        );
    }
}

export default function CollabTargetConfirmComponent(props: CollabTargetConfirmProps) {
    const [disabled, setDisabled] = useState(false);

    function callbackSubmit() {
        setDisabled(!disabled);
    }

    return (
        <div className="flex row mt-4 gap-2">
            <CollabTargetConfirmButton type="yes" onClick={callbackSubmit} disabled={disabled} {...props} />
            <CollabTargetConfirmButton type="no" onClick={callbackSubmit} disabled={disabled} {...props} />
            <button
                className={`flex flex-row px-3 py-2 rounded-lg text-white transition duration-200 ease-in-out items-center ${
                    disabled
                        ? "bg-blue-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }`}
                onClick={(ev) => {
                    ev.preventDefault();
                    if (disabled) {
                        return;
                    }
                    Router.push("/admin/proyek/kolaborasi");
                }}
            >
                <GoBackIcon className="font-bold mr-1" />
                <span className="font-semibold mt-0.5">Kembali</span>
            </button>
        </div>
    );
}
