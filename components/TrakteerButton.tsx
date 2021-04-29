import React from "react";

class TrakteerButton extends React.Component {
    render() {
        return (
            <>
                <div className="flex items-end justify-end fixed bottom-0 right-0 mb-6 mr-6 z-10">
                    <div>
                        <a
                            title="Trakteer"
                            href="https://trakteer.id/noaione"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12 bg-white"
                        >
                            <img
                                title="Trakteer Logo"
                                className="object-cover object-center w-full h-full rounded-full"
                                src="https://trakteer.id/images/mix/Logo%20Trakteer%20-%20Lite-01.png"
                            />
                        </a>
                    </div>
                </div>
            </>
        );
    }
}

export default TrakteerButton;
