import React from "react";
import Head from "next/head";

import MetadataHead from "../components/MetadataHead";

class ServerErrorPage extends React.Component {
    render() {
        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>500 :: naoTimesUI</title>
                    <MetadataHead.SEO title="500" description="Terjadi kesalahan internal" />
                </Head>
                <div className="bg-gray-900 text-white h-screen w-screen grid grid-cols-1 lg:grid-cols-2 lg:items-center">
                    <div className="p-4 lg:p-10">
                        <img
                            className="rounded-lg"
                            src="/assets/img/bocchi_aaaaaa.gif"
                            width={786}
                            height={491}
                            alt="Your friendly bocchi crying image"
                        />
                        <div className="block mt-8 text-center lg:hidden">
                            <div className="flex flex-row gap-2 justify-center mb-4">
                                <h1 className="text-3xl font-bold">Oops</h1>
                                <h3 className="text-lg">{`(Kode 500)`}</h3>
                            </div>
                            <p>Sesuatu meletup saat melakukan proses yang anda inginkan.</p>
                            <p>Sementara WebAdmin memperbaiki masalah, nikmati gambar Bocchi berikut.</p>
                        </div>
                    </div>
                    <div className="hidden lg:block lg:p-4">
                        <div className="flex flex-row gap-2 mb-3">
                            <h1 className="text-3xl font-bold">Oops</h1>
                            <h3 className="text-lg">{`(Kode 500)`}</h3>
                        </div>
                        <p>Sesuatu meletup saat melakukan proses yang anda inginkan.</p>
                        <p>Sementara WebAdmin memperbaiki masalah, nikmati gambar Bocchi berikut.</p>
                    </div>
                </div>
            </>
        );
    }
}

export default ServerErrorPage;
