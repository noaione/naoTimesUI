import React from "react";

import { NextServerSideContextWithSession } from "../../../lib/session";

export default function ProjekRedirect() {
    return <div className="hidden"></div>;
}

export async function getServerSideProps({ params }: NextServerSideContextWithSession) {
    const { aniid } = params;
    return {
        redirect: {
            destination: `/admin/proyek/${aniid}`,
            permanent: true,
        },
    };
}
