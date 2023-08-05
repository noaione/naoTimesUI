import * as Types from "./types.generated";

import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type AnilistSearchQueryVariables = Types.Exact<{
    search: Types.Scalars["String"]["input"];
}>;

export type AnilistSearchQuery = {
    __typename?: "Query";
    search: {
        __typename?: "QuerySearch";
        shows:
            | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
            | {
                  __typename?: "SearchResults";
                  count: number;
                  results: Array<{
                      __typename?: "SearchResult";
                      id: string;
                      title: string;
                      format: Types.SearchExternalType;
                      coverUrl?: string | null;
                      count?: number | null;
                      year?: number | null;
                      titles: {
                          __typename?: "SearchResultTitle";
                          native?: string | null;
                          romanized?: string | null;
                      };
                  }>;
              };
        books:
            | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
            | {
                  __typename?: "SearchResults";
                  count: number;
                  results: Array<{
                      __typename?: "SearchResult";
                      id: string;
                      title: string;
                      format: Types.SearchExternalType;
                      coverUrl?: string | null;
                      count?: number | null;
                      year?: number | null;
                      titles: {
                          __typename?: "SearchResultTitle";
                          native?: string | null;
                          romanized?: string | null;
                      };
                  }>;
              };
    };
};

export type ExternalResultsFragment = {
    __typename?: "SearchResults";
    count: number;
    results: Array<{
        __typename?: "SearchResult";
        id: string;
        title: string;
        format: Types.SearchExternalType;
        coverUrl?: string | null;
        count?: number | null;
        year?: number | null;
        titles: { __typename?: "SearchResultTitle"; native?: string | null; romanized?: string | null };
    }>;
};

export type ExternalResultFragment = {
    __typename?: "SearchResult";
    id: string;
    title: string;
    format: Types.SearchExternalType;
    coverUrl?: string | null;
    count?: number | null;
    year?: number | null;
    titles: { __typename?: "SearchResultTitle"; native?: string | null; romanized?: string | null };
};

export const ExternalResultFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ExternalResult" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SearchResult" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "titles" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "native" } },
                                { kind: "Field", name: { kind: "Name", value: "romanized" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "format" } },
                    { kind: "Field", name: { kind: "Name", value: "coverUrl" } },
                    { kind: "Field", name: { kind: "Name", value: "count" } },
                    { kind: "Field", name: { kind: "Name", value: "year" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ExternalResultFragment, unknown>;
export const ExternalResultsFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ExternalResults" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SearchResults" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "results" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "ExternalResult" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "count" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ExternalResult" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SearchResult" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "titles" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "native" } },
                                { kind: "Field", name: { kind: "Name", value: "romanized" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "format" } },
                    { kind: "Field", name: { kind: "Name", value: "coverUrl" } },
                    { kind: "Field", name: { kind: "Name", value: "count" } },
                    { kind: "Field", name: { kind: "Name", value: "year" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ExternalResultsFragment, unknown>;
export const AnilistSearchDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "AnilistSearch" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "search" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "search" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    alias: { kind: "Name", value: "shows" },
                                    name: { kind: "Name", value: "anilist" },
                                    arguments: [
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "query" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "search" },
                                            },
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "titleSort" },
                                            value: { kind: "EnumValue", value: "ROMANIZED" },
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "type" },
                                            value: { kind: "EnumValue", value: "SHOWS" },
                                        },
                                    ],
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                    kind: "NamedType",
                                                    name: { kind: "Name", value: "SearchResults" },
                                                },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: { kind: "Name", value: "ExternalResults" },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                    kind: "NamedType",
                                                    name: { kind: "Name", value: "Result" },
                                                },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: { kind: "Name", value: "ResultFrag" },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    alias: { kind: "Name", value: "books" },
                                    name: { kind: "Name", value: "anilist" },
                                    arguments: [
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "query" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "search" },
                                            },
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "titleSort" },
                                            value: { kind: "EnumValue", value: "ROMANIZED" },
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "type" },
                                            value: { kind: "EnumValue", value: "BOOKS" },
                                        },
                                    ],
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                    kind: "NamedType",
                                                    name: { kind: "Name", value: "SearchResults" },
                                                },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: { kind: "Name", value: "ExternalResults" },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "InlineFragment",
                                                typeCondition: {
                                                    kind: "NamedType",
                                                    name: { kind: "Name", value: "Result" },
                                                },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: { kind: "Name", value: "ResultFrag" },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ExternalResult" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SearchResult" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "titles" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "native" } },
                                { kind: "Field", name: { kind: "Name", value: "romanized" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "format" } },
                    { kind: "Field", name: { kind: "Name", value: "coverUrl" } },
                    { kind: "Field", name: { kind: "Name", value: "count" } },
                    { kind: "Field", name: { kind: "Name", value: "year" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ExternalResults" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SearchResults" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "results" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "ExternalResult" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "count" } },
                ],
            },
        },
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ResultFrag" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Result" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "success" } },
                    { kind: "Field", name: { kind: "Name", value: "code" } },
                    { kind: "Field", name: { kind: "Name", value: "message" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AnilistSearchQuery, AnilistSearchQueryVariables>;
