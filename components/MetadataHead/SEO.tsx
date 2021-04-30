import React from "react";

import OpenGraphMeta from "./OpenGraph";
import TwitterCardsMeta from "./TwitterCard";

function isString(data: any): data is string {
    return typeof data === "string";
}

export interface SEOMetaProps {
    title?: string;
    description?: string;
    image?: string;
    urlPath?: string;
    color?: string;
}

class SEOMetaTags extends React.Component<SEOMetaProps> {
    constructor(props: SEOMetaProps) {
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
        if (isString(color)) {
            realColor = color;
        }

        let url = "https://beta.panel.naoti.me";
        if (isString(urlPath)) {
            if (urlPath.startsWith("/")) {
                url += realUrl;
            } else {
                url += "/" + realUrl;
            }
        }

        return (
            <>
                {realTitle && <meta name="description" content={realTitle} />}
                <meta name="theme-color" content={realColor} />
                <OpenGraphMeta title={realTitle} description={realDescription} url={url} image={realImage} />
                <TwitterCardsMeta title={realTitle} description={realDescription} image={realImage} />
            </>
        );
    }
}

export default SEOMetaTags;
