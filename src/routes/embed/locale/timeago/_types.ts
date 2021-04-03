import { Duration, Locale, Tense } from "javascript-time-ago/locale";

export interface ExtendedLocale extends Locale {
    now: {
        now: Tense;
    };
    mini?: Duration;
}
