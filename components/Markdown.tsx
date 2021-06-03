import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";

import breaks from "remark-breaks";
import gemoji from "remark-gemoji";
import gfm from "remark-gfm";

function MarkdownLinkFormatting({ href, ...rest }: React.HTMLProps<HTMLAnchorElement>) {
    const internalLink = href && href.startsWith("/");
    if (internalLink) {
        return (
            <Link href={href} passHref>
                <a {...rest} />
            </Link>
        );
    }
    return <a href={href} {...rest} rel="noopener noreferrer" target="_blank" />;
}

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
                    a: ({ ...props }) => <MarkdownLinkFormatting {...props} />,
                }}
                remarkPlugins={[gemoji, gfm, breaks]}
            >
                {this.props.children as string}
            </ReactMarkdown>
        );
    }
}
