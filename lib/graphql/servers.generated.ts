import * as Types from "./types.generated";

import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type SetServerMutationVariables = Types.Exact<{
    id?: Types.InputMaybe<Types.Scalars["UUID"]["input"]>;
}>;

export type SetServerMutation = {
    __typename?: "Mutation";
    selectServer: { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type GetCurrentServerQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetCurrentServerQuery = {
    __typename?: "Query";
    server:
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
        | {
              __typename?: "Server";
              id: any;
              name: string;
              avatar?: { __typename?: "ImageMetadata"; path: string; type: string } | null;
              integrations: Array<{ __typename?: "Integration"; id: string; type: string }>;
              owners: Array<
                  | { __typename?: "User"; id: any; username: string; privilege: Types.UserType }
                  | { __typename?: "UserTemporary"; id: any; username: string; type: Types.UserTempType }
              >;
          };
};

export type GetRegisteredServerQueryVariables = Types.Exact<{
    cursor?: Types.InputMaybe<Types.Scalars["String"]["input"]>;
}>;

export type GetRegisteredServerQuery = {
    __typename?: "Query";
    servers:
        | { __typename?: "Result"; code?: string | null; message?: string | null; success: boolean }
        | {
              __typename?: "ServerConnection";
              _total: number;
              pageInfo: {
                  __typename?: "PageInfo";
                  nextCursor?: string | null;
                  hasNextPage: boolean;
                  perPage: number;
                  totalResults: number;
              };
              nodes: Array<{
                  __typename?: "Server";
                  id: any;
                  name: string;
                  avatar?: { __typename?: "ImageMetadata"; path: string; type: string } | null;
                  integrations: Array<{ __typename?: "Integration"; id: string; type: string }>;
                  owners: Array<
                      | { __typename?: "User"; id: any; username: string; privilege: Types.UserType }
                      | { __typename?: "UserTemporary"; id: any; username: string; type: Types.UserTempType }
                  >;
              }>;
          };
};

export type GetServerStatsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type GetServerStatsQuery = {
    __typename?: "Query";
    stats:
        | {
              __typename?: "IntKeyValueNodeResult";
              nodes: Array<{ __typename?: "IntKeyValue"; key: string; value: number }>;
          }
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type GetServerNamesQueryVariables = Types.Exact<{
    ids?: Types.InputMaybe<Array<Types.Scalars["UUID"]["input"]> | Types.Scalars["UUID"]["input"]>;
    cursor?: Types.InputMaybe<Types.Scalars["String"]["input"]>;
}>;

export type GetServerNamesQuery = {
    __typename?: "Query";
    servers:
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
        | {
              __typename?: "ServerConnection";
              nodes: Array<{ __typename?: "Server"; id: any; name: string }>;
              pageInfo: { __typename?: "PageInfo"; nextCursor?: string | null };
          };
};

export type MutateServerOwnerMutationVariables = Types.Exact<{
    owners: Array<Types.Scalars["UUID"]["input"]> | Types.Scalars["UUID"]["input"];
}>;

export type MutateServerOwnerMutation = {
    __typename?: "Mutation";
    updateServerOwners:
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
        | {
              __typename?: "Server";
              owners: Array<
                  | { __typename?: "User"; id: any; username: string }
                  | { __typename?: "UserTemporary"; id: any; username: string }
              >;
          };
};

export type MutateServerMutationVariables = Types.Exact<{
    data: Types.ServerInput;
}>;

export type MutateServerMutation = {
    __typename?: "Mutation";
    updateServer:
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
        | {
              __typename?: "Server";
              id: any;
              name: string;
              avatar?: { __typename?: "ImageMetadata"; path: string; type: string } | null;
              integrations: Array<{ __typename?: "Integration"; id: string; type: string }>;
              owners: Array<
                  | { __typename?: "User"; id: any; username: string; privilege: Types.UserType }
                  | { __typename?: "UserTemporary"; id: any; username: string; type: Types.UserTempType }
              >;
          };
};

export type NukeServerMutationVariables = Types.Exact<{
    id: Types.Scalars["UUID"]["input"];
}>;

export type NukeServerMutation = {
    __typename?: "Mutation";
    deleteServer: { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type AddServerMutationVariables = Types.Exact<{
    data: Types.ServerInput;
}>;

export type AddServerMutation = {
    __typename?: "Mutation";
    addServer:
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
        | {
              __typename?: "Server";
              id: any;
              name: string;
              avatar?: { __typename?: "ImageMetadata"; path: string; type: string } | null;
              integrations: Array<{ __typename?: "Integration"; id: string; type: string }>;
              owners: Array<
                  | { __typename?: "User"; id: any; username: string; privilege: Types.UserType }
                  | { __typename?: "UserTemporary"; id: any; username: string; type: Types.UserTempType }
              >;
          };
};

export const SetServerDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "SetServer" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "selectServer" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "ResultFrag" } },
                            ],
                        },
                    },
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
} as unknown as DocumentNode<SetServerMutation, SetServerMutationVariables>;
export const GetCurrentServerDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetCurrentServer" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "server" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
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
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "Server" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "ServerInfo" },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ServerInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Server" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "avatar" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "path" } },
                                { kind: "Field", name: { kind: "Name", value: "type" } },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "integrations" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "type" } },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "owners" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "username" } },
                                            { kind: "Field", name: { kind: "Name", value: "privilege" } },
                                        ],
                                    },
                                },
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "UserTemporary" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "username" } },
                                            { kind: "Field", name: { kind: "Name", value: "type" } },
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
} as unknown as DocumentNode<GetCurrentServerQuery, GetCurrentServerQueryVariables>;
export const GetRegisteredServerDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetRegisteredServer" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "servers" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "limit" },
                                value: { kind: "IntValue", value: "25" },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "cursor" },
                                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "Result" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "code" } },
                                            { kind: "Field", name: { kind: "Name", value: "message" } },
                                            { kind: "Field", name: { kind: "Name", value: "success" } },
                                        ],
                                    },
                                },
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "ServerConnection" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "_total" } },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "pageInfo" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "nextCursor" },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "hasNextPage" },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "perPage" },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "totalResults" },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "nodes" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: { kind: "Name", value: "ServerInfo" },
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
            name: { kind: "Name", value: "ServerInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Server" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "avatar" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "path" } },
                                { kind: "Field", name: { kind: "Name", value: "type" } },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "integrations" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "type" } },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "owners" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "username" } },
                                            { kind: "Field", name: { kind: "Name", value: "privilege" } },
                                        ],
                                    },
                                },
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "UserTemporary" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "username" } },
                                            { kind: "Field", name: { kind: "Name", value: "type" } },
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
} as unknown as DocumentNode<GetRegisteredServerQuery, GetRegisteredServerQueryVariables>;
export const GetServerStatsDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetServerStats" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "stats" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
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
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "IntKeyValueNodeResult" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "nodes" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "key" },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "value" },
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
} as unknown as DocumentNode<GetServerStatsQuery, GetServerStatsQueryVariables>;
export const GetServerNamesDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetServerNames" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "ids" } },
                    type: {
                        kind: "ListType",
                        type: {
                            kind: "NonNullType",
                            type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "servers" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "ids" },
                                value: { kind: "Variable", name: { kind: "Name", value: "ids" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "limit" },
                                value: { kind: "IntValue", value: "100" },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "cursor" },
                                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
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
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "ServerConnection" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "nodes" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "id" },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "name" },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "pageInfo" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "nextCursor" },
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
} as unknown as DocumentNode<GetServerNamesQuery, GetServerNamesQueryVariables>;
export const MutateServerOwnerDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "MutateServerOwner" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "owners" } },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "ListType",
                            type: {
                                kind: "NonNullType",
                                type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "updateServerOwners" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "owners" },
                                value: { kind: "Variable", name: { kind: "Name", value: "owners" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
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
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "Server" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "owners" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "InlineFragment",
                                                            typeCondition: {
                                                                kind: "NamedType",
                                                                name: { kind: "Name", value: "User" },
                                                            },
                                                            selectionSet: {
                                                                kind: "SelectionSet",
                                                                selections: [
                                                                    {
                                                                        kind: "Field",
                                                                        name: { kind: "Name", value: "id" },
                                                                    },
                                                                    {
                                                                        kind: "Field",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "username",
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: "InlineFragment",
                                                            typeCondition: {
                                                                kind: "NamedType",
                                                                name: {
                                                                    kind: "Name",
                                                                    value: "UserTemporary",
                                                                },
                                                            },
                                                            selectionSet: {
                                                                kind: "SelectionSet",
                                                                selections: [
                                                                    {
                                                                        kind: "Field",
                                                                        name: { kind: "Name", value: "id" },
                                                                    },
                                                                    {
                                                                        kind: "Field",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "username",
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
                            ],
                        },
                    },
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
} as unknown as DocumentNode<MutateServerOwnerMutation, MutateServerOwnerMutationVariables>;
export const MutateServerDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "MutateServer" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "data" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ServerInput" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "updateServer" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: { kind: "Variable", name: { kind: "Name", value: "data" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
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
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "Server" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "ServerInfo" },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ServerInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Server" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "avatar" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "path" } },
                                { kind: "Field", name: { kind: "Name", value: "type" } },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "integrations" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "type" } },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "owners" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "username" } },
                                            { kind: "Field", name: { kind: "Name", value: "privilege" } },
                                        ],
                                    },
                                },
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "UserTemporary" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "username" } },
                                            { kind: "Field", name: { kind: "Name", value: "type" } },
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
} as unknown as DocumentNode<MutateServerMutation, MutateServerMutationVariables>;
export const NukeServerDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "NukeServer" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "deleteServer" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
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
} as unknown as DocumentNode<NukeServerMutation, NukeServerMutationVariables>;
export const AddServerDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "AddServer" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "data" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ServerInput" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "addServer" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: { kind: "Variable", name: { kind: "Name", value: "data" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
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
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "Server" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "ServerInfo" },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ServerInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Server" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "avatar" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "path" } },
                                { kind: "Field", name: { kind: "Name", value: "type" } },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "integrations" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "id" } },
                                { kind: "Field", name: { kind: "Name", value: "type" } },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "owners" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "User" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "username" } },
                                            { kind: "Field", name: { kind: "Name", value: "privilege" } },
                                        ],
                                    },
                                },
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "UserTemporary" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "username" } },
                                            { kind: "Field", name: { kind: "Name", value: "type" } },
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
} as unknown as DocumentNode<AddServerMutation, AddServerMutationVariables>;
