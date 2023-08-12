import { toString } from "lodash";
import React from "react";

import { SettingsProps } from "./base";

import LoadingCircle from "../LoadingCircle";
import client from "@/lib/graphql/client";
import { ResetPasswordDocument } from "@/lib/graphql/auth.generated";
import { isNone } from "@/lib/utils";
import {
    USER_INVALID_OLD_PASSWORD,
    USER_NEED_MIGRATE,
    USER_NOT_FOUND,
    USER_REPEAT_OLD_PASSWORD,
    USER_REQUIREMENT_PASSWORD,
} from "@/lib/graphql/error-code";
import Router from "next/router";

interface RPassState {
    oldValue: string;
    newValue: string;
    isSubmitting: boolean;
    isValid: boolean;
    validityCheck: string[];
    submitSuccess: boolean;
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

function translateError(error: string, errorCode?: string) {
    if (isNone(errorCode)) return error;
    switch (errorCode) {
        case USER_NEED_MIGRATE:
            return "Akun anda perlu migrasi ke versi baru. Silahkan hubungi admin untuk bantuan.";
        case USER_REPEAT_OLD_PASSWORD:
            return "Password baru tidak boleh sama dengan password lama.";
        case USER_REQUIREMENT_PASSWORD:
            return "Password baru harus melebihi 8 karakter!";
        case USER_INVALID_OLD_PASSWORD:
            return "Password lama salah.";
        case USER_NOT_FOUND:
            return "Akun tidak ditemukan.";
        default:
            return error;
    }
}

class ResetPasswordComponent extends React.Component<SettingsProps, RPassState> {
    constructor(props: SettingsProps) {
        super(props);

        this.submitPassword = this.submitPassword.bind(this);
        this.passwordVerify = this.passwordVerify.bind(this);

        this.state = {
            oldValue: "",
            newValue: "",
            isSubmitting: false,
            isValid: false,
            validityCheck: verifyPasswordStrength(""),
            submitSuccess: false,
        };
    }

    async submitPassword() {
        if (this.state.isSubmitting || !this.state.isValid) {
            return;
        }
        if (this.state.oldValue.length < 1) {
            this.props.onErrorModal("Mohon masukan password lama terlebih dahulu!");
            return;
        }
        if (this.state.validityCheck.length > 0) {
            return;
        }

        this.setState({ isSubmitting: true });

        const { data, errors } = await client.mutate({
            mutation: ResetPasswordDocument,
            variables: {
                oldPass: this.state.oldValue,
                newPass: this.state.newValue,
            },
        });

        if (errors) {
            this.props.onErrorModal(errors.map((e) => e.message).join("\n"));
            this.setState({ isSubmitting: false });
            return;
        }

        if (data.resetPassword.__typename === "Result") {
            if (data.resetPassword.code === USER_NOT_FOUND || data.resetPassword.code === USER_NEED_MIGRATE) {
                localStorage.removeItem("sessionToken");
                Router.push("/");
                return;
            }

            this.props.onErrorModal(translateError(data.resetPassword.message, data.resetPassword.code));
            this.setState({
                isSubmitting: false,
            });
        } else {
            // success
            this.setState({ isSubmitting: false, submitSuccess: true });
            setTimeout(() => {
                this.setState({ submitSuccess: false });
                setTimeout(() => {
                    Router.push("/");
                });
            }, 2000);
        }
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
        const { isSubmitting, isValid, validityCheck, submitSuccess } = this.state;
        let disableButton = false;
        if (!isValid) {
            disableButton = true;
        }
        if (isSubmitting) {
            disableButton = true;
        }
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
                                    className="form-darkable w-full py-1"
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
                                    className="form-darkable w-full py-1"
                                    placeholder="************"
                                    onChange={(ev) => this.passwordVerify(toString(ev.target.value))}
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
                                            ? "cursor-not-allowed opacity-60 " +
                                              (submitSuccess ? "bg-green-500" : "bg-blue-500")
                                            : "opacity-100 " +
                                              (submitSuccess
                                                  ? "bg-green-600 hover:bg-green-700"
                                                  : "bg-blue-600 hover:bg-blue-700")
                                    } transition duration-200 flex flex-row items-center focus:outline-none`}
                                    disabled={disableButton || isSubmitting || submitSuccess}
                                >
                                    {isSubmitting && <LoadingCircle className="ml-0 mt-0" />}
                                    <span className={isSubmitting ? "mt-0.5 font-semibold" : "font-semibold"}>
                                        {submitSuccess ? "Sukses" : "Ubah"}
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
