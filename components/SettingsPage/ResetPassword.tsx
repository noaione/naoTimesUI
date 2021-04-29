import { toString } from "lodash";
import React from "react";

import { SettingsProps } from "./base";
import LoadingCircle from "../LoadingCircle";

interface RPassState {
    oldValue: string;
    newValue: string;
    isSubmitting: boolean;
    isValid: boolean;
    validityCheck: string[];
}

function verifyPasswordStrength(password: string): string[] {
    const failureCheck = [];
    if (password.length < 8) {
        failureCheck.push("Password minimal 8 karakter");
    }
    if (!password.match(/[A-Z]/)) {
        failureCheck.push("Minimal ada satu huruf kapital");
    }
    return failureCheck;
}

class ResetPasswordComponent extends React.Component<SettingsProps, RPassState> {
    constructor(props) {
        super(props);

        this.submitPassword = this.submitPassword.bind(this);
        this.passwordVerify = this.passwordVerify.bind(this);

        this.state = {
            oldValue: "",
            newValue: "",
            isSubmitting: false,
            isValid: false,
            validityCheck: verifyPasswordStrength(""),
        };
    }

    async submitPassword() {
        if (this.state.isSubmitting || !this.state.isValid) {
            return;
        }
        this.setState({ isSubmitting: true });
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;
        setTimeout(() => {
            outerThis.setState({ isSubmitting: false });
        }, 2000);
    }

    passwordVerify(passwd: string) {
        this.setState({ newValue: passwd });
        const totalError = verifyPasswordStrength(passwd);
        if (totalError.length > 0) {
            this.setState({ isValid: false, validityCheck: totalError });
        } else {
            this.setState({ isValid: true, validityCheck: [] });
        }
    }

    render() {
        const { isSubmitting, isValid, validityCheck } = this.state;
        let disableButton = false;
        if (!isValid) {
            disableButton = true;
        }
        if (isSubmitting) {
            disableButton = true;
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;
        return (
            <>
                <div className="flex flex-col py-1">
                    <h3 className="font-semibold dark:text-white mb-2 text-lg">Ubah Password</h3>
                    <div className="flex flex-row pb-2">
                        <div className="flex flex-col w-full md:w-1/2 lg:w-1/3">
                            <div className="w-full mt-2 mb-1 flex flex-col">
                                <label className="text-sm font-medium dark:text-white mb-1">
                                    Password Lama
                                </label>
                                <input
                                    value={this.state.oldValue}
                                    type="password"
                                    className="form-input w-full py-1 rounded-lg border-2 transition-colors duration-200 ease-in-out border-gray-200 focus:border-yellow-600 focus:outline-none"
                                    placeholder="************"
                                    onChange={(ev) =>
                                        outerThis.setState({ oldValue: toString(ev.target.value) })
                                    }
                                />
                            </div>
                            <div className="w-full mt-2 mb-1 flex flex-col">
                                <label className="text-sm font-medium dark:text-white mb-1">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={this.state.newValue}
                                    className="form-input w-full py-1 rounded-lg border-2 transition-colors duration-200 ease-in-out border-gray-200 focus:border-yellow-600 focus:outline-none"
                                    placeholder="************"
                                    onChange={(ev) => outerThis.passwordVerify(toString(ev.target.value))}
                                />
                                {!isValid &&
                                    validityCheck.map((res) => {
                                        return (
                                            <p key={`errpass-${res}`} className="text-sm text-red-500 mt-1">
                                                {res}
                                            </p>
                                        );
                                    })}
                            </div>
                            <div className="flex mt-2">
                                <button
                                    onClick={this.submitPassword}
                                    className={`rounded text-white px-4 py-2 ${
                                        disableButton
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
