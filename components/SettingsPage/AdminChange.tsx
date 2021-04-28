import { cloneDeep, toString, uniqueId } from "lodash";
import React from "react";
import { Nullable } from "../../lib/utils";
import LoadingCircle from "../LoadingCircle";

interface AdminTextBoxProps {
    index: number;
    currentVal: Nullable<string>;
    onAdjust(data: string, idx: number): void;
    onRemoval(idx: number): void;
}

interface AdminTextBoxState {
    value: Nullable<string>;
}

class AdminChangeTextBox extends React.Component<AdminTextBoxProps, AdminTextBoxState> {
    constructor(props: AdminTextBoxProps) {
        super(props);
        this.internalOnChange = this.internalOnChange.bind(this);
        this.state = {
            value: this.props.currentVal,
        };
    }

    internalOnChange(value: number) {
        this.setState({ value: toString(value) });
        this.props.onAdjust(toString(value), this.props.index);
    }

    render() {
        return (
            <>
                <div className="w-full px-3 mb-1 flex flex-row">
                    <input
                        type="number"
                        className="form-input w-full py-1 rounded-lg border-2 transition-colors duraion-400 ease-in-out border-gray-200 focus:border-yellow-600 focus:outline-none"
                        value={this.state.value}
                        onChange={(ev) => this.internalOnChange(ev.target.valueAsNumber)}
                        placeholder="xxxxxxxxxxxxxx"
                    />
                    <button
                        className="mx-2 px-2 py-1 bg-red-500 hover:bg-red-600 transition-colors duration-150 rounded font-medium text-white focus:outline-none"
                        onClick={() => this.props.onRemoval(this.props.index)}
                    >
                        Hapus
                    </button>
                </div>
            </>
        );
    }
}

/**
 * Check if two string array is different or not.
 *
 * It first check if there's any length difference, if there's just say yes
 * since it's already different.
 *
 * If the length is same, sort both of them, and create a simple for-loop
 * which will check if the same index of array1 and array2 is different or not.
 * If different, break the loop and return as true, otherwise false.
 *
 * Can be bad if the array is big, but who cares.
 * @param array1 First string array collection
 * @param array2 Second string array collection
 * @returns is the array different or not?
 */
function isDifferent(array1: string[], array2: string[]) {
    if (array1.length !== array2.length) {
        return true;
    }
    let unmatching = false;
    array1.sort();
    array2.sort();
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            unmatching = true;
            break;
        }
    }
    return unmatching;
}

interface AdminChangeProps {
    serverOwner: string[];
    onErrorModal(errString: string): void;
}

interface AdminData {
    id: string;
    value: Nullable<string>;
}

interface AdminChangeState {
    serverOwner: AdminData[];
    oldServerOwner: AdminData[];
    isSubmitting: boolean;
    isEdit: boolean;
}

class AdminChangeSettings extends React.Component<AdminChangeProps, AdminChangeState> {
    constructor(props: AdminChangeProps) {
        super(props);
        this.submitNew = this.submitNew.bind(this);
        this.addNew = this.addNew.bind(this);
        this.remove = this.remove.bind(this);
        this.onAdjusting = this.onAdjusting.bind(this);
        const newFormatting: AdminData[] = this.props.serverOwner.map((results) => {
            return {
                id: uniqueId("adm"),
                value: results,
            };
        });
        this.state = {
            serverOwner: newFormatting,
            oldServerOwner: cloneDeep(newFormatting),
            isSubmitting: false,
            isEdit: false,
        };
    }

    async submitNew() {
        if (this.state.isSubmitting) {
            return;
        }
        const serverOwner = this.state.serverOwner
            .map((res) => res.value)
            .filter((e) => typeof e === "string" && e.length > 0);
        const oldServerOwner = this.state.oldServerOwner.map((res) => res.value);
        if (!isDifferent(serverOwner, oldServerOwner)) {
            this.setState({ isEdit: false, serverOwner: this.state.oldServerOwner });
            return;
        }
        const actualNewServerOwner = this.state.serverOwner.filter(
            (e) => typeof e.value === "string" && e.value.length > 0
        );
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;
        this.setState({ isSubmitting: true });
        setTimeout(
            () =>
                outerThis.setState({
                    isEdit: false,
                    isSubmitting: false,
                    oldServerOwner: actualNewServerOwner,
                }),
            3000
        );
        // this.setState({ isSubmitting: true });
        // const stringfied = toString(this.state.announcerId);

        // const bodyBag = {
        //     channelid: toString(this.state.announcerId),
        // };
        // const apiRes = await fetch("/api/showtimes/settings/announcer", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(bodyBag),
        // });

        // const jsonRes = await apiRes.json();
        // if (jsonRes.code === 200) {
        //     this.setState({ oldAnnouncer: stringfied, announcerId: stringfied, isSubmitting: false });
        // } else {
        //     this.setState({ isSubmitting: false });
        //     this.props.onErrorModal(jsonRes.message as string);
        // }
    }

    addNew() {
        const { serverOwner } = this.state;
        serverOwner.push({ id: uniqueId("adm"), value: "" });
        this.setState({ serverOwner });
    }

    remove(idx: number) {
        let { serverOwner } = this.state;
        console.info(serverOwner, idx, "old");
        serverOwner = serverOwner.filter((_v, idxIn) => idx !== idxIn);
        console.info(serverOwner, idx, "new");
        this.setState({ serverOwner });
    }

    onAdjusting(data: string, idx: number) {
        const { serverOwner } = this.state;
        const { id } = serverOwner[idx];
        serverOwner[idx] = { id, value: data };
        console.info(serverOwner);
        this.setState({ serverOwner });
    }

    render() {
        const { oldServerOwner, serverOwner, isSubmitting, isEdit } = this.state;

        if (!isEdit) {
            return (
                <>
                    <div className="flex flex-col py-1">
                        <h3 className="font-semibold dark:text-white mb-2 text-lg">Ubah Admin</h3>
                        <div className="flex flex-col">
                            {oldServerOwner.map((res) => {
                                return (
                                    <div key={`view${res.id}`} className="dark:text-white">
                                        - {res.value}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex mt-2">
                            <button
                                onClick={() => this.setState({ isEdit: true })}
                                className={`rounded text-white px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex flex-row items-center focus:outline-none`}
                            >
                                <span className="font-semibold">Ubah</span>
                            </button>
                        </div>
                    </div>
                </>
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;

        return (
            <>
                <div className="flex flex-col py-1">
                    <h3 className="font-semibold dark:text-white mb-2 text-lg">Ubah Admin</h3>
                    <div className={`flex flex-col gap-1 ${serverOwner.length > 0 && "-mx-3"}`}>
                        {serverOwner.length > 0 ? (
                            serverOwner.map((admin, idx) => {
                                return (
                                    <AdminChangeTextBox
                                        key={`edit${admin.id}`}
                                        index={idx}
                                        currentVal={admin.value}
                                        onAdjust={outerThis.onAdjusting}
                                        onRemoval={outerThis.remove}
                                    />
                                );
                            })
                        ) : (
                            <span className="dark:text-gray-200">Tidak ada admin</span>
                        )}
                    </div>
                    <div className="flex flex-row gap-2 mt-2">
                        <button
                            onClick={this.addNew}
                            className={`rounded text-white px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors duration-200 flex flex-row items-center focus:outline-none`}
                        >
                            <span className="font-semibold">Tambah</span>
                        </button>
                        <button
                            onClick={this.submitNew}
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
            </>
        );
    }
}

export default AdminChangeSettings;
