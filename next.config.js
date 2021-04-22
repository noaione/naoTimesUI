// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextBuildId = require("next-build-id");

module.exports = {
    future: {
        webpack5: true,
    },
    generateBuildId: nextBuildId({ dir: __dirname }),
};
