import express from "express";
import bodyparser from "body-parser";
import { ensureLoggedIn } from "connect-ensure-login";

import passport from "../lib/passport";
import { UserModel, UserProps } from "../models/user";

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

function checkStringValid(data: any): boolean {
    if (typeof data !== "string") return false;
    if (data === "" || data === " ") return false;
    return true;
}

// AuthAPIRoutes.use(express.json());
AuthAPIRoutes.post("/reset", ensureLoggedIn("/"), async (req, res) => {
    const user = req.user as UserProps;
    const jsonBody = req.body;
    if (!checkStringValid(jsonBody.old) || !checkStringValid(jsonBody.new)) {
        req.flash("reseterror", "Tidak ada data yang mencukupi untuk password baru/lama");
        res.redirect("/admin/atur");
    } else {
        const oldUserData = await UserModel.findOne({ id: { $eq: user.id } });
        if (oldUserData.secret === jsonBody.old) {
            await UserModel.updateOne({ id: { $eq: user.id } }, { $set: { secret: jsonBody.new } });
            // @ts-ignore
            req.session.passport.user.secret = jsonBody.new;
            req.session.save((_e) => {
                req.session.reload((_e) => {
                    req.flash("resetinfo", "Sukses mengubah password");
                    res.redirect("/admin/atur");
                });
            });
        } else {
            req.flash("reseterror", "Password lama salah!");
            res.redirect("/admin/atur");
        }
    }
});

AuthAPIRoutes.post("/changename", ensureLoggedIn("/"), async (req, res) => {
    const user = req.user as UserProps;
    const jsonBody = req.body;
    if (!checkStringValid(jsonBody.newname)) {
        req.flash("nameerror", "Tidak ada data yang mencukupi untuk mengganti nama");
        res.redirect("/admin/atur");
    } else {
        await UserModel.updateOne({ id: { $eq: user.id } }, { $set: { name: jsonBody.newname } });
        // @ts-ignore
        req.session.passport.user.name = jsonBody.newname;
        req.session.save((_e) => {
            req.session.reload((_e) => {
                req.flash("nameinfo", "Sukses mengubah nama");
                res.redirect("/admin/atur");
            });
        });
    }
});

export { AuthAPIRoutes };
