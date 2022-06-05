import { Nullable } from "@/lib/utils";
import { Project } from "@prisma/client";

export interface SimpleServerInfo {
    id: string;
    name?: string;
    selfId?: {
        id: string;
        name?: string;
    };
}

export interface CollabData {
    id: string;
    title: string;
    image: string;
    collaborations: SimpleServerInfo[];
}

export interface KonfirmasiData {
    id: string;
    serverId: string;
    serverName?: Nullable<string>;
    animeInfo: Project;
}

export type Confirmations = KonfirmasiData[];
export type Collaborations = CollabData[];
