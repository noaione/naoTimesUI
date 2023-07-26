import Image from "next/image";
import { ImageMetadata } from "@/lib/graphql/types.generated";

interface ImageMetadataProps {
    image: Omit<ImageMetadata, "type"> | undefined;
    className?: string;
    alt: string;
    width: number;
    height: number;
}

export function buildImageUrlString(image?: string, fallbackType: string = "project") {
    const publicEnv = process.env.NEXT_PUBLIC_API_V2_ENDPOINT;
    if (publicEnv.endsWith("/")) {
        if (!image) {
            return `${publicEnv}images/invalids/${fallbackType}/default.png`;
        }
        return `${publicEnv}images${image}`;
    }
    if (!image) {
        return `${publicEnv}/images/invalids/${fallbackType}/default.png`;
    }
    return `${publicEnv}/images${image}`;
}

export function buildImageUrl(image?: Omit<ImageMetadata, "type">, fallbackType: string = "project") {
    const publicEnv = process.env.NEXT_PUBLIC_API_V2_ENDPOINT;
    if (publicEnv.endsWith("/")) {
        if (!image) {
            return `${publicEnv}images/invalids/${fallbackType}/default.png`;
        }
        return `${publicEnv}images${image.path}`;
    }
    if (!image) {
        return `${publicEnv}/images/invalids/${fallbackType}/default.png`;
    }
    return `${publicEnv}/images${image.path}`;
}

export default function ImageMetadataComponent(props: ImageMetadataProps) {
    const { image, className, alt, width, height } = props;
    return <Image src={buildImageUrl(image)} width={width} height={height} className={className} alt={alt} />;
}
