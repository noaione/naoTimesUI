import React from "react";

class SampleViewerData extends React.Component<{ data: any; name: any }> {
    constructor(props) {
        super(props);
    }

    render() {
        const { data, name } = this.props;
        let nicerData = data;
        if (Array.isArray(data)) {
            nicerData = data.join(", ");
        }
        return (
            <div className="flex flex-col">
                <div className="px-2 py-1 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-t-lg">
                    <strong>Key: </strong>
                    <code>{`{${name}}`}</code>
                </div>
                <div className="px-3 py-2 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-b-lg">
                    {nicerData}
                </div>
            </div>
        );
    }
}

interface SampleViewerProps {
    sample?: { [key: string]: any };
}

class SampleViewer extends React.Component<SampleViewerProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { sample } = this.props;

        return (
            <>
                <label className="text-lg font-semibold dark:text-white mt-4">Sample</label>
                <div className="flex flex-col w-full mt-2 gap-2">
                    {Object.keys(sample).map((key) => {
                        return <SampleViewerData name={key} data={sample[key]} key={`view-${key}`} />;
                    })}
                </div>
            </>
        );
    }
}

export default SampleViewer;
