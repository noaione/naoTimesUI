/**
 * This is a typescript version specifically made for naoTimesUI
 * Adapted from https://github.com/leovoel/embed-visualizer/blob/master/src/components/discordview.jsx
 */
import React from "react";
import { DateTime } from "luxon";

import Embed, { IEmbed } from "./embed";
import { jumboify, parse } from "./markdown";

interface BasePreviewProps {
    compactMode?: boolean;
}

function formatTimestamp(c: DateTime, compactMode: boolean = false) {
    if (compactMode) {
        return c.toLocaleString(DateTime.TIME_SIMPLE);
    }

    const current = c.toRelativeCalendar();
    if (current === "today") {
        return `Today at ${c.toLocaleString(DateTime.TIME_SIMPLE)}`;
    } else if (current === "yesterday") {
        return `Yesterday at ${c.toLocaleString(DateTime.TIME_SIMPLE)}`;
    }

    return c.toLocaleString(DateTime.DATE_SHORT);
}

class MessageTimestamp extends React.Component<BasePreviewProps> {
    timer?: NodeJS.Timeout;

    constructor(props) {
        super(props);
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(() => this.tick(), 1000 & 60);
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    tick() {
        this.forceUpdate();
    }

    render() {
        const { compactMode } = this.props;
        const c = DateTime.now();

        return <span className="timestamp">{formatTimestamp(c, compactMode)}</span>;
    }
}

function BotVerified() {
    return (
        <svg
            aria-label="Verified Bot"
            className="bot-tag-verified"
            aria-hidden="false"
            width="16"
            height="16"
            viewBox="0 0 16 15.2"
        >
            <path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path>
        </svg>
    );
}
interface IMsgBodyProps extends BasePreviewProps {
    username: string;
    content?: string;
}

class MessageBody extends React.Component<IMsgBodyProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { compactMode, username, content } = this.props;
        const actualContent = parse(content, true, {}, jumboify) as React.ReactNode;
        if (compactMode) {
            return (
                <div className="markup">
                    <MessageTimestamp compactMode={compactMode} />
                    <span className="username-wrapper align-bottom">
                        <span className="bot-tag">
                            <BotVerified />
                            BOT
                        </span>
                        <strong className="user-name">{username}</strong>
                    </span>
                    <span className="highlight-separator"> - </span>
                    <span className="message-content">{content && actualContent}</span>
                </div>
            );
        } else if (content) {
            return <div className="markup">{actualContent}</div>;
        }

        return null;
    }
}

interface ICozyHeader extends BasePreviewProps {
    username: string;
}

class CozyMessageHeader extends React.Component<ICozyHeader> {
    constructor(props) {
        super(props);
    }

    render() {
        const { compactMode, username } = this.props;
        if (compactMode) {
            return null;
        }

        return (
            <h2 style={{ lineHeight: "16px" }}>
                <span className="username-wrapper align-bottom">
                    <strong className="user-name">{username}</strong>
                    <span className="bot-tag">
                        <BotVerified />
                        BOT
                    </span>
                </span>
                <span className="highlight-separator"> - </span>
                <MessageTimestamp compactMode={compactMode} />
            </h2>
        );
    }
}

interface IAvatarProps extends BasePreviewProps {
    url: string;
}

class Avatar extends React.Component<IAvatarProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { compactMode, url } = this.props;
        if (compactMode) {
            return null;
        }

        return <div className="avatar-large animate" style={{ backgroundImage: `url('${url}')` }} />;
    }
}

interface IErrorHeader extends BasePreviewProps {
    error?: string;
}

class ErrorHeader extends React.Component<IErrorHeader> {
    constructor(props) {
        super(props);
    }

    render() {
        const { error } = this.props;
        if (!error) {
            return null;
        }

        return (
            <header
                className="text-sm bg-red-400 p-2 border-t-0 w-full font-mono whitespace-pre-wrap"
                style={{ borderRadius: ".25rem" }}
            >
                {error}
            </header>
        );
    }
}

interface IViewWrapper {
    darkTheme?: boolean;
    children?: React.ReactNode;
}

class DiscordViewWrapper extends React.Component<IViewWrapper> {
    constructor(props) {
        super(props);
    }

    render() {
        const { darkTheme, children } = this.props;

        return (
            <div className="w-full h-full overflow-auto p-2 discord-view">
                <div className={`flex-vertical whitney ${darkTheme && "theme-dark"}`}>
                    <div className="chat flex-vertical flex-spacer">
                        <div className="content flex-spacer flex-horizontal">
                            <div className="flex-spacer flex-vertical message-wrapper">
                                <div className="scroller-wrap">
                                    <div className="scroller messages">{children}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

interface IDiscordViewData {
    content?: string;
    embed?: IEmbed;
    embeds?: IEmbed[];
}

interface IDiscordView extends BasePreviewProps {
    darkTheme?: boolean;
    username?: string;
    avatar_url?: string;
    error?: string;
    data: IDiscordViewData;
}

class DiscordPreview extends React.Component<IDiscordView> {
    constructor(props) {
        super(props);
    }

    render() {
        const defaultOptions = {
            username: "naoTimes",
            avatar_url:
                "https://cdn.discordapp.com/avatars/558256913926848537/09b3486b533ce56e30eb95cb96d9c976.webp?size=1024",
            darkTheme: true,
            compactMode: false,
        };
        const mergedData = Object.assign({}, defaultOptions, this.props);

        const {
            compactMode,
            darkTheme,
            username,
            avatar_url,
            error,
            data: { content, embed, embeds },
        } = mergedData;

        const bgColor = darkTheme ? "bg-discord-dark" : "bg-discord-light";
        return (
            <>
                <div
                    className={`w-full h-full flex flex-col text-white overflow-hidden rounded-lg ${bgColor}`}
                    style={{ borderRadius: ".25rem" }}
                >
                    <ErrorHeader error={error} />
                    <DiscordViewWrapper darkTheme={darkTheme}>
                        <div className={`message-group hide-overflow ${compactMode ? "compact" : ""}`}>
                            <Avatar url={avatar_url} compactMode={compactMode} />
                            <div className="comment">
                                <div className="message first">
                                    <CozyMessageHeader username={username} compactMode={compactMode} />
                                    <div className="message-text">
                                        <MessageBody
                                            content={content}
                                            username={username}
                                            compactMode={compactMode}
                                        />
                                    </div>
                                    {embed ? (
                                        <Embed {...embed} />
                                    ) : (
                                        embeds &&
                                        embeds.map((emi, i) => <Embed key={`embedded-${i}`} {...emi} />)
                                    )}
                                </div>
                            </div>
                        </div>
                    </DiscordViewWrapper>
                </div>
            </>
        );
    }
}

export default DiscordPreview;
