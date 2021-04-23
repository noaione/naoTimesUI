import { isString } from "lodash";
import React from "react";

import OpenGraphMeta from "./OpenGraph";
import TwitterCardsMeta from "./TwitterCard";

export interface SEOMetaProps {
    color?: string;
    urlPath?: string;
    image?: string;
    title: string;
    description: string;
}

class SEOMetaTags extends React.Component<SEOMetaProps> {
    constructor(props: SEOMetaProps) {
        super(props);
    }
    render() {
        const { description } = this.props;

        const { urlPath, image, color } = this.props;
        let titleReal = this.props.title;
        titleReal = titleReal || "Home";
        let copyDesc = description;
        const realColor = color || "#111827";
        copyDesc = copyDesc || "A Frontend for ihateani.me VTuber API";
        let url = "https://beta.panel.naoti.me";
        if (isString(urlPath)) {
            if (urlPath.startsWith("/")) {
                url += urlPath;
            } else {
                url += "/" + urlPath;
            }
        }

        return (
            <>
                <title>{`${titleReal} :: naoTimesUI`}</title>
                {copyDesc && <meta name="description" content={copyDesc} />}
                <meta name="theme-color" content={realColor} />
                <OpenGraphMeta title={titleReal} description={copyDesc} url={url} image={image} />
                <TwitterCardsMeta title={titleReal} description={copyDesc} image={image} />
            </>
        );
    }
}

export default SEOMetaTags;
