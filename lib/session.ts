import { Handler, withIronSession } from "next-iron-session";

export default function withSession(session: Handler) {
    return withIronSession(session, {
        password: process.env.TOKEN_SECRET,
        cookieName: "ntwebui/iron/token",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false,
        },
    });
}
