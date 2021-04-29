import React from "react";

interface CommentProps {
    text?: string;
    multiLine?: boolean;
}

function selectText<T>(text?: T): string {
    if (typeof text !== "string") {
        return "Commented from <React />";
    }
    if (text.trim().length < 1) {
        return "Commented from <React />";
    }
    return text.trim();
}

function isMultiline(text?: string, forceMulti?: boolean): boolean {
    if (forceMulti) {
        return true;
    }
    if (typeof text === "string" && text.includes("\n")) {
        return true;
    }
    return false;
}

class HTMLComment extends React.Component<CommentProps> {
    ref: React.RefObject<HTMLDivElement>;

    constructor(props: CommentProps) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        const { text, multiLine } = this.props;
        // Add comment before the <div> element
        let comment = "<!--";
        if (isMultiline(text, multiLine)) {
            comment += "\n\t";
        } else {
            comment += " ";
        }
        comment += selectText(text);
        if (isMultiline(text, multiLine)) {
            comment += "\n-->";
        } else {
            comment += " -->";
        }

        this.ref.current.outerHTML = comment;
        // Delete the <div> element afterwards
        this.ref.current.remove();
    }

    render() {
        return <div ref={this.ref} />;
    }
}

export default HTMLComment;
