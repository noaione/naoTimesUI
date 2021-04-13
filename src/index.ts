import { readFileSync } from "fs";
import path from "path";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import express_compression from "compression";
import { ensureLoggedIn } from "connect-ensure-login";
import express_flash from "connect-flash";
import connect_livereload from "connect-livereload";
import express_session_redis from "connect-redis";
import * as cons from "consolidate";
import cookieParser from "cookie-parser";
import express_cors from "cors";
import dotenv from "dotenv";
import express from "express";
import express_session from "express-session";
import { get } from "lodash";
import mongoose from "mongoose";
// eslint-disable-next-line import/no-extraneous-dependencies
import shelljs from "shelljs";

import { expressErrorLogger, expressLogger, logger } from "./lib/logger";
import { passport } from "./lib/passport";
import redisCreate from "./lib/redis";
import { emitSocketAndWait } from "./lib/socket";
import { filterToSpecificAnime, isNone, romanizeNumber } from "./lib/utils";
import { ShowtimesModel } from "./models/show";
import { UserProps } from "./models/user";
import { APIRoutes } from "./routes/api";
import { EmbedRouter } from "./routes/embed";

// Supress warning from TimeAgo or Intl
// Since it screamed about "locale is not supported" if I'm using a custom one.
const originalWarn = console.warn;
console.warn = (e?: any, ...args: any[]) => {
    if (!e.includes("locale is not supported")) {
        originalWarn(e, ...args);
    }
};

dotenv.config({ path: path.join(__dirname, "..", ".env") });
const packageJson = JSON.parse(readFileSync(path.join(__dirname, "..", "package.json")).toString());
const startTime = new Date().getTime().toString();

logger.info("Connecting to database...");
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const SECRET_KEYS = process.env.TOKEN_SECRET;
const app = express();
const currentYear = romanizeNumber(new Date().getUTCFullYear());
const sinceYear = romanizeNumber(packageJson.copyright.since || 2021);
const copyrightTo = packageJson.copyright.name || "naoTimesDev";
const copyrightData = {
    name: copyrightTo,
    year: sinceYear,
};
if (currentYear !== sinceYear) {
    copyrightData.year = `${sinceYear}-${currentYear}`;
}

const gitExec = shelljs.exec(`git log --format="%H" -n 1`, { silent: true });
let fullCommits = "";
if (gitExec.code === 0) {
    fullCommits = gitExec.stdout.trimEnd();
    logger.info(`Running naoTimesUI v${packageJson.version} (${fullCommits.slice(0, 7)})`);
} else {
    logger.info(`Running naoTimesUI v${packageJson.version}`);
}

// Opt-out of FLoC thing, even though I don't use ads
app.use((_q, res, next) => {
    res.setHeader("Permissions-Policy", "interest-cohort=()");
    next();
});

if (process.env.NODE_ENV === "production") {
    logger.info("Enabling Sentry Support...");
    Sentry.init({
        dsn: process.env.SENTRY_IO_DSN,
        serverName: "naotimes-panel",
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Tracing.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
    });

    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
}

app.use("/robots.txt", (_q, res) => {
    res.send(`
        User-agent: *
        Disallow: /
    `);
});

logger.info("Spawning new Redis Connection");
const RedisStore = express_session_redis(express_session);
const RedisClient = redisCreate();

// Initial stuff.
app.use(express_cors());
app.use(express_compression());

if (process.env.NODE_ENV === "development") {
    logger.info("Binding connect-livereload");
    app.use(connect_livereload({ port: 35729 }));
}

// eslint-disable-next-line import/namespace
app.engine("html", cons.ejs);
app.set("views", path.join(__dirname, "..", "public"));
app.set("view engine", "ejs");
app.use("/assets", express.static(path.join(__dirname, "..", "public", "assets")));

app.use(
    express_session({
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
        },
        secret: SECRET_KEYS,
        name: "ntui.session",
        resave: true,
        saveUninitialized: true,
        store: new RedisStore({ client: RedisClient }),
    })
);
app.use(cookieParser());
app.use(express_flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("/favicon.ico", (_, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "assets", "favicon.ico"));
});

app.use("/favicon.png", (_, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "assets", "favicon.png"));
});

app.use(expressLogger);

app.get("/", (req, res) => {
    if (req.user) {
        res.redirect("/admin");
    } else {
        const flashed = req.flash();
        const errors = get(flashed, "error", []);
        const infos = get(flashed, "info", []);
        if (errors.length > 0) {
            res.render("index", { error_msg: errors.join(", "), build_time: startTime });
        } else if (infos.length > 0) {
            res.render("index", { info_msg: infos.join(", "), build_time: startTime });
        } else {
            res.render("index", { error_msg: "", build_time: startTime });
        }
    }
});

app.get("/registrasi", (req, res) => {
    const flashed = req.flash();
    const errors = get(flashed, "error", []);
    if (errors.length > 0) {
        res.render("registrasi", { error_msg: errors.join(", "), build_time: startTime });
    } else {
        res.render("registrasi", { build_time: startTime });
    }
});

app.get("/admin", ensureLoggedIn("/"), (req, res) => {
    const user = req.user as UserProps;
    res.render("admin/index", {
        is_admin: user.privilege === "owner",
        commit: fullCommits,
        app_version: packageJson.version,
        build_time: startTime,
        copyright: copyrightData,
        username: isNone(user.name) ? user.id : user.name,
    });
});

app.get("/admin/projek", ensureLoggedIn("/"), (req, res) => {
    const user = req.user as UserProps;
    if (user.privilege === "owner") {
        res.status(403).render("admin/404", {
            is_admin: user.privilege === "owner",
            path: req.path,
            commit: fullCommits,
            app_version: packageJson.version,
            build_time: startTime,
            copyright: copyrightData,
            username: isNone(user.name) ? user.id : user.name,
        });
    } else {
        res.render("admin/projek/index", {
            is_admin: false,
            commit: fullCommits,
            app_version: packageJson.version,
            build_time: startTime,
            copyright: copyrightData,
            username: isNone(user.name) ? user.id : user.name,
        });
    }
});

app.get("/admin/projek/tambah", ensureLoggedIn("/"), async (req, res) => {
    const user = req.user as UserProps;
    if (user.privilege === "owner") {
        res.status(403).render("admin/404", {
            is_admin: true,
            path: req.path,
            commit: fullCommits,
            app_version: packageJson.version,
            build_time: startTime,
            copyright: copyrightData,
            username: isNone(user.name) ? user.id : user.name,
        });
    } else {
        res.render("admin/projek/tambah", {
            user_id: user.id,
            is_admin: false,
            commit: fullCommits,
            app_version: packageJson.version,
            build_time: startTime,
            copyright: copyrightData,
            username: isNone(user.name) ? user.id : user.name,
        });
    }
});

app.get("/admin/projek/:ani_id", ensureLoggedIn("/"), async (req, res) => {
    const user = req.user as UserProps;
    if (user.privilege === "owner") {
        res.status(403).render("admin/404", {
            is_admin: user.privilege === "owner",
            path: req.path,
            commit: fullCommits,
            app_version: packageJson.version,
            build_time: startTime,
            copyright: copyrightData,
            username: isNone(user.name) ? user.id : user.name,
        });
    } else {
        const serversData = await ShowtimesModel.findOne({ id: { $eq: user.id } });
        const animeData = filterToSpecificAnime(serversData, req.params.ani_id);
        if (animeData.length < 1) {
            res.status(404).render("admin/404", {
                username: isNone(user.name) ? user.id : user.name,
                is_admin: false,
                path: req.path,
                commit: fullCommits,
                app_version: packageJson.version,
                build_time: startTime,
                copyright: copyrightData,
            });
        } else {
            res.render("admin/projek/laman", {
                username: isNone(user.name) ? user.id : user.name,
                is_admin: false,
                anime_id: animeData[0].id,
                raw_data: JSON.stringify(animeData[0]),
                anime_title: animeData[0].title,
                custom_title: `${animeData[0].title} - Projek - Panel Peladen`,
                app_version: packageJson.version,
                commit: fullCommits,
                build_time: startTime,
                copyright: copyrightData,
            });
        }
    }
});

app.get("/admin/atur", ensureLoggedIn("/"), async (req, res) => {
    const user = req.user as UserProps;
    const flashed = req.flash();
    const resetError = get(flashed, "reseterror", []);
    const resetInfo = get(flashed, "resetinfo", []);
    const nameError = get(flashed, "nameerror", []);
    const nameInfo = get(flashed, "nameinfo", []);
    const channelError = get(flashed, "channelerror", []);
    const channelInfo = get(flashed, "channelinfo", []);
    let parsedInfo = null;
    let parsedError = null;
    let parsedInfo2 = null;
    let parsedError2 = null;
    let parsedInfo3 = null;
    let parsedError3 = null;
    if (resetError.length > 0) {
        [parsedError] = resetError;
    }
    if (resetInfo.length > 0) {
        [parsedInfo] = resetInfo;
    }
    if (nameError.length > 0) {
        [parsedError2] = nameError;
    }
    if (nameInfo.length > 0) {
        [parsedInfo2] = nameInfo;
    }
    if (channelError.length > 0) {
        [parsedError3] = channelError;
    }
    if (channelInfo.length > 0) {
        [parsedInfo3] = channelInfo;
    }
    const ORIGIN = `${req.protocol}://${req.hostname}`;
    let serverAdmin = [];
    let channelAnnounce = "";
    if (user.privilege !== "owner") {
        const fetchedModel = await ShowtimesModel.findOne(
            { id: { $eq: user.id } },
            { serverowner: 1, announce_channel: 1 }
        );
        serverAdmin = fetchedModel.serverowner;
        channelAnnounce = fetchedModel.announce_channel;
    }
    res.render("admin/atur", {
        username: isNone(user.name) ? user.id : user.name,
        user_id: user.id,
        embed_origin: ORIGIN,
        is_admin: user.privilege === "owner",
        commit: fullCommits,
        app_version: packageJson.version,
        build_time: startTime,
        copyright: copyrightData,
        // Flash
        resetError: parsedError,
        resetInfo: parsedInfo,
        nameError: parsedError2,
        nameInfo: parsedInfo2,
        channelInfo: parsedInfo3,
        channelError: parsedError3,
        serverAdmin,
        channelAnnounce,
    });
});

app.use("/api", APIRoutes);
app.use("/", EmbedRouter);

app.use(expressErrorLogger);

app.use((req, res, next) => {
    res.status(404).render("404", { path: req.path, build_time: startTime });
    next();
});

app.use((err: any, _q: express.Request, res: express.Response, _n: express.NextFunction) => {
    console.error(err.stack);
    if (!res.headersSent) {
        res.status(500).render("error_page", {
            status_code: 500,
            err_msg: err.toString(),
            build_time: startTime,
        });
    }
});

if (!isNone(process.env.BOT_SOCKET_PASSWORD)) {
    logger.info("Authenticating to Bot socket...");
    emitSocketAndWait("authenticate", process.env.BOT_SOCKET_PASSWORD).then((res) => {
        if (res === "ok") {
            app.listen(5000, () => {
                logger.info("🚀 App now running at port http://127.0.0.1:5000");
            });
        } else {
            logger.error("Failed to authenticate to bot socket, please check");
        }
    });
} else {
    app.listen(5000, () => {
        logger.info("🚀 App now running at port http://127.0.0.1:5000");
    });
}
