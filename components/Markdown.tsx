import React from "react";
import ReactMarkdown from "react-markdown";

import breaks from "remark-breaks";
import gemoji from "remark-gemoji";
import gfm from "remark-gfm";

// A wrapper around ReactMarkdown :)
export default class Markdown extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactMarkdown
                className="react-md"
                components={{
                    a: ({ ...props }) => <a {...props} rel="noopener noreferer" target="_blank" />,
                }}
                remarkPlugins={[gemoji, gfm, breaks]}
            >
                {this.props.children as string}
            </ReactMarkdown>
        );
    }
}
