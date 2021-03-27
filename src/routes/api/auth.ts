import express from "express";
import passport from "../../lib/passport";
import bodyparser from "body-parser";

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
