import React from "react";
import Modal, { CallbackModal } from "./Modal";

interface ErrState {
    show: boolean;
    currentFade?: "show" | "hide" | null;
}

interface ErrProps {
    onMounted?: (callbacks: CallbackModal) => void;
}

class ErrorModal extends React.Component<ErrProps, ErrState> {
    divRef?: HTMLDivElement;
    modalCb?: CallbackModal;

    constructor(props: ErrProps) {
        super(props);
        this.handleHide = this.handleHide.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            show: false,
            currentFade: null,
        };
    }

    componentDidMount() {
        if (typeof this.props.onMounted === "function") {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const outerThis = this;
            this.props.onMounted({
                showModal: () => outerThis.handleShow(),
                hideModal: () => outerThis.handleHide(),
            });
        }
    }

    handleHide() {
        if (this.modalCb) {
            this.modalCb.hideModal();
        }
    }

    handleShow() {
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    toggleModal() {
        if (this.modalCb && this.modalCb.toggleModal) {
            this.modalCb.toggleModal();
        }
    }

    render() {
        return (
            <>
                <Modal onMounted={(callback) => (this.modalCb = callback)}>
                    <Modal.Head>Terjadi Kesalahan</Modal.Head>
                    <Modal.Body>{this.props.children}</Modal.Body>
                    <Modal.Footer>
                        <button
                            onClick={this.handleHide}
                            className="inline-flex justify-center font-semibold w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
                        >
                            Tutup
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default ErrorModal;
