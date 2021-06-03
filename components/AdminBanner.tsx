import React from "react";
import Link from "next/link";
import { uniq } from "lodash";

import BullhornOutlineIcon from "mdi-react/BullhornOutlineIcon";

import Banner, { BannerData } from "../lib/banner";

interface BannerHeaderState {
    show: boolean;
}

class BannerHeader extends React.Component<BannerData, BannerHeaderState> {
    constructor(props: BannerData) {
        super(props);
        this.dismissLink = this.dismissLink.bind(this);
        this.state = {
            show: true,
        };
    }

    dismissLink() {
        const toBeAdded = this.props.id;
        const ntuiBanner: string[] = JSON.parse(localStorage.getItem("ntui.banners")) ?? [];
        ntuiBanner.push(toBeAdded);
        const uniqBanner = uniq(ntuiBanner);
        localStorage.setItem("ntui.banners", JSON.stringify(uniqBanner));
        this.setState({ show: false });
    }

    render() {
        if (!this.state.show) {
            return null;
        }
        return (
            <>
                <div className="bg-indigo-600">
                    <div className="py-3 px-3 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="w-0 flex-1 flex items-center">
                                <span className="flex p-2 rounded-lg bg-indigo-800">
                                    <BullhornOutlineIcon aria-hidden="true" className="h-6 w-6 text-white" />
                                </span>
                                <p className="ml-3 font-medium text-white truncate">
                                    <span className="md:hidden">{this.props.shortMessage}</span>
                                    <span className="hidden md:inline">{this.props.message}</span>
                                </p>
                            </div>
                            {this.props.link && (
                                <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                                    <Link href={this.props.link} passHref>
                                        <a className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                                            Lebih lanjut
                                        </a>
                                    </Link>
                                </div>
                            )}
                            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                                <button
                                    type="button"
                                    className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                                    onClick={this.dismissLink}
                                >
                                    <span className="sr-only">Tutup</span>
                                    <span className="font-semibold px-2 text-white" aria-hidden="true">
                                        x
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

interface BannerState {
    banners: BannerData[];
    toRemove: string[];
}

class AdminBanner extends React.Component<{}, BannerState> {
    constructor(props) {
        super(props);
        this.state = {
            banners: [],
            toRemove: [],
        };
    }

    componentDidMount() {
        const ntuiBanner: string[] = JSON.parse(localStorage.getItem("ntui.banners")) ?? [];

        const unlookedBanner = Banner.filter((r) => !ntuiBanner.includes(r.id));
        this.setState({ banners: unlookedBanner });
    }

    render() {
        if (this.state.banners.length < 1) {
            return null;
        }

        return (
            <div className="flex flex-col w-full">
                {this.state.banners.map((banner) => {
                    return <BannerHeader key={`banner-${banner.id}`} {...banner} />;
                })}
            </div>
        );
    }
}

export default AdminBanner;
