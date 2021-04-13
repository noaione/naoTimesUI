module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        "airbnb-base/legacy",
        "eslint-config-airbnb-base/whitespace",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "prettier",
    ],
    env: {
        node: true,
        es6: true,
    },
    settings: {
        react: {
            version: "detect",
        },
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
            },
            node: {
                extensions: [".ts", ".js"],
            },
        },
    },
    rules: {
        quotes: [
            "error",
            "double",
            {
                allowTemplateLiterals: true,
            },
        ],
        semi: [
            "error",
            "always",
            {
                omitLastInOneLineBlock: true,
            },
        ],
        "no-trailing-spaces": "error",
        "max-len": [
            "error",
            {
                code: 110,
                tabWidth: 4,
                ignoreComments: true,
                ignoreUrls: true,
                ignoreRegExpLiterals: true,
                ignoreTemplateLiterals: true,
                ignoreStrings: true,
            },
        ],
        "comma-dangle": [
            "error",
            {
                arrays: "only-multiline",
                objects: "only-multiline",
                functions: "never",
                imports: "only-multiline",
                exports: "never",
            },
        ],
        "no-empty": ["error", { allowEmptyCatch: true }],
        "eol-last": ["warn", "always"],
        "no-constant-condition": ["error", { checkLoops: false }],
        "sort-imports": [
            "warn",
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ["none", "all", "single", "multiple"],
                allowSeparatedGroups: true,
            },
        ],
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-inferrable-types": ["warn", { ignoreParameters: true }],
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
            },
        ],
        "import/no-named-as-default-member": "off",
        "import/order": [
            "error",
            {
                alphabetize: { order: "asc", caseInsensitive: true },
                "newlines-between": "always",
                groups: ["builtin", "external", "internal", "sibling", "parent", "index", "object"],
            },
        ],
        "import/extensions": "off",
        "import/prefer-default-export": "off",
        radix: "off",
        "no-plusplus": "off",
        "no-await-in-loop": "off",
        "no-console": ["warn", { allow: ["warn", "error"] }],
        camelcase: "off",
        "consistent-return": "off",
        "no-continue": "off",
        "no-underscore-dangle": ["warn", { allowFunctionParams: true }],
        "dot-notation": ["warn", { allowPattern: "^[a-z]+(_[a-z]+)+$" }],
    },
    overrides: [
        {
            files: ["tools/**/*.js", "lib/**/*.js"],
            rules: {
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/": "off",
            },
        },
        {
            files: ["src/**/*.ts"],
            rules: {
                "import/default": "off",
                "import/no-named-as-default": "off",
            },
        },
        {
            files: ["lib/**/*.js"],
            rules: {
                "import/no-extraneous-dependencies": [
                    "warn",
                    {
                        devDependencies: true,
                    },
                ],
                "no-console": ["warn", { allow: ["warn", "error", "info"] }],
            },
        },
    ],
};
