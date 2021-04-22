import { DateTime } from "luxon";
import { timeAgoLocale, TimeAgoLocale } from "../../i18n";

interface RTALocaleProps {
    unix: number;
    locale?: TimeAgoLocale;
}

export default function ReactTimeAgoLocale(props: RTALocaleProps) {
    let realLocale = "id";
    if (props.locale) {
        realLocale = props.locale;
    }

    const localized = timeAgoLocale(props.unix, realLocale as TimeAgoLocale);
    const dtTime = DateTime.fromSeconds(props.unix, { zone: "UTC" }).toISO();
    return (
        <time slot="2" dateTime={dtTime}>
            {localized}
        </time>
    );
}
