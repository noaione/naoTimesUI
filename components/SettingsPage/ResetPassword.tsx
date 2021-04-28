import { toString } from "lodash";
import React from "react";
import LoadingCircle from "../LoadingCircle";

interface RPassState {
    oldValue: string;
    newValue: string;
    isSubmitting: boolean;
}

class ResetPasswordComponent extends React.Component<{}, RPassState> {
    constructor(props) {
        super(props);

        this.submitPassword = this.submitPassword.bind(this);

        this.state = {
            oldValue: "",
            newValue: "",
            isSubmitting: false,
        };
    }

    async submitPassword() {
        this.setState({ isSubmitting: true });
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;
        setTimeout(() => {
            outerThis.setState({ isSubmitting: false });
        }, 2000);
    }

    render() {
        const { isSubmitting } = this.state;
        return (
            <>
                <div className="flex flex-col py-1">
                    <h3 className="font-semibold dark:text-white mb-2">Ubah Passowrd</h3>
                    <div className="flex flex-row pb-2">
                        <div className="flex flex-col">
                            <div className="w-full mt-2 mb-1 flex flex-col">
                                <label className="text-sm font-medium dark:text-white mb-1">
                                    Password Lama
                                </label>
                                <input
                                    value={this.state.oldValue}
                                    type="password"
                                    className="form-input w-96 py-1 rounded-lg border-2 transition-colors duration-200 ease-in-out border-gray-200 focus:border-yellow-600 focus:outline-none"
                                    placeholder="************"
                                    onChange={(ev) => this.setState({ oldValue: toString(ev.target.value) })}
                                />
                            </div>
                            <div className="w-full mt-2 mb-1 flex flex-col">
                                <label className="text-sm font-medium dark:text-white mb-1">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={this.state.newValue}
                                    className="form-input w-96 py-1 rounded-lg border-2 transition-colors duration-200 ease-in-out border-gray-200 focus:border-yellow-600 focus:outline-none"
                                    placeholder="************"
                                    onChange={(ev) => this.setState({ newValue: toString(ev.target.value) })}
                                />
                            </div>
                            <div className="flex mt-2">
                                <button
                                    onClick={this.submitPassword}
                                    className={`rounded text-white px-4 py-2 ${
                                        isSubmitting
                                            ? "bg-blue-500 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    } transition-colors duration-200 flex flex-row items-center focus:outline-none`}
                                >
                                    {isSubmitting && <LoadingCircle className="ml-0 mt-0" />}
                                    <span className={isSubmitting ? "mt-0.5 font-semibold" : "font-semibold"}>
                                        Ubah
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ResetPasswordComponent;
