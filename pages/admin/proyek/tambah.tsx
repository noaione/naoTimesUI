import Head from "next/head";
import React from "react";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";

import withSession from "../../../lib/session";

import { UserProps } from "../../../models/user";

interface ProjectNewState {
    aniId?: string;
    episode?: number;
    poster?: string;
    staffTL?: string;
    staffTLC?: string;
    staffENCC?: string;
    staffED?: string;
    staffTM?: string;
    staffTS?: string;
    staffQC?: string;
}

interface ProjectNewProps {
    user?: UserProps & { loggedIn: boolean };
}

class ProjectAdditionComponents extends React.Component<ProjectNewProps, ProjectNewState> {
    constructor(props: ProjectNewProps) {
        super(props);
    }

    render() {
        const { user } = this.props;

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Tambah Proyek :: naoTimesUI</title>
                    <MetadataHead.SEO title="Tambah Proyek" urlPath="/admin/proyek/tambah" />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title="Tambah Proyek" active="projectpage">
                    <div className="container mx-auto px-6 py-7"></div>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ req, _s }) {
    const user = req.session.get("user");

    if (!user) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return { props: { user: { loggedIn: true, ...user } } };
});

export default ProjectAdditionComponents;
