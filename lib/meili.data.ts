import { Nullable } from "./utils";

export interface IntegrationData {
    id: string;
    type: string;
}

export interface SearchUser {
    id: string;
    username: string;
    type: "tempuser" | "user";
    integrations: IntegrationData[];
    name: Nullable<string>;
    avatar_url: Nullable<string>;
}

export interface SearchServer {
    id: string;
    name: string;
    projects: string[];
    integrations: IntegrationData[];
}

export interface SearchProject {
    id: string;
    title: string;
    poster_url: Nullable<string>;
    created_at: number;
    updated_at: number;
    server_id: string;
    integrations: IntegrationData[];
    aliases: string[];
}
