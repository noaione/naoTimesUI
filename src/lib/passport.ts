import passport from "passport";
import { Strategy } from "passport-local";

import { logger } from "./logger";
import { findUser, validatePassword } from "./user";

const localStrategy = new Strategy(
    {
        usernameField: "username",
        passwordField: "password",
    },
    (username, password, done) => {
        findUser(username)
            .then((user) => {
                if (user && validatePassword(user, password)) {
                    const realUserData = {
                        id: user.id,
                        name: user.name,
                        secret: user.secret,
                        privilege: user.privilege,
                    };
                    done(null, realUserData);
                } else if (user && !validatePassword(user, password)) {
                    done(null, null, {
                        message: "Kombinasi server ID dan password salah!",
                    });
                } else {
                    done(null, null, {
                        message: "Tidak dapat menemukan server ID tersebut!",
                    });
                }
            })
            .catch((error) => {
                logger.error("An error occured when trying to fetch user!");
                console.error(error);
                done(error);
            });
    }
);

passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export { passport };
