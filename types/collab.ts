import { ShowAnimeProps } from "@/models/show";

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
    animeInfo: ShowAnimeProps;
}

export type Confirmations = KonfirmasiData[];
export type Collaborations = CollabData[];
