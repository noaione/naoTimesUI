import * as Types from "./types.generated";

import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type GetLatestProjectInfoQueryVariables = Types.Exact<{
    cursor?: Types.InputMaybe<Types.Scalars["String"]["input"]>;
    includeLast?: Types.InputMaybe<Types.Scalars["Boolean"]["input"]>;
}>;

export type GetLatestProjectInfoQuery = {
    __typename?: "Query";
    latests:
        | {
              __typename?: "ProjectConnection";
              pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; nextCursor?: string | null };
              nodes: Array<{
                  __typename?: "Project";
                  id: any;
                  title: string;
                  poster?: {
                      __typename?: "ShowPoster";
                      image: { __typename?: "ImageMetadata"; path: string };
                  } | null;
                  statuses: Array<{
                      __typename?: "ProjectStatus";
                      episode: number;
                      isReleased: boolean;
                      roles: Array<{
                          __typename?: "ProjectStatusRole";
                          key: string;
                          name: string;
                          done: boolean;
                      }>;
                  }>;
                  assignments: Array<{
                      __typename?: "ProjectAssignee";
                      key: string;
                      assignee?: { __typename?: "ProjectAssigneeInfo"; id: any; name: string } | null;
                  }>;
              }>;
          }
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type GetEmbedProjectsQueryVariables = Types.Exact<{
    cursor?: Types.InputMaybe<Types.Scalars["String"]["input"]>;
    ids?: Types.InputMaybe<Array<Types.Scalars["UUID"]["input"]> | Types.Scalars["UUID"]["input"]>;
}>;

export type GetEmbedProjectsQuery = {
    __typename?: "Query";
    projects:
        | {
              __typename?: "ProjectConnection";
              pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; nextCursor?: string | null };
              nodes: Array<{
                  __typename?: "Project";
                  id: any;
                  title: string;
                  updatedAt: any;
                  poster?: {
                      __typename?: "ShowPoster";
                      image: { __typename?: "ImageMetadata"; path: string };
                  } | null;
                  statuses: Array<{
                      __typename?: "ProjectStatus";
                      airingAt?: any | null;
                      isReleased: boolean;
                      episode: number;
                      delayReason?: string | null;
                      roles: Array<{
                          __typename?: "ProjectStatusRole";
                          key: string;
                          done: boolean;
                          name: string;
                      }>;
                  }>;
                  collaborations?: { __typename?: "ProjectCollabLink"; servers: Array<any> } | null;
                  external:
                      | { __typename?: "ProjectExternalAniList"; startTime?: any | null }
                      | { __typename?: "ProjectExternalTMDb"; startTime?: any | null };
              }>;
          }
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type GetProjectQueryVariables = Types.Exact<{
    id: Types.Scalars["UUID"]["input"];
}>;

export type GetProjectQuery = {
    __typename?: "Query";
    project:
        | {
              __typename?: "Project";
              id: any;
              title: string;
              aliases: Array<string>;
              poster?: {
                  __typename?: "ShowPoster";
                  image: { __typename?: "ImageMetadata"; path: string };
              } | null;
              assignments: Array<{
                  __typename?: "ProjectAssignee";
                  key: string;
                  assignee?: { __typename?: "ProjectAssigneeInfo"; id: any; name: string } | null;
              }>;
              statuses: Array<{
                  __typename?: "ProjectStatus";
                  episode: number;
                  isReleased: boolean;
                  airingAt?: any | null;
                  delayReason?: string | null;
                  roles: Array<{
                      __typename?: "ProjectStatusRole";
                      key: string;
                      name: string;
                      done: boolean;
                  }>;
              }>;
              prediction: {
                  __typename?: "ProjectPrediction";
                  nextEpisode?: number | null;
                  overall?: number | null;
              };
          }
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type MutateNewProjectMutationVariables = Types.Exact<{
    data: Types.ProjectInput;
}>;

export type MutateNewProjectMutation = {
    __typename?: "Mutation";
    addProject:
        | { __typename?: "Project"; id: any; title: string }
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type MutateProjectEpisodeStatusMutationVariables = Types.Exact<{
    id: Types.Scalars["UUID"]["input"];
    episode: Types.ProjectEpisodeInput;
}>;

export type MutateProjectEpisodeStatusMutation = {
    __typename?: "Mutation";
    updateProjectEpisode: {
        __typename?: "Result";
        success: boolean;
        code?: string | null;
        message?: string | null;
    };
};

export type MutateProjectAliasesMutationVariables = Types.Exact<{
    id: Types.Scalars["UUID"]["input"];
    aliases?: Types.InputMaybe<Array<Types.Scalars["String"]["input"]> | Types.Scalars["String"]["input"]>;
}>;

export type MutateProjectAliasesMutation = {
    __typename?: "Mutation";
    updateProject:
        | { __typename?: "Project"; aliases: Array<string> }
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type MutateProjectStaffMutationVariables = Types.Exact<{
    id: Types.Scalars["UUID"]["input"];
    assignee: Types.ProjectInputAssignee;
}>;

export type MutateProjectStaffMutation = {
    __typename?: "Mutation";
    updateProject:
        | {
              __typename?: "Project";
              assignments: Array<{
                  __typename?: "ProjectAssignee";
                  key: string;
                  assignee?: { __typename?: "ProjectAssigneeInfo"; id: any; name: string } | null;
              }>;
          }
        | { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type MutateProjectNukeMutationVariables = Types.Exact<{
    id: Types.Scalars["UUID"]["input"];
}>;

export type MutateProjectNukeMutation = {
    __typename?: "Mutation";
    deleteProject: { __typename?: "Result"; success: boolean; code?: string | null; message?: string | null };
};

export type ProjectAddResultFragment = { __typename?: "Project"; id: any; title: string };

export type EmbedProjectFragment = {
    __typename?: "Project";
    id: any;
    title: string;
    updatedAt: any;
    poster?: { __typename?: "ShowPoster"; image: { __typename?: "ImageMetadata"; path: string } } | null;
    statuses: Array<{
        __typename?: "ProjectStatus";
        airingAt?: any | null;
        isReleased: boolean;
        episode: number;
        delayReason?: string | null;
        roles: Array<{ __typename?: "ProjectStatusRole"; key: string; done: boolean; name: string }>;
    }>;
    collaborations?: { __typename?: "ProjectCollabLink"; servers: Array<any> } | null;
    external:
        | { __typename?: "ProjectExternalAniList"; startTime?: any | null }
        | { __typename?: "ProjectExternalTMDb"; startTime?: any | null };
};

export type ProjectQueryInfoFragment = {
    __typename?: "Project";
    id: any;
    title: string;
    aliases: Array<string>;
    poster?: { __typename?: "ShowPoster"; image: { __typename?: "ImageMetadata"; path: string } } | null;
    assignments: Array<{
        __typename?: "ProjectAssignee";
        key: string;
        assignee?: { __typename?: "ProjectAssigneeInfo"; id: any; name: string } | null;
    }>;
    statuses: Array<{
        __typename?: "ProjectStatus";
        episode: number;
        isReleased: boolean;
        airingAt?: any | null;
        delayReason?: string | null;
        roles: Array<{ __typename?: "ProjectStatusRole"; key: string; name: string; done: boolean }>;
    }>;
    prediction: { __typename?: "ProjectPrediction"; nextEpisode?: number | null; overall?: number | null };
};

export type LatestProjectFragment = {
    __typename?: "Project";
    id: any;
    title: string;
    poster?: { __typename?: "ShowPoster"; image: { __typename?: "ImageMetadata"; path: string } } | null;
    statuses: Array<{
        __typename?: "ProjectStatus";
        episode: number;
        isReleased: boolean;
        roles: Array<{ __typename?: "ProjectStatusRole"; key: string; name: string; done: boolean }>;
    }>;
    assignments: Array<{
        __typename?: "ProjectAssignee";
        key: string;
        assignee?: { __typename?: "ProjectAssigneeInfo"; id: any; name: string } | null;
    }>;
};

export const ProjectAddResultFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectAddResult" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Project" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProjectAddResultFragment, unknown>;
export const EmbedProjectFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EmbedProject" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Project" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "poster" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "image" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "path" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "statuses" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "roles" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "key" } },
                                            { kind: "Field", name: { kind: "Name", value: "done" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
                                        ],
                                    },
                                },
                                { kind: "Field", name: { kind: "Name", value: "airingAt" } },
                                { kind: "Field", name: { kind: "Name", value: "isReleased" } },
                                { kind: "Field", name: { kind: "Name", value: "episode" } },
                                { kind: "Field", name: { kind: "Name", value: "delayReason" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "collaborations" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "Field", name: { kind: "Name", value: "servers" } }],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "external" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "ProjectExternal" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "startTime" } },
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
} as unknown as DocumentNode<EmbedProjectFragment, unknown>;
export const ProjectQueryInfoFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectQueryInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Project" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "poster" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "image" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "path" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "aliases" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "assignments" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "key" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "assignee" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "statuses" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "episode" } },
                                { kind: "Field", name: { kind: "Name", value: "isReleased" } },
                                { kind: "Field", name: { kind: "Name", value: "airingAt" } },
                                { kind: "Field", name: { kind: "Name", value: "delayReason" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "roles" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "key" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
                                            { kind: "Field", name: { kind: "Name", value: "done" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "prediction" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "nextEpisode" } },
                                { kind: "Field", name: { kind: "Name", value: "overall" } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<ProjectQueryInfoFragment, unknown>;
export const LatestProjectFragmentDoc = {
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "LatestProject" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Project" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "poster" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "image" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "path" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "statuses" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "episode" } },
                                { kind: "Field", name: { kind: "Name", value: "isReleased" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "roles" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "key" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
                                            { kind: "Field", name: { kind: "Name", value: "done" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "assignments" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "key" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "assignee" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
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
} as unknown as DocumentNode<LatestProjectFragment, unknown>;
export const GetLatestProjectInfoDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetLatestProjectInfo" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "includeLast" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
                    defaultValue: { kind: "BooleanValue", value: false },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "latests" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "cursor" },
                                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "limit" },
                                value: { kind: "IntValue", value: "10" },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "includeLast" },
                                value: { kind: "Variable", name: { kind: "Name", value: "includeLast" } },
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
                                        name: { kind: "Name", value: "ProjectConnection" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "pageInfo" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "hasNextPage" },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "nextCursor" },
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
                                                            name: { kind: "Name", value: "LatestProject" },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "LatestProject" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Project" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "poster" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "image" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "path" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "statuses" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "episode" } },
                                { kind: "Field", name: { kind: "Name", value: "isReleased" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "roles" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "key" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
                                            { kind: "Field", name: { kind: "Name", value: "done" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "assignments" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "key" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "assignee" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
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
} as unknown as DocumentNode<GetLatestProjectInfoQuery, GetLatestProjectInfoQueryVariables>;
export const GetEmbedProjectsDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetEmbedProjects" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                },
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
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projects" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "cursor" },
                                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
                            },
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
                                        name: { kind: "Name", value: "ProjectConnection" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "pageInfo" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "hasNextPage" },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "nextCursor" },
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
                                                            name: { kind: "Name", value: "EmbedProject" },
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
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EmbedProject" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Project" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "poster" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "image" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "path" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "statuses" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "roles" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "key" } },
                                            { kind: "Field", name: { kind: "Name", value: "done" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
                                        ],
                                    },
                                },
                                { kind: "Field", name: { kind: "Name", value: "airingAt" } },
                                { kind: "Field", name: { kind: "Name", value: "isReleased" } },
                                { kind: "Field", name: { kind: "Name", value: "episode" } },
                                { kind: "Field", name: { kind: "Name", value: "delayReason" } },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "collaborations" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "Field", name: { kind: "Name", value: "servers" } }],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "external" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "ProjectExternal" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "startTime" } },
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
} as unknown as DocumentNode<GetEmbedProjectsQuery, GetEmbedProjectsQueryVariables>;
export const GetProjectDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetProject" },
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
                        name: { kind: "Name", value: "project" },
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
                                {
                                    kind: "InlineFragment",
                                    typeCondition: {
                                        kind: "NamedType",
                                        name: { kind: "Name", value: "Project" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "ProjectQueryInfo" },
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
            name: { kind: "Name", value: "ProjectQueryInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Project" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "poster" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "image" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "path" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    { kind: "Field", name: { kind: "Name", value: "aliases" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "assignments" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "key" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "assignee" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "id" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "statuses" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "episode" } },
                                { kind: "Field", name: { kind: "Name", value: "isReleased" } },
                                { kind: "Field", name: { kind: "Name", value: "airingAt" } },
                                { kind: "Field", name: { kind: "Name", value: "delayReason" } },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "roles" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "key" } },
                                            { kind: "Field", name: { kind: "Name", value: "name" } },
                                            { kind: "Field", name: { kind: "Name", value: "done" } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "prediction" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "Field", name: { kind: "Name", value: "nextEpisode" } },
                                { kind: "Field", name: { kind: "Name", value: "overall" } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetProjectQuery, GetProjectQueryVariables>;
export const MutateNewProjectDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "MutateNewProject" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "data" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ProjectInput" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "addProject" },
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
                                        name: { kind: "Name", value: "Project" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "ProjectAddResult" },
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
            name: { kind: "Name", value: "ProjectAddResult" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Project" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "title" } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<MutateNewProjectMutation, MutateNewProjectMutationVariables>;
export const MutateProjectEpisodeStatusDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "MutateProjectEpisodeStatus" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "episode" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ProjectEpisodeInput" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "updateProjectEpisode" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "episodes" },
                                value: {
                                    kind: "ListValue",
                                    values: [{ kind: "Variable", name: { kind: "Name", value: "episode" } }],
                                },
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
} as unknown as DocumentNode<MutateProjectEpisodeStatusMutation, MutateProjectEpisodeStatusMutationVariables>;
export const MutateProjectAliasesDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "MutateProjectAliases" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "aliases" } },
                    type: {
                        kind: "ListType",
                        type: {
                            kind: "NonNullType",
                            type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "updateProject" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "aliases" },
                                            value: {
                                                kind: "Variable",
                                                name: { kind: "Name", value: "aliases" },
                                            },
                                        },
                                    ],
                                },
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
                                        name: { kind: "Name", value: "Project" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "Field", name: { kind: "Name", value: "aliases" } },
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
} as unknown as DocumentNode<MutateProjectAliasesMutation, MutateProjectAliasesMutationVariables>;
export const MutateProjectStaffDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "MutateProjectStaff" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "UUID" } },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "assignee" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ProjectInputAssignee" } },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "updateProject" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "ObjectValue",
                                    fields: [
                                        {
                                            kind: "ObjectField",
                                            name: { kind: "Name", value: "assignees" },
                                            value: {
                                                kind: "ListValue",
                                                values: [
                                                    {
                                                        kind: "Variable",
                                                        name: { kind: "Name", value: "assignee" },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
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
                                        name: { kind: "Name", value: "Project" },
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "assignments" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "key" },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "assignee" },
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
} as unknown as DocumentNode<MutateProjectStaffMutation, MutateProjectStaffMutationVariables>;
export const MutateProjectNukeDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "MutateProjectNuke" },
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
                        name: { kind: "Name", value: "deleteProject" },
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
} as unknown as DocumentNode<MutateProjectNukeMutation, MutateProjectNukeMutationVariables>;
