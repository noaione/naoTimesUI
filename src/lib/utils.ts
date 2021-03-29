import { ShowtimesProps } from "../models/show";

export type Nullable<T> = T | null;
export type NoneType = null | undefined;
export type NoneAble<T> = T | NoneType;

export function isNone(value: any): value is NoneType {
    return typeof value === "undefined" || value === null;
}

export function determineSeason(month: number): number {
    if (month >= 0 && month <= 2) {
        return 0;
    } else if (month >= 3 && month <= 5) {
        return 1;
    } else if (month >= 6 && month <= 8) {
        return 2;
    } else if (month >= 9 && month <= 11) {
        return 3;
    } else if (month >= 12) {
        return 0;
    }
}

export function seasonNaming(season: 0 | 1 | 2 | 3): string {
    let seasonName: string;
    switch (season) {
        case 0:
            seasonName = "Winter";
            break;
        case 1:
            seasonName = "Spring";
            break;
        case 2:
            seasonName = "Summer";
            break;
        case 3:
            seasonName = "Fall";
            break;
        default:
            seasonName = "Unknown";
            break;
    }
    return seasonName;
}

export function filterToSpecificAnime(results: ShowtimesProps, anime_id: string) {
    const animeLists = results.anime.filter((res) => res.id === anime_id);
    return animeLists;
}
