import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";

import { UserProps } from "../../models/user";
import { isNone } from "../../lib/utils";
import { emitSocket, emitSocketAndWait } from "../../lib/socket";

const APIPOSTRoutes = express.Router();

APIPOSTRoutes.post("/serverinfo", ensureLoggedIn("/"), async (req, res) => {
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            res.status(504).json({ message: "Not implemented for Admin", code: 504 });
        } else {
            const results = await emitSocketAndWait("get server", userData.id);
            res.json({ data: results, code: 200 });
        }
    }
});

APIPOSTRoutes.post("/poll", ensureLoggedIn("/"), (req, res) => {
    if (isNone(req.user)) {
        res.status(403).json({ message: "Unauthorized", code: 403 });
    } else {
        const userData = req.user as UserProps;
        if (userData.privilege === "owner") {
            res.json({ done: false });
        } else {
            emitSocket("pull data", userData.id);
            res.json({ done: true });
        }
    }
});

export { APIPOSTRoutes };
