import { ShowAnimeProps } from "@/models/show";

export interface CollabData {
    id: string;
    serverId: string;
    animeInfo: ShowAnimeProps;
}

export type Collaborations = CollabData[];
