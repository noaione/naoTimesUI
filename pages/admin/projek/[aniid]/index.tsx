import { GetServerSidePropsContext } from "next";
import React from "react";

export default function ProjekRedirect() {
    return <div className="hidden"></div>;
}

export async function getServerSideProps({ params }: GetServerSidePropsContext) {
    const { aniid } = params;
    return {
        redirect: {
            destination: `/admin/proyek/${aniid}`,
            permanent: true,
        },
    };
}
