# 🎓 Makin Cerdas Makin Sukses | Arena Game Edukasi (SD, SMP & SMA)

**Makin Cerdas Makin Sukses** adalah platform game edukasi dan latihan ujian berbasis web untuk pelajar **SD, SMP, hingga SMA/MA/SMK sederajat**. Mencakup materi **Kurikulum Merdeka**, **Kurikulum 2013 (K13)**, latihan **TKA**, **ANBK**, **Ujian Sekolah**, **UTBK-SNBT**, **Arena 3 Bahasa (Inggris CEFR, Jepang JLPT, Mandarin YCT/HSK dengan 3.150+ kosakata terverifikasi / 1.053 konsep × 3 bahasa)** lengkap dengan animasi adaptif per jenjang, **Studio Musik (Custom & Rekomendasi)**, fitur **Kritik & Saran**, serta **Dashboard Visualisasi Trafik & Masukan** di Cloudflare Pages.

👉 **Mainkan Langsung (Cloudflare Pages HTTPS)**: https://makincerdasmakinsukses.pages.dev/
👉 **Dashboard Visualisasi Trafik & Kritik Saran**: https://makincerdasmakinsukses.pages.dev/statistik
👉 **Repositori GitHub**: https://github.com/bayuafriyan/game-afriyan
👉 **Mirror GitHub Pages**: https://bayuafriyan.github.io/game-afriyan/

---

## 🎮 8 Pilihan Mode Game & Latihan

1. **🌍 Bahasa Inggris, Jepang & Mandarin (3.150+ Kosakata & 270 Kalimat Grammar)**: Dilengkapi filter per topik, latihan **Speaking** interaktif pakai mikrofon + audio native, **Writing** (kanvas tracing aksara Jepang/Mandarin & ejaan Inggris), **Susun Kalimat & Grammar 2 Model** (susun blok kata & ketik langsung dalam bahasa asli maupun terjemahan EYD V), **Kuis Kosakata** seimbang, **Dialog NPC** di tiap jenjang, dan **Kamus 3 Bahasa** dengan pencarian instan.
2. **🎯 Simulasi TKA & Ujian CBT**: Latihan ujian dengan timer, navigasi nomor soal, tombol tandai ragu, skor skala 0 hingga 100, serta pembahasan lengkap setiap nomor.
3. **⚡ Cepat Tepat**: Kuis interaktif dengan filter semua mata pelajaran sesuai jenjang, bantuan *50:50*, *Bekukan Waktu*, *Lewati*, combo, dan pengacakan posisi jawaban A/B/C/D seimbang.
4. **🚀 Meteor Hitung**: Game aksi Canvas 2D! Tembak jatuh meteor berisi soal matematika (aritmetika SD, aljabar/akar SMP, logaritma/turunan/matriks SMA) menggunakan laser.
5. **🃏 Memori Pasangan**: Kartu animasi 3D flip untuk menjodohkan pasangan pengetahuan.
6. **🧩 Susun Kata**: Rangkai huruf acak menjadi istilah sains, sejarah, geografi, atau ekonomi.
7. **⚖️ Benar atau Mitos**: Tantangan refleks cepat memilah fakta ilmiah vs mitos populer.
8. **🔗 Rantai Ilmu**: Sortir kartu konsep ke portal kategori yang tepat.

---

## 📊 Dashboard Visualisasi Trafik & Kritik Saran (`/statistik`)

- **Cloudflare Web Analytics + D1 Telemetry**: Halaman utama dan arena game merekam kunjungan harian, pengunjung unik (ter-hash SHA-256 harian tanpa menyimpan IP asli), perangkat (Mobile/Desktop), negara, serta jumlah ronde game dimulai/diselesaikan beserta skornya ke database **Cloudflare D1 (`makincerdasmakinsukses-db`)**.
- **Visualisasi Grafik Interaktif**: Tersedia langsung di **`/statistik`** (atau tombol ikon grafik 📊 di bilah atas aplikasi) berisi kartu KPI utama, grafik batang tren 14 hari terakhir, grafik popularitas 8 mode game, grafik donut jenjang `SD`/`SMP`/`SMA` & perangkat, distribusi bintang rating & kategori kritik/saran, daftar filterable kritik & saran terbaru, aktivitas permainan terbaru, serta tombol unduh CSV.
- **Integrasi Repositori GitHub**: Root proyek (`_worker.js`, `_routes.json`, `_headers`) sudah siap untuk build otomatis Cloudflare Pages dari `bayuafriyan/game-afriyan` branch `main`, disertai workflow [`.github/workflows/cloudflare-pages.yml`](.github/workflows/cloudflare-pages.yml).

---

## 💬 Fitur Kritik & Saran

- Tersedia langsung lewat tombol **💬 Kritik & Saran** di bilah atas (*topbar*) maupun bagian bawah beranda.
- Pengunjung (Siswa, Orang Tua, Guru, maupun Umum) dapat memilih peran, kategori masukan, penilaian 1 sampai 5 bintang, dan melihat masukan terbaru.
- Terhubung langsung ke database **Cloudflare D1 (`makincerdasmakinsukses-db`)** melalui `/api/feedback`, serta tetap berfungsi dengan cadangan `localStorage` jika dibuka secara offline.

---

## 🎨 Tema, Font & Animasi Adaptif Per Jenjang

| Jenjang | Tema Visual | Font Utama | Animasi Latar Canvas |
| :--- | :--- | :--- | :--- |
| **SD (Kelas 1 hingga 6)** | Taman Langit Ceria | `Fredoka` + `Quicksand` | Awan lembut & partikel cerah |
| **SMP (Kelas 7 hingga 9)** | Akademi Petualang | `Rubik` + `Poppins` | Hexagon geometris dinamis |
| **SMA/SMK (Kelas 10 hingga 12)** | Arena Juara | `Chakra Petch` + `Rajdhani` | Grid & pola kompetisi fokus |

---

## 🎵 Studio Musik (Rekomendasi & Custom Sendiri)

- **4 Musik Rekomendasi Bawaan** (Web Audio API synthesizer, ringan & bebas hak cipta): *Petualangan Ceria (SD)*, *Cyber-Lab Lo-Fi (SMP)*, *Fokus TKA & Ujian (SMA)*, dan *Arcade Semangat*.
- **Custom Musik Sendiri**: Unggah file audio lokal dari HP/laptop (`.mp3`, `.wav`, `.ogg`, `.m4a`, maksimal 50 MB) atau tempel tautan URL **HTTPS** publik langsung, lengkap dengan validasi tipe/domain aman, Play/Pause, Volume Slider, dan animasi equalizer.

---

## 🛡️ Keamanan Siber & Privasi Berlapis

- **Enkripsi & Redirect HTTPS**: Seluruh lalu lintas wajib menggunakan HTTPS dengan header HSTS (`preload`), sertifikat TLS modern agar aman dibuka di Chrome Android, iOS, maupun desktop.
- **Header Pertahanan Browser**: Mengirim `Content-Security-Policy` ketat (`script-src 'self' https://static.cloudflareinsights.com`, `connect-src 'self' https://cloudflareinsights.com https://*.cloudflareinsights.com`, `object-src 'none'`, `frame-ancestors 'none'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Cross-Origin-Opener-Policy: same-origin`, dan `Cross-Origin-Resource-Policy: same-origin`.
- **Proteksi Sisi Server (`_worker.js`)**: Memblokir pemindaian path sensitif (`/.env`, `/.git`, `/.github`, `/_worker.js`, `/_routes.json`, `/_headers`, `/wp-login.php`, ekstensi skrip server), membatasi metode HTTP (`405`), menegakkan proteksi CSRF (`Origin` & `Sec-Fetch-Site`), batas muatan `4 KB` (`413` feedback) / `1 KB` (telemetry), honeypot & jeda interaksi anti-bot, deduplikasi, query parameterized D1 anti-SQLi, serta rate-limit IP ter-hash SHA-256 harian.
- **Sanitasi Sisi Klien**: Proteksi anti-XSS berbasis DOM `textContent` di seluruh toast, daftar masukan, dan dashboard grafik SVG, sanitasi data `localStorage` (`sanitizeProfile`), pembatas level anti-DoS, proteksi formula CSV export, serta pemblokiran tautan HTTP polos dan IP privat/SSRF pada pemutar URL musik.
- **Soal Latihan Mandiri**: Seluruh soal latihan TKA, ANBK, Ujian Sekolah, dan UTBK adalah materi latihan edukatif yang mengacu pada kisi-kisi kurikulum nasional, bukan naskah soal resmi pemerintah.
