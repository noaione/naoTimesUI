import { Nullable } from "./utils";

export interface FansubRSSEmbed {
    title?: Nullable<string>;
    description?: Nullable<string>;
    url?: Nullable<string>;
    thumbnail?: Nullable<string>;
    image?: Nullable<string>;
    footer?: Nullable<string>;
    footer_img?: Nullable<string>;
    color?: Nullable<string | number>;
    timestamp: boolean;
}

export interface FansubRSSFeeds {
    id: string;
    channel: string;
    feedUrl: string;
    message?: Nullable<string>;
    lastEtag?: Nullable<string>;
    lastModified?: Nullable<string>;
    embed?: FansubRSSEmbed;
}

export interface FansubRSSSchemas {
    feeds: FansubRSSFeeds[];
    premium?: boolean;
}
