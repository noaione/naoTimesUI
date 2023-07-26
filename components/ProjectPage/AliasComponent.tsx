import { cloneDeep } from "lodash";
import React from "react";

import CreatableSelect from "react-select/creatable";
import { ActionMeta } from "react-select";

import LoadingCircle from "../LoadingCircle";
import MotionInView from "../MotionInView";
import { SettingsProps } from "../SettingsPage/base";

import { isDifferent, verifyExist } from "@/lib/utils";
import client from "@/lib/graphql/client";
import { MutateProjectAliasesDocument } from "@/lib/graphql/projects.generated";

interface AliasProps extends SettingsProps {
    aniId: string;
    disableEditing?: boolean;
    aliases?: string[];
}

interface AliasState {
    isEdit: boolean;
    isFirst: boolean;
    isSubmit: boolean;
    oldAlias: string[];
    aliases: string[];
}

interface AliasSelectData {
    label: string;
    value: string;
    __isNew__?: boolean;
}

class AliasComponent extends React.Component<AliasProps, AliasState> {
    constructor(props: AliasProps) {
        super(props);
        this.submitNewAliases = this.submitNewAliases.bind(this);
        this.onChangeEvent = this.onChangeEvent.bind(this);
        const arrayOfAlias = verifyExist(props, "aliases", "array") ? cloneDeep(props.aliases) : [];
        this.state = {
            isEdit: false,
            isFirst: true,
            isSubmit: false,
            oldAlias: arrayOfAlias,
            aliases: arrayOfAlias,
        };
    }

    onChangeEvent(data: AliasSelectData[], _a: ActionMeta<any>) {
        const allNewAliases = data.map((res) => res.value);
        this.setState({ aliases: allNewAliases });
    }

    async submitNewAliases() {
        if (this.state.isSubmit) {
            return;
        }
        if (!isDifferent(this.state.aliases, this.state.oldAlias)) {
            this.setState({ isEdit: false });
            return;
        }

        this.setState({ isSubmit: true });

        const { data, errors } = await client.mutate({
            mutation: MutateProjectAliasesDocument,
            variables: {
                id: this.props.aniId,
                aliases: this.state.aliases,
            },
        });

        if (errors) {
            console.error(errors);
            this.setState({ isSubmit: false });
            return;
        }

        if (data.updateProject.__typename === "Result") {
            console.log(data.updateProject.message);
            this.setState({ isEdit: false, isSubmit: false });
            return;
        }

        this.setState({
            isSubmit: false,
            isEdit: false,
            aliases: data.updateProject.aliases,
            oldAlias: data.updateProject.aliases,
        });
    }

    render() {
        const { isEdit, isFirst, isSubmit, oldAlias } = this.state;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;

        if (!isEdit) {
            return (
                <MotionInView.div
                    className="text-sm text-gray-600 dark:text-gray-300"
                    initial={{ x: -35, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: isFirst ? 0.2 : 0 }}
                >
                    <span>{oldAlias.length > 0 ? `Alias: ${oldAlias.join(", ")}` : "Tidak ada alias"}</span>
                    {!this.props.disableEditing && (
                        <button
                            onClick={() => outerThis.setState({ isEdit: true, isFirst: false })}
                            className="ml-1 text-red-400 hover:text-red-500 transition-colors duration-150 focus:outline-none"
                        >{`[Edit]`}</button>
                    )}
                </MotionInView.div>
            );
        }

        const defaultValue: AliasSelectData[] = oldAlias.map((res) => {
            return {
                label: res,
                value: res,
            };
        });

        return (
            <>
                <div className="flex flex-col w-full mt-2">
                    <CreatableSelect
                        id="alias-selector-reactive"
                        inputId="alias-selector-reactive-input"
                        defaultValue={defaultValue}
                        isMulti
                        isClearable
                        name="aliases-selected"
                        onChange={this.onChangeEvent}
                        classNamePrefix="rselect"
                        className="basic-multi-select w-full rounded-lg"
                        placeholder="Masukan alias..."
                    />
                    <div className="mt-2">
                        <button
                            onClick={this.submitNewAliases}
                            className={`rounded text-white px-4 py-2 ${
                                isSubmit
                                    ? "bg-green-500 cursor-not-allowed opacity-60"
                                    : "bg-green-600 hover:bg-green-700 opacity-100"
                            } transition duration-200 flex flex-row items-center focus:outline-none`}
                        >
                            {isSubmit && <LoadingCircle className="ml-0 mt-0" />}
                            <span className={isSubmit ? "mt-0.5 font-semibold" : "font-semibold"}>Ubah</span>
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

export default AliasComponent;
