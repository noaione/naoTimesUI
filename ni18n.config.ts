import type { Ni18nOptions } from "ni18n";

const namespaces = ["common", "embed", "projects"];
const languages = ["id", "en", "su", "jv", "ja"];

export const ni18nConfig: Ni18nOptions = {
    supportedLngs: languages,
    fallbackLng: languages,
    ns: namespaces,
    fallbackNS: namespaces,
    react: {
        useSuspense: false,
    },
};
