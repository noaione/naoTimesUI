import { ShowAnimeProps } from "@/models/show";
import { Nullable } from "@/lib/utils";

interface SimpleServerInfo {
    id: string;
    name: string;
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
    animeInfo: ShowAnimeProps;
}

export type Confirmations = KonfirmasiData[];
export type Collaborations = CollabData[];
