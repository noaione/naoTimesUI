import Head from "next/head";
import React from "react";

import Base from "./Base";
import Prefetch from "./Prefetch";
import SEO from "./SEO";

export default class MetadataHead extends React.Component<React.PropsWithChildren<{}>> {
    static Base = Base;
    static Prefetch = Prefetch;
    static SEO = SEO;

    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;
        return <Head>{children}</Head>;
    }
}
