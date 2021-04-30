import React from "react";

export default function ProjectHomeRedirect() {
    return <div className="hidden"></div>;
}

export async function getServerSideProps() {
    return {
        redirect: {
            destination: `/admin/proyek`,
            permanent: true,
        },
    };
}
