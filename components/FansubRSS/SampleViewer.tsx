import { motion } from "framer-motion";
import React from "react";

interface AniContainer {
    animate?: boolean;
    animateDelay?: number;
}
interface SampleViewerDataProps extends AniContainer {
    data: any;
    name: any;
}

function ViewerContainer(props: AniContainer & { children?: React.ReactNode }) {
    if (props.animate) {
        return (
            <motion.div
                className="flex flex-col"
                initial={{ y: 35, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: props.animateDelay || 0.2 }}
            >
                {props.children}
            </motion.div>
        );
    }

    return <div className="flex flex-col">{props.children}</div>;
}

class SampleViewerData extends React.Component<SampleViewerDataProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { data, name, animate, animateDelay } = this.props;
        let nicerData = data;
        if (Array.isArray(data)) {
            nicerData = data.join(", ");
        }

        return (
            <ViewerContainer animate={animate} animateDelay={animateDelay}>
                <div className="px-2 py-1 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-t-lg">
                    <strong>Key: </strong>
                    <code>{`{${name}}`}</code>
                </div>
                <div className="px-3 py-2 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-b-lg">
                    {nicerData}
                </div>
            </ViewerContainer>
        );
    }
}

interface SampleViewerProps extends AniContainer {
    sample?: { [key: string]: any };
}

class SampleViewer extends React.Component<SampleViewerProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { sample, animate } = this.props;

        return (
            <>
                <label className="text-lg font-semibold dark:text-white mt-4">Sample</label>
                <div className="flex flex-col w-full mt-2 gap-2">
                    {Object.keys(sample).map((key, idx) => {
                        let aniDelay = 0.2;
                        if (idx > 0) {
                            aniDelay = 0.2 + 0.1 * (idx + 1);
                        }
                        return (
                            <SampleViewerData
                                name={key}
                                data={sample[key]}
                                key={`view-${key}`}
                                animate={animate}
                                animateDelay={aniDelay}
                            />
                        );
                    })}
                </div>
            </>
        );
    }
}

export default SampleViewer;
