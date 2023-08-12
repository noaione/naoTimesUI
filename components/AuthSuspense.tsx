import { useQuery } from "@apollo/client";
import { SessionDocument, UserSessFragment } from "@/lib/graphql/auth.generated";
import { useRouter } from "next/router";
import { createContext, PropsWithChildren, useEffect } from "react";

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
        // If null, we're not logged in. Try to nuke localStorage data.
        console.error(data.session.message);
        if (shouldRefetchOrRedirect(path) && path.startsWith("/admin")) {
            router.push("/");
        }
        return <AuthContext.Provider value={null}>{props.children}</AuthContext.Provider>;
    }

    const isPeladen = path.startsWith("/admin/peladen");
    const isNotAdminOrIsPeladen = isPeladen || !path.startsWith("/admin");

    if (shouldRefetchOrRedirect(path) && data.session.active?.id && !isPeladen) {
        console.log("Redirecting to server admin page");
        router.push("/admin/peladen");
    } else if (shouldRefetchOrRedirect(path) && !data.session.active?.id && isNotAdminOrIsPeladen) {
        console.log("Redirecting to user admin page");
        router.push("/admin");
    }

    return <AuthContext.Provider value={data.session}>{props.children}</AuthContext.Provider>;
}
