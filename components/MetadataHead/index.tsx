import Head from "next/head";
import React from "react";

import Base from "./Base";
import CSSExtra from "./CSSExtra";
import Prefetch from "./Prefetch";
import SEO from "./SEO";

export default class MetadataHead extends React.Component {
    static Base = Base;
    static Prefetch = Prefetch;
    static SEO = SEO;
    static CSSExtra = CSSExtra;

    constructor(props) {
        super(props);
    }

    render() {
        const { children } = this.props;
        return <Head>{children}</Head>;
    }
}
