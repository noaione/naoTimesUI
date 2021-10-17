import { UserModel } from "@/models/user";
import { NextApiResponse, NextApiHandler } from "next";
import dbConnect from "./dbConnect";
import { IUserAuth, NextApiRequestWithSession } from "./session";
import { isNone } from "./utils";

async function getUserByToken(token: string): Promise<IUserAuth | null> {
    await dbConnect();

    const fetchedData = await UserModel.findOne({ api_token: token });
    if (!fetchedData) {
        return null;
    }
    try {
        return {
            id: fetchedData.id,
            privilege: fetchedData.privilege,
            name: fetchedData.name,
        };
    } catch (err) {
        return null;
    }
}

export interface IUserAuthMiddleware extends IUserAuth {
    isToken: boolean;
}

type NextFunction = (err?: any) => any;
type MiddlewareFunction = (req: NextApiRequestWithSession, res: NextApiResponse, next: NextFunction) => void;

export async function authMiddleware(
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    next: NextFunction
) {
    let user = req.session.get<IUserAuth>("user");
    let isToken = false;
    let isValid = false;
    if (!user) {
        const authHeader = req.headers["authorization"] ?? "";
        if (authHeader.startsWith("Token")) {
            const token = authHeader.substr("Token ".length);
            user = await getUserByToken(token);
            if (!isNone(user)) {
                isToken = true;
                isValid = true;
            }
        }
    }

    if (isValid) {
        req.activeUser = { ...user, isToken };
    }
    next();
}

export default async function runMiddleware(
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    fn: MiddlewareFunction
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (err) => {
            if (err instanceof Error) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
}
