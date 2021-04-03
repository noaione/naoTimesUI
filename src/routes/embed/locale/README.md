# WebUI Localization
This program have a localization module currently only available to the WebUI.
To contribute, please add the new file in the corresponding folder and follow the `_template` file that are provided, then open a PR to this project.

## Folder meaning
- `This folder`: will be used for the embed localization itself.
- `timeago` folder: Used for the "time text" e.g. `xx days ago`, `in xx days`, `right now`, etc.

Create a file that contains the 2-character language code, if you dont know, search it.

## Localizing
Some quick rules:
1. Don't use machine TL

Yes, only that. Please don't use MTL for the localization ~~or I'll break your kneecaps~~

You can add your name on top of the file, I've provided a template in each folder that you can follow.

## Importing the localization to the main file

### TimeAgo
After you add your shiny new file, add a new import and export in the [`index.ts`](https://github.com/naoTimesdev/webpanel/blob/master/src/routes/embed/locale/timeago/index.ts) file on the `timeago` folder.

In that file, add your language on the import section, like for example:
```ts
import jv from "./jv";
import su from "./su";
import newlang from "./your-new-lang";

...
```

Then reexport/add it on the bottom of the file.

```ts
...

// Reexport
export { jv, su, newlang }; // newlang is your new language.
```

After that, go to the main [`index.ts`](https://github.com/naoTimesdev/webpanel/blob/master/src/routes/embed/locale/index.ts) on the main `locale` folder.

Try to find this line:
```ts
// Import any timeAgo stuff here
import id from "javascript-time-ago/locale/id";
import en from "javascript-time-ago/locale/en";
import { jv, su } from "./timeago";
```

You want to add your new language to the third line import

```ts
import { jv, su, newlang } from "./timeago";
```

Like that, after that find this line:
```ts
// Add the new time-ago locale here.
// Call `TimeAgo.addLocale(MODULE)`
TimeAgo.addDefaultLocale(id);
TimeAgo.addLocale(en);
TimeAgo.addLocale(jv);
TimeAgo.addLocale(su);
```

Add your new language to the TimeAgo list by calling the `.addLocale()` function.

```ts
TimeAgo.addLocale(newlang)
```

And then add your new language code to the `TimeAgoLocale` type, add it by adding `|` and your language code after it:
```ts
// Add new TimeAgo language code here.
export type TimeAgoLocale = "id" | "en" | "jv" | "su" | "newlang";
```

You're done, now open up a new PR so the maintaner can add it to the website.

### Main Website
After you add your shiny new file to the main locale folder, open up the [`index.ts`](https://github.com/naoTimesdev/webpanel/blob/master/src/routes/embed/locale/index.ts) on the main `locale` folder.

In here, find this line on the top:
```ts
// Import the locale here
import LocaleID from "./id";
import LocaleEN from "./en";
import LocaleJV from "./jv";
import LocaleSU from "./su";

...
```

You'll need to add your new language localization after the very bottom one, like this:
```ts
...
import LocaleSU from "./su";
import LocaleNewLang from "./newlang";

...
```

After that, find this line:
```ts
// Add new language mapping here.
const LocaleMap = {
    id: LocaleID,
    en: LocaleEN,
    jv: LocaleJV,
    su: LocaleSU,
};
```

In here, add your new language import with the language code, find it if you didn't know
Add it to the bottomest part of the Object

```ts
const LocaleMap = {
    id: LocaleID,
    en: LocaleEN,
    jv: LocaleJV,
    su: LocaleSU,
    newlang: LocaleNewLang
};
```

You're done, now open up a new PR so the maintaner can add it to the website.

## Question

If you have any question, you can open a new Issue and use the `tag: meta` tag.
Happy contributing!

Your contribution will be licensed with [MIT License](https://github.com/naoTimesdev/webpanel/blob/master/LICENSE)