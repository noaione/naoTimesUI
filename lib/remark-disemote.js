const visit = require("unist-util-visit");
const DiscordEmote = require("./disemote");

const findRe = /:\((\+1|[-\w]+)\):/g;

const own = Object.prototype.hasOwnProperty;
const splice = Array.prototype.splice;

module.exports = disemote;

function disemote() {
    return transform;
}

function transform(tree) {
    visit(tree, "text", onText);
}

function wrapImage(url) {
    return `<img src="${url}">`;
}

function onText(node, index, parent) {
    const value = node.value;
    const slices = [];
    let start = 0;
    let match;
    let position;

    findRe.lastIndex = 0;
    match = findRe.exec(value);

    while (match) {
        position = match.index;

        if (own.call(DiscordEmote, match[1])) {
            if (start !== position) {
                slices.push({ type: "text", value: value.slice(start, position) });
            }

            slices.push({
                type: "image",
                title: match[1],
                url: DiscordEmote[match[1]],
                alt: match[1],
                properties: {
                    width: "32px",
                    height: "32px",
                    className: "discord-emote",
                },
            });
            start = position + match[0].length;
            console.info(match, start);
        } else {
            findRe.lastIndex = position + 1;
        }

        match = findRe.exec(value);
    }

    if (slices.length > 0) {
        if (start < value.length) {
            console.info("add extra peepolove");
            slices.push({ type: "text", value: value.slice(start) });
        }

        splice.apply(parent.children, [index, 1].concat(slices));
        return index + slices.length;
    }
}
