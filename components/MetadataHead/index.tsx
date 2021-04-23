import Head from "next/head";
import React from "react";

import Base from "./Base";
import CSSExtra from "./CSSExtra";
import Prefetch from "./Prefetch";
import SEO, { SEOMetaProps } from "./SEO";

function isString(data: any): data is string {
    return typeof data === "string";
}

export default class MetadataHead extends React.Component<Partial<SEOMetaProps>> {
    constructor(props: Partial<SEOMetaProps>) {
        super(props);
    }

    render() {
        const { title, description, image, urlPath, color } = this.props;

        let realTitle = "naoTimesUI";
        let realDescription = "Atur progress utang Fansub anda via WebUI naoTimes!";
        let realImage = "/assets/img/ntui_splash.png";
        let realUrl = null;
        let realColor = "#111827";
        if (isString(title)) {
            realTitle = title;
        }
        if (isString(description)) {
            realDescription = description;
        }
        if (isString(image)) {
            realImage = image;
        }
        if (isString(urlPath)) {
            realUrl = urlPath;
        }
        if (isString(realColor)) {
            realColor = color;
        }

        return (
            <>
                <Head>
                    <Base />
                    <Prefetch />
                    <SEO
                        title={realTitle}
                        description={realDescription}
                        image={realImage}
                        urlPath={realUrl}
                        color={realColor}
                    />
                    <CSSExtra />
                </Head>
            </>
        );
    }
}
