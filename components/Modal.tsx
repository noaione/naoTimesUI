import React from "react";
import Portal from "./Portal";

interface ModalState {
    show: boolean;
    currentFade?: "show" | "hide" | null;
}

export interface CallbackModal {
    showModal: () => void;
    hideModal: () => void;
    toggleModal?: () => void;
}

export interface ModalProps {
    id?: string;
    forceOpen?: boolean;
    onMounted?: (callbacks: CallbackModal) => void;
    onClose?: () => void;
}

class ModalHead extends React.Component {
    render() {
        return (
            <>
                <h3 className="text-lg text-center mt-2 font-medium leading-6 text-gray-900 dark:text-gray-100 sm:mt-0 sm:mx-2 sm:text-left">
                    {this.props.children}
                </h3>
            </>
        );
    }
}

class ModalBody extends React.Component {
    render() {
        return (
            <>
                <div className="mt-3 text-center sm:mt-0 sm:mx-2 sm:text-left">
                    <div className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-300">
                        {this.props.children}
                    </div>
                </div>
            </>
        );
    }
}

interface FooterExtra {
    className?: string;
}

class ModalFooter extends React.Component<FooterExtra> {
    constructor(props: FooterExtra) {
        super(props);
    }

    render() {
        const { className, children } = this.props;
        return (
            <div className={"mt-5 sm:mt-6 flex w-full rounded-md shadow-sm " + (className ?? "")}>
                {children}
            </div>
        );
    }
}

class Modal extends React.Component<ModalProps, ModalState> {
    divRef?: HTMLDivElement;
    static Head = ModalHead;
    static Body = ModalBody;
    static Footer = ModalFooter;

    constructor(props: ModalProps) {
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
                toggleModal: () => outerThis.toggleModal(),
            });
        }
    }

    handleHide() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;
        this.setState({ currentFade: "hide" });
        // fade animation thingamagic.
        setTimeout(
            () =>
                outerThis.setState({ show: false, currentFade: null }, () => {
                    if (typeof this.props.onClose === "function") {
                        this.props.onClose();
                    }
                }),
            300
        );
    }

    handleShow() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;
        this.setState({ show: true, currentFade: "show" });
        setTimeout(() => outerThis.setState({ currentFade: null }), 300);
    }

    toggleModal() {
        if (this.state.show) {
            this.handleHide();
        } else {
            this.handleShow();
        }
    }

    render() {
        if (!this.state.show) {
            return null;
        }
        const fadeInTransition = "fade-in-modal";
        const fadeOutTransition = "transition ease-out duration-300 opacity-0 transform scale-90";

        let extraClasses = "";
        if (this.state.currentFade === "show") {
            extraClasses = fadeInTransition;
        } else if (this.state.currentFade === "hide") {
            extraClasses = fadeOutTransition;
        }
        const { forceOpen, id } = this.props;
        let realIds = "modal";
        if (typeof id === "string" && id.length > 0) {
            realIds = id;
        }

        return (
            <Portal id={realIds}>
                <div
                    ref={(ref) => (this.divRef = ref)}
                    className={`absolute top-0 left-0 ${
                        this.state.show ? "flex" : "hidden"
                    } items-center justify-center w-full h-full transition-all duration-200 backdrop-filter backdrop-blur bg-[rgba(0,0,0,0.5)] z-40`}
                    onClick={(ev) => {
                        if (this.divRef && ev.target === this.divRef && !forceOpen) {
                            // Only handle if clicked outside the main div
                            this.handleHide();
                        }
                    }}
                >
                    <div
                        className={
                            "h-auto p-4 mx-6 text-left bg-white dark:bg-gray-700 rounded shadow-xl md:max-w-xl md:p-6 lg:p-8 md:mx-0 " +
                            extraClasses
                        }
                    >
                        {this.props.children}
                    </div>
                </div>
            </Portal>
        );
    }
}

export default Modal;
