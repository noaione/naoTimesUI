import React from "react";

export default function LoginSidebar() {
    return (
        <>
            <div className="hidden md:block w-1/2 bg-gradient-to-br from-indigo-500 to-pink-300 p-10">
                <img
                    className="icon h-1/3 mb-2 ring-offset-indigo-800 transition-shadow duration-500 ease-in-out stack-shadow-6 hover:stack-shadow-3"
                    src="/assets/img/nt192.png"
                />
                <div className="font-extrabold text-white text-3xl mb-3 mt-5">
                    <span className="bg-gradient-to-br from-indigo-800 to-indigo-600 transition-shadow duration-500 ease-in-out rounded-none px-2 py-1 stack-shadow-3 hover:stack-shadow-5 ring-offset-gray-800">
                        naoTimes
                    </span>
                </div>
                <div className="font-semibold text-lg text-gray-100 mb-4">
                    <p>Sebuah Bot Multifungsi dengan fitur utama tracking garapan Fansub</p>
                </div>
                <a
                    className="font-semibold text-lg text-white hover:text-gray-200 transition-all duration-400 ease-in-out rounded-md bg-indigo-800 hover:bg-indigo-700 px-2 py-1 stack-shadow-2 hover:stack-shadow-3 ring-offset-indigo-900 mr-1"
                    href="https://naoti.me/invite"
                    target="_blank"
                    rel="noreferrer"
                >
                    Invite!
                </a>
                <a
                    className="font-semibold text-lg text-white hover:text-gray-200 transition-all duration-400 ease-in-out rounded-md bg-indigo-800 hover:bg-indigo-700 px-2 py-1 stack-shadow-2 hover:stack-shadow-3 ring-offset-indigo-900"
                    href="https://discord.gg/7KyYecn"
                    target="_blank"
                    rel="noreferrer"
                >
                    Support Server
                </a>
            </div>
        </>
    );
}
