function extractRGB(i: number) {
    return {
        r: (i >> 16) & 0xff,
        g: (i >> 8) & 0xff,
        b: i & 0xff,
    };
}

function combineRGB(r: number, g: number, b: number) {
    return (r << 16) | (g << 8) | b;
}

export { extractRGB, combineRGB };
