import { ExtendedFormats, Locale, QuantifyType, Tense, TimeUnit } from "javascript-time-ago/locale";

export type ExtraLocale = Partial<Record<TimeUnit, QuantifyType | string>>;

export interface ExtendedLocale extends Omit<Locale, ExtendedFormats> {
    now: {
        now: Tense;
    };
    mini?: ExtraLocale;
    "short-time"?: ExtraLocale;
    "short-convenient"?: ExtraLocale;
    "long-time"?: ExtraLocale;
    "long-convenient"?: ExtraLocale;
}
