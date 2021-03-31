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
import shelljs from "shelljs";
import path from "path";

import passport from "./lib/passport";
import redisCreate from "./lib/redis";
import { APIRoutes } from "./routes/api";
import { expressErrorLogger, expressLogger, logger } from "./lib/logger";
import { UserProps } from "./models/user";
import { ShowtimesModel } from "./models/show";
import { filterToSpecificAnime } from "./lib/utils";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

logger.info("Connecting to database...");
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const SECRET_KEYS = process.env.TOKEN_SECRET;
const app = express();
const gitExec = shelljs.exec(`git log --format="%H" -n 1`, { silent: true });
let fullCommits = "";
if (gitExec.code === 0) {
    fullCommits = gitExec.stdout.trimEnd();
    logger.info(`Running naoTimesUI version ${fullCommits.slice(0, 7)}`);
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
            res.render("index", { error_msg: errors.join(", ") });
        } else {
            res.render("index", { error_msg: "" });
        }
    }
});

app.get("/admin", ensureLoggedIn("/"), (req, res) => {
    const user = req.user as UserProps;
    res.render("admin/index", {
        user_id: user.id,
        is_admin: user.privilege === "owner",
        commit: fullCommits,
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
        });
    } else {
        res.render("admin/projek/index", {
            user_id: user.id,
            is_admin: false,
            commit: fullCommits,
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
            });
        } else {
            res.render("admin/projek/laman", {
                user_id: user.id,
                is_admin: false,
                raw_data: JSON.stringify(animeData[0]),
                anime_title: animeData[0].title,
                custom_title: animeData[0].title + " - Projek - Panel Peladen",
                commit: fullCommits,
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
    });
});

app.use("/api", APIRoutes);

app.use(expressErrorLogger);

app.use((req, res, next) => {
    res.status(404).render("404", { path: req.path });
    next();
});

app.use(function (err: any, _q: express.Request, res: express.Response, _n: express.NextFunction) {
    console.error(err.stack);
    if (!res.headersSent) {
        res.status(500).render("error_page", {
            status_code: 500,
            err_msg: err.toString(),
        });
    }
});

app.listen(5000, () => {
    console.info("App now running at port 5000!");
});
