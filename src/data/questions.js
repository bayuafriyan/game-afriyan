// Bank Soal Kurikulum Indonesia (SD, SMP, SMA) untuk Cepat Tepat & Benar/Mitos

export const QUIZ_BANK = {
  SD: [
    // Matematika
    { subject: 'Matematika', q: 'Berapakah hasil dari 8 × 7 + 14?', options: ['64', '70', '72', '68'], answer: 1, exp: 'Perkalian dikerjakan dulu: 8 × 7 = 56, lalu 56 + 14 = 70.' },
    { subject: 'Matematika', q: 'Sebuah persegi memiliki panjang sisi 9 cm. Berapa kelilingnya?', options: ['18 cm', '27 cm', '36 cm', '81 cm'], answer: 2, exp: 'Keliling persegi = 4 × sisi = 4 × 9 cm = 36 cm.' },
    { subject: 'Matematika', q: 'Pecahan yang senilai dengan 1/2 adalah...', options: ['2/6', '3/6', '4/6', '2/5'], answer: 1, exp: 'Jika pembilang dan penyebut 1/2 dikali 3, hasilnya 3/6.' },
    { subject: 'Matematika', q: '2 jam + 45 menit sama dengan berapa menit?', options: ['125 menit', '145 menit', '165 menit', '185 menit'], answer: 2, exp: '2 jam = 120 menit, ditambah 45 menit = 165 menit.' },
    { subject: 'Matematika', q: 'Sudut yang besarnya tepat 90° disebut sudut...', options: ['Lancip', 'Tumpul', 'Siku-siku', 'Lurus'], answer: 2, exp: 'Sudut 90° disebut sudut siku-siku, seperti pojok buku.' },
    { subject: 'Matematika', q: 'Hasil dari 144 ÷ 12 adalah...', options: ['10', '11', '12', '14'], answer: 2, exp: '12 × 12 = 144, sehingga 144 ÷ 12 = 12.' },
    // IPA
    { subject: 'IPA', q: 'Proses tumbuhan hijau membuat makanan dengan bantuan cahaya matahari disebut...', options: ['Respirasi', 'Fotosintesis', 'Metamorfosis', 'Evaporasi'], answer: 1, exp: 'Fotosintesis mengubah air dan CO₂ menjadi glukosa dan oksigen dengan bantuan klorofil.' },
    { subject: 'IPA', q: 'Planet terbesar di tata surya kita adalah...', options: ['Saturnus', 'Mars', 'Jupiter', 'Neptunus'], answer: 2, exp: 'Jupiter adalah planet terbesar dengan diameter sekitar 11 kali Bumi.' },
    { subject: 'IPA', q: 'Hewan yang mengalami metamorfosis sempurna adalah...', options: ['Belalang', 'Kupu-kupu', 'Kecoak', 'Jangkrik'], answer: 1, exp: 'Kupu-kupu melewati 4 tahap: telur → ulat → kepompong (pupa) → kupu-kupu.' },
    { subject: 'IPA', q: 'Alat pernapasan utama pada ikan adalah...', options: ['Paru-paru', 'Trakea', 'Insang', 'Kulit'], answer: 2, exp: 'Ikan menyaring oksigen yang terlarut dalam air menggunakan insang.' },
    { subject: 'IPA', q: 'Perubahan wujud benda dari cair menjadi gas disebut...', options: ['Mencair', 'Membeku', 'Menguap', 'Menyublim'], answer: 2, exp: 'Air yang dipanaskan akan menguap menjadi uap air (gas).' },
    { subject: 'IPA', q: 'Bagian darah yang berfungsi mengedarkan oksigen ke seluruh tubuh adalah...', options: ['Sel darah merah', 'Sel darah putih', 'Keping darah', 'Plasma darah'], answer: 0, exp: 'Sel darah merah mengandung hemoglobin yang mengikat oksigen.' },
    // IPS
    { subject: 'IPS', q: 'Ibu kota Provinsi Jawa Tengah adalah...', options: ['Surabaya', 'Bandung', 'Semarang', 'Yogyakarta'], answer: 2, exp: 'Semarang adalah ibu kota Provinsi Jawa Tengah.' },
    { subject: 'IPS', q: 'Proklamasi Kemerdekaan Indonesia dibacakan pada tanggal...', options: ['17 Agustus 1945', '28 Oktober 1928', '10 November 1945', '1 Juni 1945'], answer: 0, exp: 'Ir. Soekarno membacakan teks Proklamasi pada 17 Agustus 1945 di Jakarta.' },
    { subject: 'IPS', q: 'Rumah adat Tongkonan berasal dari daerah...', options: ['Sumatra Barat', 'Toraja (Sulawesi Selatan)', 'Papua', 'Kalimantan Timur'], answer: 1, exp: 'Tongkonan adalah rumah adat masyarakat Toraja dengan atap melengkung khas.' },
    { subject: 'IPS', q: 'Gunung tertinggi di Pulau Jawa adalah...', options: ['Gunung Merapi', 'Gunung Bromo', 'Gunung Semeru', 'Gunung Slamet'], answer: 2, exp: 'Gunung Semeru di Jawa Timur memiliki ketinggian 3.676 mdpl.' },
    // Bahasa
    { subject: 'Bahasa', q: 'Lawan kata (antonim) dari kata "Dermawan" adalah...', options: ['Ramah', 'Kikir', 'Sabar', 'Jujur'], answer: 1, exp: 'Dermawan berarti suka memberi, sedangkan antonimnya adalah kikir (pelit).' },
    { subject: 'Bahasa', q: 'Bahasa Inggris dari kata "Perpustakaan" adalah...', options: ['Bookstore', 'Laboratory', 'Library', 'Canteen'], answer: 2, exp: 'Library artinya perpustakaan, tempat meminjam dan membaca buku.' },
    { subject: 'Bahasa', q: 'Kalimat "Adik membaca buku di kamar." Kata "membaca" berkedudukan sebagai...', options: ['Subjek', 'Predikat', 'Objek', 'Keterangan'], answer: 1, exp: 'Adik (S), membaca (P), buku (O), di kamar (K).' },
    { subject: 'Bahasa', q: 'Persamaan kata (sinonim) dari "Cerdas" adalah...', options: ['Pintar', 'Malas', 'Lambat', 'Gugup'], answer: 0, exp: 'Cerdas bersinonim dengan pintar atau pandai.' },
  ],

  SMP: [
    // Matematika
    { subject: 'Matematika', q: 'Jika 3x - 7 = 14, maka nilai x adalah...', options: ['5', '6', '7', '8'], answer: 2, exp: '3x = 14 + 7 = 21, sehingga x = 21 ÷ 3 = 7.' },
    { subject: 'Matematika', q: 'Segitiga siku-siku memiliki sisi tegak 6 cm dan 8 cm. Panjang sisi miringnya adalah...', options: ['9 cm', '10 cm', '12 cm', '14 cm'], answer: 1, exp: 'Teorema Pythagoras: √(6² + 8²) = √(36 + 64) = √100 = 10 cm.' },
    { subject: 'Matematika', q: 'Hasil dari (-4)² + (-2)³ adalah...', options: ['8', '24', '-8', '10'], answer: 0, exp: '(-4)² = 16 dan (-2)³ = -8. Maka 16 + (-8) = 8.' },
    { subject: 'Matematika', q: 'Sebuah toko memberi diskon 20% untuk tas seharga Rp150.000. Harga setelah diskon adalah...', options: ['Rp110.000', 'Rp120.000', 'Rp125.000', 'Rp130.000'], answer: 1, exp: 'Diskon = 20% × 150.000 = Rp30.000. Harga akhir = Rp120.000.' },
    { subject: 'Matematika', q: 'Gradien garis yang melalui titik (0, 2) dan (4, 10) adalah...', options: ['1', '2', '3', '4'], answer: 1, exp: 'm = (y2 - y1) / (x2 - x1) = (10 - 2) / (4 - 0) = 8/4 = 2.' },
    { subject: 'Matematika', q: 'Luas lingkaran dengan jari-jari 7 cm (π = 22/7) adalah...', options: ['44 cm²', '154 cm²', '308 cm²', '77 cm²'], answer: 1, exp: 'L = π × r² = (22/7) × 7 × 7 = 154 cm².' },
    // IPA
    { subject: 'IPA', q: 'Satuan Internasional (SI) untuk gaya adalah...', options: ['Joule', 'Watt', 'Newton', 'Pascal'], answer: 2, exp: 'Gaya (F = m × a) memiliki satuan Newton (N).' },
    { subject: 'IPA', q: 'Organel sel yang berfungsi sebagai pusat penghasil energi (respirasi sel) adalah...', options: ['Ribosom', 'Mitokondria', 'Vakuola', 'Lisosom'], answer: 1, exp: 'Mitokondria dikenal sebagai "powerhouse of the cell" karena menghasilkan ATP.' },
    { subject: 'IPA', q: 'Lambang unsur kimia untuk Natrium adalah...', options: ['Nt', 'Na', 'N', 'Ni'], answer: 1, exp: 'Natrium berasal dari bahasa Latin "Natrium" dengan lambang Na (nomor atom 11).' },
    { subject: 'IPA', q: 'Hukum Newton II dirumuskan sebagai...', options: ['F = m / a', 'F = m × a', 'F = m × v', 'F = a / m'], answer: 1, exp: 'Percepatan benda sebanding dengan gaya dan berbanding terbalik dengan massanya: F = m × a.' },
    { subject: 'IPA', q: 'Zat yang mengubah kertas lakmus biru menjadi merah bersifat...', options: ['Basa', 'Netral', 'Asam', 'Garam'], answer: 2, exp: 'Larutan asam memerahkan lakmus biru, sedangkan basa membirukan lakmus merah.' },
    { subject: 'IPA', q: 'Proses pemecahan makanan secara kimiawi di mulut dibantu oleh enzim...', options: ['Pepsin', 'Ptialin (Amilase)', 'Lipase', 'Tripsin'], answer: 1, exp: 'Enzim ptialin dalam air liur mengubah amilum (pati) menjadi maltosa.' },
    // IPS
    { subject: 'IPS', q: 'Sumpah Pemuda diikrarkan pada Kongres Pemuda II tanggal...', options: ['20 Mei 1908', '28 Oktober 1928', '17 Agustus 1945', '10 November 1945'], answer: 1, exp: 'Sumpah Pemuda 28 Oktober 1928 menyatukan semangat satu tanah air, bangsa, dan bahasa.' },
    { subject: 'IPS', q: 'Organisasi kerja sama negara-negara Asia Tenggara (ASEAN) didirikan pada tahun...', options: ['1945', '1955', '1967', '1975'], answer: 2, exp: 'ASEAN didirikan pada 8 Agustus 1967 melalui Deklarasi Bangkok.' },
    { subject: 'IPS', q: 'Garis khayal yang membagi Bumi menjadi belahan utara dan selatan adalah...', options: ['Garis Bujur', 'Garis Khatulistiwa (Ekuator)', 'Garis Meridian', 'Garis Wallace'], answer: 1, exp: 'Khatulistiwa berada pada 0° lintang dan melintasi Kota Pontianak di Indonesia.' },
    { subject: 'IPS', q: 'Kerajaan Hindu tertua di Indonesia yang terletak di Kalimantan Timur adalah...', options: ['Majapahit', 'Sriwijaya', 'Kutai', 'Tarumanegara'], answer: 2, exp: 'Kerajaan Kutai (abad ke-4 M) dibuktikan dengan peninggalan 7 prasasti Yupa.' },
    // Bahasa
    { subject: 'Bahasa', q: 'Majas yang menyamakan benda mati seolah-olah hidup seperti manusia disebut...', options: ['Hiperbola', 'Personifikasi', 'Metafora', 'Ironi'], answer: 1, exp: 'Contoh personifikasi: "Angin malam berbisik lembut di telingaku."' },
    { subject: 'Bahasa', q: 'Choose the correct sentence in Simple Past Tense:', options: ['She go to school yesterday.', 'She goes to school yesterday.', 'She went to school yesterday.', 'She going to school yesterday.'], answer: 2, exp: 'Bentuk lampau (Verb 2) dari "go" adalah "went".' },
    { subject: 'Bahasa', q: 'Bagian teks berita yang berisi inti peristiwa (5W+1H) di awal paragraf disebut...', options: ['Judul', 'Teras berita (Lead)', 'Ekor berita', 'Opini'], answer: 1, exp: 'Teras berita (lead) memuat informasi paling penting di paragraf pertama.' },
    { subject: 'Bahasa', q: 'Kata baku yang benar menurut KBBI adalah...', options: ['Apotik', 'Praktek', 'Aktivitas', 'Resiko'], answer: 2, exp: 'Bentuk baku: Apotek, Praktik, Aktivitas, Risiko.' },
  ],

  SMA: [
    // Matematika
    { subject: 'Matematika', q: 'Nilai dari ²log 16 + ³log 27 adalah...', options: ['5', '6', '7', '8'], answer: 2, exp: '²log 16 = 4 (karena 2⁴=16) dan ³log 27 = 3 (karena 3³=27). Jadi 4 + 3 = 7.' },
    { subject: 'Matematika', q: 'Turunan pertama dari f(x) = 3x³ - 4x² + 5x - 2 adalah...', options: ['9x² - 8x + 5', '9x² - 4x + 5', '6x² - 8x + 5', '9x² - 8x - 2'], answer: 0, exp: 'Gunakan aturan pangkat: d/dx(axⁿ) = a·n·xⁿ⁻¹ → 9x² - 8x + 5.' },
    { subject: 'Matematika', q: 'Nilai dari sin 30° + cos 60° adalah...', options: ['0', '1/2', '1', '√3'], answer: 2, exp: 'sin 30° = 1/2 dan cos 60° = 1/2, sehingga 1/2 + 1/2 = 1.' },
    { subject: 'Matematika', q: 'Jumlah 5 suku pertama deret aritmetika 2 + 5 + 8 + ... adalah...', options: ['35', '40', '45', '50'], answer: 1, exp: 'a=2, b=3, n=5. S₅ = (5/2)(2(2) + 4(3)) = 2.5 × 16 = 40.' },
    { subject: 'Matematika', q: 'Determinan dari matriks [[4, 2], [3, 5]] adalah...', options: ['14', '20', '26', '10'], answer: 0, exp: 'det(A) = (4×5) - (2×3) = 20 - 6 = 14.' },
    { subject: 'Matematika', q: 'Limit x → 2 dari (x² - 4) / (x - 2) adalah...', options: ['0', '2', '4', '∞'], answer: 2, exp: 'Faktorkan: (x-2)(x+2)/(x-2) = x+2. Substitusi x=2 menghasilkan 4.' },
    // IPA (Fisika, Kimia, Biologi)
    { subject: 'IPA', q: 'Benda bermassa 2 kg bergerak dengan kecepatan 6 m/s. Energi kinetiknya adalah...', options: ['12 J', '24 J', '36 J', '72 J'], answer: 2, exp: 'Ek = ½ m v² = ½ × 2 × 6² = 36 Joule.' },
    { subject: 'IPA', q: 'Ikatan kimia yang terbentuk akibat pemakaian pasangan elektron bersama disebut...', options: ['Ikatan ion', 'Ikatan kovalen', 'Ikatan logam', 'Ikatan hidrogen'], answer: 1, exp: 'Ikatan kovalen terjadi antar atom nonlogam dengan berbagi elektron valensi.' },
    { subject: 'IPA', q: 'Pada pembelahan sel, tahap ketika kromosom berjajar rapi di bidang ekuator disebut...', options: ['Profase', 'Metafase', 'Anafase', 'Telofase'], answer: 1, exp: 'Metafase = "Middle" (tengah), kromosom berjajar di bidang ekuator sel.' },
    { subject: 'IPA', q: 'pH larutan HCl 0,01 M (asam kuat bervalensi 1) adalah...', options: ['1', '2', '3', '12'], answer: 1, exp: '[H⁺] = 10⁻² M, maka pH = -log(10⁻²) = 2.' },
    { subject: 'IPA', q: 'Hukum Ohm menyatakan hubungan tegangan (V), arus (I), dan hambatan (R) sebagai...', options: ['V = I / R', 'V = I × R', 'I = V × R', 'R = I / V'], answer: 1, exp: 'Hukum Ohm: V = I × R (Volt = Ampere × Ohm).' },
    { subject: 'IPA', q: 'Basa nitrogen yang hanya ditemukan pada RNA (menggantikan Timin pada DNA) adalah...', options: ['Adenin', 'Guanin', 'Sitosin', 'Urasil'], answer: 3, exp: 'RNA memiliki A, U, G, C; sedangkan DNA memiliki A, T, G, C.' },
    // IPS (Ekonomi, Sejarah, Sosiologi)
    { subject: 'IPS', q: 'Kenaikan harga barang dan jasa secara umum dan terus-menerus dalam jangka waktu tertentu disebut...', options: ['Deflasi', 'Inflasi', 'Resesi', 'Devaluasi'], answer: 1, exp: 'Inflasi menurunkan daya beli uang karena harga rata-rata barang terus naik.' },
    { subject: 'IPS', q: 'Konferensi Asia-Afrika (KAA) pertama tahun 1955 diselenggarakan di kota...', options: ['Jakarta', 'Bandung', 'Surabaya', 'Bogor'], answer: 1, exp: 'KAA 1955 di Gedung Merdeka Bandung melahirkan Dasasila Bandung.' },
    { subject: 'IPS', q: 'Dalam ilmu ekonomi, nilai barang/jasa terbaik yang dikorbankan saat memilih alternatif lain disebut...', options: ['Biaya tetap', 'Biaya peluang (Opportunity cost)', 'Biaya marginal', 'Biaya variabel'], answer: 1, exp: 'Biaya peluang muncul karena sumber daya terbatas sehingga kita harus memilih.' },
    { subject: 'IPS', q: 'Perpindahan status sosial seseorang dari satu lapisan ke lapisan lain dalam masyarakat disebut...', options: ['Integrasi sosial', 'Mobilitas sosial', 'Stratifikasi sosial', 'Diferensiasi sosial'], answer: 1, exp: 'Mobilitas sosial bisa bersifat vertikal (naik/turun) maupun horizontal.' },
    // Bahasa & Logika
    { subject: 'Bahasa', q: 'If I ____ enough money, I would buy a new telescope.', options: ['have', 'had', 'will have', 'having'], answer: 1, exp: 'Conditional Sentence Type 2 menggunakan pola: If + Past Tense (had), S + would + V1.' },
    { subject: 'Bahasa', q: 'Paragraf yang kalimat utamanya terletak di akhir paragraf disebut paragraf...', options: ['Deduktif', 'Induktif', 'Campuran', 'Naratif'], answer: 1, exp: 'Induktif: khusus ke umum (kalimat utama/kesimpulan di akhir).' },
    { subject: 'Bahasa', q: 'Premis 1: Semua ilmuwan gemar membaca. Premis 2: Raka adalah ilmuwan. Kesimpulan yang sah adalah...', options: ['Raka gemar membaca', 'Sebagian ilmuwan bukan Raka', 'Raka mungkin membaca', 'Tidak dapat disimpulkan'], answer: 0, exp: 'Silogisme kategoris (Modus Ponens): karena Raka anggota himpunan ilmuwan, ia gemar membaca.' },
    { subject: 'Bahasa', q: 'The word "ubiquitous" in academic English is closest in meaning to...', options: ['Rare', 'Everywhere', 'Ancient', 'Dangerous'], answer: 1, exp: 'Ubiquitous berarti ada di mana-mana (omnipresent).' },
  ],
};

export const TRUE_FALSE_BANK = {
  SD: [
    { statement: 'Matahari adalah sebuah bintang, bukan planet.', isTrue: true, exp: 'Benar! Matahari adalah bintang yang memancarkan cahayanya sendiri.' },
    { statement: 'Paus dan lumba-lumba bernapas menggunakan insang seperti ikan.', isTrue: false, exp: 'Mitos! Paus dan lumba-lumba adalah mamalia laut yang bernapas dengan paru-paru.' },
    { statement: 'Indonesia terletak di Benua Asia dan dilalui garis Khatulistiwa.', isTrue: true, exp: 'Benar! Garis Khatulistiwa melintasi Pontianak, Bonjol, dan beberapa wilayah Indonesia.' },
    { statement: 'Hasil dari 7 × 8 adalah 54.', isTrue: false, exp: 'Mitos! 7 × 8 = 56, sedangkan 54 adalah 6 × 9.' },
    { statement: 'Bunga Rafflesia arnoldii adalah bunga terbesar di dunia dan tumbuh di Sumatra.', isTrue: true, exp: 'Benar! Rafflesia arnoldii ditemukan di hutan hujan Sumatra, terutama Bengkulu.' },
    { statement: 'Bulan menghasilkan cahayanya sendiri di malam hari.', isTrue: false, exp: 'Mitos! Bulan hanya memantulkan cahaya dari Matahari.' },
    { statement: 'Candi Borobudur merupakan candi Buddha terbesar di dunia.', isTrue: true, exp: 'Benar! Candi Borobudur di Magelang, Jawa Tengah, adalah warisan dunia UNESCO.' },
    { statement: 'Laba-laba termasuk kelompok serangga karena punya 6 kaki.', isTrue: false, exp: 'Mitos! Laba-laba termasuk Arachnida dan memiliki 8 kaki, bukan 6.' },
    { statement: 'Air murni membeku pada suhu 0°C pada tekanan normal.', isTrue: true, exp: 'Benar! Titik beku air adalah 0°C dan titik didihnya 100°C.' },
    { statement: 'Komodo adalah kadal terbesar di dunia yang hanya hidup alami di Indonesia.', isTrue: true, exp: 'Benar! Komodo hidup di Pulau Komodo, Rinca, dan sekitarnya di NTT.' },
  ],
  SMP: [
    { statement: 'Suara merambat lebih cepat di ruang hampa daripada di udara.', isTrue: false, exp: 'Mitos! Bunyi adalah gelombang mekanik yang butuh medium; di ruang hampa bunyi tidak bisa merambat.' },
    { statement: 'Jumlah sudut dalam setiap segitiga selalu 180 derajat.', isTrue: true, exp: 'Benar! Pada geometri Euclidean, total ketiga sudut segitiga selalu 180°.' },
    { statement: 'Jantung manusia memiliki 4 ruang: 2 serambi (atrium) dan 2 bilik (ventrikel).', isTrue: true, exp: 'Benar! Serambi menerima darah, sedangkan bilik memompa darah keluar jantung.' },
    { statement: 'Besi akan berkarat lebih cepat di tempat yang benar-benar kering tanpa air dan oksigen.', isTrue: false, exp: 'Mitos! Korosi (karat) membutuhkan reaksi antara besi, oksigen, dan air/kelembapan.' },
    { statement: 'Bilangan prima terkecil adalah 2 dan merupakan satu-satunya bilangan prima genap.', isTrue: true, exp: 'Benar! Angka 1 bukan bilangan prima, jadi 2 adalah yang terkecil.' },
    { statement: 'Kerajaan Sriwijaya dikenal sebagai kerajaan maritim bercorak Buddha di Sumatra.', isTrue: true, exp: 'Benar! Sriwijaya berpusat di sekitar Palembang dan menguasai jalur perdagangan Selat Malaka.' },
    { statement: 'Semua bakteri berbahaya dan menyebabkan penyakit pada manusia.', isTrue: false, exp: 'Mitos! Banyak bakteri baik, misalnya Lactobacillus pada yogurt dan bakteri usus pencernaan.' },
    { statement: 'Cermin cembung sering digunakan sebagai kaca spion kendaraan karena jangkauannya luas.', isTrue: true, exp: 'Benar! Cermin cembung menghasilkan bayangan maya, tegak, diperkecil sehingga pandangan lebih luas.' },
    { statement: 'Rumus kimia untuk garam dapur adalah NaCl.', isTrue: true, exp: 'Benar! Natrium Klorida (NaCl) adalah senyawa penyusun garam dapur.' },
    { statement: 'Bumi lebih dekat ke Matahari saat musim panas di belahan utara, itulah penyebab utama musim.', isTrue: false, exp: 'Mitos! Musim disebabkan oleh kemiringan sumbu rotasi Bumi (23,5°), bukan jarak ke Matahari.' },
  ],
  SMA: [
    { statement: 'Cahaya memiliki sifat dualisme: dapat berperilaku sebagai gelombang sekaligus partikel (foton).', isTrue: true, exp: 'Benar! Efek fotolistrik membuktikan sifat partikel cahaya, sedangkan interferensi membuktikan sifat gelombangnya.' },
    { statement: 'Turunan dari fungsi konstan f(x) = 7 adalah 7.', isTrue: false, exp: 'Mitos! Laju perubahan konstanta selalu nol, jadi f\'(x) = 0.' },
    { statement: 'DNA berbentuk untai ganda (double helix) yang tersusun atas nukleotida.', isTrue: true, exp: 'Benar! Struktur double helix DNA ditemukan oleh Watson, Crick, dan Rosalind Franklin.' },
    { statement: 'Dalam hukum permintaan ekonomi, jika harga barang naik (ceteris paribus), jumlah permintaan cenderung naik.', isTrue: false, exp: 'Mitos! Hukum permintaan berbanding terbalik: harga naik → jumlah yang diminta turun.' },
    { statement: 'Gas mulia (Golongan VIIIA) sangat stabil karena kulit elektron terluarnya sudah penuh.', isTrue: true, exp: 'Benar! Helium (duplet) dan Neon/Argon/dst (oktet) sangat sukar bereaksi.' },
    { statement: 'Nilai sin²(x) + cos²(x) selalu sama dengan 1 untuk setiap bilangan real x.', isTrue: true, exp: 'Benar! Itu adalah identitas trigonometri Pythagoras paling fundamental.' },
    { statement: 'Enzim ikut habis bereaksi setelah mempercepat suatu reaksi kimia dalam tubuh.', isTrue: false, exp: 'Mitos! Enzim adalah biokatalisator yang mempercepat reaksi tanpa ikut habis bereaksi.' },
    { statement: 'Bank Indonesia berperan sebagai bank sentral yang menjaga stabilitas nilai Rupiah.', isTrue: true, exp: 'Benar! Bank Indonesia mengatur kebijakan moneter, sistem pembayaran, dan stabilitas rupiah.' },
    { statement: 'Perang Dunia II berakhir pada tahun 1945, tahun yang sama dengan Proklamasi RI.', isTrue: true, exp: 'Benar! Jepang menyerah kepada Sekutu pada 15 Agustus 1945, dua hari sebelum Proklamasi RI.' },
    { statement: 'Arus listrik searah (DC) secara terus-menerus mengubah arah alirannya setiap detik.', isTrue: false, exp: 'Mitos! Yang bolak-balik adalah AC (Alternating Current), sedangkan DC (Direct Current) searah.' },
  ],
};
