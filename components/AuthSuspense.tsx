import { ApolloError, useLazyQuery } from "@apollo/client";
import { SessionDocument, UserSessFragment } from "@/lib/graphql/auth.generated";
import { useRouter } from "next/router";
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";

interface AuthSuspenseProps {
    path: string;
}

export const AuthContext = createContext<UserSessFragment | null>(null);

const DO_NOT_REDIRECT = ["/500", "/404"];
const PREFIX_INVALID = ["/tentang", "/embed", "/assets", "/discord"];

function shouldRefetchOrRedirect(path: string) {
    if (DO_NOT_REDIRECT.includes(path)) {
        return false;
    }
    for (const invalid of PREFIX_INVALID) {
        if (path.startsWith(invalid)) {
            return false;
        }
    }
    return true;
}

interface SessionContext {
    session: UserSessFragment | null;
    error: ApolloError | string | null;
    loading: boolean;
}

export default function AuthSuspense(props: PropsWithChildren<AuthSuspenseProps>) {
    const { path } = props;
    const [{ session, error, loading }, setSession] = useState<SessionContext>({
        session: null,
        error: null,
        loading: true,
    });
    const router = useRouter();
    const getSession = useLazyQuery(SessionDocument)[0];

    const sessionFetch = useCallback(async () => {
        setSession({
            session: null,
            error: null,
            loading: true,
        });
        const { data, error } = await getSession();

        if (error) {
            console.error(error);
            setSession({
                session: null,
                error,
                loading: false,
            });
            return;
        }

        if (data.session.__typename === "Result") {
            console.error(data.session.message);
            setSession({
                session: null,
                error: data.session.message,
                loading: false,
            });
            return;
        }

        setSession({
            session: data.session,
            error: null,
            loading: false,
        });
    }, [getSession]);

    useEffect(() => {
        console.log("Initial session fetch");
        sessionFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (shouldRefetchOrRedirect(path)) {
            console.log("Route validation change start, refetching session");
            sessionFetch();
        }
    }, [path, sessionFetch]);

    if (loading) {
        return <AuthContext.Provider value={null}>{props.children}</AuthContext.Provider>;
    }

    const errorPage = path.startsWith("/500") || path.startsWith("/404");

    if (error) {
        console.error(error);
        if (!errorPage && shouldRefetchOrRedirect(path)) {
            router.push("/500");
        }
        return <AuthContext.Provider value={null}>{props.children}</AuthContext.Provider>;
    }

    const isPeladen = path.startsWith("/admin/peladen");
    const isNotAdminOrIsPeladen = isPeladen || !path.startsWith("/admin");

    if (shouldRefetchOrRedirect(path) && session.active?.id && !isPeladen) {
        console.log("Redirecting to server admin page");
        router.push("/admin/peladen");
    } else if (shouldRefetchOrRedirect(path) && !session.active?.id && isNotAdminOrIsPeladen) {
        console.log("Redirecting to user admin page");
        router.push("/admin");
    }

    return <AuthContext.Provider value={session}>{props.children}</AuthContext.Provider>;
}
