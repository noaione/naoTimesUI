import React from "react";

interface TwitterCardProps {
    image?: string;
    title: string;
    description: string;
}

class TwitterCardsMeta extends React.Component<TwitterCardProps> {
    constructor(props: TwitterCardProps) {
        super(props);
    }
    render() {
        const { title, description, image } = this.props;

        const realImage = image ?? "/assets/img/ntui_splash.png";

        return (
            <>
                {/* Twitter Card Meta */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:creator" content="@nao0809_" />
                <meta name="twitter:title" content={title} />
                {description && <meta property="twitter:description" content={description} />}
                {realImage && <meta property="twitter:image" content={realImage} />}
            </>
        );
    }
}

export default TwitterCardsMeta;
