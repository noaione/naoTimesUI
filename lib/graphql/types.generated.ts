export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  UNIX: { input: any; output: any; }
  UUID: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

/** A key-value input pair */
export type BoolKeyValueInput = {
  /** The key */
  key: Scalars['String']['input'];
  /** The value */
  value: Scalars['Boolean']['input'];
};

/** An image for an entity */
export type ImageMetadata = {
  __typename?: 'ImageMetadata';
  /** The path to the image */
  path: Scalars['String']['output'];
  /** The type of the avatar (user, group, shows, etc) */
  type: Scalars['String']['output'];
};

/** A key-value pair */
export type IntKeyValue = {
  __typename?: 'IntKeyValue';
  /** The key */
  key: Scalars['String']['output'];
  /** The value */
  value: Scalars['Int']['output'];
};

/** Simple result wrapper for a list */
export type IntKeyValueNodeResult = {
  __typename?: 'IntKeyValueNodeResult';
  /** List of nodes */
  nodes: Array<IntKeyValue>;
};

/** The integration information */
export type Integration = {
  __typename?: 'Integration';
  /** The integration ID or value */
  id: Scalars['String']['output'];
  /** The integration type (in full capital) */
  type: Scalars['String']['output'];
};

/** The integration information */
export type IntegrationInput = {
  /** The integration action */
  action: IntegrationInputAction;
  /** The integration ID or value */
  id: Scalars['String']['input'];
  /** The integration type (in full capital) */
  type: Scalars['String']['input'];
};

/** The action to be taken for the integration */
export enum IntegrationInputAction {
  Add = 'ADD',
  Delete = 'DELETE',
  Upsert = 'UPSERT'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a new project */
  addProject: ResultProject;
  /** Add a new server */
  addServer: ResultServer;
  /** Approve a user migration request */
  approveMigration: UserResult;
  /** Approve a user registration */
  approveRegister: UserResult;
  /** Delete a project */
  deleteProject: Result;
  /** Delete a server */
  deleteServer: Result;
  /** Login to Showtimes */
  login: UserSessionResult;
  /** Logout from Showtimes */
  logout: Result;
  /** Migrate user to new Showtimes */
  migrate: UserTemporaryResult;
  /** Register to Showtimes */
  register: UserTemporaryResult;
  /** Reset API key of an account */
  resetApi: Result;
  /** Reset password of an account */
  resetPassword: UserResult;
  /** Select or deselect an active server for an account */
  selectServer: Result;
  /** Update a project */
  updateProject: ResultProject;
  /** Update a project episode status */
  updateProjectEpisode: Result;
  /** Update a server */
  updateServer: ResultServer;
  /** Update a server owners */
  updateServerOwners: ResultServer;
};


export type MutationAddProjectArgs = {
  data: ProjectInput;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


export type MutationAddServerArgs = {
  data: ServerInput;
};


export type MutationApproveMigrationArgs = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationApproveRegisterArgs = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationDeleteServerArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationMigrateArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationSelectServerArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


export type MutationUpdateProjectArgs = {
  data: ProjectInput;
  id: Scalars['UUID']['input'];
};


export type MutationUpdateProjectEpisodeArgs = {
  episodes: Array<ProjectEpisodeInput>;
  id: Scalars['UUID']['input'];
};


export type MutationUpdateServerArgs = {
  data: ServerInput;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


export type MutationUpdateServerOwnersArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  owners: Array<Scalars['UUID']['input']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** Whether there is a next page or not */
  hasNextPage: Scalars['Boolean']['output'];
  /** Next cursor for pagination */
  nextCursor?: Maybe<Scalars['String']['output']>;
  /** How much data exist per page */
  perPage: Scalars['Int']['output'];
  /** The total data count on all pages */
  totalResults: Scalars['Int']['output'];
};

/** The partial project information */
export type PartialProject = PartialProjectInterface & {
  __typename?: 'PartialProject';
  /** The project aliases */
  aliases: Array<Scalars['String']['output']>;
  /** The project assignments */
  assignments: Array<ProjectAssignee>;
  /** The project creation time */
  createdAt: Scalars['DateTime']['output'];
  /** The project external information */
  external: ProjectExternal;
  /** The project ID */
  id: Scalars['UUID']['output'];
  /** The project integrations */
  integrations: Array<Integration>;
  /** The project poster */
  poster?: Maybe<ShowPoster>;
  /** The server ID */
  serverId: Scalars['UUID']['output'];
  /** The project statuses of each episode */
  statuses: Array<ProjectStatus>;
  /** The project title */
  title: Scalars['String']['output'];
  /** The project type */
  type: ProjectType;
  /** The project last update time */
  updatedAt: Scalars['DateTime']['output'];
};

/** The partial project information */
export type PartialProjectInterface = {
  /** The project aliases */
  aliases: Array<Scalars['String']['output']>;
  /** The project assignments */
  assignments: Array<ProjectAssignee>;
  /** The project creation time */
  createdAt: Scalars['DateTime']['output'];
  /** The project ID */
  id: Scalars['UUID']['output'];
  /** The project integrations */
  integrations: Array<Integration>;
  /** The project poster */
  poster?: Maybe<ShowPoster>;
  /** The server ID */
  serverId: Scalars['UUID']['output'];
  /** The project statuses of each episode */
  statuses: Array<ProjectStatus>;
  /** The project title */
  title: Scalars['String']['output'];
  /** The project type */
  type: ProjectType;
  /** The project last update time */
  updatedAt: Scalars['DateTime']['output'];
};

/** The partial server information */
export type PartialServer = PartialServerInterface & {
  __typename?: 'PartialServer';
  /** The server image */
  avatar?: Maybe<ImageMetadata>;
  /** The server ID */
  id: Scalars['UUID']['output'];
  /** The server integrations */
  integrations: Array<Integration>;
  /** The server name */
  name: Scalars['String']['output'];
};

/** The partial server information */
export type PartialServerInterface = {
  /** The server image */
  avatar?: Maybe<ImageMetadata>;
  /** The server ID */
  id: Scalars['UUID']['output'];
  /** The server integrations */
  integrations: Array<Integration>;
  /** The server name */
  name: Scalars['String']['output'];
};

/** The project information */
export type Project = PartialProjectInterface & {
  __typename?: 'Project';
  /** The project aliases */
  aliases: Array<Scalars['String']['output']>;
  /** The project assignments */
  assignments: Array<ProjectAssignee>;
  /** The project collaboration sync status */
  collaborations?: Maybe<ProjectCollabLink>;
  /** The project creation time */
  createdAt: Scalars['DateTime']['output'];
  /** The project external information */
  external: ProjectExternalAniListProjectExternalTmDb;
  /** The project ID */
  id: Scalars['UUID']['output'];
  /** The project integrations */
  integrations: Array<Integration>;
  /** The project poster */
  poster?: Maybe<ShowPoster>;
  /** The project prediction information */
  prediction: ProjectPrediction;
  /** The server ID */
  serverId: Scalars['UUID']['output'];
  /** The project statuses of each episode */
  statuses: Array<ProjectStatus>;
  /** The project title */
  title: Scalars['String']['output'];
  /** The project type */
  type: ProjectType;
  /** The project last update time */
  updatedAt: Scalars['DateTime']['output'];
};

/** The project assignee information of each role */
export type ProjectAssignee = {
  __typename?: 'ProjectAssignee';
  /** The project assignee actor information */
  assignee?: Maybe<ProjectAssigneeInfo>;
  /** The role key */
  key: Scalars['String']['output'];
};

/** The project assignee actor information */
export type ProjectAssigneeInfo = {
  __typename?: 'ProjectAssigneeInfo';
  /** The actor ID */
  id: Scalars['UUID']['output'];
  /** The actor integrations */
  integrations: Array<Integration>;
  /** The actor name */
  name: Scalars['String']['output'];
};

/** A synchronization link to a project collab. */
export type ProjectCollabLink = {
  __typename?: 'ProjectCollabLink';
  /** The ID of this server. */
  id: Scalars['UUID']['output'];
  /** The ID of the project that is linked to this collab. */
  project: Scalars['UUID']['output'];
  /** The list of other projects that are linked to this collab. */
  projects: Array<Scalars['UUID']['output']>;
  /** The list of servers that are linked to this collab. */
  servers: Array<Scalars['UUID']['output']>;
};

export type ProjectConnection = {
  __typename?: 'ProjectConnection';
  /** The current data count */
  _total: Scalars['Int']['output'];
  /** List of resolved data */
  nodes: Array<Project>;
  /** The current pagination information */
  pageInfo: PageInfo;
};

export type ProjectConnectionResult = ProjectConnection | Result;

/** The project episode input information */
export type ProjectEpisodeInput = {
  /** The delay reason of the episode */
  delayReason?: InputMaybe<Scalars['String']['input']>;
  /** The episode number */
  episode: Scalars['Int']['input'];
  /** The release status of the episode */
  release?: InputMaybe<Scalars['Boolean']['input']>;
  /** The roles for the episode */
  roles?: InputMaybe<Array<BoolKeyValueInput>>;
};

export type ProjectEpisodeUpdateSubs = {
  __typename?: 'ProjectEpisodeUpdateSubs';
  /** The new project statuses */
  new: Array<ProjectStatus>;
  /** The old project statuses */
  old: Array<ProjectStatus>;
  /** The project that this episode belongs to */
  project: PartialProject;
  /** The project ID */
  projectId: Scalars['UUID']['output'];
  /** The server that this project belongs to */
  server: PartialServer;
  /** The server ID */
  serverId: Scalars['UUID']['output'];
  /** The timestamp of the update */
  timestamp: Scalars['DateTime']['output'];
};

/** The project external information */
export type ProjectExternal = {
  /** The project external episodes */
  episodes: Array<ProjectExternalEpisode>;
  /** The project external AniList start time, in UNIX timestamp */
  startTime?: Maybe<Scalars['UNIX']['output']>;
  /** The project external type */
  type: ProjectExternalType;
};

/** The project external AniList information */
export type ProjectExternalAniList = ProjectExternal & {
  __typename?: 'ProjectExternalAniList';
  /** The project external episodes */
  episodes: Array<ProjectExternalEpisode>;
  /** The project external AniList ID */
  id: Scalars['String']['output'];
  /** The project external AniList MyAnimeList ID */
  malId?: Maybe<Scalars['String']['output']>;
  /** The project external AniList start time, in UNIX timestamp */
  startTime?: Maybe<Scalars['UNIX']['output']>;
  /** The project external type */
  type: ProjectExternalType;
};

export type ProjectExternalAniListProjectExternalTmDb = ProjectExternalAniList | ProjectExternalTmDb;

/** The project external episode information */
export type ProjectExternalEpisode = {
  __typename?: 'ProjectExternalEpisode';
  /** The episode airtime, in UNIX timestamp */
  airtime?: Maybe<Scalars['UNIX']['output']>;
  /** The episode number */
  episode: Scalars['Int']['output'];
  /** The season number */
  season: Scalars['Int']['output'];
  /** The episode title */
  title?: Maybe<Scalars['String']['output']>;
};

/** The project external TMDb information */
export type ProjectExternalTmDb = ProjectExternal & {
  __typename?: 'ProjectExternalTMDb';
  /** The project external episodes */
  episodes: Array<ProjectExternalEpisode>;
  /** The project external TMDb ID */
  id: Scalars['String']['output'];
  /** The project external AniList start time, in UNIX timestamp */
  startTime?: Maybe<Scalars['UNIX']['output']>;
  /** The project external type */
  type: ProjectExternalType;
};

/** The external project type or source type */
export enum ProjectExternalType {
  Anilist = 'ANILIST',
  Tmdb = 'TMDB',
  Unknown = 'UNKNOWN'
}

/** The project input information */
export type ProjectInput = {
  /** List of aliases to add to the project */
  aliases?: InputMaybe<Array<Scalars['String']['input']>>;
  /** List of assignees to add to the project, if missing will use the default roles assignments per type */
  assignees?: InputMaybe<Array<ProjectInputAssignee>>;
  /** The episode/chapter count override for the project */
  count?: InputMaybe<Scalars['Int']['input']>;
  /** The external project information */
  external?: InputMaybe<ProjectInputExternal>;
  /** List of integrations to add to the server */
  integrations?: InputMaybe<Array<IntegrationInput>>;
  /** The name of the server */
  name?: InputMaybe<Scalars['String']['input']>;
  /** The avatar of the server */
  poster?: InputMaybe<Scalars['Upload']['input']>;
  /** List of roles to add to the project, if missing will use the default roles */
  roles?: InputMaybe<Array<ProjectInputRoles>>;
};

/** The project assignee input information */
export type ProjectInputAssignee = {
  /** The information of the assignee */
  info?: InputMaybe<ProjectInputAssigneeInfo>;
  /** The key of the assignee */
  key: Scalars['String']['input'];
  /** The action to perform on the assignee */
  mode?: ProjectInputAssigneeAction;
};

/** The action to be taken for the assignments */
export enum ProjectInputAssigneeAction {
  Delete = 'DELETE',
  Upsert = 'UPSERT'
}

/** The project assignee input information */
export type ProjectInputAssigneeInfo = {
  /** The ID of the assignee */
  id: Scalars['String']['input'];
  /** List of integrations to add to the assignee */
  integrations?: InputMaybe<Array<IntegrationInput>>;
  /** The name of the assignee */
  name: Scalars['String']['input'];
};

/** The project external input information */
export type ProjectInputExternal = {
  /** The reference ID of the project */
  ref: Scalars['String']['input'];
  /** The source of the project external data */
  source: SearchSourceType;
  /** The type of the project external data */
  type: SearchExternalType;
};

/** The project roles input information */
export type ProjectInputRoles = {
  /** The key of the role */
  key: Scalars['String']['input'];
  /** The name of the role */
  name: Scalars['String']['input'];
};

/** The project prediction information */
export type ProjectPrediction = {
  __typename?: 'ProjectPrediction';
  /** Next episode prediction in days */
  nextEpisode?: Maybe<Scalars['Int']['output']>;
  /** Overall prediction in days */
  overall?: Maybe<Scalars['Int']['output']>;
};


/** The project prediction information */
export type ProjectPredictionNextEpisodeArgs = {
  model?: ProjectPredictionModel;
};


/** The project prediction information */
export type ProjectPredictionOverallArgs = {
  model?: ProjectPredictionModel;
};

/** The prediction model for the project */
export enum ProjectPredictionModel {
  History = 'HISTORY',
  Simulated = 'SIMULATED'
}

export type ProjectResult = Project | Result;

/** The project status information of each episodes */
export type ProjectStatus = {
  __typename?: 'ProjectStatus';
  /** The episode airtime, in UNIX timestamp */
  airingAt?: Maybe<Scalars['UNIX']['output']>;
  /** The episode delay reason */
  delayReason?: Maybe<Scalars['String']['output']>;
  /** The episode number */
  episode: Scalars['Int']['output'];
  /** Whether the episode is released */
  isReleased: Scalars['Boolean']['output'];
  /** The project status information of each role */
  roles: Array<ProjectStatusRole>;
};

/** The project status information of each episodes of each role */
export type ProjectStatusRole = {
  __typename?: 'ProjectStatusRole';
  /** Whether the role has finished its job or not */
  done: Scalars['Boolean']['output'];
  /** The role key */
  key: Scalars['String']['output'];
  /** The role long name */
  name: Scalars['String']['output'];
};

/** The project type */
export enum ProjectType {
  Books = 'BOOKS',
  Shows = 'SHOWS',
  Unknown = 'UNKNOWN'
}

export type Query = {
  __typename?: 'Query';
  /** Get latest progress for all projects with pagination */
  latests: ResultProjectConnection;
  /** Get server project info */
  project: ProjectResult;
  /** Get all projects with pagination */
  projects: ProjectConnectionResult;
  /** Do a search on external source or internal database */
  search: QuerySearch;
  /** Get server info */
  server: ServerResult;
  /** Get all servers with pagination */
  servers: ServerConnectionResult;
  /** Get current user session, different from user query which query user information */
  session: ResultUserSession;
  /** Get simple statistics information for all projects with pagination */
  stats: ResultIntKeyValueNodeResult;
  /** Get current logged in user */
  user: UserResult;
};


export type QueryLatestsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  includeLast?: Scalars['Boolean']['input'];
  limit?: Scalars['Int']['input'];
  sort?: SortDirection;
};


export type QueryProjectArgs = {
  id: Scalars['UUID']['input'];
  serverId?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryProjectsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['UUID']['input']>>;
  limit?: Scalars['Int']['input'];
  serverIds?: InputMaybe<Array<Scalars['UUID']['input']>>;
  sort?: SortDirection;
};


export type QueryServerArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryServersArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['UUID']['input']>>;
  limit?: Scalars['Int']['input'];
  sort?: SortDirection;
};


export type QueryStatsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};

export type QuerySearch = {
  __typename?: 'QuerySearch';
  /** Search using Anilist API */
  anilist: SearchResultsResult;
  /** Search using TMDb API */
  tmdb: SearchResultsResult;
};


export type QuerySearchAnilistArgs = {
  query: Scalars['String']['input'];
  titleSort?: SearchTitleType;
  type: SearchExternalType;
};


export type QuerySearchTmdbArgs = {
  query: Scalars['String']['input'];
  titleSort?: SearchTitleType;
};

/** Simple result of mutation or an error */
export type Result = {
  __typename?: 'Result';
  /** Extra code if any, might be available if success is False */
  code?: Maybe<Scalars['String']['output']>;
  /** Extra message if any, might be available if success is False */
  message?: Maybe<Scalars['String']['output']>;
  /** Success status */
  success: Scalars['Boolean']['output'];
};

export type ResultIntKeyValueNodeResult = IntKeyValueNodeResult | Result;

export type ResultProject = Project | Result;

export type ResultProjectConnection = ProjectConnection | Result;

export type ResultServer = Result | Server;

export type ResultUserSession = Result | UserSession;

/** The external search type */
export enum SearchExternalType {
  Books = 'BOOKS',
  Movie = 'MOVIE',
  Shows = 'SHOWS',
  Unknown = 'UNKNOWN'
}

/** Simple search result from external source */
export type SearchResult = {
  __typename?: 'SearchResult';
  /** The count of the result */
  count?: Maybe<Scalars['Int']['output']>;
  /** The cover URL of the result */
  coverUrl?: Maybe<Scalars['String']['output']>;
  /** The format of the result */
  format: SearchExternalType;
  /** The show/book ID of the result */
  id: Scalars['String']['output'];
  /** The season of the result, only applicable for shows */
  season?: Maybe<Scalars['String']['output']>;
  /** The source of the result */
  source: SearchSourceType;
  /** The title of the result */
  title: Scalars['String']['output'];
  /** The titles of the result */
  titles: SearchResultTitle;
  /** The starting year of the result */
  year?: Maybe<Scalars['Int']['output']>;
};

/** Simple search result from external source */
export type SearchResultTitle = {
  __typename?: 'SearchResultTitle';
  /** English title */
  english?: Maybe<Scalars['String']['output']>;
  /** Native or Original title */
  native?: Maybe<Scalars['String']['output']>;
  /** Romanized title */
  romanized?: Maybe<Scalars['String']['output']>;
};

/** Simple search results from external source */
export type SearchResults = {
  __typename?: 'SearchResults';
  /** The count of the results */
  count: Scalars['Int']['output'];
  /** The results */
  results: Array<SearchResult>;
};

export type SearchResultsResult = Result | SearchResults;

/** The source type of the search result */
export enum SearchSourceType {
  Anilist = 'ANILIST',
  Database = 'DATABASE',
  Tmdb = 'TMDB',
  Unknown = 'UNKNOWN'
}

/** Select title type to be shown in search results */
export enum SearchTitleType {
  English = 'ENGLISH',
  Native = 'NATIVE',
  Romanized = 'ROMANIZED'
}

/** The server information */
export type Server = PartialServerInterface & {
  __typename?: 'Server';
  /** The server image */
  avatar?: Maybe<ImageMetadata>;
  /** The server ID */
  id: Scalars['UUID']['output'];
  /** The server integrations */
  integrations: Array<Integration>;
  /** The server name */
  name: Scalars['String']['output'];
  /** List of owners that this server is linked to */
  owners: Array<UserUserTemporary>;
  /** List of projects that this server is linked to */
  projects: Array<Project>;
};

export type ServerConnection = {
  __typename?: 'ServerConnection';
  /** The current data count */
  _total: Scalars['Int']['output'];
  /** List of resolved data */
  nodes: Array<Server>;
  /** The current pagination information */
  pageInfo: PageInfo;
};

export type ServerConnectionResult = Result | ServerConnection;

/** The server information */
export type ServerInput = {
  /** The avatar of the server */
  avatar?: InputMaybe<Scalars['Upload']['input']>;
  /** List of integrations to add to the server */
  integrations?: InputMaybe<Array<IntegrationInput>>;
  /** The name of the server */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ServerResult = Result | Server;

/** The show poster information */
export type ShowPoster = {
  __typename?: 'ShowPoster';
  /** The show poster color */
  color?: Maybe<Scalars['Int']['output']>;
  /** The show poster image */
  image: ImageMetadata;
};

/** The sort direction for pagination */
export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** The response for simple ID-based deletion */
export type SubsResponse = {
  __typename?: 'SubsResponse';
  /** The extra ID of the model being deleted */
  extraId?: Maybe<Scalars['UUID']['output']>;
  /** The ID of the model being deleted */
  id: Scalars['UUID']['output'];
  /** The timestamp of the deletion */
  timestamp: Scalars['DateTime']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Subscribe to server deletion */
  projectDeletion: SubsResponse;
  /** Subscribe to project episode update */
  projectEpisodeUpdates: ProjectEpisodeUpdateSubs;
  /** Subscribe to server deletion */
  serverDeletion: SubsResponse;
};


export type SubscriptionProjectDeletionArgs = {
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  serverId?: InputMaybe<Scalars['UUID']['input']>;
};


export type SubscriptionProjectEpisodeUpdatesArgs = {
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  serverId?: InputMaybe<Scalars['UUID']['input']>;
  startFrom?: InputMaybe<Scalars['UNIX']['input']>;
};


export type SubscriptionServerDeletionArgs = {
  serverId?: InputMaybe<Scalars['UUID']['input']>;
};

/** The user information */
export type User = {
  __typename?: 'User';
  /** The user's avatar URL */
  avatar?: Maybe<ImageMetadata>;
  /** The user ID */
  id: Scalars['UUID']['output'];
  /** The user's privilege level */
  privilege: UserType;
  /** The user's username */
  username: Scalars['String']['output'];
};

export type UserResult = Result | User;

/** The user session information */
export type UserSession = {
  __typename?: 'UserSession';
  /** The currently selected active server */
  active?: Maybe<PartialServer>;
  /** The currently selected active server */
  activeId?: Maybe<Scalars['UUID']['output']>;
  /** The user ID */
  id: Scalars['UUID']['output'];
  /** The user's privilege level */
  privilege: UserType;
  /** The user's session token */
  token: Scalars['String']['output'];
  /** The user's username */
  username: Scalars['String']['output'];
};

export type UserSessionResult = Result | UserSession;

/** The temporary user type */
export enum UserTempType {
  Migration = 'MIGRATION',
  Register = 'REGISTER'
}

/** The temporary user information */
export type UserTemporary = {
  __typename?: 'UserTemporary';
  /** The user's approval code */
  approvalCode: Scalars['String']['output'];
  /** The user ID */
  id: Scalars['UUID']['output'];
  /** The user's type */
  type: UserTempType;
  /** The user's username */
  username: Scalars['String']['output'];
};

export type UserTemporaryResult = Result | UserTemporary;

/** The user type */
export enum UserType {
  Admin = 'ADMIN',
  User = 'USER'
}

export type UserUserTemporary = User | UserTemporary;
