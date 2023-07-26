import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://127.0.0.1:8000/graphql",
    documents: ["lib/graphql/**.graphql"],
    generates: {
        "lib/graphql/types.generated.ts": { plugins: ["typescript"] },
        "lib/graphql/": {
            preset: "near-operation-file",
            presetConfig: {
                extension: ".generated.ts",
                baseTypesPath: "types.generated.ts",
            },
            plugins: ["typescript-operations", "typed-document-node"],
        },
        "lib/graphql/apollo-helper.ts": {
            plugins: ["typescript-apollo-client-helpers"],
        },
    },
    ignoreNoDocuments: false,
};

export default config;
