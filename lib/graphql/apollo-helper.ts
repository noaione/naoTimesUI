import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from "@apollo/client/cache";
export type ImageMetadataKeySpecifier = ("path" | "type" | ImageMetadataKeySpecifier)[];
export type ImageMetadataFieldPolicy = {
    path?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type IntKeyValueKeySpecifier = ("key" | "value" | IntKeyValueKeySpecifier)[];
export type IntKeyValueFieldPolicy = {
    key?: FieldPolicy<any> | FieldReadFunction<any>;
    value?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type IntKeyValueNodeResultKeySpecifier = ("nodes" | IntKeyValueNodeResultKeySpecifier)[];
export type IntKeyValueNodeResultFieldPolicy = {
    nodes?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type IntegrationKeySpecifier = ("id" | "type" | IntegrationKeySpecifier)[];
export type IntegrationFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type MutationKeySpecifier = (
    | "addProject"
    | "addServer"
    | "approveMigration"
    | "bind"
    | "deleteProject"
    | "deleteServer"
    | "login"
    | "logout"
    | "migrate"
    | "register"
    | "resetApi"
    | "resetPassword"
    | "selectServer"
    | "updateProject"
    | "updateProjectEpisode"
    | "updateServer"
    | "updateServerOwners"
    | MutationKeySpecifier
)[];
export type MutationFieldPolicy = {
    addProject?: FieldPolicy<any> | FieldReadFunction<any>;
    addServer?: FieldPolicy<any> | FieldReadFunction<any>;
    approveMigration?: FieldPolicy<any> | FieldReadFunction<any>;
    bind?: FieldPolicy<any> | FieldReadFunction<any>;
    deleteProject?: FieldPolicy<any> | FieldReadFunction<any>;
    deleteServer?: FieldPolicy<any> | FieldReadFunction<any>;
    login?: FieldPolicy<any> | FieldReadFunction<any>;
    logout?: FieldPolicy<any> | FieldReadFunction<any>;
    migrate?: FieldPolicy<any> | FieldReadFunction<any>;
    register?: FieldPolicy<any> | FieldReadFunction<any>;
    resetApi?: FieldPolicy<any> | FieldReadFunction<any>;
    resetPassword?: FieldPolicy<any> | FieldReadFunction<any>;
    selectServer?: FieldPolicy<any> | FieldReadFunction<any>;
    updateProject?: FieldPolicy<any> | FieldReadFunction<any>;
    updateProjectEpisode?: FieldPolicy<any> | FieldReadFunction<any>;
    updateServer?: FieldPolicy<any> | FieldReadFunction<any>;
    updateServerOwners?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type NotificationKeySpecifier = (
    | "created"
    | "data"
    | "id"
    | "read"
    | "target"
    | NotificationKeySpecifier
)[];
export type NotificationFieldPolicy = {
    created?: FieldPolicy<any> | FieldReadFunction<any>;
    data?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    read?: FieldPolicy<any> | FieldReadFunction<any>;
    target?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type NotificationDataAdminBroadcastGQLKeySpecifier = (
    | "link"
    | "message"
    | NotificationDataAdminBroadcastGQLKeySpecifier
)[];
export type NotificationDataAdminBroadcastGQLFieldPolicy = {
    link?: FieldPolicy<any> | FieldReadFunction<any>;
    message?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PageInfoKeySpecifier = (
    | "hasNextPage"
    | "nextCursor"
    | "perPage"
    | "totalResults"
    | PageInfoKeySpecifier
)[];
export type PageInfoFieldPolicy = {
    hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>;
    nextCursor?: FieldPolicy<any> | FieldReadFunction<any>;
    perPage?: FieldPolicy<any> | FieldReadFunction<any>;
    totalResults?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PartialProjectKeySpecifier = (
    | "aliases"
    | "assignments"
    | "createdAt"
    | "external"
    | "id"
    | "integrations"
    | "poster"
    | "serverId"
    | "statuses"
    | "title"
    | "type"
    | "updatedAt"
    | PartialProjectKeySpecifier
)[];
export type PartialProjectFieldPolicy = {
    aliases?: FieldPolicy<any> | FieldReadFunction<any>;
    assignments?: FieldPolicy<any> | FieldReadFunction<any>;
    createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
    external?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    integrations?: FieldPolicy<any> | FieldReadFunction<any>;
    poster?: FieldPolicy<any> | FieldReadFunction<any>;
    serverId?: FieldPolicy<any> | FieldReadFunction<any>;
    statuses?: FieldPolicy<any> | FieldReadFunction<any>;
    title?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
    updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PartialProjectInterfaceKeySpecifier = (
    | "aliases"
    | "assignments"
    | "createdAt"
    | "id"
    | "integrations"
    | "poster"
    | "serverId"
    | "statuses"
    | "title"
    | "type"
    | "updatedAt"
    | PartialProjectInterfaceKeySpecifier
)[];
export type PartialProjectInterfaceFieldPolicy = {
    aliases?: FieldPolicy<any> | FieldReadFunction<any>;
    assignments?: FieldPolicy<any> | FieldReadFunction<any>;
    createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    integrations?: FieldPolicy<any> | FieldReadFunction<any>;
    poster?: FieldPolicy<any> | FieldReadFunction<any>;
    serverId?: FieldPolicy<any> | FieldReadFunction<any>;
    statuses?: FieldPolicy<any> | FieldReadFunction<any>;
    title?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
    updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PartialServerKeySpecifier = (
    | "avatar"
    | "id"
    | "integrations"
    | "name"
    | PartialServerKeySpecifier
)[];
export type PartialServerFieldPolicy = {
    avatar?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    integrations?: FieldPolicy<any> | FieldReadFunction<any>;
    name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type PartialServerInterfaceKeySpecifier = (
    | "avatar"
    | "id"
    | "integrations"
    | "name"
    | PartialServerInterfaceKeySpecifier
)[];
export type PartialServerInterfaceFieldPolicy = {
    avatar?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    integrations?: FieldPolicy<any> | FieldReadFunction<any>;
    name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectKeySpecifier = (
    | "aliases"
    | "assignments"
    | "collaborations"
    | "createdAt"
    | "external"
    | "id"
    | "integrations"
    | "poster"
    | "prediction"
    | "serverId"
    | "statuses"
    | "title"
    | "type"
    | "updatedAt"
    | ProjectKeySpecifier
)[];
export type ProjectFieldPolicy = {
    aliases?: FieldPolicy<any> | FieldReadFunction<any>;
    assignments?: FieldPolicy<any> | FieldReadFunction<any>;
    collaborations?: FieldPolicy<any> | FieldReadFunction<any>;
    createdAt?: FieldPolicy<any> | FieldReadFunction<any>;
    external?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    integrations?: FieldPolicy<any> | FieldReadFunction<any>;
    poster?: FieldPolicy<any> | FieldReadFunction<any>;
    prediction?: FieldPolicy<any> | FieldReadFunction<any>;
    serverId?: FieldPolicy<any> | FieldReadFunction<any>;
    statuses?: FieldPolicy<any> | FieldReadFunction<any>;
    title?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
    updatedAt?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectAssigneeKeySpecifier = ("assignee" | "key" | ProjectAssigneeKeySpecifier)[];
export type ProjectAssigneeFieldPolicy = {
    assignee?: FieldPolicy<any> | FieldReadFunction<any>;
    key?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectAssigneeInfoKeySpecifier = (
    | "id"
    | "integrations"
    | "name"
    | ProjectAssigneeInfoKeySpecifier
)[];
export type ProjectAssigneeInfoFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    integrations?: FieldPolicy<any> | FieldReadFunction<any>;
    name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectCollabConfirmationKeySpecifier = (
    | "code"
    | "id"
    | "source"
    | "target"
    | ProjectCollabConfirmationKeySpecifier
)[];
export type ProjectCollabConfirmationFieldPolicy = {
    code?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    source?: FieldPolicy<any> | FieldReadFunction<any>;
    target?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectCollabConfirmationInfoKeySpecifier = (
    | "project"
    | "server"
    | ProjectCollabConfirmationInfoKeySpecifier
)[];
export type ProjectCollabConfirmationInfoFieldPolicy = {
    project?: FieldPolicy<any> | FieldReadFunction<any>;
    server?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectCollabLinkKeySpecifier = (
    | "id"
    | "project"
    | "projects"
    | "servers"
    | ProjectCollabLinkKeySpecifier
)[];
export type ProjectCollabLinkFieldPolicy = {
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    project?: FieldPolicy<any> | FieldReadFunction<any>;
    projects?: FieldPolicy<any> | FieldReadFunction<any>;
    servers?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectConnectionKeySpecifier = (
    | "_total"
    | "nodes"
    | "pageInfo"
    | ProjectConnectionKeySpecifier
)[];
export type ProjectConnectionFieldPolicy = {
    _total?: FieldPolicy<any> | FieldReadFunction<any>;
    nodes?: FieldPolicy<any> | FieldReadFunction<any>;
    pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectEpisodeUpdateSubsKeySpecifier = (
    | "new"
    | "old"
    | "project"
    | "projectId"
    | "server"
    | "serverId"
    | "timestamp"
    | ProjectEpisodeUpdateSubsKeySpecifier
)[];
export type ProjectEpisodeUpdateSubsFieldPolicy = {
    new?: FieldPolicy<any> | FieldReadFunction<any>;
    old?: FieldPolicy<any> | FieldReadFunction<any>;
    project?: FieldPolicy<any> | FieldReadFunction<any>;
    projectId?: FieldPolicy<any> | FieldReadFunction<any>;
    server?: FieldPolicy<any> | FieldReadFunction<any>;
    serverId?: FieldPolicy<any> | FieldReadFunction<any>;
    timestamp?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectExternalKeySpecifier = ("episodes" | "startTime" | "type" | ProjectExternalKeySpecifier)[];
export type ProjectExternalFieldPolicy = {
    episodes?: FieldPolicy<any> | FieldReadFunction<any>;
    startTime?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectExternalAniListKeySpecifier = (
    | "episodes"
    | "id"
    | "malId"
    | "startTime"
    | "type"
    | ProjectExternalAniListKeySpecifier
)[];
export type ProjectExternalAniListFieldPolicy = {
    episodes?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    malId?: FieldPolicy<any> | FieldReadFunction<any>;
    startTime?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectExternalEpisodeKeySpecifier = (
    | "airtime"
    | "episode"
    | "season"
    | "title"
    | ProjectExternalEpisodeKeySpecifier
)[];
export type ProjectExternalEpisodeFieldPolicy = {
    airtime?: FieldPolicy<any> | FieldReadFunction<any>;
    episode?: FieldPolicy<any> | FieldReadFunction<any>;
    season?: FieldPolicy<any> | FieldReadFunction<any>;
    title?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectExternalTMDbKeySpecifier = (
    | "episodes"
    | "id"
    | "startTime"
    | "type"
    | ProjectExternalTMDbKeySpecifier
)[];
export type ProjectExternalTMDbFieldPolicy = {
    episodes?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    startTime?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectPredictionKeySpecifier = ("nextEpisode" | "overall" | ProjectPredictionKeySpecifier)[];
export type ProjectPredictionFieldPolicy = {
    nextEpisode?: FieldPolicy<any> | FieldReadFunction<any>;
    overall?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectStatusKeySpecifier = (
    | "airingAt"
    | "delayReason"
    | "episode"
    | "isReleased"
    | "roles"
    | ProjectStatusKeySpecifier
)[];
export type ProjectStatusFieldPolicy = {
    airingAt?: FieldPolicy<any> | FieldReadFunction<any>;
    delayReason?: FieldPolicy<any> | FieldReadFunction<any>;
    episode?: FieldPolicy<any> | FieldReadFunction<any>;
    isReleased?: FieldPolicy<any> | FieldReadFunction<any>;
    roles?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ProjectStatusRoleKeySpecifier = ("done" | "key" | "name" | ProjectStatusRoleKeySpecifier)[];
export type ProjectStatusRoleFieldPolicy = {
    done?: FieldPolicy<any> | FieldReadFunction<any>;
    key?: FieldPolicy<any> | FieldReadFunction<any>;
    name?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QueryKeySpecifier = (
    | "latests"
    | "project"
    | "projects"
    | "search"
    | "server"
    | "servers"
    | "session"
    | "stats"
    | "user"
    | QueryKeySpecifier
)[];
export type QueryFieldPolicy = {
    latests?: FieldPolicy<any> | FieldReadFunction<any>;
    project?: FieldPolicy<any> | FieldReadFunction<any>;
    projects?: FieldPolicy<any> | FieldReadFunction<any>;
    search?: FieldPolicy<any> | FieldReadFunction<any>;
    server?: FieldPolicy<any> | FieldReadFunction<any>;
    servers?: FieldPolicy<any> | FieldReadFunction<any>;
    session?: FieldPolicy<any> | FieldReadFunction<any>;
    stats?: FieldPolicy<any> | FieldReadFunction<any>;
    user?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type QuerySearchKeySpecifier = ("anilist" | "tmdb" | QuerySearchKeySpecifier)[];
export type QuerySearchFieldPolicy = {
    anilist?: FieldPolicy<any> | FieldReadFunction<any>;
    tmdb?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ResultKeySpecifier = ("code" | "message" | "success" | ResultKeySpecifier)[];
export type ResultFieldPolicy = {
    code?: FieldPolicy<any> | FieldReadFunction<any>;
    message?: FieldPolicy<any> | FieldReadFunction<any>;
    success?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SearchResultKeySpecifier = (
    | "count"
    | "coverUrl"
    | "format"
    | "id"
    | "season"
    | "source"
    | "title"
    | "titles"
    | "year"
    | SearchResultKeySpecifier
)[];
export type SearchResultFieldPolicy = {
    count?: FieldPolicy<any> | FieldReadFunction<any>;
    coverUrl?: FieldPolicy<any> | FieldReadFunction<any>;
    format?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    season?: FieldPolicy<any> | FieldReadFunction<any>;
    source?: FieldPolicy<any> | FieldReadFunction<any>;
    title?: FieldPolicy<any> | FieldReadFunction<any>;
    titles?: FieldPolicy<any> | FieldReadFunction<any>;
    year?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SearchResultTitleKeySpecifier = (
    | "english"
    | "native"
    | "romanized"
    | SearchResultTitleKeySpecifier
)[];
export type SearchResultTitleFieldPolicy = {
    english?: FieldPolicy<any> | FieldReadFunction<any>;
    native?: FieldPolicy<any> | FieldReadFunction<any>;
    romanized?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SearchResultsKeySpecifier = ("count" | "results" | SearchResultsKeySpecifier)[];
export type SearchResultsFieldPolicy = {
    count?: FieldPolicy<any> | FieldReadFunction<any>;
    results?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ServerKeySpecifier = (
    | "avatar"
    | "id"
    | "integrations"
    | "name"
    | "owners"
    | "projects"
    | ServerKeySpecifier
)[];
export type ServerFieldPolicy = {
    avatar?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    integrations?: FieldPolicy<any> | FieldReadFunction<any>;
    name?: FieldPolicy<any> | FieldReadFunction<any>;
    owners?: FieldPolicy<any> | FieldReadFunction<any>;
    projects?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ServerConnectionKeySpecifier = ("_total" | "nodes" | "pageInfo" | ServerConnectionKeySpecifier)[];
export type ServerConnectionFieldPolicy = {
    _total?: FieldPolicy<any> | FieldReadFunction<any>;
    nodes?: FieldPolicy<any> | FieldReadFunction<any>;
    pageInfo?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type ShowPosterKeySpecifier = ("color" | "image" | ShowPosterKeySpecifier)[];
export type ShowPosterFieldPolicy = {
    color?: FieldPolicy<any> | FieldReadFunction<any>;
    image?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SubsResponseKeySpecifier = ("extraId" | "id" | "timestamp" | SubsResponseKeySpecifier)[];
export type SubsResponseFieldPolicy = {
    extraId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    timestamp?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type SubscriptionKeySpecifier = (
    | "notification"
    | "projectDeletion"
    | "projectEpisodeUpdates"
    | "serverDeletion"
    | SubscriptionKeySpecifier
)[];
export type SubscriptionFieldPolicy = {
    notification?: FieldPolicy<any> | FieldReadFunction<any>;
    projectDeletion?: FieldPolicy<any> | FieldReadFunction<any>;
    projectEpisodeUpdates?: FieldPolicy<any> | FieldReadFunction<any>;
    serverDeletion?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UserKeySpecifier = ("avatar" | "id" | "privilege" | "username" | UserKeySpecifier)[];
export type UserFieldPolicy = {
    avatar?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    privilege?: FieldPolicy<any> | FieldReadFunction<any>;
    username?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UserSessionKeySpecifier = (
    | "active"
    | "activeId"
    | "id"
    | "privilege"
    | "token"
    | "username"
    | UserSessionKeySpecifier
)[];
export type UserSessionFieldPolicy = {
    active?: FieldPolicy<any> | FieldReadFunction<any>;
    activeId?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    privilege?: FieldPolicy<any> | FieldReadFunction<any>;
    token?: FieldPolicy<any> | FieldReadFunction<any>;
    username?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type UserTemporaryKeySpecifier = (
    | "approvalCode"
    | "id"
    | "type"
    | "username"
    | UserTemporaryKeySpecifier
)[];
export type UserTemporaryFieldPolicy = {
    approvalCode?: FieldPolicy<any> | FieldReadFunction<any>;
    id?: FieldPolicy<any> | FieldReadFunction<any>;
    type?: FieldPolicy<any> | FieldReadFunction<any>;
    username?: FieldPolicy<any> | FieldReadFunction<any>;
};
export type StrictTypedTypePolicies = {
    ImageMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ImageMetadataKeySpecifier | (() => undefined | ImageMetadataKeySpecifier);
        fields?: ImageMetadataFieldPolicy;
    };
    IntKeyValue?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | IntKeyValueKeySpecifier | (() => undefined | IntKeyValueKeySpecifier);
        fields?: IntKeyValueFieldPolicy;
    };
    IntKeyValueNodeResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | IntKeyValueNodeResultKeySpecifier
            | (() => undefined | IntKeyValueNodeResultKeySpecifier);
        fields?: IntKeyValueNodeResultFieldPolicy;
    };
    Integration?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | IntegrationKeySpecifier | (() => undefined | IntegrationKeySpecifier);
        fields?: IntegrationFieldPolicy;
    };
    Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier);
        fields?: MutationFieldPolicy;
    };
    Notification?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | NotificationKeySpecifier | (() => undefined | NotificationKeySpecifier);
        fields?: NotificationFieldPolicy;
    };
    NotificationDataAdminBroadcastGQL?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | NotificationDataAdminBroadcastGQLKeySpecifier
            | (() => undefined | NotificationDataAdminBroadcastGQLKeySpecifier);
        fields?: NotificationDataAdminBroadcastGQLFieldPolicy;
    };
    PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier);
        fields?: PageInfoFieldPolicy;
    };
    PartialProject?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | PartialProjectKeySpecifier | (() => undefined | PartialProjectKeySpecifier);
        fields?: PartialProjectFieldPolicy;
    };
    PartialProjectInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | PartialProjectInterfaceKeySpecifier
            | (() => undefined | PartialProjectInterfaceKeySpecifier);
        fields?: PartialProjectInterfaceFieldPolicy;
    };
    PartialServer?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | PartialServerKeySpecifier | (() => undefined | PartialServerKeySpecifier);
        fields?: PartialServerFieldPolicy;
    };
    PartialServerInterface?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | PartialServerInterfaceKeySpecifier
            | (() => undefined | PartialServerInterfaceKeySpecifier);
        fields?: PartialServerInterfaceFieldPolicy;
    };
    Project?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ProjectKeySpecifier | (() => undefined | ProjectKeySpecifier);
        fields?: ProjectFieldPolicy;
    };
    ProjectAssignee?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ProjectAssigneeKeySpecifier | (() => undefined | ProjectAssigneeKeySpecifier);
        fields?: ProjectAssigneeFieldPolicy;
    };
    ProjectAssigneeInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | ProjectAssigneeInfoKeySpecifier
            | (() => undefined | ProjectAssigneeInfoKeySpecifier);
        fields?: ProjectAssigneeInfoFieldPolicy;
    };
    ProjectCollabConfirmation?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | ProjectCollabConfirmationKeySpecifier
            | (() => undefined | ProjectCollabConfirmationKeySpecifier);
        fields?: ProjectCollabConfirmationFieldPolicy;
    };
    ProjectCollabConfirmationInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | ProjectCollabConfirmationInfoKeySpecifier
            | (() => undefined | ProjectCollabConfirmationInfoKeySpecifier);
        fields?: ProjectCollabConfirmationInfoFieldPolicy;
    };
    ProjectCollabLink?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ProjectCollabLinkKeySpecifier | (() => undefined | ProjectCollabLinkKeySpecifier);
        fields?: ProjectCollabLinkFieldPolicy;
    };
    ProjectConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ProjectConnectionKeySpecifier | (() => undefined | ProjectConnectionKeySpecifier);
        fields?: ProjectConnectionFieldPolicy;
    };
    ProjectEpisodeUpdateSubs?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | ProjectEpisodeUpdateSubsKeySpecifier
            | (() => undefined | ProjectEpisodeUpdateSubsKeySpecifier);
        fields?: ProjectEpisodeUpdateSubsFieldPolicy;
    };
    ProjectExternal?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ProjectExternalKeySpecifier | (() => undefined | ProjectExternalKeySpecifier);
        fields?: ProjectExternalFieldPolicy;
    };
    ProjectExternalAniList?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | ProjectExternalAniListKeySpecifier
            | (() => undefined | ProjectExternalAniListKeySpecifier);
        fields?: ProjectExternalAniListFieldPolicy;
    };
    ProjectExternalEpisode?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | ProjectExternalEpisodeKeySpecifier
            | (() => undefined | ProjectExternalEpisodeKeySpecifier);
        fields?: ProjectExternalEpisodeFieldPolicy;
    };
    ProjectExternalTMDb?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?:
            | false
            | ProjectExternalTMDbKeySpecifier
            | (() => undefined | ProjectExternalTMDbKeySpecifier);
        fields?: ProjectExternalTMDbFieldPolicy;
    };
    ProjectPrediction?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ProjectPredictionKeySpecifier | (() => undefined | ProjectPredictionKeySpecifier);
        fields?: ProjectPredictionFieldPolicy;
    };
    ProjectStatus?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ProjectStatusKeySpecifier | (() => undefined | ProjectStatusKeySpecifier);
        fields?: ProjectStatusFieldPolicy;
    };
    ProjectStatusRole?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ProjectStatusRoleKeySpecifier | (() => undefined | ProjectStatusRoleKeySpecifier);
        fields?: ProjectStatusRoleFieldPolicy;
    };
    Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier);
        fields?: QueryFieldPolicy;
    };
    QuerySearch?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | QuerySearchKeySpecifier | (() => undefined | QuerySearchKeySpecifier);
        fields?: QuerySearchFieldPolicy;
    };
    Result?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ResultKeySpecifier | (() => undefined | ResultKeySpecifier);
        fields?: ResultFieldPolicy;
    };
    SearchResult?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | SearchResultKeySpecifier | (() => undefined | SearchResultKeySpecifier);
        fields?: SearchResultFieldPolicy;
    };
    SearchResultTitle?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | SearchResultTitleKeySpecifier | (() => undefined | SearchResultTitleKeySpecifier);
        fields?: SearchResultTitleFieldPolicy;
    };
    SearchResults?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | SearchResultsKeySpecifier | (() => undefined | SearchResultsKeySpecifier);
        fields?: SearchResultsFieldPolicy;
    };
    Server?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ServerKeySpecifier | (() => undefined | ServerKeySpecifier);
        fields?: ServerFieldPolicy;
    };
    ServerConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ServerConnectionKeySpecifier | (() => undefined | ServerConnectionKeySpecifier);
        fields?: ServerConnectionFieldPolicy;
    };
    ShowPoster?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | ShowPosterKeySpecifier | (() => undefined | ShowPosterKeySpecifier);
        fields?: ShowPosterFieldPolicy;
    };
    SubsResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | SubsResponseKeySpecifier | (() => undefined | SubsResponseKeySpecifier);
        fields?: SubsResponseFieldPolicy;
    };
    Subscription?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | SubscriptionKeySpecifier | (() => undefined | SubscriptionKeySpecifier);
        fields?: SubscriptionFieldPolicy;
    };
    User?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier);
        fields?: UserFieldPolicy;
    };
    UserSession?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | UserSessionKeySpecifier | (() => undefined | UserSessionKeySpecifier);
        fields?: UserSessionFieldPolicy;
    };
    UserTemporary?: Omit<TypePolicy, "fields" | "keyFields"> & {
        keyFields?: false | UserTemporaryKeySpecifier | (() => undefined | UserTemporaryKeySpecifier);
        fields?: UserTemporaryFieldPolicy;
    };
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;
