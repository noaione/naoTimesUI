import React from "react";
import { RoleColorPalette } from "./ColorMap";

interface RolePopupProps {
    title: "TL" | "TLC" | "ENC" | "ED" | "TM" | "TS" | "QC";
    popupText: string;
}

class RolePopup extends React.Component<RolePopupProps> {
    constructor(props: RolePopupProps) {
        super(props);
    }

    render() {
        const { title, popupText } = this.props;

        const extraColor = RoleColorPalette[title];
        return (
            <>
                <div
                    className={
                        "cursor-default group relative rounded border px-1 inline-block align-middle " +
                        extraColor
                    }
                    title={popupText}
                >
                    <span>{title}</span>
                    <div
                        className={
                            "block z-50 rounded-sm px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow border text-xs absolute whitespace-nowrap left-1/2 transform bottom-6 text-center -translate-x-1/2 " +
                            extraColor
                        }
                    >
                        {popupText}
                    </div>
                </div>
            </>
        );
    }
}

export default RolePopup;
