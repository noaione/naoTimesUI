import React from "react";
import { createPortal } from "react-dom";

function isDomAvailable() {
    if (typeof window !== "undefined" && window.document && window.document.createElement) {
        return true;
    }
    return false;
}

interface PortalProps {
    id?: string;
    node?: any;
    children: React.ReactNode;
}

interface PortalState {
    ready: boolean;
}

if (!global.portalNumber) {
    global.portalNumber = 1;
}

export default class Portal extends React.Component<PortalProps, PortalState> {
    defaultNode?: Element;

    constructor(props) {
        super(props);
        this.state = {
            ready: false,
        };
    }

    async componentDidMount() {
        // Import the element itself.
        await import("../lib/portal-element");
        this.setState({ ready: true });
    }

    componentWillUnmount() {
        if (this.defaultNode) {
            document.body.removeChild(this.defaultNode);
        }
        this.defaultNode = null;
    }

    render() {
        if (!isDomAvailable()) {
            return null;
        }

        if (!this.state.ready) {
            return null;
        }

        if (!this.props.node && !this.defaultNode) {
            this.defaultNode = document.createElement("naotimes-portal");
            let mainIds = `portal-${global.portalNumber}`;
            global.portalNumber++;
            const ids = this.props.id;
            if (typeof ids === "string" && ids.length > 0) {
                mainIds = `${ids}-${mainIds}`;
            }
            this.defaultNode.setAttribute("data-id", mainIds);
            document.body.appendChild(this.defaultNode);
        }

        return createPortal(this.props.children, this.props.node || this.defaultNode);
    }
}
