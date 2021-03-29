import express from "express";
import bodyparser from "body-parser";

import passport from "../lib/passport";

const AuthAPIRoutes = express.Router();

AuthAPIRoutes.use(bodyparser.urlencoded({ extended: true }));

AuthAPIRoutes.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/",
        failureFlash: true,
        successRedirect: "/admin",
    }),
    (_, res) => {
        res.redirect("/admin");
    }
);
AuthAPIRoutes.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

export { AuthAPIRoutes };
