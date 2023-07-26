import React from "react";
import Router from "next/router";

import TrashIcon from "mdi-react/TrashCanIcon";
import { motion } from "framer-motion";

import Modal, { CallbackModal } from "../Modal";
import LoadingCircle from "../LoadingCircle";
import { SettingsProps } from "../SettingsPage/base";

import { generateWordSets } from "@/lib/words";
import client from "@/lib/graphql/client";
import { MutateProjectNukeDocument } from "@/lib/graphql/projects.generated";

interface ExtendedNukeProps extends SettingsProps {
    id: string;
}

interface DeleteState {
    targetCheck: string[];
    isSubmitting: boolean;
    passwordCheck: string;
    correctPassword: boolean;
}

function resetState(submit: boolean = false): DeleteState {
    return {
        targetCheck: generateWordSets(3),
        isSubmitting: submit,
        passwordCheck: "",
        correctPassword: false,
    };
}

class NukeProjectComponent extends React.Component<ExtendedNukeProps, DeleteState> {
    modalCb: CallbackModal;

    constructor(props: ExtendedNukeProps) {
        super(props);
        this.handleHide = this.handleHide.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.deleteProjectForReal = this.deleteProjectForReal.bind(this);
        this.verifyParaphrase = this.verifyParaphrase.bind(this);

        this.state = resetState();
    }

    async deleteProjectForReal() {
        if (!this.state.correctPassword) {
            return;
        }
        this.handleHide();
        this.setState(resetState(true));

        const { data, errors } = await client.mutate({
            mutation: MutateProjectNukeDocument,
            variables: {
                id: this.props.id,
            },
        });

        if (errors) {
            this.props.onErrorModal(errors.map((e) => e.message).join("\n"));
            this.setState(resetState());
            return;
        }

        if (data.deleteProject.success) {
            Router.push("/admin/proyek");
        } else {
            this.props.onErrorModal(data.deleteProject.message);
            this.setState(resetState());
        }
    }

    handleHide() {
        if (this.modalCb) {
            this.modalCb.hideModal();
        }
    }

    verifyParaphrase(targetCheck: string) {
        const joinedTarget = this.state.targetCheck.join("-");
        if (joinedTarget === targetCheck) {
            this.setState({ correctPassword: true });
        } else if (this.state.correctPassword && joinedTarget !== targetCheck) {
            this.setState({ correctPassword: false });
        }
    }

    handleShow() {
        if (this.modalCb && !this.state.isSubmitting) {
            this.modalCb.showModal();
        }
    }

    render() {
        const { isSubmitting } = this.state;

        return (
            <>
                <motion.div
                    className="flex flex-col"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.05 }}
                >
                    <button
                        onClick={this.handleShow}
                        className={`rounded text-white px-4 py-2 ${
                            isSubmitting ? "bg-red-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                        } transition duration-200 flex flex-row items-center focus:outline-none`}
                    >
                        {isSubmitting ? (
                            <LoadingCircle className="ml-0 mt-0" />
                        ) : (
                            <TrashIcon className="font-semibold mr-1 ml-0" />
                        )}
                        <span className="font-semibold mt-0.5">Hapus Proyek</span>
                    </button>
                </motion.div>
                <Modal
                    onMounted={(cb) => (this.modalCb = cb)}
                    onClose={() => {
                        this.setState(resetState());
                    }}
                >
                    <Modal.Head>Apakah anda yakin?</Modal.Head>
                    <Modal.Body>
                        <div>Proyek akan dihapus selama-lamanya dan data lama tidak dapat dikembalikan!</div>
                        <div>Mohon masukan parafrasa berikut untuk melanjutkan!</div>
                        <div className="mt-2 text-center text-red-400">
                            <code>{this.state.targetCheck.join("-")}</code>
                        </div>
                        <div className="mt-2">
                            <input
                                className="form-darkable w-full"
                                value={this.state.passwordCheck}
                                placeholder="Masukan parafrasa"
                                onChange={(ev) => {
                                    this.setState({ passwordCheck: ev.target.value });
                                    this.verifyParaphrase(ev.target.value);
                                }}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="gap-2">
                        <button
                            onClick={this.deleteProjectForReal}
                            className={`inline-flex justify-center font-semibold w-full px-4 py-2 text-white transition duration-200 rounded focus:outline-none ${
                                this.state.correctPassword
                                    ? "bg-red-600 hover:bg-red-700 opacity-100"
                                    : "bg-red-400 cursor-not-allowed opacity-60"
                            }`}
                        >
                            Hapus
                        </button>
                        <button
                            onClick={this.handleHide}
                            className="inline-flex justify-center font-semibold w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            Tidak
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default NukeProjectComponent;
