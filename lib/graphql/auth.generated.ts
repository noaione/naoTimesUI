import * as Types from "./types.generated";

import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type LoginMutationVariables = Types.Exact<{
    username: Types.Scalars["String"]["input"];
    password: Types.Scalars["String"]["input"];
}>;

export type LoginMutation = {
    __typename?: "Mutation";
    login:
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
        | { __typename?: "UserSession"; id: any; username: string; privilege: Types.UserType; token: string };
};

export type LogoutMutationVariables = Types.Exact<{ [key: string]: never }>;

export type LogoutMutation = {
    __typename?: "Mutation";
    logout: { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type RegisterUserMutationVariables = Types.Exact<{
    username: Types.Scalars["String"]["input"];
    password: Types.Scalars["String"]["input"];
}>;

export type RegisterUserMutation = {
    __typename?: "Mutation";
    register:
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
        | { __typename?: "User"; id: any; username: string };
};

export type MigrateUserMutationVariables = Types.Exact<{
    username: Types.Scalars["String"]["input"];
    password: Types.Scalars["String"]["input"];
}>;

export type MigrateUserMutation = {
    __typename?: "Mutation";
    migrate:
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
        | { __typename?: "UserTemporary"; id: any; username: string; approvalCode: string };
};

export type ResetPasswordMutationVariables = Types.Exact<{
    oldPass: Types.Scalars["String"]["input"];
    newPass: Types.Scalars["String"]["input"];
}>;

export type ResetPasswordMutation = {
    __typename?: "Mutation";
    resetPassword:
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
        | { __typename?: "User"; id: any; username: string };
};

export type SessionQueryVariables = Types.Exact<{ [key: string]: never }>;

export type SessionQuery = {
    __typename?: "Query";
    session:
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null }
        | {
              __typename?: "UserSession";
              id: any;
              username: string;
              privilege: Types.UserType;
              token: string;
              active?: {
                  __typename?: "PartialServer";
                  id: any;
                  name: string;
                  avatar?: { __typename?: "ImageMetadata"; path: string; type: string } | null;
              } | null;
          };
};

export type UserSessFragment = {
    __typename?: "UserSession";
    id: any;
    username: string;
    privilege: Types.UserType;
    token: string;
    active?: {
        __typename?: "PartialServer";
        id: any;
        name: string;
        avatar?: { __typename?: "ImageMetadata"; path: string; type: string } | null;
    } | null;
};

export const UserSessFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "UserSess" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserSession" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "username" } },
                    { kind: "Field", name: { kind: "Name", value: "privilege" } },
                    { kind: "Field", name: { kind: "Name", value: "token" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "active" },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UserSessFragment, unknown>;
export const LoginDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "Login" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "username" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "password" } },
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
                        name: { kind: "Name", value: "login" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "username" },
                                value: { kind: "Variable", name: { kind: "Name", value: "username" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "password" },
                                value: { kind: "Variable", name: { kind: "Name", value: "password" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "UserSession" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "username" } },
                                            { kind: "Field", name: { kind: "Name", value: "privilege" } },
                                            { kind: "Field", name: { kind: "Name", value: "token" } },
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
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "Logout" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "logout" },
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
} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RegisterUserDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "RegisterUser" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "username" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "password" } },
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
                        name: { kind: "Name", value: "register" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "username" },
                                value: { kind: "Variable", name: { kind: "Name", value: "username" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "password" },
                                value: { kind: "Variable", name: { kind: "Name", value: "password" } },
                            },
                        ],
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
} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const MigrateUserDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "MigrateUser" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "username" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "password" } },
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
                        name: { kind: "Name", value: "migrate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "username" },
                                value: { kind: "Variable", name: { kind: "Name", value: "username" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "password" },
                                value: { kind: "Variable", name: { kind: "Name", value: "password" } },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
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
                                            { kind: "Field", name: { kind: "Name", value: "approvalCode" } },
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
} as unknown as DocumentNode<MigrateUserMutation, MigrateUserMutationVariables>;
export const ResetPasswordDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "ResetPassword" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "oldPass" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "newPass" } },
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
                        name: { kind: "Name", value: "resetPassword" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "oldPassword" },
                                value: { kind: "Variable", name: { kind: "Name", value: "oldPass" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "newPassword" },
                                value: { kind: "Variable", name: { kind: "Name", value: "newPass" } },
                            },
                        ],
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
} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SessionDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "Session" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "session" },
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
                                        name: { kind: "Name", value: "UserSession" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "UserSess" },
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
            name: { kind: "Name", value: "UserSess" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserSession" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "username" } },
                    { kind: "Field", name: { kind: "Name", value: "privilege" } },
                    { kind: "Field", name: { kind: "Name", value: "token" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "active" },
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
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SessionQuery, SessionQueryVariables>;
