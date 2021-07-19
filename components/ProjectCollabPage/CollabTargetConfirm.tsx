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
        this.submitProcess = this.submitProcess.bind(this);
        this.state = {
            isSubmitting: false,
        };
    }

    async submitProcess() {
        if (this.state.isSubmitting) {
            return;
        }
        this.setState({ isSubmitting: true });
        if (typeof this.props.onClick === "function") {
            this.props.onClick();
        }
        // send api call to accept collab.
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
        console.info("Called back...");
        setDisabled(!disabled);
    }
    console.info(disabled);

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
