import { useQuery } from "@apollo/client";
import { SessionDocument, UserSessFragment } from "@/lib/graphql/auth.generated";
import { useRouter } from "next/router";
import { createContext, PropsWithChildren, useEffect } from "react";

interface AuthSuspenseProps {
    path: string;
}

export const AuthContext = createContext<UserSessFragment | null>(null);

const DO_NOT_REDIRECT = ["/500", "/404"];
const PREFIX_INVALID = ["/tentang", "/embed", "/assets"];

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

export default function AuthSuspense(props: PropsWithChildren<AuthSuspenseProps>) {
    const { path } = props;
    const router = useRouter();
    const { data, loading, error, refetch } = useQuery(SessionDocument);

    useEffect(() => {
        if (shouldRefetchOrRedirect(path)) {
            console.log("Route validation change start, refetching session");
            refetch();
        }
    }, [path, refetch]);

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

    console.log(data);

    if (data.session.__typename === "Result") {
        console.error(data.session.message);
        if (shouldRefetchOrRedirect(path) && (path.startsWith("/admin") || path.startsWith("/servers"))) {
            router.push("/");
        }
        return <AuthContext.Provider value={null}>{props.children}</AuthContext.Provider>;
    }

    if (shouldRefetchOrRedirect(path) && data.session.active?.id && !path.startsWith("/admin")) {
        console.log("Redirecting to admin");
        router.push("/admin");
    }

    if (shouldRefetchOrRedirect(path) && !data.session.active?.id && !path.startsWith("/servers")) {
        console.log("Redirecting to servers selection");
        router.push("/servers");
    }

    return <AuthContext.Provider value={data.session}>{props.children}</AuthContext.Provider>;
}
