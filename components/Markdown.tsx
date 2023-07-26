import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";

import breaks from "remark-breaks";
import gemoji from "remark-gemoji";
import gfm from "remark-gfm";

function MarkdownLinkFormatting({ href, children, ...rest }: React.HTMLProps<HTMLAnchorElement>) {
    const internalLink = href && href.startsWith("/");
    if (internalLink) {
        return (
            <Link href={href} {...rest}>
                {children}
            </Link>
        );
    }
    return <a href={href} {...rest} rel="noopener noreferrer" target="_blank" />;
}

function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

// A wrapper around ReactMarkdown :)
export default class Markdown extends React.Component<React.PropsWithChildren<{}>> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactMarkdown
                className="react-md"
                components={{
                    a: ({ ...props }) => <MarkdownLinkFormatting {...props} />,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    h2: ({ node, ...props }) => {
                        const { id, ...rest } = props;
                        const actualId =
                            id ?? slugify(String(rest.children[0]).toLowerCase().replace(/ /g, "-"));
                        return <h2 id={actualId} {...rest} />;
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    h1: ({ node, ...props }) => {
                        const { id, ...rest } = props;
                        const actualId =
                            id ?? slugify(String(rest.children[0]).toLowerCase().replace(/ /g, "-"));
                        return <h1 id={actualId} {...rest} />;
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    h3: ({ node, ...props }) => {
                        const { id, ...rest } = props;
                        const actualId =
                            id ?? slugify(String(rest.children[0]).toLowerCase().replace(/ /g, "-"));
                        return <h3 id={actualId} {...rest} />;
                    },
                }}
                remarkPlugins={[gemoji, gfm, breaks]}
            >
                {this.props.children as string}
            </ReactMarkdown>
        );
    }
}
