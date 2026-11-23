# 🎓 CerdasPlay — Arena Game Edukasi SD, SMP & SMA

**CerdasPlay** adalah platform game edukasi berbasis web untuk pelajar **SD, SMP, hingga SMA/SMK sederajat**. Dirancang agar belajar tidak membosankan dengan animasi interaktif, efek suara (Web Audio API), sistem XP & level, lencana prestasi, misi harian, serta **6 pilihan mini-game** yang otomatis menyesuaikan kurikulum jenjang pendidikan yang dipilih.

---

## 🎮 6 Pilihan Mini-Game

1. **⚡ Cepat Tepat Arena** — Kuis interaktif dengan filter mata pelajaran (Matematika, IPA, IPS, Bahasa), timer animasi, sistem combo, bantuan (*50:50*, *Bekukan Waktu*, *Lewati*), dan pembahasan instan.
2. **🚀 Meteor Hitung** — Game aksi Canvas 2D! Tembak jatuh meteor berisi soal matematika (aritmetika SD, aljabar/akar SMP, logaritma/turunan/matriks SMA) menggunakan laser sebelum menabrak perisai planet.
3. **🃏 Memori Pasangan** — Game kartu 3D flip yang mencocokkan pasangan pengetahuan (provinsi ↔ ibu kota, rumus kimia ↔ senyawa, besaran ↔ satuan, trigonometri ↔ nilai).
4. **🧩 Susun Kata Cerdas** — Rangkai huruf acak menjadi istilah sains, geografi, sejarah, atau ekonomi dari petunjuk yang diberikan (mendukung klik & ketik keyboard).
5. **⚖️ Benar atau Mitos?** — Tantangan refleks cepat memilah fakta ilmiah vs mitos populer lengkap dengan penjelasan singkat.
6. **🔗 Rantai Ilmu** — Game sortir kategori pengetahuan ke portal yang tepat (Herbivora/Karnivora/Omnivora, Wujud Benda, Unsur/Senyawa/Campuran, Asam/Basa/Netral, Ekonomi Mikro/Makro/Akuntansi).

---

## ✨ Fitur Gamifikasi & Anti-Bosan

- **Switch Jenjang Instan (SD / SMP / SMA)** di navigasi atas — seluruh soal & mini-game langsung menyesuaikan tingkat kesulitan.
- **Animasi & Efek Visual** — Latar bintang kosmik bergerak, kartu 3D flip, ledakan partikel, laser arcade, dan hujan konfeti saat menang atau naik level.
- **Efek Suara Synthesized (Web Audio API)** — Tanpa file audio eksternal, ringan, dan bisa di-mute kapan saja.
- **Profil, Avatar, XP, Level & 8 Lencana Prestasi** — Tersimpan otomatis di `localStorage` browser.
- **Misi Harian (Daily Quests)** — Bonus XP setiap hari.
- **Zero Dependencies** — Murni HTML5, CSS3, dan JavaScript ES Modules, siap langsung dijalankan di browser atau di-hosting gratis via **GitHub Pages**.

---

## 🚀 Cara Menjalankan Secara Lokal

Karena menggunakan ES Modules (`type="module"`), jalankan lewat server lokal sederhana:

```bash
# Menggunakan Node.js (npx)
npx serve .

# Atau menggunakan Python
python -m http.server 8080
```

Lalu buka `http://localhost:3000` (atau `http://localhost:8080`) di browser.

---

## 🌐 Cara Publish Online Gratis di GitHub Pages

1. Buka repository ini di GitHub → menu **Settings** → **Pages**.
2. Pada bagian **Build and deployment**, pilih **Source: Deploy from a branch**.
3. Pilih branch **`main`** dan folder **`/ (root)`**, lalu klik **Save**.
4. Tunggu 1–2 menit, game akan langsung bisa dimainkan online di `https://bayuafriyan.github.io/game-afriyan/`.
