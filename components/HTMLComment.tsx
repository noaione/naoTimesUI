import React from "react";

interface CommentProps {
    text?: string;
}

class HTMLComment extends React.Component<CommentProps> {
    ref: React.RefObject<HTMLDivElement>;

    constructor(props: CommentProps) {
        super(props);
        this.ref = React.createRef();
    }
    componentDidMount() {
        // Add comment before the <div> element
        this.ref.current.outerHTML = `<!-- ${this.props.text || "React Comment"} -->`;
        // Delete the <div> element afterwards
        this.ref.current.remove();
    }

    render() {
        return <div ref={this.ref} />;
    }
}

export default HTMLComment;
