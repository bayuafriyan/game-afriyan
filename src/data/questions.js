// Bank Soal Lengkap Kurikulum Merdeka, K13, TKA (2025/2026), ANBK, Ujian Sekolah & UTBK-SNBT
// Mencakup semua mata pelajaran utama jenjang SD, SMP, dan SMA/SMK sederajat

export const SUBJECT_LIST = {
  SD: ['Semua', 'Matematika', 'Bahasa Indonesia', 'IPAS (IPA)', 'IPAS (IPS)', 'Pendidikan Pancasila', 'Bahasa Inggris', 'Seni & PJOK'],
  SMP: ['Semua', 'Matematika', 'Bahasa Indonesia', 'IPA', 'IPS', 'Bahasa Inggris', 'Pendidikan Pancasila', 'Informatika', 'Seni & Prakarya'],
  SMA: ['Semua', 'Matematika', 'Matematika Lanjut', 'Bahasa Indonesia', 'Bahasa Inggris', 'Fisika', 'Kimia', 'Biologi', 'Ekonomi', 'Sosiologi', 'Geografi', 'Sejarah', 'Pendidikan Pancasila', 'Informatika & PKWU'],
};

export const TKA_SUBJECTS = {
  SD: ['Matematika', 'Bahasa Indonesia'],
  SMP: ['Matematika', 'Bahasa Indonesia'],
  SMA: ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Matematika Lanjut', 'Fisika', 'Kimia', 'Biologi', 'Ekonomi', 'Sosiologi', 'Geografi', 'Sejarah', 'Pendidikan Pancasila'],
};

export const QUIZ_BANK = {
  SD: [
    // Matematika (TKA SD, ANBK, Kurikulum Merdeka & K13)
    { subject: 'Matematika', tag: 'TKA SD', curriculum: 'TKA & Kurikulum Merdeka', isTka: true, q: 'Ibu membeli 3 kantong apel. Setiap kantong berisi 12 apel. Jika 8 apel diberikan kepada tetangga, sisa apel Ibu adalah...', options: ['24 buah', '28 buah', '30 buah', '32 buah'], answer: 1, exp: 'Total apel = 3 × 12 = 36 buah. Setelah diberikan 8 buah, sisanya 36 - 8 = 28 buah.' },
    { subject: 'Matematika', tag: 'TKA SD', curriculum: 'TKA & Kurikulum Merdeka', isTka: true, q: 'Sebuah taman berbentuk persegi panjang memiliki panjang 15 m dan lebar 8 m. Berapakah luas taman tersebut?', options: ['46 m²', '92 m²', '120 m²', '135 m²'], answer: 2, exp: 'Luas persegi panjang = panjang × lebar = 15 × 8 = 120 m².' },
    { subject: 'Matematika', tag: 'ANBK Numerasi', curriculum: 'ANBK', isTka: true, q: 'Pecahan yang nilainya paling besar di antara berikut adalah...', options: ['1/4', '2/5', '3/4', '1/2'], answer: 2, exp: '1/4 = 0,25; 2/5 = 0,40; 1/2 = 0,50; dan 3/4 = 0,75 (paling besar).' },
    { subject: 'Matematika', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'FPB (Faktor Persekutuan Terbesar) dari 18 dan 24 adalah...', options: ['3', '6', '8', '12'], answer: 1, exp: 'Faktor 18 = 1,2,3,6,9,18; Faktor 24 = 1,2,3,4,6,8,12,24. FPB-nya adalah 6.' },
    { subject: 'Matematika', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Sebuah bus berangkat pukul 07.25 dan tiba pukul 09.10. Lama perjalanan bus tersebut adalah...', options: ['1 jam 35 menit', '1 jam 45 menit', '2 jam 15 menit', '1 jam 55 menit'], answer: 1, exp: 'Dari 07.25 ke 08.25 = 1 jam; dari 08.25 ke 09.10 = 45 menit. Total 1 jam 45 menit.' },
    { subject: 'Matematika', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Volume sebuah kubus yang memiliki panjang rusuk 5 cm adalah...', options: ['25 cm³', '75 cm³', '125 cm³', '150 cm³'], answer: 2, exp: 'Volume kubus = s × s × s = 5 × 5 × 5 = 125 cm³.' },
    { subject: 'Matematika', tag: 'TKA SD', curriculum: 'TKA', isTka: true, q: 'Nilai rata-rata dari ulangan Rina: 80, 90, 70, dan 80 adalah...', options: ['75', '80', '82', '85'], answer: 1, exp: 'Jumlah = 80+90+70+80 = 320. Rata-rata = 320 ÷ 4 = 80.' },

    // Bahasa Indonesia (TKA SD, ANBK Literasi)
    { subject: 'Bahasa Indonesia', tag: 'TKA SD', curriculum: 'TKA & Kurikulum Merdeka', isTka: true, q: 'Ide pokok atau gagasan utama dalam suatu paragraf disebut juga...', options: ['Kalimat penjelas', 'Pokok pikiran', 'Kata sambung', 'Tanda baca'], answer: 1, exp: 'Gagasan utama/pokok pikiran adalah inti bahasan yang dikembangkan oleh kalimat penjelas.' },
    { subject: 'Bahasa Indonesia', tag: 'TKA SD', curriculum: 'TKA & Kurikulum Merdeka', isTka: true, q: 'Manakah penggunaan huruf kapital yang paling benar?', options: ['Rani berlibur ke pulau bali.', 'Rani berlibur ke Pulau Bali.', 'rani Berlibur ke Pulau bali.', 'Rani berlibur Ke Pulau Bali.'], answer: 1, exp: 'Huruf kapital digunakan pada awal kalimat dan nama geografis (Pulau Bali).' },
    { subject: 'Bahasa Indonesia', tag: 'ANBK Literasi', curriculum: 'ANBK', isTka: true, q: 'Arti ungkapan "banting tulang" pada kalimat "Ayah bekerja banting tulang demi keluarga" adalah...', options: ['Patah tulang', 'Bekerja sangat keras', 'Berolahraga pagi', 'Bermalas-malasan'], answer: 1, exp: 'Ungkapan "banting tulang" bermakna bekerja keras dengan sekuat tenaga.' },
    { subject: 'Bahasa Indonesia', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Antonim (lawan kata) dari kata "Dermawan" adalah...', options: ['Ramah', 'Kikir', 'Sabar', 'Jujur'], answer: 1, exp: 'Dermawan berarti suka memberi, sedangkan antonimnya adalah kikir (pelit).' },
    { subject: 'Bahasa Indonesia', tag: 'TKA SD', curriculum: 'TKA', isTka: true, q: 'Kata tanya yang tepat untuk menanyakan alasan terjadinya suatu peristiwa adalah...', options: ['Siapa', 'Di mana', 'Mengapa', 'Kapan'], answer: 2, exp: 'Kata tanya "Mengapa" digunakan untuk menanyakan sebab atau alasan.' },
    { subject: 'Bahasa Indonesia', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Kalimat "Adik membaca buku cerita di teras." Kata "buku cerita" berkedudukan sebagai...', options: ['Subjek', 'Predikat', 'Objek', 'Keterangan'], answer: 2, exp: 'Pola kalimat: Adik (S) - membaca (P) - buku cerita (O) - di teras (K).' },

    // IPAS (IPA)
    { subject: 'IPAS (IPA)', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Proses tumbuhan hijau membuat makanan dengan bantuan cahaya matahari disebut...', options: ['Respirasi', 'Fotosintesis', 'Metamorfosis', 'Evaporasi'], answer: 1, exp: 'Fotosintesis mengubah air dan CO₂ menjadi glukosa dan oksigen dengan bantuan klorofil.' },
    { subject: 'IPAS (IPA)', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Hewan yang mengalami metamorfosis sempurna adalah...', options: ['Belalang', 'Kupu-kupu', 'Kecoak', 'Jangkrik'], answer: 1, exp: 'Kupu-kupu melewati 4 tahap lengkap: telur → larva (ulat) → pupa (kepompong) → imago.' },
    { subject: 'IPAS (IPA)', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Planet terbesar di tata surya kita adalah...', options: ['Saturnus', 'Mars', 'Jupiter', 'Neptunus'], answer: 2, exp: 'Jupiter adalah planet terbesar di tata surya dengan diameter ±11 kali Bumi.' },
    { subject: 'IPAS (IPA)', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Perubahan wujud benda dari padat langsung menjadi gas (seperti kapur barus) disebut...', options: ['Mencair', 'Menguap', 'Menyublim', 'Mengembun'], answer: 2, exp: 'Menyublim adalah perubahan wujud padat langsung menjadi gas tanpa mencair dulu.' },
    { subject: 'IPAS (IPA)', tag: 'K13', curriculum: 'K13', isTka: false, q: 'Alat pernapasan utama pada ikan adalah...', options: ['Paru-paru', 'Trakea', 'Insang', 'Kulit'], answer: 2, exp: 'Ikan menyaring oksigen yang terlarut dalam air menggunakan insang.' },

    // IPAS (IPS)
    { subject: 'IPAS (IPS)', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Proklamasi Kemerdekaan Indonesia dibacakan pada tanggal...', options: ['17 Agustus 1945', '28 Oktober 1928', '10 November 1945', '1 Juni 1945'], answer: 0, exp: 'Ir. Soekarno membacakan teks Proklamasi pada 17 Agustus 1945 di Jakarta.' },
    { subject: 'IPAS (IPS)', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Rumah adat Tongkonan berasal dari provinsi...', options: ['Sumatra Barat', 'Sulawesi Selatan (Toraja)', 'Papua', 'Kalimantan Timur'], answer: 1, exp: 'Tongkonan adalah rumah adat masyarakat Toraja, Sulawesi Selatan.' },
    { subject: 'IPAS (IPS)', tag: 'K13', curriculum: 'K13', isTka: false, q: 'Gunung tertinggi di Pulau Jawa adalah...', options: ['Gunung Merapi', 'Gunung Bromo', 'Gunung Semeru', 'Gunung Slamet'], answer: 2, exp: 'Gunung Semeru di Jawa Timur memiliki ketinggian 3.676 mdpl.' },
    { subject: 'IPAS (IPS)', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Kegiatan menghasilkan barang atau jasa dalam ekonomi disebut...', options: ['Konsumsi', 'Distribusi', 'Produksi', 'Promosi'], answer: 2, exp: 'Produksi = menghasilkan, Distribusi = menyalurkan, Konsumsi = menggunakan.' },

    // Pendidikan Pancasila / PPKn
    { subject: 'Pendidikan Pancasila', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Lambang sila ke-3 Pancasila ("Persatuan Indonesia") adalah...', options: ['Bintang', 'Rantai Emas', 'Pohon Beringin', 'Kepala Banteng'], answer: 2, exp: 'Pohon Beringin melambangkan tempat berteduh dan persatuan seluruh rakyat Indonesia.' },
    { subject: 'Pendidikan Pancasila', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Semboyan "Bhinneka Tunggal Ika" memiliki arti...', options: ['Bersatu kita teguh', 'Berbeda-beda tetapi tetap satu jua', 'Maju terus pantang mundur', 'Gotong royong bersama'], answer: 1, exp: 'Bhinneka Tunggal Ika berasal dari Kitab Sutasoma karya Mpu Tantular.' },
    { subject: 'Pendidikan Pancasila', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Menyelesaikan masalah kelas dengan cara berdiskusi bersama sesuai dengan pengamalan sila ke...', options: ['Sila ke-2', 'Sila ke-3', 'Sila ke-4', 'Sila ke-5'], answer: 2, exp: 'Sila ke-4 menekankan musyawarah untuk mencapai mufakat.' },

    // Bahasa Inggris
    { subject: 'Bahasa Inggris', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Bahasa Inggris dari kata "Perpustakaan" adalah...', options: ['Bookstore', 'Laboratory', 'Library', 'Canteen'], answer: 2, exp: 'Library artinya perpustakaan, tempat membaca dan meminjam buku.' },
    { subject: 'Bahasa Inggris', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: '"Good afternoon" diucapkan untuk menyapa pada waktu...', options: ['Pagi hari', 'Siang/sore hari', 'Malam hari', 'Tengah malam'], answer: 1, exp: 'Good morning (pagi), Good afternoon (siang/sore), Good evening (malam).' },
    { subject: 'Bahasa Inggris', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'What is the English word for "Kupu-kupu"?', options: ['Dragonfly', 'Butterfly', 'Grasshopper', 'Ladybug'], answer: 1, exp: 'Butterfly artinya kupu-kupu.' },

    // Seni & PJOK
    { subject: 'Seni & PJOK', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Warna primer (warna dasar) dalam seni rupa terdiri dari...', options: ['Merah, Kuning, Biru', 'Hijau, Ungu, Oranye', 'Hitam, Putih, Abu-abu', 'Merah, Hijau, Hitam'], answer: 0, exp: 'Merah, kuning, dan biru adalah warna primer yang dapat dicampur membentuk warna lain.' },
    { subject: 'Seni & PJOK', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Alat musik tradisional Angklung yang dimainkan dengan cara digoyangkan berasal dari...', options: ['Jawa Barat', 'Bali', 'Sumatra Utara', 'Papua'], answer: 0, exp: 'Angklung terbuat dari bambu dan merupakan warisan budaya dunia asal Jawa Barat.' },
    { subject: 'Seni & PJOK', tag: 'K13 & Merdeka', curriculum: 'K13 & Merdeka', isTka: false, q: 'Sebelum berolahraga, kita wajib melakukan pemanasan (warming up) agar...', options: ['Cepat lelah', 'Mencegah cedera otot', 'Tubuh menjadi dingin', 'Mengurangi tinggi badan'], answer: 1, exp: 'Pemanasan melenturkan otot dan meningkatkan aliran darah untuk mencegah cedera.' },
  ],

  SMP: [
    // Matematika (TKA SMP, US, Kurikulum Merdeka & K13)
    { subject: 'Matematika', tag: 'TKA SMP', curriculum: 'TKA & Kurikulum Merdeka', isTka: true, q: 'Jika 3x - 7 = 14, maka nilai dari 2x + 5 adalah...', options: ['15', '17', '19', '21'], answer: 2, exp: '3x = 21 → x = 7. Maka 2(7) + 5 = 14 + 5 = 19.' },
    { subject: 'Matematika', tag: 'TKA SMP', curriculum: 'TKA & Kurikulum Merdeka', isTka: true, q: 'Segitiga siku-siku memiliki sisi tegak 6 cm dan 8 cm. Panjang sisi miring (hipotenusa) adalah...', options: ['9 cm', '10 cm', '12 cm', '14 cm'], answer: 1, exp: 'Pythagoras: c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.' },
    { subject: 'Matematika', tag: 'TKA SMP', curriculum: 'TKA', isTka: true, q: 'Sebuah toko memberi diskon 20% untuk tas seharga Rp150.000. Harga yang harus dibayar adalah...', options: ['Rp110.000', 'Rp120.000', 'Rp125.000', 'Rp130.000'], answer: 1, exp: 'Diskon = 20% × 150.000 = Rp30.000. Harga bayar = Rp120.000.' },
    { subject: 'Matematika', tag: 'ANBK Numerasi', curriculum: 'ANBK', isTka: true, q: 'Sebuah dadu bersisi 6 dilempar sekali. Peluang munculnya mata dadu bilangan prima adalah...', options: ['1/6', '1/3', '1/2', '2/3'], answer: 2, exp: 'Bilangan prima pada dadu: {2, 3, 5} ada 3 kejadian. Peluang = 3/6 = 1/2.' },
    { subject: 'Matematika', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Gradien garis yang melalui titik A(0, 2) dan B(4, 10) adalah...', options: ['1', '2', '3', '4'], answer: 1, exp: 'm = (y₂ - y₁)/(x₂ - x₁) = (10 - 2)/(4 - 0) = 8/4 = 2.' },
    { subject: 'Matematika', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Hasil dari (-4)² + (-2)³ adalah...', options: ['8', '24', '-8', '10'], answer: 0, exp: '(-4)² = 16 dan (-2)³ = -8, sehingga 16 + (-8) = 8.' },
    { subject: 'Matematika', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Luas lingkaran dengan jari-jari 7 cm (π = 22/7) adalah...', options: ['44 cm²', '154 cm²', '308 cm²', '77 cm²'], answer: 1, exp: 'L = π r² = (22/7) × 7 × 7 = 154 cm².' },

    // Bahasa Indonesia (TKA SMP, ANBK)
    { subject: 'Bahasa Indonesia', tag: 'TKA SMP', curriculum: 'TKA & Kurikulum Merdeka', isTka: true, q: 'Majas yang menggambarkan benda mati seolah-olah hidup seperti manusia disebut...', options: ['Hiperbola', 'Personifikasi', 'Metafora', 'Ironi'], answer: 1, exp: 'Contoh personifikasi: "Angin malam berbisik lembut di jendela."' },
    { subject: 'Bahasa Indonesia', tag: 'TKA SMP', curriculum: 'TKA & Kurikulum Merdeka', isTka: true, q: 'Manakah penulisan kata baku yang tepat menurut KBBI?', options: ['Apotik dan Praktek', 'Apotek dan Aktivitas', 'Resiko dan Jadwal', 'Ijasah dan Sistem'], answer: 1, exp: 'Bentuk baku KBBI: Apotek, Praktik, Aktivitas, Risiko, Ijazah.' },
    { subject: 'Bahasa Indonesia', tag: 'ANBK Literasi', curriculum: 'ANBK', isTka: true, q: 'Bagian awal teks berita yang memuat inti peristiwa (5W+1H) disebut...', options: ['Judul berita', 'Teras berita (Lead)', 'Tubuh berita', 'Ekor berita'], answer: 1, exp: 'Teras berita (lead) berada di paragraf pertama berisi pokok informasi berita.' },
    { subject: 'Bahasa Indonesia', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Teks yang berisi langkah-langkah sistematis untuk melakukan atau membuat sesuatu disebut...', options: ['Teks Deskripsi', 'Teks Prosedur', 'Teks Eksposisi', 'Teks Fabel'], answer: 1, exp: 'Teks prosedur memandu pembaca lewat tahapan/langkah yang terurut.' },
    { subject: 'Bahasa Indonesia', tag: 'TKA SMP', curriculum: 'TKA', isTka: true, q: 'Kalimat "Karena hujan deras, pertandingan sepak bola ditunda." Kata "Karena" adalah konjungsi...', options: ['Pertentangan', 'Kausalitas (sebab-akibat)', 'Kronologis', 'Pilihan'], answer: 1, exp: 'Konjungsi kausalitas (karena, sebab, sehingga) menyatakan hubungan sebab-akibat.' },

    // IPA
    { subject: 'IPA', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Organel sel yang berfungsi sebagai pusat penghasil energi (respirasi sel) adalah...', options: ['Ribosom', 'Mitokondria', 'Vakuola', 'Lisosom'], answer: 1, exp: 'Mitokondria menghasilkan ATP sebagai sumber energi utama sel.' },
    { subject: 'IPA', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Satuan Internasional (SI) untuk gaya adalah...', options: ['Joule', 'Watt', 'Newton', 'Pascal'], answer: 2, exp: 'Gaya (F = m × a) bersatuan Newton (N).' },
    { subject: 'IPA', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Lambang unsur kimia untuk Natrium adalah...', options: ['Nt', 'Na', 'N', 'Ni'], answer: 1, exp: 'Natrium dilambangkan Na (nomor atom 11), penyusun garam dapur NaCl.' },
    { subject: 'IPA', tag: 'K13 & Merdeka', curriculum: 'K13 & Merdeka', isTka: false, q: 'Zat yang mengubah kertas lakmus biru menjadi merah bersifat...', options: ['Basa', 'Netral', 'Asam', 'Garam'], answer: 2, exp: 'Larutan asam memerahkan lakmus biru (pH < 7).' },
    { subject: 'IPA', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Enzim di dalam air liur mulut yang mengubah amilum (pati) menjadi maltosa adalah...', options: ['Pepsin', 'Ptialin (Amilase)', 'Lipase', 'Renin'], answer: 1, exp: 'Pencernaan kimiawi pertama terjadi di mulut oleh enzim ptialin/amilase.' },

    // IPS
    { subject: 'IPS', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Sumpah Pemuda diikrarkan pada Kongres Pemuda II tanggal...', options: ['20 Mei 1908', '28 Oktober 1928', '17 Agustus 1945', '10 November 1945'], answer: 1, exp: 'Sumpah Pemuda 28 Oktober 1928 menegaskan satu tanah air, bangsa, dan bahasa.' },
    { subject: 'IPS', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'ASEAN didirikan pada 8 Agustus 1967 melalui Deklarasi...', options: ['Deklarasi Djuanda', 'Deklarasi Bangkok', 'Deklarasi Bandung', 'Deklarasi Bogor'], answer: 1, exp: 'Lima negara pendiri ASEAN (Indonesia, Malaysia, Singapura, Thailand, Filipina) menandatangani Deklarasi Bangkok.' },
    { subject: 'IPS', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Kerajaan Hindu tertua di Indonesia yang terletak di Kalimantan Timur adalah...', options: ['Majapahit', 'Sriwijaya', 'Kutai', 'Tarumanegara'], answer: 2, exp: 'Kerajaan Kutai (abad ke-4 M) dibuktikan oleh 7 prasasti Yupa.' },
    { subject: 'IPS', tag: 'K13 & Merdeka', curriculum: 'K13 & Merdeka', isTka: false, q: 'Garis khayal 0° lintang yang membagi Bumi menjadi belahan utara dan selatan disebut...', options: ['Garis Bujur', 'Garis Khatulistiwa (Ekuator)', 'Garis Meridian', 'Garis Wallace'], answer: 1, exp: 'Garis Khatulistiwa melintasi Pontianak dan membuat Indonesia beriklim tropis.' },

    // Bahasa Inggris
    { subject: 'Bahasa Inggris', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Choose the correct sentence in Simple Past Tense:', options: ['She go to school yesterday.', 'She goes to school yesterday.', 'She went to school yesterday.', 'She going to school yesterday.'], answer: 2, exp: 'Simple Past Tense menggunakan Verb 2: "went" (lampau dari "go").' },
    { subject: 'Bahasa Inggris', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'What is the purpose of a Descriptive Text?', options: ['To tell a funny story', 'To describe a specific person, place, or thing', 'To explain how to make something', 'To persuade people to buy'], answer: 1, exp: 'Descriptive text bertujuan menggambarkan ciri-ciri khusus suatu objek.' },

    // Pendidikan Pancasila
    { subject: 'Pendidikan Pancasila', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Lembaga negara yang berwenang mengubah dan menetapkan UUD 1945 adalah...', options: ['DPR', 'MPR', 'Mahkamah Agung', 'BPK'], answer: 1, exp: 'Sesuai Pasal 3 UUD 1945, MPR berwenang mengubah dan menetapkan UUD.' },
    { subject: 'Pendidikan Pancasila', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Norma yang bersumber dari hati nurani manusia disebut norma...', options: ['Norma Hukum', 'Norma Kesopanan', 'Norma Kesusilaan', 'Norma Adat'], answer: 2, exp: 'Norma kesusilaan bersumber dari bisikan hati nurani tentang baik dan buruk.' },

    // Informatika (Wajib Kurikulum Merdeka SMP!)
    { subject: 'Informatika', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Dalam berpikir komputasional, memecah masalah besar menjadi bagian-bagian kecil disebut...', options: ['Abstraksi', 'Dekomposisi', 'Pengenalan Pola', 'Enkripsi'], answer: 1, exp: '4 pilar Computational Thinking: Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma.' },
    { subject: 'Informatika', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Bilangan biner 1010 jika dikonversi ke bilangan desimal bernilai...', options: ['8', '10', '12', '14'], answer: 1, exp: '1×8 + 0×4 + 1×2 + 0×1 = 8 + 2 = 10.' },
    { subject: 'Informatika', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Perangkat keras (hardware) yang berfungsi sebagai otak pemroses utama komputer adalah...', options: ['RAM', 'CPU (Processor)', 'Hard Disk', 'Monitor'], answer: 1, exp: 'CPU (Central Processing Unit) mengeksekusi instruksi dan perhitungan utama komputer.' },

    // Seni & Prakarya
    { subject: 'Seni & Prakarya', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Teknik menggambar dengan menggunakan titik-titik rapat untuk membentuk gelap terang disebut...', options: ['Arsir', 'Pointilis', 'Aquarel', 'Plakat'], answer: 1, exp: 'Teknik pointilis memanfaatkan susunan titik untuk menciptakan gradasi dan dimensi.' },
  ],

  SMA: [
    // Matematika Wajib (TKA SMA Wajib & UTBK)
    { subject: 'Matematika', tag: 'TKA SMA Wajib', curriculum: 'TKA 2025/2026', isTka: true, q: 'Nilai dari ²log 16 + ³log 27 - ⁵log 25 adalah...', options: ['4', '5', '6', '7'], answer: 1, exp: '²log 16 = 4, ³log 27 = 3, ⁵log 25 = 2. Jadi 4 + 3 - 2 = 5.' },
    { subject: 'Matematika', tag: 'TKA SMA Wajib', curriculum: 'TKA 2025/2026', isTka: true, q: 'Jumlah 5 suku pertama deret aritmetika 2 + 5 + 8 + ... adalah...', options: ['35', '40', '45', '50'], answer: 1, exp: 'a=2, b=3, n=5. S₅ = (5/2)(2(2) + 4(3)) = 2,5 × 16 = 40.' },
    { subject: 'Matematika', tag: 'TKA SMA Wajib', curriculum: 'TKA 2025/2026', isTka: true, q: 'Nilai dari sin 30° + cos 60° + tan 45° adalah...', options: ['1', '1,5', '2', '2,5'], answer: 2, exp: 'sin 30° = 0,5; cos 60° = 0,5; tan 45° = 1. Total = 2.' },
    { subject: 'Matematika', tag: 'UTBK-SNBT', curriculum: 'UTBK-SNBT', isTka: true, q: 'Jika f(x) = 2x + 3 dan g(x) = x - 4, maka nilai (f ∘ g)(5) adalah...', options: ['3', '5', '7', '9'], answer: 1, exp: 'g(5) = 5 - 4 = 1, lalu f(1) = 2(1) + 3 = 5.' },

    // Matematika Lanjut (TKA SMA Pilihan)
    { subject: 'Matematika Lanjut', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Turunan pertama dari f(x) = 3x³ - 4x² + 5x - 2 adalah...', options: ['9x² - 8x + 5', '9x² - 4x + 5', '6x² - 8x + 5', '9x² - 8x - 2'], answer: 0, exp: 'Aturan pangkat: d/dx(axⁿ) = a·n·xⁿ⁻¹ → 9x² - 8x + 5.' },
    { subject: 'Matematika Lanjut', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Determinan dari matriks A = [[4, 2], [3, 5]] adalah...', options: ['10', '14', '20', '26'], answer: 1, exp: 'det(A) = (4×5) - (2×3) = 20 - 6 = 14.' },
    { subject: 'Matematika Lanjut', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Nilai limit x → 2 dari (x² - 4) / (x - 2) adalah...', options: ['0', '2', '4', '∞'], answer: 2, exp: 'Faktorkan (x-2)(x+2)/(x-2) = x+2. Substitusi x=2 menghasilkan 4.' },
    { subject: 'Matematika Lanjut', tag: 'Ujian Sekolah', curriculum: 'Kurikulum Merdeka', isTka: true, q: 'Hasil dari integral tak tentu ∫ 6x² dx adalah...', options: ['2x³ + C', '3x³ + C', '12x + C', '6x³ + C'], answer: 0, exp: '∫ axⁿ dx = (a/(n+1)) xⁿ⁺¹ + C → (6/3)x³ + C = 2x³ + C.' },

    // Bahasa Indonesia (TKA SMA Wajib & UTBK)
    { subject: 'Bahasa Indonesia', tag: 'TKA SMA Wajib', curriculum: 'TKA 2025/2026', isTka: true, q: 'Paragraf yang kalimat utamanya terletak di akhir paragraf disebut paragraf...', options: ['Deduktif', 'Induktif', 'Campuran', 'Naratif'], answer: 1, exp: 'Induktif menyajikan rincian khusus terlebih dahulu lalu kesimpulan/kalimat utama di akhir.' },
    { subject: 'Bahasa Indonesia', tag: 'UTBK-SNBT', curriculum: 'UTBK-SNBT', isTka: true, q: 'Premis 1: Semua ilmuwan gemar membaca. Premis 2: Raka adalah ilmuwan. Kesimpulan yang sah adalah...', options: ['Raka gemar membaca', 'Sebagian ilmuwan bukan Raka', 'Raka mungkin membaca', 'Tidak dapat disimpulkan'], answer: 0, exp: 'Silogisme kategoris (Modus Ponens): Raka anggota ilmuwan, maka ia gemar membaca.' },
    { subject: 'Bahasa Indonesia', tag: 'TKA SMA Wajib', curriculum: 'TKA 2025/2026', isTka: true, q: 'Kalimat efektif harus memenuhi syarat kehematan kata. Manakah yang paling efektif?', options: ['Para siswa-siswa sedang belajar.', 'Agar supaya lulus, ia belajar giat.', 'Para siswa sedang belajar di aula.', 'Naik ke atas panggung sekarang.'], answer: 2, exp: 'Hindari pleonasme seperti "para siswa-siswa", "agar supaya", atau "naik ke atas".' },

    // Bahasa Inggris (TKA SMA Wajib & UTBK)
    { subject: 'Bahasa Inggris', tag: 'TKA SMA Wajib', curriculum: 'TKA 2025/2026', isTka: true, q: 'If I ____ enough money, I would buy a new astronomical telescope.', options: ['have', 'had', 'will have', 'having'], answer: 1, exp: 'Conditional Type 2 (pengandaian sekarang): If + Simple Past (had), S + would + V1.' },
    { subject: 'Bahasa Inggris', tag: 'TKA SMA Wajib', curriculum: 'TKA 2025/2026', isTka: true, q: 'The word "ubiquitous" in academic reading is closest in meaning to...', options: ['Rare', 'Everywhere', 'Ancient', 'Temporary'], answer: 1, exp: 'Ubiquitous berarti ada di mana-mana (omnipresent).' },
    { subject: 'Bahasa Inggris', tag: 'UTBK-SNBT', curriculum: 'UTBK-SNBT', isTka: true, q: 'The scientific paper ____ by the research team before the deadline yesterday.', options: ['submitted', 'was submitted', 'is submitting', 'has submit'], answer: 1, exp: 'Kalimat pasif bentuk lampau (Simple Past Passive): was/were + Verb 3.' },

    // Fisika (TKA SMA Pilihan)
    { subject: 'Fisika', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Benda bermassa 2 kg bergerak dengan kecepatan 6 m/s. Energi kinetiknya adalah...', options: ['12 J', '24 J', '36 J', '72 J'], answer: 2, exp: 'Ek = ½ m v² = ½ × 2 × 6² = 36 Joule.' },
    { subject: 'Fisika', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Dua resistor 4 Ω dan 6 Ω dirangkai seri lalu dihubungkan tegangan 20 V. Kuat arus rangkaian adalah...', options: ['1 A', '2 A', '4 A', '5 A'], answer: 1, exp: 'R total seri = 4 + 6 = 10 Ω. Hukum Ohm: I = V / R = 20 / 10 = 2 Ampere.' },
    { subject: 'Fisika', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Efek fotolistrik yang dijelaskan Albert Einstein membuktikan bahwa cahaya bersifat sebagai...', options: ['Gelombang longitudinal', 'Partikel (kuanta energi/foton)', 'Medan gravitasi', 'Zat cair'], answer: 1, exp: 'Einstein membuktikan cahaya membawa paket energi diskrit (foton) E = h·f.' },

    // Kimia (TKA SMA Pilihan)
    { subject: 'Kimia', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'pH larutan HCl 0,01 M (asam kuat bervalensi 1) adalah...', options: ['1', '2', '3', '12'], answer: 1, exp: '[H⁺] = 10⁻² M, maka pH = -log(10⁻²) = 2.' },
    { subject: 'Kimia', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Ikatan kimia yang terbentuk akibat pemakaian pasangan elektron bersama disebut...', options: ['Ikatan ion', 'Ikatan kovalen', 'Ikatan logam', 'Ikatan van der Waals'], answer: 1, exp: 'Ikatan kovalen terbentuk antar atom nonlogam melalui pemakaian elektron bersama.' },
    { subject: 'Kimia', tag: 'K13 & Merdeka', curriculum: 'K13 & Merdeka', isTka: false, q: 'Bilangan oksidasi atom S pada senyawa asam sulfat (H₂SO₄) adalah...', options: ['+2', '+4', '+6', '-2'], answer: 2, exp: '2(+1) + S + 4(-2) = 0 → S = +6.' },

    // Biologi (TKA SMA Pilihan)
    { subject: 'Biologi', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Pada pembelahan mitosis, tahap saat kromosom berjajar rapi di bidang ekuator disebut...', options: ['Profase', 'Metafase', 'Anafase', 'Telofase'], answer: 1, exp: 'Metafase (M = Middle) adalah fase kromosom sejajar di bidang ekuator sel.' },
    { subject: 'Biologi', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Basa nitrogen yang hanya ditemukan pada RNA (menggantikan Timin pada DNA) adalah...', options: ['Adenin', 'Guanin', 'Sitosin', 'Urasil'], answer: 3, exp: 'RNA memiliki A, U, G, C; sedangkan DNA memiliki A, T, G, C.' },

    // Ekonomi (TKA SMA Pilihan)
    { subject: 'Ekonomi', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Kenaikan harga barang dan jasa secara umum dan terus-menerus dalam periode tertentu disebut...', options: ['Deflasi', 'Inflasi', 'Resesi', 'Devaluasi'], answer: 1, exp: 'Inflasi menyebabkan nilai riil/daya beli uang menurun.' },
    { subject: 'Ekonomi', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Nilai alternatif terbaik yang dikorbankan saat menentukan suatu pilihan ekonomi disebut...', options: ['Biaya tetap', 'Biaya peluang (Opportunity cost)', 'Biaya marginal', 'Biaya eksplisit'], answer: 1, exp: 'Biaya peluang timbul akibat kelangkaan sumber daya sehingga harus memilih.' },

    // Sosiologi (TKA SMA Pilihan)
    { subject: 'Sosiologi', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Perpindahan status sosial seseorang dari satu lapisan ke lapisan lain dalam masyarakat disebut...', options: ['Integrasi sosial', 'Mobilitas sosial', 'Stratifikasi sosial', 'Asimilasi'], answer: 1, exp: 'Mobilitas sosial bisa vertikal naik/turun (social climbing/sinking) atau horizontal.' },
    { subject: 'Sosiologi', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka', isTka: false, q: 'Percampuran dua kebudayaan atau lebih yang melahirkan budaya baru tanpa menghilangkan budaya asli disebut...', options: ['Akulturasi', 'Asimilasi', 'Konflik', 'Segregasi'], answer: 0, exp: 'Akulturasi mempertahankan unsur budaya lama; asimilasi meleburkannya menjadi budaya baru.' },

    // Geografi (TKA SMA Pilihan)
    { subject: 'Geografi', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Lapisan atmosfer tempat terjadinya berbagai fenomena cuaca (hujan, awan, petir) adalah...', options: ['Stratosfer', 'Troposfer', 'Mesosfer', 'Termosfer'], answer: 1, exp: 'Troposfer adalah lapisan atmosfer terbawah tempat cuaca dan kehidupan berlangsung.' },
    { subject: 'Geografi', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Garis khayal yang memisahkan fauna Indonesia bagian Barat (Asiatis) dan Tengah (Peralihan) adalah...', options: ['Garis Weber', 'Garis Wallace', 'Garis Lydekker', 'Garis Ekuator'], answer: 1, exp: 'Garis Wallace memisahkan Asiatis dan Peralihan; Garis Weber memisahkan Peralihan dan Australis.' },

    // Sejarah (TKA SMA Pilihan)
    { subject: 'Sejarah', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Konferensi Asia-Afrika (KAA) pertama tahun 1955 yang melahirkan Dasasila Bandung digelar di...', options: ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta'], answer: 1, exp: 'KAA 1955 berlangsung di Gedung Merdeka Bandung dan menginspirasi Gerakan Non-Blok.' },
    { subject: 'Sejarah', tag: 'Ujian Sekolah', curriculum: 'K13 & Merdeka', isTka: true, q: 'Organisasi pergerakan nasional modern pertama di Indonesia yang berdiri 20 Mei 1908 adalah...', options: ['Sarekat Islam', 'Budi Utomo', 'Indische Partij', 'Perhimpunan Indonesia'], answer: 1, exp: 'Budi Utomo didirikan oleh Dr. Sutomo dkk dan diperingati sebagai Hari Kebangkitan Nasional.' },

    // Pendidikan Pancasila (TKA SMA Pilihan)
    { subject: 'Pendidikan Pancasila', tag: 'TKA SMA Pilihan', curriculum: 'TKA 2025/2026', isTka: true, q: 'Sistem pemerintahan Indonesia menurut UUD 1945 hasil amandemen adalah sistem...', options: ['Parlementer', 'Presidensial', 'Monarki Konstitusional', 'Federasi'], answer: 1, exp: 'Dalam sistem presidensial, Presiden berkedudukan sebagai kepala negara sekaligus kepala pemerintahan.' },

    // Informatika & PKWU (Kurikulum Merdeka & SMK)
    { subject: 'Informatika & PKWU', tag: 'Kurikulum Merdeka', curriculum: 'Kurikulum Merdeka & SMK', isTka: false, q: 'Struktur data yang menganut prinsip LIFO (Last In, First Out) adalah...', options: ['Queue (Antrean)', 'Stack (Tumpukan)', 'Linked List', 'Graph'], answer: 1, exp: 'Stack seperti tumpukan piring: elemen terakhir yang masuk akan keluar pertama kali.' },
    { subject: 'Informatika & PKWU', tag: 'TKA SMK / PKWU', curriculum: 'SMK & Merdeka', isTka: true, q: 'Analisis strategi usaha yang memetakan Strengths, Weaknesses, Opportunities, dan Threats disebut...', options: ['Analisis BEP', 'Analisis SWOT', 'Analisis HPP', 'Analisis ROI'], answer: 1, exp: 'SWOT digunakan wirausahawan untuk mengevaluasi kekuatan, kelemahan, peluang, dan ancaman bisnis.' },
  ],
};

export const TRUE_FALSE_BANK = {
  SD: [
    { statement: 'Matahari adalah sebuah bintang, bukan planet.', isTrue: true, exp: 'Benar! Matahari memancarkan cahayanya sendiri seperti bintang lainnya.' },
    { statement: 'Paus dan lumba-lumba bernapas menggunakan insang seperti ikan.', isTrue: false, exp: 'Mitos! Paus dan lumba-lumba adalah mamalia laut yang bernapas dengan paru-paru.' },
    { statement: 'Indonesia terletak di Benua Asia dan dilalui garis Khatulistiwa.', isTrue: true, exp: 'Benar! Garis Khatulistiwa melintasi Pontianak dan beberapa wilayah Indonesia.' },
    { statement: 'Hasil dari 7 × 8 adalah 54.', isTrue: false, exp: 'Mitos! 7 × 8 = 56, sedangkan 54 adalah 6 × 9.' },
    { statement: 'Bunga Rafflesia arnoldii adalah bunga terbesar di dunia dan tumbuh di Sumatra.', isTrue: true, exp: 'Benar! Rafflesia arnoldii tumbuh alami di hutan hujan Sumatra, terutama Bengkulu.' },
    { statement: 'Bulan menghasilkan cahayanya sendiri di malam hari.', isTrue: false, exp: 'Mitos! Bulan hanya memantulkan cahaya dari Matahari.' },
    { statement: 'Candi Borobudur merupakan candi Buddha terbesar di dunia.', isTrue: true, exp: 'Benar! Candi Borobudur di Magelang, Jawa Tengah, adalah warisan dunia UNESCO.' },
    { statement: 'Laba-laba termasuk kelompok serangga karena punya 6 kaki.', isTrue: false, exp: 'Mitos! Laba-laba termasuk Arachnida dan memiliki 8 kaki.' },
    { statement: 'Air murni membeku pada suhu 0°C pada tekanan normal.', isTrue: true, exp: 'Benar! Titik beku air 0°C dan titik didihnya 100°C.' },
    { statement: 'Komodo adalah kadal terbesar di dunia yang hanya hidup alami di Indonesia.', isTrue: true, exp: 'Benar! Komodo hidup di Pulau Komodo, Rinca, dan sekitarnya di NTT.' },
  ],
  SMP: [
    { statement: 'Suara merambat lebih cepat di ruang hampa daripada di udara.', isTrue: false, exp: 'Mitos! Bunyi butuh medium; di ruang hampa bunyi tidak bisa merambat sama sekali.' },
    { statement: 'Jumlah sudut dalam setiap segitiga selalu 180 derajat.', isTrue: true, exp: 'Benar! Pada geometri Euclidean, total ketiga sudut segitiga selalu 180°.' },
    { statement: 'Jantung manusia memiliki 4 ruang: 2 serambi (atrium) dan 2 bilik (ventrikel).', isTrue: true, exp: 'Benar! Serambi menerima darah, bilik memompa darah keluar jantung.' },
    { statement: 'Besi akan berkarat lebih cepat di tempat yang benar-benar kering tanpa air.', isTrue: false, exp: 'Mitos! Korosi membutuhkan reaksi besi dengan oksigen dan air/kelembapan.' },
    { statement: 'Bilangan prima terkecil adalah 2 dan satu-satunya bilangan prima genap.', isTrue: true, exp: 'Benar! Angka 1 bukan bilangan prima, jadi 2 adalah yang terkecil.' },
    { statement: 'Kerajaan Sriwijaya dikenal sebagai kerajaan maritim bercorak Buddha di Sumatra.', isTrue: true, exp: 'Benar! Sriwijaya berpusat di sekitar Palembang dan menguasai Selat Malaka.' },
    { statement: 'Semua bakteri berbahaya dan menyebabkan penyakit pada manusia.', isTrue: false, exp: 'Mitos! Banyak bakteri baik, seperti Lactobacillus pada yogurt dan bakteri pencernaan.' },
    { statement: 'Cermin cembung digunakan sebagai kaca spion karena jangkauan pandangannya luas.', isTrue: true, exp: 'Benar! Cermin cembung menghasilkan bayangan maya, tegak, diperkecil.' },
    { statement: 'Dalam Kurikulum Merdeka SMP, mata pelajaran Informatika termasuk mata pelajaran wajib.', isTrue: true, exp: 'Benar! Informatika menjadi mapel wajib di SMP pada Kurikulum Merdeka.' },
    { statement: 'Musim di Bumi terutama disebabkan oleh jarak Bumi yang jauh-dekat ke Matahari.', isTrue: false, exp: 'Mitos! Musim disebabkan kemiringan sumbu rotasi Bumi sebesar 23,5°.' },
  ],
  SMA: [
    { statement: 'Cahaya memiliki sifat dualisme: gelombang sekaligus partikel (foton).', isTrue: true, exp: 'Benar! Efek fotolistrik membuktikan sifat partikel, interferensi membuktikan sifat gelombang.' },
    { statement: 'Turunan dari fungsi konstan f(x) = 7 adalah 7.', isTrue: false, exp: 'Mitos! Laju perubahan konstanta selalu nol, jadi f\'(x) = 0.' },
    { statement: 'DNA berbentuk untai ganda (double helix) yang tersusun atas nukleotida.', isTrue: true, exp: 'Benar! Struktur double helix DNA diungkap oleh Watson, Crick, dan Rosalind Franklin.' },
    { statement: 'Dalam hukum permintaan, jika harga naik (ceteris paribus), jumlah permintaan ikut naik.', isTrue: false, exp: 'Mitos! Hukum permintaan berbanding terbalik: harga naik → jumlah diminta turun.' },
    { statement: 'Gas mulia (Golongan VIIIA) sangat stabil karena kulit elektron terluarnya penuh.', isTrue: true, exp: 'Benar! Konfigurasi duplet/oktet membuat gas mulia sangat sukar bereaksi.' },
    { statement: 'Nilai sin²(x) + cos²(x) selalu sama dengan 1 untuk setiap bilangan real x.', isTrue: true, exp: 'Benar! Ini adalah identitas trigonometri Pythagoras paling mendasar.' },
    { statement: 'Enzim ikut habis bereaksi setelah mempercepat reaksi kimia di dalam sel.', isTrue: false, exp: 'Mitos! Enzim adalah biokatalisator yang mempercepat reaksi tanpa ikut habis.' },
    { statement: 'Pada TKA SMA Kemendikdasmen, mapel wajibnya adalah Matematika, Bahasa Indonesia, dan Bahasa Inggris.', isTrue: true, exp: 'Benar! Selain 3 mapel wajib tersebut, siswa SMA/SMK memilih 2 mapel pilihan.' },
    { statement: 'Perang Dunia II berakhir pada tahun 1945, tahun yang sama dengan Proklamasi RI.', isTrue: true, exp: 'Benar! Jepang menyerah kepada Sekutu pada 15 Agustus 1945.' },
    { statement: 'Arus listrik searah (DC) selalu membalik arah alirannya 50 kali per detik.', isTrue: false, exp: 'Mitos! Yang bolak-balik adalah AC (Alternating Current), sedangkan DC searah.' },
  ],
};
