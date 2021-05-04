import fs from "fs";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

const fallbackAbout = `# naoTimes dan naoTimesUI
merupakan *pet-project* milik N4O.

Dibuat tahun 2019 lalu, naoTimes merupakan sebuah Bot yang mengambil inspirasi dari Aquarius untuk tracking garapan Fansub.
Website ini sendiri mulai dibuat Maret 2021 lalu, dengan niat sebagai alternatif bagi yang kurang ngerti pakai botnya gimana.
Dengan merilis website ini juga, semua orang dapat daftar ke fitur Showtimes tanpa perlu meminta ke saya sendiri 😊

Website ini telah melewati beberapa iterasi sebelum akhirnya nyantol sama salah satu framework:
- Next.js
- Svelte
- SSR Rendering w/ ExpressJS + EJS **[Versi lama]**
- Next.js (lagi) **[Versi sekarang]**

Versi yang sekarang anda liat merupakan versi Next.js, setelah belajar-belajar React dari buat web VTuber API (https://vtuber.ihateani.me)

Beberapa alasan pindah ke ReactJS gampang sih:
1. Lebih gampang kontrol perubahan
2. Berbasis Komponen, jadi bisa pake ulang lagi komponen yang sama untuk laman lain
3. Support komunitasnya lumayan banyak
4. ~~Bisa hosting gratis di Vercel, paling penting ini :)~~

Dan alasan gak mau pake ReactJS/Next.js:
1. RIBET ANJGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
2. Untuk session handling agak scuffed, tapi bisa pake [next-iron-session](https://github.com/vvo/next-iron-session)
3. Berat, Virtual DOM itu lumayan makan memori.

Walaupun ada beberapa hal negatif tentang React, pake React sendiri jadi mempermudah hidup.
Awalnya pengen nyoba Vue.js sih, tapi kurang cocok dengan use-case yang tak inginkan.

### Kredit
Website ini menggunakan teknologi berikut:
- [Next.js](https://nextjs.org/) oleh Vercel, sebagai Framework utama
- [ReactJS](https://reactjs.org/) oleh Facebook, sebagai library utama untuk buat website ini
- [TailwindCSS](https://tailwindcss.com/) oleh TailwindLabs, sebagai styling website
- [PostCSS](https://postcss.org/), sebagai engine CSS yang tak pakai
- [MongoDB](https://www.mongodb.com/) oleh MongoDB Inc. sebagai Database yang dipakai
- [Mongoose](https://mongoosejs.com/) oleh Automattic, sebagai connector database MongoDB dengan sistem ODM
- [TypeScript](https://www.typescriptlang.org/) oleh Microsoft, sebagai bahasa yang tak pakai untuk nulis website ini
- [Webpack](https://webpack.js.org/), sebagai bundler untuk website ini
- [ReactMarkdown](https://github.com/remarkjs/react-markdown) oleh Remark, sebagai Markdown engine yang tak pakai untuk render teks ini
- [Embed Visualizer](https://github.com/leovoel/embed-visualizer) oleh leovoel, digunakan sebagai basis untuk Pratinjau pesan/embed di FansubRSS
- [Vercel](https://vercel.com), sebagai tempat hosting web ini :heart:

Makasih juga untuk manusia-manusia berikut:
- Kresendo (Bantuan pemilihan kata, ide, dan lain-lain)
- *Anon* 1 (Bantuan translasi untuk Embed versi Jawa)
- *Anon* 2 (Bantuan translasi untuk Embed versi Sunda)
- Semua orang yang mencoba dan menyebarkan naoTimes :heart:

:heart: {{currentYear}} - naoTimesDev a.k.a N4O
`;

const fallbackChangelog = `# Perubahan Website

## Versi 0.1.0

Kodenama: [Inugami Korone](https://www.youtube.com/channel/UChAnqc_AY5_I3Px5dig3X1Q)

- Versi pertama dari website ini
- 📺 Menambah Proyek Baru
- 👀 Melihat Proyek yang masih dikerjakan maupun yang sudah
- 📈 Statistik
- ✏ Merubah status episode dengan mudah
- 👯‍♂️ Merubah staff (masih harus tetap mengambil User Discord ID)
- ✨ Embed untuk Website! (Akses di [Pengaturan](/admin/atur))

## Versi 0.2.0

Kodenama: /shrug

- 👤 Menambah/Menghapus Admin
- 📺 Menambah/Menghapus Alias untuk Proyek
- 💥 Menghapus server dari Database

## Versi 1.0.0

Kodenama: [To the Moon](https://en.wikipedia.org/wiki/GameStop_short_squeeze)

- 🚀 Migrasi ke [Next.js](https://nextjs.org/)
- 📰 Penambahan laman FansubRSS **[Akan datang]**
- 🔃 *Loading indicator* ketika mengsubmit sesuatu
- 🚫 Menulis parafrasa tambahan sebelum menghapus server
- 🕶 Dark mode segalanya, hampir semua komponen memiliki versi "gelap"-nya

## Versi 1.1.0

Kodenama: *Tidak ada*

- 📰 Penambahan FansubRSS di Website
- 🔍 Penambahan tooling untuk memeriksa error lebih cepat.
- 🐛 Memperbaiki beberapa bugs
`;

export function getAboutContent() {
    const fullPath = join(postsDirectory, "about.md");
    try {
        const fileContents = fs.readFileSync(fullPath, "utf-8");
        return fileContents.toString();
    } catch (e) {
        return fallbackAbout;
    }
}

export function getChangelogContent() {
    const fullPath = join(postsDirectory, "changelog.md");
    try {
        const fileContents = fs.readFileSync(fullPath, "utf-8");
        return fileContents.toString();
    } catch (e) {
        return fallbackChangelog;
    }
}
