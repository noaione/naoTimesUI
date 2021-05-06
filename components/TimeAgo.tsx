import React from "react";
import { DateTime } from "luxon";

import { timeAgoLocale, TimeAgoLocale, ValidLocale } from "../i18n";

interface RTALocaleProps {
    unix: number;
    locale?: TimeAgoLocale;
}

export default function ReactTimeAgoLocale(props: RTALocaleProps) {
    let realLocale = "id";
    if (props.locale && ValidLocale.includes(props.locale)) {
        realLocale = props.locale;
    }

    const localized = timeAgoLocale(props.unix, realLocale as TimeAgoLocale);
    const dtTime = DateTime.fromSeconds(props.unix, { zone: "UTC" }).toISO();
    return <time dateTime={dtTime}>{localized}</time>;
}
