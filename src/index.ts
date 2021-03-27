import * as cons from "consolidate";

import dotenv from "dotenv";
import express from "express";
import express_compression from "compression";
import express_cors from "cors";
import { ensureLoggedIn } from "connect-ensure-login";
import express_session from "express-session";
import express_flash from "connect-flash";
import mongoose from "mongoose";
import get from "lodash.get";
import path from "path";

import passport from "./lib/passport";
import { APIRoutes } from "./routes/api";
import { expressErrorLogger, expressLogger, logger } from "./lib/logger";

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

app.use("/robots.txt", (_q, res) => {
    res.send(`
        User-agent: *
        Disallow: /
    `);
});

// Initial stuff.
app.use(express_cors());
app.use(express_compression());
app.engine("html", cons.ejs);
app.set("views", path.join(__dirname, "..", "public"));
app.set("view engine", "ejs");
app.use("/assets", express.static(path.join(__dirname, "..", "public", "assets")));

app.use(express_session({ secret: SECRET_KEYS, name: "ntui", resave: true, saveUninitialized: true }));
app.use(express_flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(expressLogger);

app.get("/", (req, res) => {
    const flashed = req.flash();
    const errors = get(flashed, "error", []);
    if (errors.length > 0) {
        res.render("index", { error_msg: errors.join(", ") });
    } else {
        res.render("index");
    }
});

app.get("/admin", ensureLoggedIn("/"), (req, res) => {
    res.send("Placeholder");
});

app.use("/api", APIRoutes);

app.use(expressErrorLogger);

app.listen(5000, () => {
    console.info("App now running at port 5000!");
});
