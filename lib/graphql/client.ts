import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const endpoint = process.env.NEXT_PUBLIC_API_V2_ENDPOINT;
if (typeof endpoint !== "string") {
    throw new Error("NEXT_PUBLIC_API_V2_ENDPOINT is not defined");
}

const httpLink = createHttpLink({
    uri: `${endpoint.replace(/\/$/, "")}/graphql`,
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    let token;
    try {
        token = window && window.localStorage && window.localStorage.getItem("sessionToken");
    } catch {}
    const masterKey = process.env.API_V2_KEY; // should be none on client side
    if (masterKey) {
        return {
            headers: {
                ...headers,
                authorization: `Token ${masterKey}`,
            },
        };
    }
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
