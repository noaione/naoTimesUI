import { UserModel, UserProps } from "../models/user";
import { logger as MainLogger } from "./logger";
import { Nullable } from "./utils";

export async function findUser(username: string): Promise<Nullable<UserProps>> {
    const logger = MainLogger.child({ fn: "findUser", cls: "lib.user" });
    logger.info(`Mencari user ${username}`);
    const result = await UserModel.find({ id: { $eq: username } }).catch((err) => {
        logger.error(`An error occured while trying to find ${username}`);
        console.error(err);
        return [];
    });
    return result.find((user) => user?.id === username);
}

export function validatePassword(user: UserProps, password: string) {
    return user.secret === password;
}
