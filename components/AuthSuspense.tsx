import { ApolloError, useLazyQuery } from "@apollo/client";
import { SessionDocument, UserSessFragment } from "@/lib/graphql/auth.generated";
import { useRouter } from "next/router";
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { isNone } from "@/lib/utils";

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
    apiError: boolean;
    loading: boolean;
}

export default function AuthSuspense(props: PropsWithChildren<AuthSuspenseProps>) {
    const { path } = props;
    const [{ session, error, apiError, loading }, setSession] = useState<SessionContext>({
        session: null,
        error: null,
        apiError: false,
        loading: true,
    });
    const router = useRouter();
    const getSession = useLazyQuery(SessionDocument, {
        fetchPolicy: "network-only",
    })[0];

    const sessionFetch = useCallback(async () => {
        setSession({
            session: null,
            error: null,
            apiError: false,
            loading: true,
        });
        console.debug("  Fetching session...");
        const { data, error } = await getSession();

        if (error) {
            console.error("SessionFetch: API Error:", error);
            setSession({
                session: null,
                error,
                apiError: true,
                loading: false,
            });
            return;
        }

        if (data.session.__typename === "Result") {
            console.error("SessionFetch: Result Error:", data.session.message);
            setSession({
                session: null,
                error: data.session.message,
                apiError: false,
                loading: false,
            });
            return;
        }

        console.debug("  Session fetched:", data.session);

        setSession({
            session: data.session,
            error: null,
            apiError: false,
            loading: false,
        });
    }, [getSession]);

    useEffect(() => {
        if (shouldRefetchOrRedirect(router.asPath)) {
            console.log("Route validation change start, refetching session");
            sessionFetch();
        }
    }, [router.asPath, sessionFetch]);

    if (loading) {
        return <AuthContext.Provider value={null}>{props.children}</AuthContext.Provider>;
    }

    const errorPage = path.startsWith("/500") || path.startsWith("/404");

    if (error) {
        if (!errorPage && shouldRefetchOrRedirect(path) && apiError) {
            router.push("/500");
        }
        return <AuthContext.Provider value={null}>{props.children}</AuthContext.Provider>;
    }

    const isPeladen = path.startsWith("/admin/peladen");
    const isNotAdminOrIsPeladen = isPeladen || !path.startsWith("/admin");

    if (shouldRefetchOrRedirect(path) && isNone(session) && router.asPath !== "/") {
        console.debug("Redirecting to login page");
        router.push("/");
    } else if (shouldRefetchOrRedirect(path) && session.active?.id && !isPeladen) {
        console.debug("Redirecting to server admin page");
        router.push("/admin/peladen");
    } else if (shouldRefetchOrRedirect(path) && !session.active?.id && isNotAdminOrIsPeladen) {
        console.debug("Redirecting to user admin page");
        router.push("/admin");
    }

    return <AuthContext.Provider value={session}>{props.children}</AuthContext.Provider>;
}
