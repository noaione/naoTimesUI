import React from "react";

import { SettingsProps } from "./base";
import SelectAsync from "react-select/async";
import { ActionMeta } from "react-select";
import { MeiliSearch } from "meilisearch";

import LoadingCircle from "../LoadingCircle";

import client from "@/lib/graphql/client";
import { MutateServerOwnerDocument } from "@/lib/graphql/servers.generated";
import { SearchUser } from "@/lib/meili.data";

interface SimpleIDName {
    id: string;
    username: string;
}

const Meili = new MeiliSearch({
    host: process.env.NEXT_PUBLIC_MEILI_API,
    apiKey: process.env.NEXT_PUBLIC_MEILI_KEY,
});

interface AdminChangeProps extends SettingsProps {
    serverOwner: SimpleIDName[];
}

interface AdminChangeState {
    serverOwner: SimpleIDName[];
    isSubmitting: boolean;
}

function filterIdUsernameOnly(data: SearchUser[]) {
    return data.map((e) => ({ id: e.id, username: e.username }));
}

const loadUsersData = (inputValue: string, callback: Function) => {
    Meili.index("users")
        .search(inputValue, { limit: 10 })
        .then((results) => {
            callback(filterIdUsernameOnly(results.hits as SearchUser[]));
        })
        .catch((err) => {
            console.error(err);
            callback([]);
        });
};

function labelValues(data: SimpleIDName) {
    const { id, username } = data;
    return `${username} (${id})`;
}

class AdminChangeSettings extends React.Component<AdminChangeProps, AdminChangeState> {
    constructor(props: AdminChangeProps) {
        super(props);
        this.submitNew = this.submitNew.bind(this);
        this.onAdminChange = this.onAdminChange.bind(this);
        this.state = {
            isSubmitting: false,
            serverOwner: this.props.serverOwner.map((e) => ({ id: e.id, username: e.username })),
        };
    }

    async submitNew() {
        if (this.state.isSubmitting) {
            return;
        }
        this.setState({ isSubmitting: true });
        const serverOwner = this.state.serverOwner
            .map((res) => res.id)
            .filter((e) => typeof e === "string" && e.length > 0);

        const { data, errors } = await client.mutate({
            mutation: MutateServerOwnerDocument,
            variables: {
                owners: serverOwner,
            },
        });

        if (errors) {
            this.setState({ isSubmitting: false });
            this.props.onErrorModal(errors.map((e) => e.message).join("\n"));
            return;
        }

        if (data.updateServerOwners.__typename === "Result") {
            this.setState({ isSubmitting: false });
            this.props.onErrorModal(data.updateServerOwners.message);
            return;
        }

        this.setState({
            isSubmitting: false,
            serverOwner: data.updateServerOwners.owners.map((e) => ({ id: e.id, username: e.username })),
        });
    }

    onAdminChange(data: any, action: ActionMeta<any>) {
        if (action.action === "select-option") {
            this.setState({ serverOwner: data });
        } else if (action.action === "clear") {
            this.setState({ serverOwner: [] });
        } else if (["remove-value", "deselect-option"].includes(action.action)) {
            this.setState({ serverOwner: data });
        }
    }

    render() {
        const { isSubmitting } = this.state;

        return (
            <div className="flex flex-col py-1">
                <h3 className="font-semibold dark:text-white mb-2 mt-4 text-lg">Ubah Admin</h3>
                <div className="flex flex-row pb-2">
                    <div className="flex flex-col w-full">
                        <div className="w-full mb-1">
                            <SelectAsync
                                isMulti
                                className="w-full mt-1 rounded-lg"
                                cacheOptions
                                loadOptions={loadUsersData}
                                defaultOptions
                                value={this.state.serverOwner}
                                getOptionLabel={labelValues}
                                getOptionValue={labelValues}
                                filterOption={() => true}
                                placeholder="Ubah pemilik..."
                                inputId="owner-selector-rselect"
                                classNamePrefix="rselect"
                                onChange={this.onAdminChange}
                                isClearable
                            />
                        </div>
                        <div className="flex flex-row gap-2 mt-2">
                            <button
                                onClick={this.submitNew}
                                className={`rounded text-white px-4 py-2 ${
                                    isSubmitting
                                        ? "bg-blue-500 cursor-not-allowed opacity-60"
                                        : "bg-blue-600 hover:bg-blue-700 opacity-100"
                                } transition duration-200 flex flex-row items-center focus:outline-none`}
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
        );
    }
}

export default AdminChangeSettings;
