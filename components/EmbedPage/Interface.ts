import { ValidAccent } from "../ColorMap";
import { AvailableLocale } from "@/lib/timeago";

interface IEmbedParams {
    id?: string;
    accent?: (typeof ValidAccent)[number];
    lang?: AvailableLocale & string;
    dark?: string;
}

export type { IEmbedParams };
