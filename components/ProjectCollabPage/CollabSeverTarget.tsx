import React from "react";
import Router from "next/router";

import DeleteIcon from "mdi-react/DeleteOutlineIcon";

import LoadingCircle from "../LoadingCircle";

interface CollabSeverTargetProps {
    id: string;
    animeId: string;
    onError?: (errorText: string) => void;
}

interface CollabSeverTargetState {
    isSubmitting: boolean;
}

export default class CollabSeverTargetButton extends React.Component<
    CollabSeverTargetProps,
    CollabSeverTargetState
> {
    constructor(props: CollabSeverTargetProps) {
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

        try {
            const result = await fetch(`/api/showtimes/proyek/collab/${this.props.animeId}/sever`, {
                method: "POST",
            });
            const jsonResult = await result.json();
            if (jsonResult.success) {
                Router.push(`/admin/proyek/${this.props.animeId}`);
            } else {
                this.showError(jsonResult.message || "Terjadi kesalahan yang tidak diketahui...");
            }
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                this.showError("Terjadi kesalahan internal:\n" + error.toString());
            } else {
                this.showError("Terjadi kesalahan internal yang tidak diketahui!");
            }
        }
        this.setState({ isSubmitting: false });
    }

    render() {
        const { isSubmitting } = this.state;

        return (
            <button
                className={`flex flex-row px-3 py-2 rounded-lg text-white transition duration-200 ease-in-out items-center ${
                    isSubmitting ? "bg-red-500" : "bg-red-600 hover:bg-red-700"
                } ${isSubmitting ? "cursor-not-allowed" : ""} ${isSubmitting ? "animate-pulse" : ""}`}
                disabled={isSubmitting}
                onClick={this.submitProcess}
            >
                {isSubmitting ? (
                    <LoadingCircle className="ml-0 mr-2 mt-0" />
                ) : (
                    <DeleteIcon className="font-bold mr-1" />
                )}
                <span className="font-semibold mt-0.5">Putuskan</span>
            </button>
        );
    }
}
