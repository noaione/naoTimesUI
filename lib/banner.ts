export interface BannerData {
    id: string;
    message: string;
    shortMessage: string;
    link?: string;
}

const BannerSets: BannerData[] = [
    {
        id: "20210501-0000",
        message: "Versi 1.0.0! naoTimesUI sekarang migrasi dari EJS ke Next.JS (React)",
        shortMessage: "Versi 1.0.0 telah dirilis",
        link: "https://github.com/noaione/naoTimesUI/releases/tag/1.0.0",
    },
    {
        id: "20210504-1626",
        message: "Fitur baru! UI FansubRSS mulai sekarang dapat dipakai",
        shortMessage: "FansubRSS dapat dipakai!",
        link: "/admin/fansubrss",
    },
    {
        id: "20210505-1745",
        message: "Penambah Kebijakan Privasi dan Syarat dan Ketentuan",
        shortMessage: "Penambah Kebijakan Privasi dan TOS",
        link: "https://naoti.me/legal",
    },
    {
        id: "20210626-1200",
        message: "Bot naoTimes telah terverifikasi oleh Discord",
        shortMessage: "Bot naoTimes terverifikasi!",
        link: "https://naoti.me/blog/2021/06/26/verified",
    },
    {
        id: "20210701-1200",
        message: "Tambah atau hapus episode untuk proyek anda lewat naoTimesUI",
        shortMessage: "Ubah total episode via naoTimesUI",
        link: "/admin/proyek",
    },
    {
        id: "20210806-1500",
        message: "Inisiasi, batalkan, dan putuskan kolaborasi sebuah proyek melalui naoTimesUI",
        shortMessage: "Kolaborasi via naoTimesUI",
        link: "/admin/proyek/kolaborasi",
    },
    {
        id: "20211123-1100",
        message: "Pembaharuan Kebijakan Privasi naoTimes",
        shortMessage: "Pembaharuan Kebijakan Privasi",
        link: "https://naoti.me/privasi",
    },
    {
        id: "20221024-1700",
        message: "Login ke WebUI sekarang lebih mudah dengan Discord OAuth2!",
        shortMessage: "Login dengan Discord!",
        link: "https://panel.naoti.me/admin/tentang#versi-1-4-0",
    },
];

export default BannerSets;
