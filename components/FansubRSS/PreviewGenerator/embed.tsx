/**
 * This is a typescript version specifically made for naoTimesUI
 * Adapter from https://github.com/leovoel/embed-visualizer/blob/master/src/components/embed.jsx
 */
import React from "react";
import { DateTime } from "luxon";
import { parseAllowLinks, parseEmbedTitle } from "./markdown";
import { extractRGB } from "./color";

interface LinkElem extends Partial<Omit<HTMLLinkElement, "children">> {
    children: React.ReactNode;
}

class Link extends React.PureComponent<LinkElem> {
    constructor(props) {
        super(props);
    }

    render() {
        const { children, ...props } = this.props;
        return (
            // @ts-ignore
            <a target="_blank" rel="noreferrer noopener" {...props}>
                {children}
            </a>
        );
    }
}

interface IEmbedColorPill {
    color?: number;
}

class EmbedColorPill extends React.Component<IEmbedColorPill> {
    constructor(props) {
        super(props);
    }

    render() {
        const { color } = this.props;
        let computed;
        if (color) {
            const c = extractRGB(color);
            computed = `rgba(${c.r},${c.g},${c.b},1)`;
        }

        const style = { backgroundColor: computed !== undefined ? computed : "" };
        return <div className="embed-color-pill" style={style} />;
    }
}

interface IEmbedTitle {
    title?: string;
    url?: string;
}

class EmbedTitle extends React.Component<IEmbedTitle> {
    constructor(props) {
        super(props);
    }

    render() {
        const { title, url } = this.props;
        if (!title) {
            return null;
        }

        const titleParsed = parseEmbedTitle(title);

        if (url) {
            return (
                <Link href={url} className="embed-title">
                    {titleParsed}
                </Link>
            );
        }

        return <div className="embed-title">{titleParsed}</div>;
    }
}

interface IEmbedDescription {
    content?: string;
}

class EmbedDescription extends React.Component<IEmbedDescription> {
    constructor(props) {
        super(props);
    }

    render() {
        const { content } = this.props;
        if (!content) {
            return null;
        }

        return <div className="embed-description markup">{parseAllowLinks(content)}</div>;
    }
}

interface IEmbedAuthor {
    name?: string;
    url?: string;
    icon_url?: string;
}

class EmbedAuthor extends React.Component<IEmbedAuthor> {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, url, icon_url } = this.props;
        if (!name) {
            return null;
        }

        let authorName = <span className="embed-author-name">{name}</span>;
        if (url) {
            authorName = (
                <Link href={url} className="embed-author-name">
                    {name}
                </Link>
            );
        }

        const authorIcon = icon_url ? (
            <img src={icon_url} role="presentation" className="embed-author-icon" />
        ) : null;
        return (
            <div className="embed-author">
                {authorIcon}
                {authorName}
            </div>
        );
    }
}

interface IEmbedField {
    name?: string;
    value?: string;
    inline: boolean;
}

class EmbedField extends React.Component<IEmbedField> {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, value, inline } = this.props;
        if (!name && !value) {
            return null;
        }

        const classExtra = "embed-field" + (inline ? " embed-field-inline" : "");

        const fieldName = name ? <div className="embed-field-name">{parseEmbedTitle(name)}</div> : null;
        const fieldValue = value ? (
            <div className="embed-field-value markup">{parseAllowLinks(name)}</div>
        ) : null;

        return (
            <div className={classExtra}>
                {fieldName}
                {fieldValue}
            </div>
        );
    }
}

interface IEmbedThumb {
    url?: string;
}

class EmbedThumbnail extends React.Component<IEmbedThumb> {
    constructor(props) {
        super(props);
    }

    render() {
        const { url } = this.props;
        if (!url) {
            return null;
        }

        return (
            <img
                src={url}
                className="embed-rich-thumb"
                style={{ maxWidth: 80, maxHeight: 80 }}
                role="presentation"
            />
        );
    }
}

interface IEmbedImage {
    url?: string;
}

class EmbedImage extends React.Component<IEmbedImage> {
    constructor(props) {
        super(props);
    }

    render() {
        const { url } = this.props;
        if (!url) {
            return null;
        }

        return (
            <a className="embed-thumbnail embed-thumbnail-rich">
                <img className="image" role="presentation" src={url} />
            </a>
        );
    }
}

interface IEmbedFooter {
    text?: string;
    timestamp?: number;
    icon_url?: string;
}

class EmbedFooter extends React.Component<IEmbedFooter> {
    constructor(props) {
        super(props);
    }

    render() {
        const { text, timestamp, icon_url } = this.props;
        if (!text && !timestamp) {
            return null;
        }

        let timeText;
        if (timestamp) {
            const time = DateTime.fromMillis(timestamp);
            // ddd MMM Do, YYYY [at] h:mm A
            timeText = time.isValid ? time.toFormat("EEE MMM dd, yyyy 'at' hh:mm a") : undefined;
        }

        const footerText = [text, timeText].filter((e) => typeof e === "string").join(" | ");
        const footerIcon =
            text && icon_url ? (
                <img
                    src={icon_url}
                    className="embed-footer-icon"
                    role="presentation"
                    width={20}
                    height={20}
                />
            ) : null;

        return (
            <div className="items-center flex flex-row">
                {footerIcon}
                <span className="embed-footer">{footerText}</span>
            </div>
        );
    }
}

interface IEmbedFields {
    fields: IEmbedField[];
}

class EmbedFields extends React.Component<IEmbedFields> {
    constructor(props) {
        super(props);
    }

    render() {
        const { fields } = this.props;
        if (!fields) {
            return null;
        }
        return (
            <div className="embed-fields">
                {fields.map((f, i) => (
                    <EmbedField key={`field-${i}`} {...f} />
                ))}
            </div>
        );
    }
}

export interface IEmbed {
    color?: number;
    author?: IEmbedAuthor;
    title?: string;
    url?: string;
    description?: string;
    thumbnail?: IEmbedThumb;
    image?: IEmbedImage;
    timestamp?: number;
    footer?: IEmbedFooter;
    fields?: IEmbedField[];
}

export default class EmbedPreview extends React.Component<IEmbed> {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            color,
            author,
            title,
            url,
            description,
            fields,
            thumbnail,
            image,
            timestamp,
            footer,
        } = this.props;

        return (
            <>
                <div className="accessory">
                    <div className="embed-wrapper">
                        <EmbedColorPill color={color} />
                        <div className="embed embed-rich">
                            <div className="embed-content">
                                <div className="embed-content-inner">
                                    <EmbedAuthor {...author} />
                                    <EmbedTitle title={title} url={url} />
                                    <EmbedDescription content={description} />
                                    <EmbedFields fields={fields} />
                                </div>
                                <EmbedThumbnail {...thumbnail} />
                            </div>
                            <EmbedImage {...image} />
                            <EmbedFooter timestamp={timestamp} {...footer} />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
