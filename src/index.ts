import * as cons from "consolidate";

import dotenv from "dotenv";
import express from "express";
import express_compression from "compression";
import express_cors from "cors";
import { ensureLoggedIn } from "connect-ensure-login";
import express_session from "express-session";
import express_session_redis from "connect-redis";
import express_flash from "connect-flash";
import mongoose from "mongoose";
import { get } from "lodash";
import { readFileSync } from "fs";
import shelljs from "shelljs";
import path from "path";

import passport from "./lib/passport";
import redisCreate from "./lib/redis";
import { emitSocketAndWait } from "./lib/socket";
import { expressErrorLogger, expressLogger, logger } from "./lib/logger";
import { filterToSpecificAnime, isNone, romanizeNumber } from "./lib/utils";
import { UserProps } from "./models/user";
import { ShowtimesModel } from "./models/show";
import { APIRoutes } from "./routes/api";

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
const sinceYear = romanizeNumber(packageJson["copyright"]["since"] || 2021);
const copyrightTo = packageJson["copyright"]["name"] || "naoTimesDev";
const copyrightData = {
    name: copyrightTo,
};
if (currentYear !== sinceYear) {
    copyrightData["year"] = `${sinceYear}-${currentYear}`;
} else {
    copyrightData["year"] = sinceYear;
}

const gitExec = shelljs.exec(`git log --format="%H" -n 1`, { silent: true });
let fullCommits = "";
if (gitExec.code === 0) {
    fullCommits = gitExec.stdout.trimEnd();
    logger.info(`Running naoTimesUI v${packageJson["version"]} (${fullCommits.slice(0, 7)})`);
} else {
    logger.info(`Running naoTimesUI v${packageJson["version"]}`);
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
        name: "ntui",
        resave: true,
        saveUninitialized: true,
        store: new RedisStore({ client: RedisClient }),
    })
);
app.use(express_flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("/favicon.*", (_, res) => {
    res.sendFile("../public/assets/favicon.ico");
});

app.use(expressLogger);

app.get("/", (req, res) => {
    if (req.user) {
        res.redirect("/admin");
    } else {
        const flashed = req.flash();
        const errors = get(flashed, "error", []);
        if (errors.length > 0) {
            res.render("index", { error_msg: errors.join(", "), build_time: startTime });
        } else {
            res.render("index", { error_msg: "", build_time: startTime });
        }
    }
});

app.get("/admin", ensureLoggedIn("/"), (req, res) => {
    const user = req.user as UserProps;
    res.render("admin/index", {
        user_id: user.id,
        is_admin: user.privilege === "owner",
        commit: fullCommits,
        app_version: packageJson["version"],
        build_time: startTime,
        copyright: copyrightData,
    });
});

app.get("/admin/projek", ensureLoggedIn("/"), (req, res) => {
    const user = req.user as UserProps;
    if (user.privilege === "owner") {
        res.status(403).render("admin/404", {
            user_id: user.id,
            is_admin: user.privilege === "owner",
            path: req.path,
            commit: fullCommits,
            app_version: packageJson["version"],
            build_time: startTime,
            copyright: copyrightData,
        });
    } else {
        res.render("admin/projek/index", {
            user_id: user.id,
            is_admin: false,
            commit: fullCommits,
            app_version: packageJson["version"],
            build_time: startTime,
            copyright: copyrightData,
        });
    }
});

app.get("/admin/projek/tambah", ensureLoggedIn("/"), async (req, res) => {
    const user = req.user as UserProps;
    if (user.privilege === "owner") {
        res.status(403).render("admin/404", {
            user_id: user.id,
            is_admin: true,
            path: req.path,
            commit: fullCommits,
            app_version: packageJson["version"],
            build_time: startTime,
            copyright: copyrightData,
        });
    } else {
        res.render("admin/projek/tambah", {
            user_id: user.id,
            is_admin: false,
            commit: fullCommits,
            app_version: packageJson["version"],
            build_time: startTime,
            copyright: copyrightData,
        });
    }
});

app.get("/admin/projek/:ani_id", ensureLoggedIn("/"), async (req, res) => {
    const user = req.user as UserProps;
    if (user.privilege === "owner") {
        res.status(403).render("admin/404", {
            user_id: user.id,
            is_admin: user.privilege === "owner",
            path: req.path,
            commit: fullCommits,
            app_version: packageJson["version"],
            build_time: startTime,
            copyright: copyrightData,
        });
    } else {
        const serversData = await ShowtimesModel.findOne({ id: { $eq: user.id } });
        const animeData = filterToSpecificAnime(serversData, req.params.ani_id);
        if (animeData.length < 1) {
            res.status(404).render("admin/404", {
                user_id: user.id,
                is_admin: false,
                path: req.path,
                commit: fullCommits,
                app_version: packageJson["version"],
                build_time: startTime,
                copyright: copyrightData,
            });
        } else {
            res.render("admin/projek/laman", {
                user_id: user.id,
                is_admin: false,
                raw_data: JSON.stringify(animeData[0]),
                anime_title: animeData[0].title,
                custom_title: animeData[0].title + " - Projek - Panel Peladen",
                app_version: packageJson["version"],
                commit: fullCommits,
                build_time: startTime,
                copyright: copyrightData,
            });
        }
    }
});

app.get("/admin/atur", ensureLoggedIn("/"), (req, res) => {
    const user = req.user as UserProps;
    res.render("admin/atur", {
        user_id: user.id,
        is_admin: user.privilege === "owner",
        commit: fullCommits,
        app_version: packageJson["version"],
        build_time: startTime,
        copyright: copyrightData,
    });
});

app.use("/api", APIRoutes);

app.use(expressErrorLogger);

app.use((req, res, next) => {
    res.status(404).render("404", { path: req.path, build_time: startTime });
    next();
});

app.use(function (err: any, _q: express.Request, res: express.Response, _n: express.NextFunction) {
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
