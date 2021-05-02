/**
 * This is a typescript version specifically made for naoTimesUI
 * Also removed some deprecated function.
 * Adapted from https://github.com/leovoel/embed-visualizer/blob/master/src/components/markdown.jsx
 */
import React from "react";
import SimpleMarkdown from "simple-markdown";
import hljs from "highlight.js";
import Twemoji from "twemoji";

import Emoji from "../../../lib/constant/emoji";

function flattenAst(node: SimpleMarkdown.ASTNode, parent?: SimpleMarkdown.SingleASTNode) {
    if (Array.isArray(node)) {
        for (let n = 0; n < node.length; n++) {
            node[n] = flattenAst(node[n], parent);
        }
        return node;
    }

    if (node && node.content) {
        node.content = flattenAst(node.content, node);
    }
    if (parent && node.type === parent.type) {
        return node.content;
    }
    return node;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function astToString(node: SimpleMarkdown.ASTNode, result?: any[]) {
    function inner(node: SimpleMarkdown.ASTNode, result = []) {
        if (Array.isArray(node)) {
            node.forEach((subNode) => astToString(subNode, result));
        } else if (typeof node.content === "string") {
            result.push(node.content);
        } else if (node.content !== null) {
            astToString(node.content, result);
        }
        return result;
    }
    return inner(node).join("");
}

type TransformFunction = (ast: SimpleMarkdown.SingleASTNode[]) => SimpleMarkdown.SingleASTNode[];

function parserFor(rules: SimpleMarkdown.ParserRules, returnAst?: boolean) {
    const parser = SimpleMarkdown.parserFor(rules);
    // @ts-ignore
    const renderer = SimpleMarkdown.outputFor(rules, "react");

    return function (
        input: string = "",
        inline = true,
        state: SimpleMarkdown.State = {},
        transform: TransformFunction = null
    ) {
        if (!inline) {
            input += "\n\n";
        }

        let ast = parser(input, { inline, ...state });
        ast = flattenAst(ast);
        if (transform) {
            ast = transform(ast);
        }
        if (returnAst) {
            return ast;
        }
        return renderer(ast);
    };
}

function omit(object: any, excluded?: string[]) {
    return Object.keys(object).reduce((result, key) => {
        if (excluded.indexOf(key) === -1) {
            result[key] = object[key];
        }
        return result;
    }, {});
}

interface EmoteType {
    id: string;
}

function getEmoteURL(emote: EmoteType) {
    return `https://cdn.discordapp.com/emojis/${emote.id}.png`;
}

function getEmojiURL(surrogate?: string) {
    if (["™", "©", "®"].indexOf(surrogate) > -1) {
        return "";
    }

    try {
        return `https://twemoji.maxcdn.com/2/svg/${Twemoji.convert.toCodePoint(surrogate)}.svg`;
    } catch (error) {
        return "";
    }
}

type EmojiMap = { [key: string]: string };
const DIVERSITY_SURROGATES = ["🏻", "🏼", "🏽", "🏾", "🏿"];
const NAME_TO_EMOJI: EmojiMap = {};
const EMOJI_TO_NAME: EmojiMap = {};

Object.keys(Emoji).forEach((category) => {
    Emoji[category].forEach((emoji) => {
        EMOJI_TO_NAME[emoji.surrogates] = emoji.names[0] || "";

        emoji.names.forEach((name) => {
            NAME_TO_EMOJI[name] = emoji.surrogates;

            DIVERSITY_SURROGATES.forEach((d, i) => {
                NAME_TO_EMOJI[`${name}::skin-tone-${i + 1}`] = emoji.surrogates.concat(d);
            });
        });

        DIVERSITY_SURROGATES.forEach((d, i) => {
            const surrogates = emoji.surrogates.concat(d);
            const name = emoji.names[0] || "";

            EMOJI_TO_NAME[surrogates] = `${name}::skin-tone-${i + 1}`;
        });
    });
});

// eslint-disable-next-line no-useless-escape
const EMOJI_NAME_AND_DIVERSITY_RE = /^:([^\s:]+?(?:::skin\-tone\-\d)?):/;

function convertNameToSurrogate(name: string, t = "") {
    // eslint-disable-next-line no-prototype-builtins
    return NAME_TO_EMOJI.hasOwnProperty(name) ? NAME_TO_EMOJI[name] : t;
}

function convertSurrogateToName(surrogate: string, colons = true, n = "") {
    // what is n for?
    let a = n;

    // eslint-disable-next-line no-prototype-builtins
    if (EMOJI_TO_NAME.hasOwnProperty(surrogate)) {
        a = EMOJI_TO_NAME[surrogate];
    }

    return colons ? `:${a}:` : a;
}

function escape(str: string) {
    // eslint-disable-next-line no-useless-escape
    return str.replace(/[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

const replacer = (function () {
    const surrogates = Object.keys(EMOJI_TO_NAME)
        .sort((surrogate) => -surrogate.length)
        .map((surrogate) => escape(surrogate))
        .join("|");

    return new RegExp("(" + surrogates + ")", "g");
})();

function translateSurrogatesToInlineEmoji(surrogates: string) {
    return surrogates.replace(replacer, (_o, match) => convertSurrogateToName(match));
}

interface ExtendedASTNode {
    src?: string;
    surrogate: string;
    jumboable?: boolean;
    name: string;
}

type ReactASTNodeExtended = SimpleMarkdown.SingleASTNode & ExtendedASTNode;

const baseRules: SimpleMarkdown.ParserRules = {
    newline: SimpleMarkdown.defaultRules.newline,
    paragraph: SimpleMarkdown.defaultRules.paragraph,
    escape: SimpleMarkdown.defaultRules.escape,
    link: SimpleMarkdown.defaultRules.link,
    autolink: {
        ...SimpleMarkdown.defaultRules.autolink,
        match: SimpleMarkdown.inlineRegex(/^<(https?:\/\/[^ >]+)>/),
    },
    url: SimpleMarkdown.defaultRules.url,
    strong: SimpleMarkdown.defaultRules.strong,
    em: SimpleMarkdown.defaultRules.em,
    u: SimpleMarkdown.defaultRules.u,
    br: SimpleMarkdown.defaultRules.br,
    inlineCode: SimpleMarkdown.defaultRules.inlineCode,
    emoticon: {
        order: SimpleMarkdown.defaultRules.text.order,
        match: function (source) {
            return /^(¯\\_\(ツ\)_\/¯)/.exec(source);
        },
        parse: function (capture) {
            return { type: "text", content: capture[1] };
        },
    },
    codeBlock: {
        order: SimpleMarkdown.defaultRules.codeBlock.order,
        match(source) {
            // eslint-disable-next-line no-useless-escape
            return /^```(([A-z0-9\-]+?)\n+)?\n*([^]+?)\n*```/.exec(source);
        },
        parse(capture) {
            return { lang: (capture[2] || "").trim(), content: capture[3] || "" };
        },
    },
    emoji: {
        order: SimpleMarkdown.defaultRules.text.order,
        match(source) {
            return EMOJI_NAME_AND_DIVERSITY_RE.exec(source);
        },
        parse(capture) {
            const match = capture[0];
            const name = capture[1];
            const surrogate = convertNameToSurrogate(name);
            return surrogate
                ? {
                      name: `:${name}:`,
                      surrogate: surrogate,
                      src: getEmojiURL(surrogate),
                  }
                : {
                      type: "text",
                      content: match,
                  };
        },
        // @ts-ignore
        react(node: ReactASTNodeExtended, recurseOutput, state) {
            return node.src ? (
                <img
                    draggable={false}
                    className={`emoji ${node.jumboable ? "jumboable" : ""}`}
                    alt={node.surrogate}
                    title={node.name}
                    src={node.src}
                    key={state.key}
                />
            ) : (
                <span key={state.key}>{node.surrogate}</span>
            );
        },
    },
    customEmoji: {
        order: SimpleMarkdown.defaultRules.text.order,
        match(source) {
            return /^<:(\w+):(\d+)>/.exec(source);
        },
        parse(capture) {
            const name = capture[1];
            const id = capture[2];
            return {
                emojiId: id,
                // NOTE: we never actually try to fetch the emote
                // so checking if colons are required (for 'name') is not
                // something we can do to begin with
                name: name,
                src: getEmoteURL({
                    id: id,
                }),
            };
        },
        // @ts-ignore
        react(node: ReactASTNodeExtended, recurseOutput, state) {
            return (
                <img
                    draggable={false}
                    className={`emoji ${node.jumboable ? "jumboable" : ""}`}
                    alt={`<:${node.name}:${node.id}>`}
                    title={node.name}
                    src={node.src}
                    key={state.key}
                />
            );
        },
    },
    text: {
        ...SimpleMarkdown.defaultRules.text,
        parse(capture, recurseParse, state) {
            return state.nested
                ? {
                      content: capture[0],
                  }
                : recurseParse(translateSurrogatesToInlineEmoji(capture[0]), {
                      ...state,
                      nested: true,
                  });
        },
    },
    s: {
        order: SimpleMarkdown.defaultRules.u.order,
        match: SimpleMarkdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
        parse: SimpleMarkdown.defaultRules.u.parse,
    },
};

function createRules(r: typeof baseRules): SimpleMarkdown.ParserRules {
    const paragraph = r.paragraph;
    const url = r.url;
    const link = r.link;
    const codeBlock = r.codeBlock;
    const inlineCode = r.inlineCode;

    return {
        ...r,
        // @ts-ignore
        s: {
            order: r.u.order,
            match: SimpleMarkdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
            parse: r.u.parse,
            react(node, recurseOutput, state) {
                // @ts-ignore
                return <s key={state.key}>{recurseOutput(node.content, state)}</s>;
            },
        },
        paragraph: {
            ...paragraph,
            react(node, recurseOutput, state) {
                // @ts-ignore
                return <p key={state.key}>{recurseOutput(node.content, state)}</p>;
            },
        },
        // @ts-ignore
        url: {
            ...url,
            match: SimpleMarkdown.inlineRegex(/^((https?|steam):\/\/[^\s<]+[^<.,:;"')\]\s])/),
        },
        link: {
            ...link,
            // @ts-ignore
            react(node: SimpleMarkdown.SingleASTNode, recurseOutput, state) {
                // this contains some special casing for invites (?)
                // or something like that.
                // we don't really bother here
                const children = recurseOutput(node.content, state);
                const title = node.title || astToString(node.content);
                return (
                    <a
                        title={title}
                        href={SimpleMarkdown.sanitizeUrl(node.target)}
                        target="_blank"
                        rel="noreferrer"
                        key={state.key}
                    >
                        {children}
                    </a>
                );
            },
        },
        inlineCode: {
            ...inlineCode,
            // @ts-ignore
            react(node: SimpleMarkdown.SingleASTNode, recurseOutput, state) {
                return (
                    <code className="inline" key={state.key}>
                        {node.content}
                    </code>
                );
            },
        },
        codeBlock: {
            ...codeBlock,
            // @ts-ignore
            react(node: SimpleMarkdown.SingleASTNode, recurseOutput, state) {
                if (node.lang && hljs.getLanguage(node.lang) != null) {
                    const highlightedBlock = hljs.highlight(node.lang, node.content, true);

                    return (
                        <pre key={state.key}>
                            <code
                                className={`hljs ${highlightedBlock.language}`}
                                dangerouslySetInnerHTML={{ __html: highlightedBlock.value }}
                            />
                        </pre>
                    );
                }

                return (
                    <pre key={state.key}>
                        <code className="hljs">{node.content}</code>
                    </pre>
                );
            },
        },
    };
}

const rulesWithoutMaskedLinks = createRules({
    ...baseRules,
    link: {
        ...baseRules.link,
        match() {
            return null;
        },
    },
});

// used in:
//  message contrent
const parse = parserFor(rulesWithoutMaskedLinks);

// used in:
//  message content (webhook mode)
//  embed description
//  embed field values
const parseAllowLinks = parserFor(createRules(baseRules));

// used in:
//  embed title (obviously)
//  embed field names
const parseEmbedTitle = parserFor(
    omit(rulesWithoutMaskedLinks, ["codeBlock", "br", "mention", "channel", "roleMention"])
);

// used in:
//  message content
function jumboify(ast: SimpleMarkdown.SingleASTNode[]) {
    const nonEmojiNodes = ast.some(
        (node) =>
            node.type !== "emoji" &&
            node.type !== "customEmoji" &&
            (typeof node.content !== "string" || node.content.trim() !== "")
    );

    if (nonEmojiNodes) {
        return ast;
    }

    const maximum = 27;
    let count = 0;

    ast.forEach((node) => {
        if (node.type === "emoji" || node.type === "customEmoji") {
            count += 1;
        }

        if (count > maximum) {
            return false;
        }
    });

    if (count < maximum) {
        ast.forEach((node) => (node.jumboable = true));
    }

    return ast;
}

export { parse, parseAllowLinks, parseEmbedTitle, jumboify };
