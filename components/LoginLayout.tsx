import React from "react";
import LoginSidebar from "./LoginSidebar";
import TrakteerButton from "./TrakteerButton";

class LoginLayout extends React.Component<React.PropsWithChildren<{}>> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="min-w-screen min-h-screen bg-gray-900 flex items-center justify-center px-5 py-5">
                    <div
                        className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
                        style={{ maxWidth: "1000px" }}
                    >
                        <div className="relative md:flex w-full">
                            <LoginSidebar />
                            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">{this.props.children}</div>
                        </div>
                    </div>
                </div>
                <TrakteerButton />
            </>
        );
    }
}

export default LoginLayout;
