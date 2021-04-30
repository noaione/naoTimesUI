import { ValidAccent } from "../ColorMap";

import { LocaleMap } from "../../i18n";

interface IEmbedParams {
    id?: string;
    accent?: typeof ValidAccent[number];
    lang?: keyof typeof LocaleMap & string;
    dark?: string;
}

export type { IEmbedParams };
