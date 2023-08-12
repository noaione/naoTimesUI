import Head from "next/head";
import React from "react";
import Router from "next/router";

import AsyncSelect from "react-select/async";
import { ActionMeta } from "react-select";
import PlusIcon from "mdi-react/PlusIcon";

import AdminLayout from "@/components/Admin";
import MetadataHead from "@/components/MetadataHead";
import LoadingCircle from "@/components/LoadingCircle";
import { CallbackModal } from "@/components/Modal";
import ErrorModal from "@/components/ErrorModal";
import { AuthContext } from "@/components/AuthSuspense";
import { UserSessFragment } from "@/lib/graphql/auth.generated";
import client from "@/lib/graphql/client";
import {
    Integration,
    IntegrationInputAction,
    ProjectInputAssignee,
    ProjectInputAssigneeInfo,
    ProjectInputRoles,
    SearchExternalType,
    SearchSourceType,
} from "@/lib/graphql/types.generated";
import { expandRoleLocalized, isNone } from "@/lib/utils";
import { AnilistSearchDocument, ExternalResultFragment } from "@/lib/graphql/search.generated";
import { SearchUser } from "@/lib/meili.data";
import MeiliSearch from "meilisearch";
import { SHOWTIMES_USER } from "@/lib/graphql/integration-type";
import { MutateNewProjectDocument } from "@/lib/graphql/projects.generated";

interface ProjectNewState {
    errTxt?: string;
    selected?: ExternalResultFragment;
    roles?: ProjectInputRoles[];
    assigness?: ProjectInputAssignee[];
    episodeOverride?: number;
    isSubmitting: boolean;
}

interface ProjectNewProps {
    user: UserSessFragment;
}

interface SimpleIDName {
    id: string;
    username: string;
    integrations: Integration[];
}

const Meili = new MeiliSearch({
    host: process.env.NEXT_PUBLIC_MEILI_API,
    apiKey: process.env.NEXT_PUBLIC_MEILI_KEY,
});

interface AssigneeRoleProps {
    role: ProjectInputRoles;
    onSelect: (val?: ProjectInputAssigneeInfo) => void;
    onRemove: (role: ProjectInputRoles) => void;
    disabled?: boolean;
}

function filterIdUsernameOnly(data: SearchUser[]) {
    return data.map((e) => ({ id: e.id, username: e.username, integrations: e.integrations }));
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

function labelValuesUser(data: SimpleIDName) {
    const { id, username } = data;
    return `${username} (${id})`;
}

function AssigneeRole(props: AssigneeRoleProps) {
    const { role, onSelect, onRemove } = props;
    const keyId = `rselect-staff-${role.key}`;
    const roleName = expandRoleLocalized(role.key, role.name);
    return (
        <div className="flex -mx-3">
            <div className="w-full px-3 mb-1">
                <label htmlFor={`${keyId}-input`} className="text-sm font-semibold dark:text-white mb-1">
                    {roleName}
                </label>
                <AsyncSelect
                    id={keyId}
                    inputId={`${keyId}-input`}
                    className="w-full rounded-lg"
                    cacheOptions
                    defaultOptions={true}
                    loadOptions={loadUsersData}
                    onChange={(value, meta) => {
                        if (meta.action === "clear") {
                            onSelect(undefined);
                        } else if (meta.action === "select-option") {
                            const integrations = value.integrations.map((e) => ({
                                id: e.id,
                                type: e.type,
                                action: IntegrationInputAction.Upsert,
                            }));
                            onSelect({
                                id: value.id,
                                integrations: [
                                    ...integrations,
                                    {
                                        type: SHOWTIMES_USER,
                                        id: role.key,
                                        action: IntegrationInputAction.Upsert,
                                    },
                                ],
                                name: value.username,
                            });
                        }
                    }}
                    getOptionLabel={labelValuesUser}
                    filterOption={() => true}
                    placeholder="Cari user..."
                    classNamePrefix="rselect"
                    isClearable
                    isDisabled={props.disabled}
                />
                <button
                    className="px-2 py-1 mt-2 rounded-md bg-red-700 hover:bg-red-800 disabled:bg-red-800 disabled:animate-pulse text-white font-bold transition"
                    onClick={() => onRemove(role)}
                    disabled={props.disabled}
                >
                    Hapus
                </button>
            </div>
        </div>
    );
}

const searchAnime = (inputValue: string, callback: Function) => {
    client
        .query({
            query: AnilistSearchDocument,
            variables: {
                search: inputValue,
            },
        })
        .then(({ data, error }) => {
            const mergedResults: ExternalResultFragment[] = [];
            if (error?.message) {
                console.error(error.message);
                return;
            }
            if (data.search.shows.__typename === "SearchResults") {
                mergedResults.push(...data.search.shows.results);
            }
            if (data.search.books.__typename === "SearchResults") {
                mergedResults.push(...data.search.books.results);
            }
            callback(mergedResults);
        });
};

function optionValueAnime(data: ExternalResultFragment) {
    const { id, title, year } = data;
    const formatType = data.format;
    let titleYear = `${title}`;
    if (year && year !== -1) {
        titleYear = `${title} (${year})`;
    }
    return `${titleYear} [${formatType}] [${id}]`;
}

function generateRoleStatusAndAssigneeDefault(info: ExternalResultFragment) {
    const SHOWS_DEFAULTS: { roles?: ProjectInputRoles[]; assigness?: ProjectInputAssignee[] } = {
        roles: [
            { key: "TL", name: "Translator" },
            { key: "TLC", name: "Translation Checker" },
            { key: "ENC", name: "Encoder" },
            { key: "ED", name: "Editor" },
            { key: "TS", name: "Typesetter" },
            { key: "TM", name: "Timer" },
            { key: "QC", name: "Quality Checker" },
        ],
        assigness: [
            {
                key: "TL",
            },
            {
                key: "TLC",
            },
            {
                key: "ENC",
            },
            {
                key: "ED",
            },
            {
                key: "TS",
            },
            {
                key: "TM",
            },
            {
                key: "QC",
            },
        ],
    };
    const BOOKS_DEFAULTS: { roles?: ProjectInputRoles[]; assigness?: ProjectInputAssignee[] } = {
        roles: [
            { key: "TL", name: "Translator" },
            { key: "CL", name: "Cleaner" },
            { key: "RD", name: "Redrawer" },
            { key: "PR", name: "Proofreader" },
            { key: "TS", name: "Typesetter" },
            { key: "QC", name: "Quality Checker" },
        ],
        assigness: [
            {
                key: "TL",
            },
            {
                key: "CL",
            },
            {
                key: "RD",
            },
            {
                key: "PR",
            },
            {
                key: "TS",
            },
            {
                key: "QC",
            },
        ],
    };

    switch (info.format) {
        case SearchExternalType.Books:
            return BOOKS_DEFAULTS;
        case SearchExternalType.Shows:
            return SHOWS_DEFAULTS;
        case SearchExternalType.Movie:
            return SHOWS_DEFAULTS;
        default:
            return { roles: [], assigness: [] };
    }
}

class ServerProjectAdditionComponents extends React.Component<ProjectNewProps, ProjectNewState> {
    modalCb?: CallbackModal;

    constructor(props: ProjectNewProps) {
        super(props);
        this.submitNewProject = this.submitNewProject.bind(this);
        this.onAnimeSelection = this.onAnimeSelection.bind(this);
        this.triggerModal = this.triggerModal.bind(this);
        this.state = {
            isSubmitting: false,
        };
    }

    async submitNewProject(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (this.state.isSubmitting) {
            return;
        }
        this.setState({ isSubmitting: true });

        const { selected, episodeOverride, roles, assigness } = this.state;
        if (!selected) {
            return;
        }

        if (isNone(selected.count) && episodeOverride) {
            selected.count = episodeOverride;
        }

        if (isNone(selected.count)) {
            this.setState({ errTxt: "Total Episode tidak boleh kosong", isSubmitting: false });
            this.triggerModal();
            return;
        }

        if (episodeOverride <= 0) {
            this.setState({ errTxt: "Total Episode harus lebih dari 0", isSubmitting: false });
            this.triggerModal();
            return;
        }

        const { data, errors } = await client.mutate({
            mutation: MutateNewProjectDocument,
            variables: {
                data: {
                    external: {
                        ref: selected.id,
                        type: selected.format,
                        source: SearchSourceType.Anilist,
                    },
                    assignees: assigness || null,
                    roles: roles || null,
                    count: selected.count,
                },
            },
        });

        if (errors) {
            this.setState({ errTxt: errors.join("\n"), isSubmitting: false });
            this.triggerModal();
            return;
        }

        if (data.addProject.__typename === "Result") {
            this.setState({ errTxt: data.addProject.message, isSubmitting: false });
            this.triggerModal();
            return;
        }

        Router.push(`/admin/peladen/proyek/${data.addProject.id}`);
    }

    onAnimeSelection(data: ExternalResultFragment, action: ActionMeta<any>) {
        if (!["select-option", "clear"].includes(action.action)) {
            return;
        }
        if (action.action === "select-option") {
            const { roles, assigness } = generateRoleStatusAndAssigneeDefault(data);
            this.setState({ selected: data, roles, assigness });
        } else if (action.action === "clear") {
            this.setState({ selected: null, roles: [], assigness: [] });
        }
    }

    triggerModal() {
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    render() {
        const { selected, isSubmitting, roles } = this.state;
        const { user } = this.props;

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Tambah Proyek :: naoTimesUI</title>
                    <MetadataHead.SEO title="Tambah Proyek" urlPath="/admin/peladen/proyek/tambah" />
                </Head>
                <AdminLayout user={user} title="Tambah Proyek" active="projectpage">
                    <div className="container mx-auto px-6 pt-8 pb-4">
                        <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">
                                <div className="flex flex-col lg:flex-row py-1">
                                    <div className="icon h-5/6 p-1 lg:mr-3">
                                        {selected?.coverUrl ? (
                                            <img
                                                className="transition duration-300 ease-out transform hover:-translate-y-1"
                                                src={selected.coverUrl}
                                                alt="Anime Poster"
                                            />
                                        ) : (
                                            <div className="px-32 py-56 self-center lg:py-44 animate-pulse bg-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col pb-2 w-full">
                                        <form onSubmit={this.submitNewProject}>
                                            <div className="w-full flex-flex-col">
                                                <label className="text-xs font-semibold dark:text-white mb-1">
                                                    Anime
                                                </label>
                                                <AsyncSelect
                                                    id="anime-selector-reactive"
                                                    inputId="anime-selector-reactive-input"
                                                    className="w-full rounded-lg"
                                                    cacheOptions
                                                    defaultOptions={false}
                                                    loadOptions={searchAnime}
                                                    onChange={this.onAnimeSelection}
                                                    getOptionLabel={optionValueAnime}
                                                    filterOption={() => true}
                                                    placeholder="Cari Anime..."
                                                    classNamePrefix="rselect"
                                                    isClearable
                                                />
                                            </div>
                                            {selected && (
                                                <>
                                                    <div
                                                        className={`-mx-3 ${
                                                            isNone(selected.count) ? "" : "hidden"
                                                        }`}
                                                    >
                                                        <div className="w-full px-3 mb-1">
                                                            <label className="text-sm font-semibold dark:text-white mb-1">
                                                                Total Episode
                                                            </label>
                                                            <input
                                                                type="number"
                                                                placeholder="00"
                                                                value={this.state.episodeOverride}
                                                                onChange={(val) =>
                                                                    this.setState({
                                                                        episodeOverride: parseInt(
                                                                            val.target.value
                                                                        ),
                                                                    })
                                                                }
                                                                className="form-darkable w-full py-1"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="text-xs tracking-wide font-semibold text-red-400 mt-1">
                                                        Role akan dibuat otomatis, cukup periksa Server anda
                                                        untuk Role baru
                                                    </div>
                                                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-200 mt-2">
                                                        Staf
                                                    </div>
                                                    <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-2">
                                                        {roles &&
                                                            roles.map((role) => (
                                                                <AssigneeRole
                                                                    key={`staff-${role.key}`}
                                                                    role={role}
                                                                    disabled={isSubmitting}
                                                                    onSelect={(value) => {
                                                                        if (isSubmitting) {
                                                                            return;
                                                                        }
                                                                        const assigneeIdx =
                                                                            this.state.assigness.findIndex(
                                                                                (e) => e.key === role.key
                                                                            );
                                                                        if (assigneeIdx !== -1) {
                                                                            const newAssignee = [
                                                                                ...this.state.assigness,
                                                                            ];
                                                                            newAssignee[assigneeIdx] = {
                                                                                ...newAssignee[assigneeIdx],
                                                                                info: value,
                                                                            };
                                                                            this.setState({
                                                                                assigness: newAssignee,
                                                                            });
                                                                        }
                                                                    }}
                                                                    onRemove={(value) => {
                                                                        if (isSubmitting) {
                                                                            return;
                                                                        }
                                                                        const newAssignee = [
                                                                            ...this.state.assigness,
                                                                        ].filter((e) => e.key !== value.key);
                                                                        const newRoles = [
                                                                            ...this.state.roles,
                                                                        ].filter((e) => e.key !== value.key);

                                                                        this.setState({
                                                                            assigness: newAssignee,
                                                                            roles: newRoles,
                                                                        });
                                                                    }}
                                                                />
                                                            ))}
                                                    </div>
                                                    <div className="flex mt-2">
                                                        <button
                                                            type="submit"
                                                            className={`rounded px-3 py-2 text-white transition ${
                                                                this.state.isSubmitting
                                                                    ? "bg-green-500 cursor-not-allowed opacity-60"
                                                                    : "bg-green-600 hover:bg-green-700 opacity-100"
                                                            } duration-200 ease-in-out items-center flex flex-row focus:outline-none`}
                                                        >
                                                            {this.state.isSubmitting ? (
                                                                <>
                                                                    <LoadingCircle className="mt-0 ml-0" />
                                                                    <span className="font-semibold mt-0.5 -ml-1">
                                                                        Tambah
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <PlusIcon className="font-bold" />
                                                                    <span className="font-semibold mt-0.5">
                                                                        Tambah
                                                                    </span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ErrorModal onMounted={(callback) => (this.modalCb = callback)}>
                        {this.state.errTxt}
                    </ErrorModal>
                </AdminLayout>
            </>
        );
    }
}

export default function WrappedServerProjectAdditionComponents() {
    return (
        <AuthContext.Consumer>
            {(sess) => sess && <ServerProjectAdditionComponents user={sess} />}
        </AuthContext.Consumer>
    );
}
