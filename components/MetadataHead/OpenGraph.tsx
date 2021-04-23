import React from "react";

interface OpenGraphProps {
    image?: string;
    title: string;
    url: string;
    description: string;
}

class OpenGraphMeta extends React.Component<OpenGraphProps> {
    constructor(props: OpenGraphProps) {
        super(props);
    }
    render() {
        const { title, description, url, image } = this.props;

        const realImage = image || "/assets/img/ntui_splash.png";

        return (
            <>
                {/* OpenGraph Meta */}
                {title && <meta property="og:title" content={title} />}
                {description && <meta property="og:description" content={description} />}
                {realImage && <meta property="og:image" content={realImage} />}
                <meta property="og:url" content={url} />
                <meta property="og:site_name" content="naoTimesUI" />
                <meta property="og:type" content="website" />
            </>
        );
    }
}

export default OpenGraphMeta;
