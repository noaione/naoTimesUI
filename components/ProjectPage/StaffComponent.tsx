import { toString } from "lodash";
import React from "react";

import CheckAllIcon from "mdi-react/CheckAllIcon";
import PencilIcon from "mdi-react/PencilIcon";
import { motion } from "framer-motion";

import { RoleColorPalette } from "../ColorMap";
import { SettingsProps } from "../SettingsPage/base";

import { expandRoleLocalized, getAssigneeName, Nullable, RoleProject } from "../../lib/utils";

interface StaffProps extends SettingsProps {
    id: RoleProject;
    animeId: string;
    userId?: Nullable<string | number>;
    animateDelay?: number;
    name?: string;
}

interface StaffState {
    isEdit: boolean;
    isFirst: boolean;
    isSubmitting: boolean;
    userId?: Nullable<string | number>;
    name?: string;
    oldId: string | number;
}

class StaffComponent extends React.Component<StaffProps, StaffState> {
    constructor(props: StaffProps) {
        super(props);
        this.submitEditing = this.submitEditing.bind(this);
        this.state = {
            isEdit: false,
            isFirst: true,
            isSubmitting: false,
            userId: this.props.userId,
            name: this.props.name,
            oldId: this.props.userId,
        };
    }

    async submitEditing() {
        if (this.state.oldId === this.state.userId) {
            // Ignore if same, save some API calls.
            this.setState({ isEdit: false });
            return;
        }
        if (this.state.isSubmitting) {
            return;
        }

        this.setState({ isSubmitting: true });
        const sendData = {
            event: "staff",
            changes: {
                role: this.props.id,
                anime_id: this.props.animeId,
                user_id: toString(this.state.userId),
            },
        };

        const apiRes = await fetch("/api/showtimes/proyek/ubah", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sendData),
        });

        const jsonRes = await apiRes.json();
        if (jsonRes.success) {
            this.setState({
                userId: jsonRes.id,
                oldId: jsonRes.id,
                name: jsonRes.name,
                isEdit: false,
                isSubmitting: false,
            });
        } else {
            this.setState({ isEdit: false, isSubmitting: false });
            this.props.onErrorModal(jsonRes.message);
        }
    }

    render() {
        const { id, animateDelay } = this.props;
        const { userId, name, isEdit, isFirst } = this.state;
        const roleColors = RoleColorPalette[id];
        const realName = typeof name === "string" ? name : "Tidak Diketahui";

        const assigneeName = getAssigneeName({ name: realName, id: toString(userId) });

        if (!isEdit) {
            const aniDelay = animateDelay || 0.25;
            return (
                <motion.div
                    className="text-base text-gray-900 items-center flex flex-row"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: isFirst ? aniDelay : 0 }}
                >
                    <PencilIcon
                        className="text-gray-800 dark:text-gray-200 mr-1 hover:opacity-70 transition-opacity duration-200 ease-out"
                        onClick={() => this.setState({ isEdit: true, isFirst: false })}
                    />
                    <span className={"px-2 rounded font-semibold " + roleColors}>
                        {expandRoleLocalized(id) + ": " + assigneeName}
                    </span>
                </motion.div>
            );
        }

        return (
            <>
                <div className="text-base text-gray-900 items-center flex flex-row">
                    <button
                        onClick={this.submitEditing}
                        className={`px-2 py-1 mr-2 ${
                            this.state.isSubmitting
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600"
                        } transition-colors duration-200 focus:outline-none`}
                    >
                        <CheckAllIcon className="text-gray-800" />
                    </button>
                    <input
                        className="form-darkable w-full py-1"
                        type="text"
                        placeholder="xxxxxxxxxxxxxx"
                        value={this.state.userId}
                        onChange={(ev) => this.setState({ userId: ev.target.value })}
                    />
                </div>
            </>
        );
    }
}

export default StaffComponent;
