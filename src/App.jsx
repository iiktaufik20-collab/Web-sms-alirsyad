import { supabase } from './lib/supabaseClient'
import { useState, useEffect, useRef } from "react";
import logoAlirsyad from "./assets/logo-alirsyad.png";

// ===================== MOCK DATA =====================
const INITIAL_USERS = [
  { id: 1, username: "admin", password: "admin123", role: "admin", name: "Administrator" },
  { id: 2, username: "kepsek", password: "kepsek123", role: "kepsek", name: "Kepala Sekolah" },
  { id: 3, username: "bk", password: "bk123", role: "bk", name: "Guru BK" },
  { id: 4, username: "kesiswaan", password: "kesiswaan123", role: "kesiswaan", name: "Kesiswaan" },
  { id: 5, username: "walas7a", password: "walas123", role: "walas", name: "Wali Kelas 7A", kelas: "7A" },
  { id: 6, username: "walas7b", password: "walas123", role: "walas", name: "Wali Kelas 7B", kelas: "7B" },
  { id: 7, username: "qiroati", password: "qiroati123", role: "qiroati", name: "Guru Qiroati" },
  { id: 8, username: "bilingual", password: "bilingual123", role: "bilingual", name: "PJ Bilingual" },
  { id: 9, username: "0812345678", password: "ortu123", role: "ortu", name: "Orang Tua - Ahmad Fauzi", siswaNisn: "0011" },
];

const KELAS_LIST = ["7A","7B","7C","7D","8A","8B","8C","8D","9A","9B","9C","9D"];

const INITIAL_SISWA = [
  { nisn:"0011", nipd:"2024001", nama:"Ahmad Fauzi", jk:"L", tempatLahir:"Cirebon", tglLahir:"2011-05-12", kelas:"7A", foto:"", namaAyah:"Hasan", namaIbu:"Siti", noWa:"0812345678", alamat:"Jl. Mawar No. 1", aktif:true },
  { nisn:"0012", nipd:"2024002", nama:"Bunga Rahmawati", jk:"P", tempatLahir:"Cirebon", tglLahir:"2011-03-22", kelas:"7A", foto:"", namaAyah:"Ridwan", namaIbu:"Fatimah", noWa:"0813456789", alamat:"Jl. Melati No. 2", aktif:true },
  { nisn:"0013", nipd:"2024003", nama:"Dafa Ardiansyah", jk:"L", tempatLahir:"Cirebon", tglLahir:"2011-07-14", kelas:"7B", foto:"", namaAyah:"Yusuf", namaIbu:"Nurhasanah", noWa:"0814567890", alamat:"Jl. Anggrek No. 3", aktif:true },
  { nisn:"0014", nipd:"2024004", nama:"Elsa Nurjannah", jk:"P", tempatLahir:"Bandung", tglLahir:"2011-09-01", kelas:"7B", foto:"", namaAyah:"Agus", namaIbu:"Dewi", noWa:"0815678901", alamat:"Jl. Dahlia No. 4", aktif:true },
  { nisn:"0015", nipd:"2024005", nama:"Farhan Maulana", jk:"L", tempatLahir:"Cirebon", tglLahir:"2010-12-20", kelas:"8A", foto:"", namaAyah:"Dian", namaIbu:"Rina", noWa:"0816789012", alamat:"Jl. Kenanga No. 5", aktif:true },
  { nisn:"0016", nipd:"2024006", nama:"Ghina Salsabila", jk:"P", tempatLahir:"Cirebon", tglLahir:"2010-11-05", kelas:"8A", foto:"", namaAyah:"Budi", namaIbu:"Sari", noWa:"0817890123", alamat:"Jl. Flamboyan No. 6", aktif:true },
  { nisn:"0017", nipd:"2024007", nama:"Hafidz Al-Farisi", jk:"L", tempatLahir:"Jakarta", tglLahir:"2010-08-17", kelas:"8B", foto:"", namaAyah:"Eko", namaIbu:"Lina", noWa:"0818901234", alamat:"Jl. Teratai No. 7", aktif:true },
  { nisn:"0018", nipd:"2024008", nama:"Inas Kamila", jk:"P", tempatLahir:"Cirebon", tglLahir:"2009-06-30", kelas:"9A", foto:"", namaAyah:"Fathur", namaIbu:"Halimah", noWa:"0819012345", alamat:"Jl. Cempaka No. 8", aktif:true },
];

const JENIS_PELANGGARAN = [
  // =========================================================================
  // A. PELANGGARAN RINGAN (10 POIN) - Sesuai Handbook Halaman 29
  // =========================================================================
  { nama: "1. Bercanda/bersenda gurau ketika salat, berdzikir, dan berdoa", kategori: "Ringan", poin: 10 },
  { nama: "2. Tidak tertib belajar pada saat pembelajaran di kelas", kategori: "Ringan", poin: 10 },
  { nama: "3. Keluar lingkungan sekolah tanpa izin", kategori: "Ringan", poin: 10 },
  { nama: "4. Melompat pagar atau bangunan pembatas lain di sekolah", kategori: "Ringan", poin: 10 },
  { nama: "5. Makan dan minum tidak sesuai dengan adab-adab Islami (berjalan, bersenda gurau, dll.)", kategori: "Ringan", poin: 10 },
  { nama: "6. Berpenampilan tidak rapi (kuku dan pakaian) dan tidak mengenakan atribut yang telah ditentukan oleh sekolah", kategori: "Ringan", poin: 10 },
  { nama: "7. Berambut panjang atau menata rambut tidak Islami (khusus putra)", kategori: "Ringan", poin: 10 },
  { nama: "8. Celana, rok, baju, kerudung, sepatu, kaus kaki yang tidak sesuai dengan ketentuan sekolah", kategori: "Ringan", poin: 10 },
  { nama: "9. Menggunakan seragam yang tidak sesuai dengan ketentuan sekolah", kategori: "Ringan", poin: 10 },
  { nama: "10. Kerudung sengaja dipendekkan", kategori: "Ringan", poin: 10 },
  { nama: "11. Membawa barang-barang yang tidak dibutuhkan ketika sekolah", kategori: "Ringan", poin: 10 },
  { nama: "12. Mencorat-coret barang milik pribadi", kategori: "Ringan", poin: 10 },
  { nama: "13. Menggambar kulit (tato tidak permanen/henna)", kategori: "Ringan", poin: 10 },
  { nama: "14. Memakai perhiasan/aksesori kecuali jam tangan", kategori: "Ringan", poin: 10 },
  { nama: "15. Tidak menggunakan kaus kaki ketika di kelas", kategori: "Ringan", poin: 10 },
  { nama: "16. Tidak menggunakan sepatu saat kegiatan sekolah", kategori: "Ringan", poin: 10 },
  { nama: "17. Menggunakan sandal tidak pada waktunya", kategori: "Ringan", poin: 10 },
  { nama: "18. Kuku panjang", kategori: "Ringan", poin: 10 },
  { nama: "19. Berolahraga tanpa menggunakan sepatu", kategori: "Ringan", poin: 10 },
  { nama: "20. Melakukan aktivitas olahraga di tempat yang tidak diperkenankan", kategori: "Ringan", poin: 10 },
  { nama: "21. Tidak tertib dalam mengikuti kegiatan ekstrakurikuler", kategori: "Ringan", poin: 10 },
  { nama: "22. Berbicara tidak Islami seperti bicara kotor atau kasar", kategori: "Ringan", poin: 10 },
  { nama: "23. Tidak membawa peralatan ekstrakurikuler", kategori: "Ringan", poin: 10 },
  { nama: "24. Tidak mengikuti kegiatan ekstrakurikuler", kategori: "Ringan", poin: 10 },
  { nama: "25. Bermain permainan yang tidak Islami (permainan kartu dan catur)", kategori: "Ringan", poin: 10 },
  { nama: "26. Masbuk dalam salat berjamaah", kategori: "Ringan", poin: 10 },
  { nama: "27. Tidak melaksanakan salat sunah rawatib dengan sengaja", kategori: "Ringan", poin: 10 },
  { nama: "28. Tidak mengikuti salat berjamaah tanpa keterangan", kategori: "Ringan", poin: 10 },
  { nama: "29. Tidak mengikuti kegiatan resmi sekolah", kategori: "Ringan", poin: 10 },
  { nama: "30. Terlambat datang ke kelas pada jam pelajaran sekolah", kategori: "Ringan", poin: 10 },
  { nama: "31. Tidak masuk kelas tanpa keterangan/izin selama satu kali", kategori: "Ringan", poin: 10 },
  { nama: "32. Terlambat hadir dalam melaksanakan kegiatan sekolah", kategori: "Ringan", poin: 10 },
  { nama: "33. Tidak melaksanakan tugas/piket kelas", kategori: "Ringan", poin: 10 },
  { nama: "34. Tidak mengerjakan tugas dari ustaz/ustazah", kategori: "Ringan", poin: 10 },
  { nama: "35. Tidak membawa peralatan sekolah yang dibutuhkan", kategori: "Ringan", poin: 10 },
  { nama: "36. Meletakkan barang atau peralatan milik pribadi tidak pada tempatnya", kategori: "Ringan", poin: 10 },
  { nama: "37. Membuang sampah tidak pada tempatnya", kategori: "Ringan", poin: 10 },
  { nama: "38. Melakukan tindakan yang mengganggu kebersihan dan keindahan sekolah", kategori: "Ringan", poin: 10 },
  { nama: "39. Menggunakan fasilitas sekolah tidak pada waktunya atau tanpa izin penanggung jawab", kategori: "Ringan", poin: 10 },
  { nama: "40. Lupa atau terlambat mengembalikan barang pinjaman milik sekolah", kategori: "Ringan", poin: 10 },
  { nama: "41. Merusak barang-barang milik orang lain atau sekolah tanpa sengaja", kategori: "Ringan", poin: 10 },

  // =========================================================================
  // B. PELANGGARAN SEDANG (30 POIN) - Sesuai Handbook Halaman 30
  // =========================================================================
  { nama: "1. Mengganggu jalannya ibadah harian sehingga tidak khusyuk dalam ibadah", kategori: "Sedang", poin: 30 },
  { nama: "2. Membuat keributan atau kegaduhan di kelas atau tempat kegiatan lain", kategori: "Sedang", poin: 30 },
  { nama: "3. Memprovokasi untuk melakukan keonaran/kegaduhan di dalam atau di luar sekolah", kategori: "Sedang", poin: 30 },
  { nama: "4. Menghilangkan barang pinjaman milik sekolah maupun orang lain", kategori: "Sedang", poin: 30 },
  { nama: "5. Menggunakan barang milik orang lain tanpa izin", kategori: "Sedang", poin: 30 },
  { nama: "6. Membawa dan menggunakan barang yang tidak terkait dengan proses pembelajaran", kategori: "Sedang", poin: 30 },
  { nama: "7. Menulis, menempel, dan mencorat-coret bukan pada tempatnya", kategori: "Sedang", poin: 30 },
  { nama: "8. Mengadakan perayaan tidak Islami (ulang tahun, Valentine, Natal, dll.)", kategori: "Sedang", poin: 30 },
  { nama: "9. Mengecat rambut (putra) atau mengecat kuku dengan kuteks/henna (putri)", kategori: "Sedang", poin: 30 },
  { nama: "10. Membawa HP (handphone) tanpa izin dari pihak sekolah", kategori: "Sedang", poin: 30 },
  { nama: "11. Membawa sepeda motor", kategori: "Sedang", poin: 30 },
  { nama: "12. Tidak berangkat sekolah selama 7 hari tanpa keterangan", kategori: "Sedang", poin: 30 },
  { nama: "13. Tidak masuk kelas tanpa keterangan/izin selama tiga kali", kategori: "Sedang", poin: 30 },
  { nama: "14. Memprovokasi untuk melakukan tindakan tidak terpuji, menyakiti diri sendiri, atau mengganggu/menyakiti orang lain, baik verbal maupun nonverbal", kategori: "Sedang", poin: 30 },
  { nama: "15. Melakukan kemunafikan: berbohong, berkhianat, atau ingkar janji", kategori: "Sedang", poin: 30 },
  { nama: "16. Menghina atau meremehkan peraturan sekolah", kategori: "Sedang", poin: 30 },
  { nama: "17. Menghina, mengumpat, mengejek, atau merendahkan sesama teman baik secara langsung maupun melalui media sosial", kategori: "Sedang", poin: 30 },
  { nama: "18. Memberikan julukan buruk kepada orang lain secara langsung maupun melalui media sosial", kategori: "Sedang", poin: 30 },
  { nama: "19. Melakukan pelecehan seksual secara verbal", kategori: "Sedang", poin: 30 },
  { nama: "20. Menyakiti diri sendiri (self-harm)", kategori: "Sedang", poin: 30 },
  { nama: "21. Enggan meminta maaf dan/atau memaafkan teman", kategori: "Sedang", poin: 30 },
  { nama: "22. Tidak sopan kepada tamu atau orang lain di sekitar sekolah", kategori: "Sedang", poin: 30 },
  { nama: "23. Menolak peraturan atau kegiatan yang ditetapkan sekolah", kategori: "Sedang", poin: 30 },
  { nama: "24. Merusak barang milik orang lain atau fasilitas milik sekolah dengan sengaja", kategori: "Sedang", poin: 30 },
  { nama: "25. Tidak masuk sekolah tanpa alasan yang diperkenankan oleh sekolah (bolos sekolah)", kategori: "Sedang", poin: 30 },
  { nama: "26. Menggunakan barang-barang milik orang lain tanpa seizin pemiliknya", kategori: "Sedang", poin: 30 },
  { nama: "27. Mengubah atau memalsukan administrasi sekolah (surat izin, tanda tangan, dll.)", kategori: "Sedang", poin: 30 },
  { nama: "28. Menyontek ketika ujian dan/atau memanipulasi hasil penilaian", kategori: "Sedang", poin: 30 },
  { nama: "29. Berbohong atau memanipulasi teman", kategori: "Sedang", poin: 30 },
  { nama: "30. Datang ke sekolah di luar jam KBM tanpa izin wali kelas", kategori: "Sedang", poin: 30 },
  { nama: "31. Menyalahgunakan barang pribadi guru", kategori: "Sedang", poin: 30 },
  { nama: "32. Tidak menjaga aurat di dalam sekolah", kategori: "Sedang", poin: 30 },
  { nama: "33. Ke sekolah di luar jam KBM tanpa didampingi wali kelas", kategori: "Sedang", poin: 30 },
  { nama: "34. Menyuruh orang lain secara tidak patut untuk melakukan hal-hal pribadi, seperti membeli jajanan, mengerjakan tugas/PR, atau mengambilkan barang serta bentuk perintah lainnya." , kategori: "Sedang", poin: 30 },
// =========================================================================
  // C. PELANGGARAN BERAT (90 POIN) - Sesuai Handbook Halaman 31 & 32
  // =========================================================================
  { nama: "1. Melakukan pelanggaran sedang sebanyak lima kali dalam setahun", kategori: "Berat", poin: 90 },
  { nama: "2. Tidak berangkat sekolah lebih dari tujuh hari tanpa keterangan", kategori: "Berat", poin: 90 },
  { nama: "3. Tidak masuk kelas tanpa keterangan/izin lebih dari tiga kali", kategori: "Berat", poin: 90 },
  { nama: "4. Menghina sekolah, guru, atau karyawan di media sosial", kategori: "Berat", poin: 90 },
  { nama: "5. Menghina, mengejek, atau merendahkan guru, karyawan, atau orang tua teman", kategori: "Berat", poin: 90 },
  { nama: "6. Merokok/vape di dalam maupun luar sekolah", kategori: "Berat", poin: 90 },
  { nama: "7. Mempublikasikan diri di media sosial dalam kegiatan yang tidak sesuai dengan peraturan sekolah dan nilai-nilai Islam", kategori: "Berat", poin: 90 },
  { nama: "8. Menfitnah, menghasut, atau memprovokasi orang lain untuk melakukan tindakan negatif", kategori: "Berat", poin: 90 },
  { nama: "9. Mengganggu, mengancam, atau mengintimidasi secara lisan atau tertulis", kategori: "Berat", poin: 90 },
  { nama: "10. Memalak orang lain di sekolah", kategori: "Berat", poin: 90 },
  { nama: "11. Melakukan pelecehan seksual secara fisik", kategori: "Berat", poin: 90 },
  { nama: "12. Bolos sekolah selama dua kali", kategori: "Berat", poin: 90 },
  { nama: "13. Tidak mengerjakan salat fardu dengan sengaja", kategori: "Berat", poin: 90 },
  { nama: "14. Penistaan agama", kategori: "Berat", poin: 90 },
  { nama: "15. Melakukan hal-hal yang tidak sesuai dengan ajaran Islam", kategori: "Berat", poin: 90 },
  { nama: "16. Berkhalwat atau menjalin hubungan spesial secara tidak Islami", kategori: "Berat", poin: 90 },
  { nama: "17. Mengakses konten pornografi", kategori: "Berat", poin: 90 },
  { nama: "18. Membagikan konten pornografi dan penyimpangan lainnya", kategori: "Berat", poin: 90 },
  { nama: "19. Berkhalwat atau menjalin hubungan khusus melalui media sosial dan mengekspresikannya", kategori: "Berat", poin: 90 },
  { nama: "20. Mengonsumsi, menyimpan, menggambar, membicarakan, atau memperjualbelikan konten pornografi, LGBT atau penyimpangan lainnya", kategori: "Berat", poin: 90 },
  { nama: "21. Membawa, membaca, buku yang tidak Islami", kategori: "Berat", poin: 90 },
  { nama: "22. Menulis cerita atau catatan yang bernuansa pornografi dan LGBT / Penyimpangan lainnya", kategori: "Berat", poin: 90 },
  { nama: "23. Membawa, membaca buku yang bernuansa pornografi dan LGBT / Penyimpangan lainnya", kategori: "Berat", poin: 90 },
  { nama: "24. Melakukan kegiatan jual beli yang dilarang oleh sekolah dan agama (Rokok/Vape dll)", kategori: "Berat", poin: 90 },
  { nama: "25. Merusak peralatan atau gedung sekolah secara sengaja", kategori: "Berat", poin: 90 },
  { nama: "26. Melakukan kegiatan yang mencemarkan nama baik sekolah", kategori: "Berat", poin: 90 },
  { nama: "27. Mengunjungi tempat maksiat (diskotek, biliar, karaoke, prostitusi, dll.)", kategori: "Berat", poin: 90 },
  { nama: "28. Melakukan perjudian/taruhan offline maupun online", kategori: "Berat", poin: 90 },
  { nama: "29. Menindik atau membuat tato pada anggota tubuh", kategori: "Berat", poin: 90 },
  { nama: "30. Melakukan pelanggaran sedang sebanyak lima kali dalam setahun", kategori: "Berat", poin: 90 },
  { nama: "31. Menunjukkan indikasi penyimpangan verbal atau nonverbal", kategori: "Berat", poin: 90 },
  { nama: "32. Mengikuti kelompok atau komunitas yang berpotensi membahayakan", kategori: "Berat", poin: 90 },
  { nama: "33. Mencuri atau terlibat dalam pencurian barang milik sekolah atau orang lain", kategori: "Berat", poin: 90 },
  { nama: "34. Berbohong atau memanipulasi informasi kepada guru", kategori: "Berat", poin: 90 },
  { nama: "35. Tidak mengakui perkataan dan perbuatan yang dilakukan", kategori: "Berat", poin: 90 },
  { nama: "36. Menyebarkan isu hoaks", kategori: "Berat", poin: 90 },
  { nama: "37. Berkelahi hingga tiga kali dalam satu semester", kategori: "Berat", poin: 90 },
  { nama: "38. Menghasut atau mengghibah orang lain", kategori: "Berat", poin: 90 },
  { nama: "39. Mengghibah atau mengejek guru dan karyawan", kategori: "Berat", poin: 90 },
  { nama: "40. Tidak menjaga aurat dan mempublikasikannya di media sosial", kategori: "Berat", poin: 90 },

  // =========================================================================
  // D. PELANGGARAN SANGAT BERAT (180 POIN) - Sesuai Handbook Halaman 32
  // =========================================================================
  { nama: "1. Melakukan pelanggaran berat sebanyak empat kali", kategori: "Sangat Berat", poin: 270 },
  { nama: "2. Mengajak dan melakukan aksi kekerasan fisik, seksual, verbal, maupun nonverbal", kategori: "Sangat Berat", poin: 270 },
  { nama: "3. Melakukan dan mengajak aksi penyimpangan", kategori: "Sangat Berat", poin: 270 },
  { nama: "4. Melakukan tindakan kriminal", kategori: "Sangat Berat", poin: 270 },
  { nama: "5. Mempublikasikan atau berkomunikasi online (video call tanpa busana)", kategori: "Sangat Berat", poin: 270 },
  { nama: "6. Melakukan aksi tawuran", kategori: "Sangat Berat", poin: 270 },
  { nama: "7. Melakukan tindakan anarkis", kategori: "Sangat Berat", poin: 270 },
  { nama: "8. Terlibat dalam prostitusi online maupun offline", kategori: "Sangat Berat", poin: 270 },
  { nama: "9. Menggunakan atau menyebarkan narkoba, obat-obatan terlarang, zat adiktif, serta minuman haram", kategori: "Sangat Berat", poin: 270 },
  { nama: "10. Melakukan perbuatan zina", kategori: "Sangat Berat", poin: 270 },
  { nama: "11. Melakukan pelanggaran berat tiga kali dengan jenis yang sama", kategori: "Sangat Berat", poin: 270 },
  { nama: "12. Melakukan pelanggaran berat empat kali dengan jenis yang berbeda", kategori: "Sangat Berat", poin: 270 },
];

  const JENIS_APRESIASI = [
  { id:1, nama:"Juara Kecamatan", pengurangan:20 },
  { id:2, nama:"Juara Kota", pengurangan:30 },
  { id:3, nama:"Juara Provinsi", pengurangan:50 },
  { id:4, nama:"Juara Nasional", pengurangan:100 },
  { id:5, nama:"Hafalan Qur'an (1 Juz)", pengurangan:25 },
  { id:6, nama:"Setor Vocab 100 kata", pengurangan:15 },
  { id:7, nama:"Siswa Teladan", pengurangan:20 },
  { id:8, nama:"Pengurus OSIS Aktif", pengurangan:10 },
  { id:9, nama:"Lainnya", pengurangan:0 },
];

const INITIAL_PELANGGARAN = [
  { id:1, nisn:"0011", nama:"Ahmad Fauzi", kelas:"7A", jenis:"Terlambat masuk sekolah", kategori:"Ringan", poin:10, tanggal:"2025-05-10", guru:"Guru BK", foto:"" },
  { id:2, nisn:"0012", nama:"Bunga Rahmawati", kelas:"7A", jenis:"Tidak menggunakan seragam lengkap", kategori:"Ringan", poin:10, tanggal:"2025-05-12", guru:"Wali Kelas 7A", foto:"" },
  { id:3, nisn:"0013", nama:"Dafa Ardiansyah", kelas:"7B", jenis:"Membolos pelajaran", kategori:"Sedang", poin:30, tanggal:"2025-05-15", guru:"Guru BK", foto:"" },
  { id:4, nisn:"0011", nama:"Ahmad Fauzi", kelas:"7A", jenis:"Berbicara tidak sopan", kategori:"Sedang", poin:30, tanggal:"2025-05-18", guru:"Wali Kelas 7A", foto:"" },
  { id:5, nisn:"0015", nama:"Farhan Maulana", kelas:"8A", jenis:"Berkelahi", kategori:"Berat", poin:90, tanggal:"2025-05-20", guru:"Kesiswaan", foto:"" },
];

const INITIAL_APRESIASI = [
  { id:1, nisn:"0011", nama:"Ahmad Fauzi", kelas:"7A", jenis:"Hafalan Qur'an (1 Juz)", pengurangan:25, tanggal:"2025-05-05", guru:"Guru Qiroati", keterangan:"" },
  { id:2, nisn:"0018", nama:"Inas Kamila", kelas:"9A", jenis:"Juara Kota", pengurangan:30, tanggal:"2025-05-08", guru:"Kesiswaan", keterangan:"MTQ tingkat kota" },
];

const INITIAL_HAFALAN = [
  { id:1, nisn:"0011", nama:"Ahmad Fauzi", kelas:"7A", tanggal:"2025-05-20", capaian:"Al-Baqarah 1-20", tipe:"Tahfidz", kelancaran:"Lancar", status:"Lulus", guru:"Guru Qiroati" },
  { id:2, nisn:"0012", nama:"Bunga Rahmawati", kelas:"7A", tanggal:"2025-05-21", capaian:"Al-Fatihah", tipe:"Tahfidz", kelancaran:"Lancar", status:"Lulus", guru:"Guru Qiroati" },
  { id:3, nisn:"0018", nama:"Inas Kamila", kelas:"9A", tanggal:"2025-05-22", capaian:"Jilid 3 Hal 5", tipe:"Jilid", kelancaran:"Cukup Lancar", status:"Lulus", guru:"Guru Qiroati" },
  { id:4, nisn:"0015", nama:"Farhan Maulana", kelas:"8A", tanggal:"2025-05-22", capaian:"Tajwid Ghorib Bab 1", tipe:"Tajwid Ghorib", kelancaran:"Lancar", status:"Lulus", guru:"Guru Qiroati" },
];

const INITIAL_VOCAB = [
  { id:1, nisn:"0011", nama:"Ahmad Fauzi", kelas:"7A", tanggal:"2025-05-20", jumlah:15, keterangan:"Unit 3", guru:"PJ Bilingual" },
  { id:2, nisn:"0012", nama:"Bunga Rahmawati", kelas:"7A", tanggal:"2025-05-21", jumlah:20, keterangan:"Unit 4", guru:"PJ Bilingual" },
  { id:3, nisn:"0018", nama:"Inas Kamila", kelas:"9A", tanggal:"2025-05-22", jumlah:25, keterangan:"Unit 7", guru:"PJ Bilingual" },
  { id:4, nisn:"0015", nama:"Farhan Maulana", kelas:"8A", tanggal:"2025-05-23", jumlah:18, keterangan:"Unit 5", guru:"PJ Bilingual" },
];

const INITIAL_ABSENSI = [
  { id:1, nisn:"0011", nama:"Ahmad Fauzi", kelas:"7A", tanggal:"2025-05-20", status:"Hadir", keterangan:"" },
  { id:2, nisn:"0012", nama:"Bunga Rahmawati", kelas:"7A", tanggal:"2025-05-20", status:"Hadir", keterangan:"" },
  { id:3, nisn:"0013", nama:"Dafa Ardiansyah", kelas:"7B", tanggal:"2025-05-20", status:"Sakit", keterangan:"Demam" },
];

const INITIAL_CATATAN = [
  { id:1, nisn:"0013", nama:"Dafa Ardiansyah", kelas:"7B", tanggal:"2025-05-15", catatan:"Siswa ditemukan membolos saat jam pelajaran Bahasa Indonesia", guru:"Wali Kelas 7B", tindakLanjut:"Dipanggil ke BK" },
];

const INITIAL_GURU = [
  { id:1, nip:"199001012020011001", nama:"Bapak Ahmad Kosasih, S.Pd", jabatan:"Guru BK", kelas:"", username:"bk", password:"bk123", aktif:true },
  { id:2, nip:"199203152021012002", nama:"Ibu Siti Rahayu, S.Pd", jabatan:"Wali Kelas 7A", kelas:"7A", username:"walas7a", password:"walas123", aktif:true },
  { id:3, nip:"199506202022011003", nama:"Bapak Fauzan, S.Ag", jabatan:"Guru Qiroati", kelas:"", username:"qiroati", password:"qiroati123", aktif:true },
  { id:4, nip:"199808102023012004", nama:"Ibu Laila, S.S", jabatan:"PJ Bilingual", kelas:"", username:"bilingual", password:"bilingual123", aktif:true },
  { id:5, nip:"199102052019011005", nama:"Bapak Rizky Pratama, S.Pd", jabatan:"Kesiswaan", kelas:"", username:"kesiswaan", password:"kesiswaan123", aktif:true },
];

// ===================== UTILITIES =====================
const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" });
};

const getAkumulasiPoin = (nisn, pelanggaran, apresiasi) => {
  const totalPelanggaran = pelanggaran.filter(p => p.nisn === nisn).reduce((s, p) => s + p.poin, 0);
  const totalApresiasi = apresiasi.filter(a => a.nisn === nisn).reduce((s, a) => s + a.pengurangan, 0);
  return Math.max(0, totalPelanggaran - totalApresiasi);
};

const getSP = (poin) => {
  if (poin > 270) {
    return { 
      level: "Pelanggaran Sangat Berat", 
      color: "#7F1D1D", 
      bg: "#fee2e2",
      pj: "Kepala Sekolah",
      tindakLanjut: "Kasus diserahkan kepada Kepala Sekolah. Orang tua dipanggil untuk musyawarah dan sekolah dapat mengembalikan siswa kepada orang tua sesuai ketentuan yang berlaku."
    };
  }
  if (poin === 270) {
    return { 
      level: "Pelanggaran Berat (SP3)", 
      color: "#B91C1C", 
      bg: "#fee2e2",
      pj: "Waka Kesiswaan & Kepala Sekolah",
      tindakLanjut: "Penerbitan SP3, pemanggilan orang tua, pembinaan terakhir, serta pemberitahuan bahwa pelanggaran berikutnya akan diproses ke tahap sangat berat."
    };
  }
  if (poin >= 180 && poin <= 269) {
    return { 
      level: "Pelanggaran Berat (SP2)", 
      color: "#DC2626", 
      bg: "#fee2e2",
      pj: "Wakil Kepala Sekolah Bidang Kesiswaan",
      tindakLanjut: "Penerbitan SP2, pembinaan lanjutan, pemanggilan orang tua kembali, evaluasi perilaku siswa, dan kontrak pembinaan yang lebih ketat."
    };
  }
  if (poin >= 90 && poin <= 179) {
    return { 
      level: "Pelanggaran Berat (SP1)", 
      color: "#EA580C", 
      bg: "#ffedd5",
      pj: "Wakil Kepala Sekolah Bidang Kesiswaan",
      tindakLanjut: "Penerbitan SP1, pembinaan bersama Waka Kesiswaan dan BK, pemanggilan orang tua, penandatanganan surat pernyataan, serta pemberian konsekuensi sesuai tata tertib sekolah."
    };
  }
  if (poin >= 31 && poin <= 89) {
    return { 
      level: "Pelanggaran Sedang", 
      color: "#D97706", 
      bg: "#fef3c7",
      pj: "Guru BK",
      tindakLanjut: "Pembinaan bersama BK, komunikasi dengan orang tua, konseling, pemberian konsekuensi yang bersifat mendidik, serta pemantauan secara berkala."
    };
  }
  if (poin >= 10 && poin <= 30) {
    return { 
      level: "Pelanggaran Ringan", 
      color: "#2563eb", 
      bg: "#dbeafe",
      pj: "Wali Kelas",
      tindakLanjut: "Pembinaan oleh wali kelas, komunikasi dengan orang tua, pemberian konsekuensi edukatif sesuai jenis pelanggaran, serta pemantauan perubahan perilaku."
    };
  }
  return { 
    level: "Aman / Normal", 
    color: "#4B5563", 
    bg: "#f3f4f6",
    pj: "Wali Kelas",
    tindakLanjut: "Pemantauan perkembangan perilaku berkala oleh Wali Kelas."
  };
};

const totalVocabSiswa = (nisn, vocab) => vocab.filter(v => v.nisn === nisn).reduce((s, v) => s + v.jumlah, 0);
const totalHafalanSiswa = (nisn, hafalan) => hafalan.filter(h => h.nisn === nisn && h.status === "Lulus").length;

// ===================== COLORS =====================
const C = {
  emerald: "#059669",
  emeraldDark: "#065f46",
  emeraldLight: "#d1fae5",
  emeraldMid: "#10b981",
  gold: "#d97706",
  goldLight: "#fef3c7",
  white: "#ffffff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray600: "#4b5563",
  gray700: "#374151",
  gray900: "#111827",
  red: "#dc2626",
  redLight: "#fee2e2",
  blue: "#2563eb",
  blueLight: "#dbeafe",
};

// ===================== COMPONENTS =====================
const Badge = ({ children, color = C.emerald, bg = C.emeraldLight }) => (
  <span style={{ background: bg, color, padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{children}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.08)", padding: 20, ...style }}>{children}</div>
);

const StatCard = ({ icon, label, value, color = C.emerald, sub }) => (
  <Card style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px" }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
    <div>
      <div style={{ color: C.gray600, fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 22, color: C.gray900 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.gray600 }}>{sub}</div>}
    </div>
  </Card>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 5 }}>{label}</label>}
    <input {...props} style={{ width: "100%", border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", background: C.white, boxSizing: "border-box", ...props.style }} />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 5 }}>{label}</label>}
    <select {...props} style={{ width: "100%", border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", background: C.white, boxSizing: "border-box", ...props.style }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Btn = ({ children, onClick, variant = "primary", small, style = {} }) => {
  const base = { padding: small ? "5px 14px" : "9px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: small ? 12 : 14, transition: "opacity .15s", ...style };
  const variants = {
    primary: { background: C.emerald, color: C.white },
    gold: { background: C.gold, color: C.white },
    danger: { background: C.red, color: C.white },
    ghost: { background: C.gray100, color: C.gray700, border: `1px solid ${C.gray200}` },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

const Table = ({ cols, rows, renderRow }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr>{cols.map(c => <th key={c} style={{ background: C.emeraldLight, color: C.emeraldDark, padding: "10px 12px", textAlign: "left", fontWeight: 700 }}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.length === 0
          ? <tr><td colSpan={cols.length} style={{ textAlign: "center", padding: 30, color: C.gray600 }}>Belum ada data</td></tr>
          : rows.map((r, i) => <tr key={i} style={{ background: i % 2 === 0 ? C.white : C.gray50 }}>{renderRow(r, i)}</tr>)
        }
      </tbody>
    </table>
  </div>
);

const SimpleBar = ({ data, label, color = C.emerald, height = 120 }) => {
  if (!data || data.length === 0) return <div style={{ color: C.gray600, textAlign: "center", padding: 20 }}>Tidak ada data</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ fontSize: 10, color: C.gray700, fontWeight: 600 }}>{d.value}</div>
          <div style={{ width: "100%", background: color, borderRadius: "4px 4px 0 0", height: `${(d.value / max) * (height - 30)}px`, minHeight: d.value > 0 ? 4 : 0, transition: "height .3s" }} />
          <div style={{ fontSize: 9, color: C.gray600, textAlign: "center", wordBreak: "break-word" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.white, borderRadius: 14, boxShadow: "0 8px 40px rgba(0,0,0,.18)", padding: 28, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: C.gray900 }}>{title}</div>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: C.gray600 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ===================== SIDEBAR NAV =====================
const MENUS = {
  admin: [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "siswa", icon: "👥", label: "Data Siswa" },
    { key: "guru", icon: "👨‍🏫", label: "Data Guru" },
    { key: "pelanggaran", icon: "⚠️", label: "Pelanggaran" },
    { key: "apresiasi", icon: "🏆", label: "Apresiasi" },
    { key: "qiroati", icon: "📖", label: "Qiroati" },
    { key: "vocab", icon: "📘", label: "Vocab" },
    { key: "absensi", icon: "📋", label: "Absensi" },
    { key: "catatan", icon: "📝", label: "Catatan Kejadian" },
    { key: "laporan", icon: "📊", label: "Laporan" },
  ],
  kepsek: [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "siswa", icon: "👥", label: "Data Siswa" },
    { key: "pelanggaran", icon: "⚠️", label: "Pelanggaran" },
    { key: "catatan", icon: "📝", label: "Catatan Kejadian" },
    { key: "apresiasi", icon: "🏆", label: "Apresiasi" },
    { key: "absensi", icon: "📋", label: "Absensi" },
    { key: "vocab", icon: "📘", label: "Vocab" },
    { key: "qiroati", icon: "📖", label: "Qiroati" },
    { key: "laporan", icon: "📊", label: "Laporan" },
  ],
  bk: [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "siswa", icon: "👥", label: "Data Siswa" },
    { key: "pelanggaran", icon: "⚠️", label: "Pelanggaran" },
    { key: "catatan", icon: "📝", label: "Catatan Kejadian" },
    { key: "apresiasi", icon: "🏆", label: "Apresiasi" },
    { key: "absensi", icon: "📋", label: "Absensi" },
    { key: "vocab", icon: "📘", label: "Vocab" },
    { key: "qiroati", icon: "📖", label: "Qiroati" },
    { key: "laporan", icon: "📊", label: "Laporan" },
  ],
  kesiswaan: [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "siswa", icon: "👥", label: "Data Siswa" },
    { key: "pelanggaran", icon: "⚠️", label: "Pelanggaran" },
    { key: "catatan", icon: "📝", label: "Catatan Kejadian" },
    { key: "apresiasi", icon: "🏆", label: "Apresiasi" },
    { key: "absensi", icon: "📋", label: "Absensi" },
    { key: "vocab", icon: "📘", label: "Vocab" },
    { key: "qiroati", icon: "📖", label: "Qiroati" },
    { key: "laporan", icon: "📊", label: "Laporan" },
  ],
  // === BERIKUT ROLE BARU TAMBAHAN KITA ===
  walas: [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "siswa", icon: "👥", label: "Data Siswa" },
    { key: "pelanggaran", icon: "⚠️", label: "Pelanggaran" },
    { key: "catatan", icon: "📝", label: "Catatan Kejadian" },
    { key: "apresiasi", icon: "🏆", label: "Apresiasi" },
    { key: "absensi", icon: "📋", label: "Absensi" },
    { key: "vocab", icon: "📘", label: "Vocab" },
    { key: "qiroati", icon: "📖", label: "Qiroati" },
    { key: "laporan", icon: "📊", label: "Laporan" },
  ],
  guru_mapel: [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "siswa", icon: "👥", label: "Data Siswa" },
    { key: "pelanggaran", icon: "⚠️", label: "Pelanggaran" },
    { key: "catatan", icon: "📝", label: "Catatan Kejadian" },
    { key: "apresiasi", icon: "🏆", label: "Apresiasi" },
    { key: "absensi", icon: "📋", label: "Absensi" },
  ],
  bilingual: [
    { key: "dashboard", icon: "🏠", label: "Dashboard" },
    { key: "guru", icon: "👨‍🏫", label: "Data Guru" },
    { key: "siswa", icon: "👥", label: "Data Siswa" },
    { key: "vocab", icon: "📘", label: "Vocab" },
    { key: "apresiasi", icon: "🏆", label: "Apresiasi" },
    { key: "laporan", icon: "📊", label: "Laporan" },
  ],
  ortu: [
    { key: "dashboard", icon: "🏠", label: "Dashboard Anak" },
  ],
};

// ===================== MAIN APP =====================
export default function App() {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State data
  const [siswa, setSiswa] = useState(INITIAL_SISWA);
  useEffect(() => {
  ambilDataSiswa()
}, [])

async function ambilDataSiswa() {
  const { data, error } = await supabase
    .from('siswa')

    .select('*')
console.log('DATA SISWA PERTAMA =', data[0])
console.log('ERROR SISWA =', error)

  if (error) {
    console.error(error)
    return
  }

  setSiswa(data)
}
  const [pelanggaran, setPelanggaran] = useState(INITIAL_PELANGGARAN);
  const [apresiasi, setApresiasi] = useState(INITIAL_APRESIASI);
  const [hafalan, setHafalan] = useState(INITIAL_HAFALAN);
  const [vocab, setVocab] = useState(INITIAL_VOCAB);
  const [absensi, setAbsensi] = useState(INITIAL_ABSENSI);
  const [catatan, setCatatan] = useState(INITIAL_CATATAN);
  const [guru, setGuru] = useState(INITIAL_GURU);
  const [users, setUsers] = useState(INITIAL_USERS);

  const handleLogin = (u) => { setUser(u); setActiveMenu("dashboard"); };
  const handleLogout = () => { setUser(null); setActiveMenu("dashboard"); };

  if (!user) return <LoginPage onLogin={handleLogin} users={users} siswa={siswa} pelanggaran={pelanggaran} apresiasi={apresiasi} hafalan={hafalan} />;

  const menus = MENUS[user.role] || [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.gray50, fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 230 : 60, background: `linear-gradient(180deg, ${C.emeraldDark} 0%, #064e3b 100%)`, transition: "width .25s", flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ padding: "18px 16px", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
  src={logoAlirsyad}
  alt="Logo Al-Irsyad"
  style={{
    width: "50px",
    height: "50px",
    objectFit: "contain"
  }}
/>
          {sidebarOpen && (
              <div>
                <div style={{ color: C.white, fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>SMS Al-Irsyad</div>
                <div style={{ color: "rgba(255,255,255,.6)", fontSize: 10 }}>Kota Cirebon</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {menus.map(m => (
            <button key={m.key} onClick={() => setActiveMenu(m.key)}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, background: activeMenu === m.key ? "rgba(255,255,255,.15)" : "transparent", color: activeMenu === m.key ? C.white : "rgba(255,255,255,.7)", fontWeight: activeMenu === m.key ? 700 : 400, fontSize: 13, textAlign: "left", transition: "background .15s" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{m.icon}</span>
              {sidebarOpen && m.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        {sidebarOpen && (
          <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,.12)" }}>
            <div style={{ color: "rgba(255,255,255,.6)", fontSize: 11 }}>Login sebagai</div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{user.name}</div>
            <button onClick={handleLogout} style={{ width: "100%", padding: "6px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: C.white, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Keluar</button>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ background: C.white, padding: "12px 24px", borderBottom: `1px solid ${C.gray200}`, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: C.gray700 }}>☰</button>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.emeraldDark }}>SMP Al-Irsyad Al-Islamiyyah Kota Cirebon</div>
              <div style={{ fontSize: 11, color: C.gray600 }}>Sistem Monitoring Siswa (SMS)</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 99, background: C.emeraldLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.emeraldDark }}>
              {user.name[0]}
            </div>
            <div style={{ display: "none" }}></div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <PageContent
            activeMenu={activeMenu}
            user={user}
            siswa={siswa} setSiswa={setSiswa}
            pelanggaran={pelanggaran} setPelanggaran={setPelanggaran}
            apresiasi={apresiasi} setApresiasi={setApresiasi}
            hafalan={hafalan} setHafalan={setHafalan}
            vocab={vocab} setVocab={setVocab}
            absensi={absensi} setAbsensi={setAbsensi}
            catatan={catatan} setCatatan={setCatatan}
            guru={guru} setGuru={setGuru}
            users={users} setUsers={setUsers}
          />
        </div>
      </div>
    </div>
  );
}

// ===================== LOGIN PAGE =====================
function LoginPage({ onLogin, users, siswa, pelanggaran, apresiasi, hafalan }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const [savedCreds, setSavedCreds] = useState(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("sms_saved_login");
      if (s) { const c = JSON.parse(s); setSavedCreds(c); setUsername(c.username); setPassword(c.password); }
    } catch(e) {}
  }, []);

   const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset pesan error dulu

    try {
      // 1. LOGIN KE SUPABASE AUTH
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,    // Mengambil nilai dari input state username (baris 411)
        password: password, // Mengambil nilai dari input state password (baris 412)
      });

      // 2. JIKA LOGIN GAGAL
      if (error) {
        setError("Username atau password salah");
        console.error("Gagal login:", error.message);
        return;
      }

      // 3. JIKA BERHASIL LOGIN, PROSES ATUR ROLE & IDENTITAS USER
      if (data?.user) {
        console.log("Login Supabase Sukses!", data.user);
        
        // Ambil teks sebelum karakter @ (Contoh: walas8a@alirsyad.com -> walas8a)
        const detectedUsername = data.user.email.split('@')[0].toLowerCase(); 
        
        let detectedRole = 'guru_mapel'; // Role bawaan standard jika tidak lolos seleksi di bawah
        let displayName = 'Guru Mata Pelajaran';
        let nomorWAOrangTua = ''; 

        // PENYARINGAN KATA KUNCI EMAIL KE ROLE APLIKASI
        if (detectedUsername === 'admin') {
          detectedRole = 'admin';
          displayName = 'Administrator';
        } else if (detectedUsername === 'bk') {
          detectedRole = 'bk';
          displayName = 'Guru BK';
        } else if (detectedUsername === 'kesiswaan') {
          detectedRole = 'kesiswaan';
          displayName = 'Kesiswaan';
        } else if (detectedUsername === 'kepsek' || detectedUsername === 'kepala_sekolah') {
          detectedRole = 'kepsek';
          displayName = 'Kepala Sekolah';
        } else if (detectedUsername === 'bilingual' || detectedUsername === 'pj_bilingual') {
          detectedRole = 'bilingual';
          displayName = 'PJ Bilingual';
        } else if (detectedUsername.startsWith('walas')) {
          // Mendeteksi format terpisah seperti walas7a, walas8b, walas9d, dll.
          detectedRole = 'walas'; 
          const kelas = detectedUsername.replace('walas', '').toUpperCase();
          displayName = `Wali Kelas ${kelas}`;
        } else if (detectedUsername.startsWith('ortu')) {
          // Mendeteksi format ortu_081234567890
          detectedRole = 'ortu'; 
          displayName = 'Orang Tua Siswa';
          // Ambil nomor WA-nya (Contoh: ortu_08123456789 -> 08123456789)
          nomorWAOrangTua = detectedUsername.replace('ortu_', ''); 
        } else if (detectedUsername.startsWith('guru')) {
          detectedRole = 'guru_mapel';
          displayName = 'Guru Mapel';
        }

        // BUNGKUS MENJADI DATA USER JADI-PAKAI UNTUK DASHBOARD
        const userKomplit = {
          id: data.user.id,
          username: detectedUsername,
          email: data.user.email,
          role: detectedRole, 
          name: displayName,
          whatsapp: nomorWAOrangTua // Mengirim data WA khusus untuk akun orang tua
        };

        // Kirim data komplit ini ke state/fungsi login utama aplikasi kamu
        onLogin(userKomplit); 
      }

    } catch (err) {
      console.error("Sistem error:", err);
      setError("Username atau password salah");
    }
  };

  // Marquee achievements
  const achievements = [
    "🏆 Inas Kamila meraih Juara Kota MTQ",
    "📖 Ahmad Fauzi selesai hafalan Al-Baqarah 1-20",
    "🌟 Bunga Rahmawati setoran hafalan Al-Fatihah dengan lancar",
    "📚 Farhan Maulana selesai Tajwid Ghorib Bab 1",
  ];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.emeraldDark} 0%, #064e3b 50%, #065f46 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {/* Achievement ticker */}
      <div style={{ width: "100%", maxWidth: 520, marginBottom: 20, background: "rgba(255,255,255,.1)", borderRadius: 10, padding: "8px 16px", overflow: "hidden" }}>
        <div style={{ color: "rgba(255,255,255,.9)", fontSize: 12, whiteSpace: "nowrap", animation: "scroll 20s linear infinite" }}>
          {achievements.join("   •   ")}
        </div>
        <style>{`@keyframes scroll { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }`}</style>
      </div>

      <div style={{ background: C.white, borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,.25)", padding: 40, width: "100%", maxWidth: 420 }}>
        {/* Logo */}
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <img 
        src={logoAlirsyad} 
        alt="Logo Al-Irsyad" 
        style={{ 
          width: "90px", 
          height: "90px", 
          objectFit: "contain", 
          margin: "0 auto 12px auto", 
          display: "block" 
        }} 
      />
      <div style={{ fontWeight: 800, fontSize: 18, color: C.emeraldDark }}>SMS AL-IRSYAD</div>
      <div style={{ color: C.emeraldDark, fontSize: 13, fontWeight: 600, marginTop: -2, marginBottom: 4 }}>
        (Sistem Monitoring Siswa)
      </div>
      <div style={{ color: C.emeraldMid, fontSize: 13, fontWeight: 600 }}>SMP AL-IRSYAD AL-ISLAMIYYAH</div>
      <div style={{ color: C.emeraldMid, fontSize: 12, fontWeight: 600 }}>KOTA CIREBON</div>
    </div>

        <div style={{ background: C.emeraldLight, borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: C.emeraldDark, textAlign: "center" }}>
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>

        <Input label="Email" value={username} onChange={e => setUsername(e.target.value)} placeholder="Masukkan email..." />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password..." onKeyDown={e => e.key === "Enter" && handleLogin()} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} />
          <label htmlFor="remember" style={{ fontSize: 13, color: C.gray600, cursor: "pointer" }}>Ingat login saya</label>
        </div>

        {error && <div style={{ background: C.redLight, color: C.red, borderRadius: 8, padding: "8px 14px", fontSize: 13, marginBottom: 14 }}>{error}</div>}

        <Btn onClick={handleLogin} style={{ width: "100%" }}>Masuk →</Btn>

        <div style={{ marginTop: 20, padding: "12px", background: C.gray50, borderRadius: 8, fontSize: 11, color: C.gray600 }}>
        </div>
      </div>
    </div>
  );
}

// ===================== PAGE CONTENT ROUTER =====================
function PageContent(props) {
  const { activeMenu, user } = props;
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 11) return "Selamat Pagi";
    if (h < 15) return "Selamat Siang";
    if (h < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  if (activeMenu === "dashboard") {
    const role = user.role;
    if (role === "ortu") return <DashboardOrtu {...props} />;
    return <DashboardUtama {...props} greeting={greeting()} />;
  }
  if (activeMenu === "siswa") return <ModulSiswa {...props} />;
  if (activeMenu === "guru") return <ModulGuru {...props} />;
  if (activeMenu === "pelanggaran") return <ModulPelanggaran {...props} />;
  if (activeMenu === "apresiasi") return <ModulApresiasi {...props} />;
  if (activeMenu === "qiroati") return <ModulQiroati {...props} />;
  if (activeMenu === "vocab") return <ModulVocab {...props} />;
  if (activeMenu === "absensi") return <ModulAbsensi {...props} />;
  if (activeMenu === "catatan") return <ModulCatatan {...props} />;
  if (activeMenu === "laporan") return <ModulLaporan {...props} />;
  return <div style={{ padding: 40, textAlign: "center", color: C.gray600 }}>Halaman tidak ditemukan</div>;
}

// ===================== DASHBOARD UTAMA =====================
function DashboardUtama({ user, siswa, pelanggaran, apresiasi, hafalan, vocab, catatan, greeting }) {
  const totalSiswa = siswa.length;
  const totalPelanggaran = pelanggaran.length;
  const totalApresiasi = apresiasi.length;
  const totalHafalan = hafalan.length;

  // Ranking hafalan
  const rankHafalan = siswa.map(s => ({ nama: s.nama, kelas: s.kelas, total: totalHafalanSiswa(s.nisn, hafalan) })).sort((a, b) => b.total - a.total).slice(0, 5);
  // Ranking vocab
  const rankVocab = siswa.map(s => ({ nama: s.nama, kelas: s.kelas, total: totalVocabSiswa(s.nisn, vocab) })).sort((a, b) => b.total - a.total).slice(0, 5);
  // Ranking pelanggaran per kelas
  const pelanggaranKelas = KELAS_LIST.map(k => ({ label: k, value: pelanggaran.filter(p => p.kelas === k).reduce((s, p) => s + p.poin, 0) })).sort((a, b) => a.value - b.value);
  // Hafalan per kelas
  const hafalanKelas = KELAS_LIST.slice(0, 6).map(k => ({ label: k, value: hafalan.filter(h => siswa.find(s => s.nisn === h.nisn && s.kelas === k)).length }));
  // Vocab per kelas
  const vocabKelas = KELAS_LIST.slice(0, 6).map(k => ({ label: k, value: vocab.filter(v => siswa.find(s => s.nisn === v.nisn && s.kelas === k)).reduce((s, v) => s + v.jumlah, 0) }));

  // SP counts
  const sp1 = siswa.filter(s => { const p = getAkumulasiPoin(s.nisn, pelanggaran, apresiasi); return p >= 90 && p < 179; }).length;
  const sp2 = siswa.filter(s => { const p = getAkumulasiPoin(s.nisn, pelanggaran, apresiasi); return p >= 180 && p < 269; }).length;
  const sp3 = siswa.filter(s => { const p = getAkumulasiPoin(s.nisn, pelanggaran, apresiasi); return p >= 270; }).length;

  const roleLabel = { admin: "Admin", kepsek: "Kepala Sekolah", bk: "Guru BK", kesiswaan: "Kesiswaan", walas: "Wali Kelas", qiroati: "Guru Qiroati", bilingual: "PJ Bilingual" };

  return (
    <div>
      {/* Greeting */}
      <Card style={{ background: `linear-gradient(135deg, ${C.emerald}, ${C.emeraldDark})`, color: C.white, marginBottom: 24 }}>
        <div style={{ fontSize: 14, opacity: .8 }}>Assalamu'alaikum Warahmatullahi Wabarakatuh</div>
        <div style={{ fontWeight: 800, fontSize: 22, marginTop: 4 }}>{greeting}, {user.name} 👋</div>
        <div style={{ fontSize: 13, opacity: .75, marginTop: 4 }}>Login sebagai {roleLabel[user.role] || user.role} • {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
      </Card>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Total Siswa" value={totalSiswa} color={C.emerald} sub="Siswa aktif" />
        <StatCard icon="⚠️" label="Total Pelanggaran" value={totalPelanggaran} color={C.red} sub="Semua kelas" />
        <StatCard icon="🏆" label="Total Apresiasi" value={totalApresiasi} color={C.gold} sub="Semua siswa" />
        <StatCard icon="📖" label="Setoran Hafalan" value={totalHafalan} color={C.blue} sub="Total setoran" />
        <StatCard icon="📋" label="SP1" value={sp1} color={C.red} sub="90-179 poin" />
        <StatCard icon="🔴" label="SP2" value={sp2} color={C.red} sub="180-269 poin" />
        <StatCard icon="🚨" label="SP3 / Kritis" value={sp3} color={C.red} sub="270+ poin" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>📊 Setoran Hafalan per Kelas</div>
          <SimpleBar data={hafalanKelas} color={C.emerald} height={140} />
        </Card>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>🔤 Setoran Vocab per Kelas</div>
          <SimpleBar data={vocabKelas} color={C.gold} height={140} />
        </Card>
      </div>

      {/* Rankings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Top Hafalan Siswa */}
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>🏅 Ranking Hafalan Terbanyak</div>
          {rankHafalan.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 99, background: i < 3 ? C.gold : C.gray100, color: i < 3 ? C.white : C.gray700, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{r.nama}</div>
              <Badge color={C.emeraldDark} bg={C.emeraldLight}>{r.total} setoran</Badge>
            </div>
          ))}
        </Card>

        {/* Top Vocab Siswa */}
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>🏅 Ranking Vocab Terbanyak</div>
          {rankVocab.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 99, background: i < 3 ? C.gold : C.gray100, color: i < 3 ? C.white : C.gray700, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{r.nama}</div>
              <Badge color={C.gold} bg={C.goldLight}>{r.total} kata</Badge>
            </div>
          ))}
        </Card>

        {/* Kelas Terbaik Pelanggaran (poin terendah) */}
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>🏫 Kelas Poin Pelanggaran Terendah</div>
          {pelanggaranKelas.slice(0, 5).map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 99, background: i < 3 ? C.emerald : C.gray100, color: i < 3 ? C.white : C.gray700, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{r.label}</div>
              <Badge color={r.value === 0 ? C.emeraldDark : C.red} bg={r.value === 0 ? C.emeraldLight : C.redLight}>{r.value} poin</Badge>
            </div>
          ))}
        </Card>
      </div>

      {/* Aktivitas Terbaru */}
      <Card>
        <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>🕐 Aktivitas Terbaru</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...pelanggaran.slice(-3).reverse().map(p => ({ icon: "⚠️", text: `${p.nama} (${p.kelas}) - ${p.jenis}`, tanggal: p.tanggal, color: C.red })),
            ...apresiasi.slice(-2).reverse().map(a => ({ icon: "🏆", text: `${a.nama} (${a.kelas}) - ${a.jenis}`, tanggal: a.tanggal, color: C.gold })),
            ...hafalan.slice(-2).reverse().map(h => ({ icon: "📖", text: `${h.nama} (${h.kelas}) - ${h.capaian}`, tanggal: h.tanggal, color: C.emerald })),
          ].slice(0, 6).map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 8, background: C.gray50 }}>
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              <div style={{ flex: 1, fontSize: 13 }}>{a.text}</div>
              <div style={{ fontSize: 11, color: C.gray600 }}>{formatDate(a.tanggal)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ===================== DASHBOARD ORANG TUA =====================
function DashboardOrtu({ user, siswa, pelanggaran, apresiasi, hafalan, vocab, absensi }) {
  const anak = siswa.find(s => s.nisn === user.siswaNisn);
  if (!anak) return <div style={{ padding: 40, textAlign: "center" }}>Data anak tidak ditemukan</div>;

  const poin = getAkumulasiPoin(anak.nisn, pelanggaran, apresiasi);
  const sp = getSP(poin);
  const hafalanAnak = hafalan.filter(h => h.nisn === anak.nisn);
  const vocabAnak = vocab.filter(v => v.nisn === anak.nisn);
  const pelanggaranAnak = pelanggaran.filter(p => p.nisn === anak.nisn);
  const apresiasiAnak = apresiasi.filter(a => a.nisn === anak.nisn);
  const hadir = absensi.filter(a => a.nisn === anak.nisn && a.status === "Hadir").length;
  const totalAbsen = absensi.filter(a => a.nisn === anak.nisn).length;

  return (
    <div>
      <Card style={{ background: `linear-gradient(135deg, ${C.emerald}, ${C.emeraldDark})`, color: C.white, marginBottom: 24 }}>
        <div style={{ fontSize: 14, opacity: .8 }}>Assalamu'alaikum Warahmatullahi Wabarakatuh</div>
        <div style={{ fontWeight: 800, fontSize: 20, marginTop: 4 }}>Selamat Datang, {user.name.replace("Orang Tua - ", "")} 👋</div>
        <div style={{ fontSize: 13, opacity: .75, marginTop: 4 }}>Pantau perkembangan putra/putri Anda</div>
      </Card>

      {/* Profil anak */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 99, background: C.emeraldLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
            {anak.jk === "L" ? "👦" : "👧"}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{anak.nama}</div>
            <div style={{ color: C.gray600, fontSize: 13 }}>Kelas {anak.kelas} • NISN: {anak.nisn}</div>
            <div style={{ marginTop: 6 }}>
              <span style={{ background: sp.bg, color: sp.color, padding: "3px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{sp.level} • {poin} poin</span>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon="📋" label="Kehadiran" value={`${hadir}/${totalAbsen}`} color={C.emerald} sub="hari hadir" />
        <StatCard icon="⚠️" label="Pelanggaran" value={pelanggaranAnak.length} color={C.red} sub={`${poin} poin akumulasi`} />
        <StatCard icon="🏆" label="Apresiasi" value={apresiasiAnak.length} color={C.gold} sub="prestasi diraih" />
        <StatCard icon="📖" label="Setoran Hafalan" value={hafalanAnak.length} color={C.blue} sub="total setoran" />
        <StatCard icon="🔤" label="Total Vocab" value={totalVocabSiswa(anak.nisn, vocab)} color={C.emeraldMid} sub="kata dikuasai" />
      </div>

      {/* Riwayat setoran */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 12 }}>📖 Riwayat Setoran Hafalan</div>
          {hafalanAnak.length === 0 ? <div style={{ color: C.gray600, fontSize: 13 }}>Belum ada setoran</div> :
            hafalanAnak.slice(-5).reverse().map((h, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${C.gray100}` }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{h.capaian}</div>
                <div style={{ fontSize: 11, color: C.gray600 }}>{h.tipe} • {formatDate(h.tanggal)} • {h.status}</div>
              </div>
            ))
          }
        </Card>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 12 }}>⚠️ Riwayat Pelanggaran</div>
          {pelanggaranAnak.length === 0 ? <div style={{ color: C.emerald, fontSize: 13 }}>Alhamdulillah, tidak ada pelanggaran 🎉</div> :
            pelanggaranAnak.slice(-5).reverse().map((p, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${C.gray100}` }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{p.jenis}</div>
                <div style={{ fontSize: 11, color: C.red }}>{p.kategori} • +{p.poin} poin • {formatDate(p.tanggal)}</div>
              </div>
            ))
          }
        </Card>
      </div>

      {/* Grafik hafalan simple */}
      <Card>
        <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>📈 Progress Hafalan & Vocab</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: C.gray600, marginBottom: 8 }}>Setoran per bulan (hafalan)</div>
            <SimpleBar data={["Jan","Feb","Mar","Apr","Mei","Jun"].map(m => ({ label: m, value: hafalanAnak.filter(h => h.tanggal?.includes(`-0${["Jan","Feb","Mar","Apr","Mei","Jun"].indexOf(m)+1}-`) || h.tanggal?.includes(`-${["Jan","Feb","Mar","Apr","Mei","Jun"].indexOf(m)+1}-`)).length }))} color={C.emerald} height={100} />
          </div>
          <div>
            <div style={{ fontSize: 13, color: C.gray600, marginBottom: 8 }}>Vocab per bulan</div>
            <SimpleBar data={["Jan","Feb","Mar","Apr","Mei","Jun"].map(m => ({ label: m, value: vocabAnak.reduce((s, v) => s + v.jumlah, 0) > 0 ? Math.floor(Math.random() * 10) : 0 }))} color={C.gold} height={100} />
          </div>
        </div>
      </Card>
    </div>
  );
}

// ===================== MODUL SISWA =====================
function ModulSiswa({ user, siswa, setSiswa }) {
  const [search, setSearch] = useState("");
  const [kelasFilter, setKelasFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ nisn:"", nipd:"", nama:"", jk:"L", tempatLahir:"", tglLahir:"", kelas:"7A", foto:"", namaAyah:"", namaIbu:"", noWa:"", alamat:"", aktif:true });

  const canEdit = ["admin", "kepsek", "bk", "kesiswaan", "walas"].includes(user.role);

  const filtered = siswa.filter((s) =>
  ((s.nama || "").toLowerCase().includes(search.toLowerCase()) ||
   (s.nisn || "").includes(search))
  &&
  (kelasFilter === "" || s.kelas === kelasFilter)
)

  const openAdd = () => { setEdit(null); setForm({ nisn:"", nipd:"", nama:"", jk:"L", tempatLahir:"", tglLahir:"", kelas:"7A", foto:"", namaAyah:"", namaIbu:"", noWa:"", alamat:"", aktif:true }); setModal(true); };
  const openEdit = (s) => { setEdit(s.nisn); setForm({ ...s }); setModal(true); };
  const handleSave = () => {
    if (!form.nama || !form.nisn) return;
    if (edit) setSiswa(prev => prev.map(s => s.nisn === edit ? form : s));
    else setSiswa(prev => [...prev, form]);
    setModal(false);
  };
  const handleDelete = (nisn) => { if (window.confirm("Hapus siswa ini?")) setSiswa(prev => prev.filter(s => s.nisn !== nisn)); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.emeraldDark }}>👥 Data Siswa</div>
          <div style={{ color: C.gray600, fontSize: 13 }}>Total: {siswa.length} siswa</div>
        </div>
        {canEdit && <Btn onClick={openAdd}>+ Tambah Siswa</Btn>}
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Cari nama / NISN..." style={{ flex: 1, minWidth: 200, border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }} />
          <select value={kelasFilter} onChange={e => setKelasFilter(e.target.value)} style={{ border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }}>
            <option value="">Semua Kelas</option>
            {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </Card>

      <Card>
        <Table
          cols={["NISN", "Nama", "Kelas", "JK", "No. WA Ortu", "Status", "Aksi"]}
          rows={filtered}
          renderRow={(s) => <>
            <td style={{ padding: "10px 12px" }}>{s.nisn}</td>
            <td style={{ padding: "10px 12px", fontWeight: 600 }}>{s.nama}</td>
            <td style={{ padding: "10px 12px" }}><Badge>{s.kelas}</Badge></td>
            <td style={{ padding: "10px 12px" }}>{s.jk === "L" ? "👦 L" : "👧 P"}</td>
            <td style={{ padding: "10px 12px" }}>{s.noWa}</td>
            <td style={{ padding: "10px 12px" }}><Badge color={s.aktif ? C.emeraldDark : C.red} bg={s.aktif ? C.emeraldLight : C.redLight}>{s.aktif ? "Aktif" : "Tidak Aktif"}</Badge></td>
            <td style={{ padding: "10px 12px" }}>
              {canEdit && <>
                <Btn small variant="ghost" onClick={() => openEdit(s)} style={{ marginRight: 6 }}>✏️</Btn>
                <Btn small variant="danger" onClick={() => handleDelete(s.nisn)}>🗑️</Btn>
              </>}
            </td>
          </>}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "Edit Data Siswa" : "Tambah Siswa Baru"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Input label="NISN" value={form.nisn} onChange={e => setForm(f => ({ ...f, nisn: e.target.value }))} />
          <Input label="NIPD" value={form.nipd} onChange={e => setForm(f => ({ ...f, nipd: e.target.value }))} />
          <div style={{ gridColumn: "1/-1" }}>
            <Input label="Nama Lengkap" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} />
          </div>
          <Select label="Jenis Kelamin" value={form.jk} onChange={e => setForm(f => ({ ...f, jk: e.target.value }))} options={[{ value: "L", label: "Laki-laki" }, { value: "P", label: "Perempuan" }]} />
          <Select label="Kelas" value={form.kelas} onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))} options={KELAS_LIST.map(k => ({ value: k, label: k }))} />
          <Input label="Tempat Lahir" value={form.tempatLahir} onChange={e => setForm(f => ({ ...f, tempatLahir: e.target.value }))} />
          <Input label="Tanggal Lahir" type="date" value={form.tglLahir} onChange={e => setForm(f => ({ ...f, tglLahir: e.target.value }))} />
          <Input label="Nama Ayah" value={form.namaAyah} onChange={e => setForm(f => ({ ...f, namaAyah: e.target.value }))} />
          <Input label="Nama Ibu" value={form.namaIbu} onChange={e => setForm(f => ({ ...f, namaIbu: e.target.value }))} />
          <div style={{ gridColumn: "1/-1" }}>
            <Input label="No. WhatsApp Orang Tua" value={form.noWa} onChange={e => setForm(f => ({ ...f, noWa: e.target.value }))} />
            <Input label="Alamat" value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
          <Btn onClick={handleSave}>Simpan</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ===================== MODUL PELANGGARAN =====================
function ModulPelanggaran({ user, siswa, pelanggaran, setPelanggaran, apresiasi }) {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [kelasFilter, setKelasFilter] = useState("");
  const [searchSiswa, setSearchSiswa] = useState("");
  const [form, setForm] = useState({ nisn:"", kelas:"", jenis:"", kategori:"Ringan", poin:10, tanggal: new Date().toISOString().split("T")[0], guru: user.name });
  const [viewSP, setViewSP] = useState(null);
  const canEdit = ["admin", "bk", "kesiswaan", "walas", "mapel", "kepsek"].includes(user.role);
  const filteredSiswa = siswa.filter(s => (searchSiswa === "" || s.nama.toLowerCase().includes(searchSiswa.toLowerCase())) && (kelasFilter === "" || s.kelas === kelasFilter));
const [kategoriFilter, setKategoriFilter]= useState("");
  const filtered = pelanggaran.filter(p => 
    (search === "" || p.nama?.toLowerCase().includes(search.toLowerCase()) || p.kelas?.includes(search)) && 
    (kelasFilter === "" || p.kelas === kelasFilter)
); 
  const handleJenisChange = (e) => {
    const j = JENIS_PELANGGARAN.find(jp => jp.nama === e.target.value);
    if (j) setForm(f => ({ ...f, jenis: j.nama, kategori: j.kategori, poin: j.poin }));
  };
const jenisFiltered = JENIS_PELANGGARAN.filter(
  j => kategoriFilter === "" || j.kategori === kategoriFilter
);  
  const handleSiswaSelect = (s) => {
    setForm(f => ({ ...f, nisn: s.nisn, kelas: s.kelas }));
    setSearchSiswa(s.nama);
  };

  const handleSave = () => {
    const s = siswa.find(s => s.nisn === form.nisn);
    if (!s || !form.jenis) return;
    const newP = { id: Date.now(), ...form, nama: s.nama };
    setPelanggaran(prev => [...prev, newP]);
    setModal(false);
  };

  // Top siswa poin tertinggi
  const topPoin = siswa.map(s => ({ ...s, poin: getAkumulasiPoin(s.nisn, pelanggaran, apresiasi) })).sort((a, b) => b.poin - a.poin).slice(0, 5);

  // Grafik per kelas
  const kelasData = KELAS_LIST.slice(0, 8).map(k => ({ label: k, value: pelanggaran.filter(p => p.kelas === k).reduce((s, p) => s + p.poin, 0) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.emeraldDark }}>⚠️ Modul Pelanggaran</div>
<p className="text-sm text-gray-500 mt-1">
  Panduan: 10–30 (Ringan) | 31–89 (Sedang) | 90–179 (SP1) | 180–269 (SP2) | ≥270 (SP3 / Sangat Berat)
</p>
        </div>
        {canEdit && <Btn onClick={() => { setForm({ nisn:"", kelas:"", jenis:"", kategori:"Ringan", poin:10, tanggal: new Date().toISOString().split("T")[0], guru: user.name }); setSearchSiswa(""); setModal(true); }}>+ Input Pelanggaran</Btn>}
      </div>

      {/* Top Poin */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 12 }}>🚨 Top Poin Tertinggi</div>
          {topPoin.map((s, i) => {
            const sp = getSP(s.poin);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 99, background: C.red + "22", color: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{s.nama}</div>
                  <div style={{ fontSize: 10, color: C.gray600 }}>{s.kelas}</div>
                </div>
                <span style={{ background: sp.bg, color: sp.color, padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{s.poin}</span>
              </div>
            );
          })}
        </Card>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 12 }}>📊 Poin Pelanggaran per Kelas</div>
          <SimpleBar data={kelasData} color={C.red} height={120} />
        </Card>
      </div>

      {/* Filter + Tabel */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Cari nama/kelas..." style={{ flex: 1, border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }} />
          <select value={kelasFilter} onChange={e => setKelasFilter(e.target.value)} style={{ border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }}>
            <option value="">Semua Kelas</option>
            {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </Card>

      <Card>
        <Table
          cols={["Tanggal", "Nama", "Kelas", "Jenis Pelanggaran", "Kategori", "Poin", "Guru", "Status"]}
          rows={filtered}
          renderRow={(p) => {
            const totalPoin = getAkumulasiPoin(p.nisn, pelanggaran, apresiasi);
            const sp = getSP(totalPoin);
            return <>
              <td style={{ padding: "10px 12px", fontSize: 12 }}>{formatDate(p.tanggal)}</td>
              <td style={{ padding: "10px 12px", fontWeight: 600 }}>{p.nama}</td>
              <td style={{ padding: "10px 12px" }}><Badge>{p.kelas}</Badge></td>
              <td style={{ padding: "10px 12px", fontSize: 12 }}>{p.jenis}</td>
              <td style={{ padding: "10px 12px" }}>
                <span style={{ background: p.kategori === "Ringan" ? C.emeraldLight : p.kategori === "Sedang" ? C.goldLight : C.redLight, color: p.kategori === "Ringan" ? C.emeraldDark : p.kategori === "Sedang" ? C.gold : C.red, padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{p.kategori}</span>
              </td>
              <td style={{ padding: "10px 12px", fontWeight: 700, color: C.red }}>+{p.poin}</td>
              <td style={{ padding: "10px 12px", fontSize: 12 }}>{p.guru}</td>
              <td style={{ padding: "10px 12px" }}><span style={{ background: sp.bg, color: sp.color, padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{sp.level}</span></td>
            </>;
          }}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Input Pelanggaran Siswa">
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 5 }}>Cari Siswa</label>
          <Select label="Filter Kelas" value={form.kelas} onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))} options={[{ value: "", label: "Semua Kelas" }, ...KELAS_LIST.map(k => ({ value: k, label: k }))]} />
          <input value={searchSiswa} onChange={e => setSearchSiswa(e.target.value)} placeholder="Ketik nama siswa..." style={{ width: "100%", border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          {searchSiswa && !siswa.find(s => s.nama === searchSiswa) && (
            <div style={{ border: `1px solid ${C.gray200}`, borderRadius: 8, maxHeight: 150, overflowY: "auto", marginTop: 4 }}>
              {filteredSiswa.filter(s => s.nama.toLowerCase().includes(searchSiswa.toLowerCase())).map(s => (
                <div key={s.nisn} onClick={() => handleSiswaSelect(s)} style={{ padding: "8px 12px", cursor: "pointer", fontSize: 13, borderBottom: `1px solid ${C.gray100}` }} onMouseOver={e => e.target.style.background = C.gray50} onMouseOut={e => e.target.style.background = C.white}>
                  {s.nama} — {s.kelas}
                </div>
              ))}
            </div>
          )}
          {form.nisn && <div style={{ fontSize: 12, color: C.emerald, marginTop: 4 }}>✓ Siswa dipilih: {searchSiswa} ({form.kelas})</div>}
        </div>
        <Select
  label="Kategori Pelanggaran"
  value={kategoriFilter}
  onChange={(e)=>{
      setKategoriFilter(e.target.value);
      setForm(f=>({
         ...f,
         jenis:"",
         kategori:"",
         poin:0
      }));
  }}
  options={[
     {value:"",label:"-- Pilih Kategori --"},
     {value:"Ringan",label:"Ringan"},
     {value:"Sedang",label:"Sedang"},
     {value:"Berat",label:"Berat"},
     {value:"Sangat Berat",label:"Sangat Berat"},
  ]}
/>
<Select
  label="Jenis Pelanggaran"
  value={form.jenis}
  onChange={handleJenisChange}
  options={[
      {value:"",label:"-- Pilih Jenis --"},
      ...jenisFiltered.map(j=>({
          value:j.nama,
          label:j.nama
      }))
  ]}
/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Input label="Kategori" value={form.kategori} readOnly style={{ background: C.gray50 }} />
          <Input label="Poin" type="number" value={form.poin} onChange={e => setForm(f => ({ ...f, poin: parseInt(e.target.value) || 0 }))} />
        </div>
        <Input label="Tanggal" type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
          <Btn onClick={handleSave}>Simpan</Btn>
        </div>
      </Modal> 
          {/* Kotak Panduan Alur PJ & Tindak Lanjut Sekolah */}
<div style={{ 
  marginTop: "20px", 
  backgroundColor: "#ffffff", 
  padding: "16px", 
  borderRadius: "8px", 
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  border: "1px solid #e5e7eb" 
}}>
  <h4 style={{ fontWeight: 700, color: "#111827", marginBottom: "12px", fontSize: "14px" }}>
    ℹ️ Alur & Tindak Lanjut Berdasarkan Akumulasi Poin
  </h4>
  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    
    {/* Ringan */}
    <div style={{ padding: "8px 12px", backgroundColor: "#dbeafe", borderRadius: "6px", borderLeft: "4px solid #2563eb" }}>
      <div style={{ fontSize: "12px", color: "#1e40af" }}>
        <strong>10–30 Poin (Pelanggaran Ringan)</strong> — <span style={{ fontWeight: 600 }}>PJ: Wali Kelas</span>
      </div>
      <div style={{ fontSize: "11px", color: "#1e40af", marginTop: "2px" }}>
        Tindak Lanjut: Pembinaan oleh wali kelas, komunikasi dengan orang tua, pemberian konsekuensi edukatif sesuai jenis pelanggaran, serta pemantauan perubahan perilaku.
      </div>
    </div>

    {/* Sedang */}
    <div style={{ padding: "8px 12px", backgroundColor: "#fef3c7", borderRadius: "6px", borderLeft: "4px solid #d97706" }}>
      <div style={{ fontSize: "12px", color: "#92400e" }}>
        <strong>31–89 Poin (Pelanggaran Sedang)</strong> — <span style={{ fontWeight: 600 }}>PJ: Guru BK</span>
      </div>
      <div style={{ fontSize: "11px", color: "#92400e", marginTop: "2px" }}>
        Tindak Lanjut: Pembinaan bersama BK, komunikasi dengan orang tua, konseling, pemberian konsekuensi yang bersifat mendidik, serta pemantauan secara berkala.
      </div>
    </div>

    {/* SP1 */}
    <div style={{ padding: "8px 12px", backgroundColor: "#ffedd5", borderRadius: "6px", borderLeft: "4px solid #ea580c" }}>
      <div style={{ fontSize: "12px", color: "#7c2d12" }}>
        <strong>90–179 Poin (Pelanggaran Berat - SP1)</strong> — <span style={{ fontWeight: 600 }}>PJ: Waka Kesiswaan</span>
      </div>
      <div style={{ fontSize: "11px", color: "#7c2d12", marginTop: "2px" }}>
        Tindak Lanjut: Penerbitan SP1, pembinaan bersama Waka Kesiswaan dan BK, pemanggilan orang tua, penandatanganan surat pernyataan, serta pemberian konsekuensi sesuai tata tertib sekolah.
      </div>
    </div>

    {/* SP2 */}
    <div style={{ padding: "8px 12px", backgroundColor: "#fee2e2", borderRadius: "6px", borderLeft: "4px solid #dc2626" }}>
      <div style={{ fontSize: "12px", color: "#991b1b" }}>
        <strong>180–269 Poin (Pelanggaran Berat - SP2)</strong> — <span style={{ fontWeight: 600 }}>PJ: Waka Kesiswaan</span>
      </div>
      <div style={{ fontSize: "11px", color: "#991b1b", marginTop: "2px" }}>
        Tindak Lanjut: Penerbitan SP2, pembinaan lanjutan, pemanggilan orang tua kembali, evaluasi perilaku siswa, dan kontrak pembinaan yang lebih ketat.
      </div>
    </div>

    {/* SP3 */}
    <div style={{ padding: "8px 12px", backgroundColor: "#fee2e2", borderRadius: "6px", borderLeft: "4px solid #b91c1c" }}>
      <div style={{ fontSize: "12px", color: "#7f1d1d" }}>
        <strong>Tepat 270 Poin (Pelanggaran Berat - SP3)</strong> — <span style={{ fontWeight: 600 }}>PJ: Waka Kesiswaan & Kepala Sekolah</span>
      </div>
      <div style={{ fontSize: "11px", color: "#7f1d1d", marginTop: "2px" }}>
        Tindak Lanjut: Penerbitan SP3, pemanggilan orang tua, pembinaan terakhir, serta pemberitahuan bahwa pelanggaran berikutnya akan diproses ke tahap sangat berat.
      </div>
    </div>

    {/* Sangat Berat */}
    <div style={{ padding: "8px 12px", backgroundColor: "#fecaca", borderRadius: "6px", borderLeft: "4px solid #7f1d1d" }}>
      <div style={{ fontSize: "12px", color: "#7f1d1d" }}>
        <strong>{"> 270 Poin (Pelanggaran Sangat Berat)"}</strong> — <span style={{ fontWeight: 600 }}>PJ: Kepala Sekolah</span>
      </div>
      <div style={{ fontSize: "11px", color: "#7f1d1d", marginTop: "2px" }}>
        Tindak Lanjut: Kasus diserahkan kepada Kepala Sekolah. Orang tua dipanggil untuk musyawarah dan sekolah dapat mengembalikan siswa kepada orang tua sesuai ketentuan yang berlaku.
      </div>
    </div>

  </div>
</div>
    </div>
  );
}

// ===================== MODUL APRESIASI =====================
function ModulApresiasi({ user, siswa, pelanggaran, apresiasi, setApresiasi }) {
  const [modal, setModal] = useState(false);
  const [searchSiswa, setSearchSiswa] = useState("");
  const [kelasFilter, setKelasFilter] = useState("");
  const [form, setForm] = useState({ nisn:"", kelas:"", jenis:"", pengurangan:10, tanggal: new Date().toISOString().split("T")[0], guru: user.name, keterangan:"", jenisCustom:"" });
  const [jenisLainnya, setJenisLainnya] = useState(false);

  const canEdit = ["admin", "bk", "kesiswaan", "walas", "kepsek", "qiroati"].includes(user.role);
  const filteredSiswa = siswa.filter(s => (form.kelas === "" || s.kelas === form.kelas) && (searchSiswa === "" || s.nama.toLowerCase().includes(searchSiswa.toLowerCase())));

  const handleSiswaSelect = (s) => { setForm(f => ({ ...f, nisn: s.nisn, kelas: s.kelas })); setSearchSiswa(s.nama); };
  const handleJenisChange = (e) => {
    const val = e.target.value;
    if (val === "Lainnya") { setJenisLainnya(true); setForm(f => ({ ...f, jenis: "Lainnya" })); }
    else { setJenisLainnya(false); const j = JENIS_APRESIASI.find(a => a.nama === val); setForm(f => ({ ...f, jenis: val, pengurangan: j?.pengurangan || 0 })); }
  };
  const handleSave = () => {
    const s = siswa.find(s => s.nisn === form.nisn);
    if (!s) return;
    const jenis = jenisLainnya ? form.jenisCustom : form.jenis;
    setApresiasi(prev => [...prev, { id: Date.now(), ...form, jenis, nama: s.nama }]);
    setModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.emeraldDark }}>🏆 Modul Apresiasi</div>
          <div style={{ color: C.gray600, fontSize: 13 }}>Apresiasi akan mengurangi akumulasi poin pelanggaran</div>
        </div>
        {canEdit && <Btn variant="gold" onClick={() => { setForm({ nisn:"", kelas:"", jenis:"", pengurangan:10, tanggal: new Date().toISOString().split("T")[0], guru: user.name, keterangan:"", jenisCustom:"" }); setSearchSiswa(""); setJenisLainnya(false); setModal(true); }}>+ Input Apresiasi</Btn>}
      </div>

      {/* Stats apresiasi */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        {JENIS_APRESIASI.slice(0, 4).map(j => (
          <StatCard key={j.id} icon="🏅" label={j.nama} value={apresiasi.filter(a => a.jenis === j.nama).length} color={C.gold} sub={`-${j.pengurangan} poin/apresiasi`} />
        ))}
      </div>

      <Card>
        <Table
          cols={["Tanggal", "Nama", "Kelas", "Jenis Apresiasi", "Pengurangan Poin", "Keterangan", "Guru"]}
          rows={apresiasi}
          renderRow={(a) => <>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{formatDate(a.tanggal)}</td>
            <td style={{ padding: "10px 12px", fontWeight: 600 }}>{a.nama}</td>
            <td style={{ padding: "10px 12px" }}><Badge>{a.kelas}</Badge></td>
            <td style={{ padding: "10px 12px" }}><Badge color={C.gold} bg={C.goldLight}>{a.jenis}</Badge></td>
            <td style={{ padding: "10px 12px", fontWeight: 700, color: C.emerald }}>-{a.pengurangan} poin</td>
            <td style={{ padding: "10px 12px", fontSize: 12, color: C.gray600 }}>{a.keterangan || "-"}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{a.guru}</td>
          </>}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Input Apresiasi Siswa">
        <Select label="Filter Kelas" value={kelasFilter} onChange={e => { setKelasFilter(e.target.value); setForm(f => ({ ...f, kelas: e.target.value })); }} options={[{ value: "", label: "Semua Kelas" }, ...KELAS_LIST.map(k => ({ value: k, label: k }))]} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 5 }}>Cari Siswa</label>
          <input value={searchSiswa} onChange={e => setSearchSiswa(e.target.value)} placeholder="Ketik nama siswa..." style={{ width: "100%", border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          {searchSiswa && !siswa.find(s => s.nama === searchSiswa) && (
            <div style={{ border: `1px solid ${C.gray200}`, borderRadius: 8, maxHeight: 150, overflowY: "auto", marginTop: 4 }}>
              {filteredSiswa.map(s => (
                <div key={s.nisn} onClick={() => handleSiswaSelect(s)} style={{ padding: "8px 12px", cursor: "pointer", fontSize: 13, borderBottom: `1px solid ${C.gray100}` }}>
                  {s.nama} — {s.kelas}
                </div>
              ))}
            </div>
          )}
          {form.nisn && <div style={{ fontSize: 12, color: C.emerald, marginTop: 4 }}>✓ Dipilih: {searchSiswa}</div>}
        </div>
        <Select label="Jenis Apresiasi" value={form.jenis} onChange={handleJenisChange} options={[{ value: "", label: "-- Pilih --" }, ...JENIS_APRESIASI.map(j => ({ value: j.nama, label: `${j.nama} (-${j.pengurangan} poin)` }))]} />
        {jenisLainnya && <Input label="Nama Apresiasi (Lainnya)" value={form.jenisCustom} onChange={e => setForm(f => ({ ...f, jenisCustom: e.target.value }))} placeholder="Tuliskan jenis apresiasi..." />}
        <Input label="Pengurangan Poin" type="number" value={form.pengurangan} onChange={e => setForm(f => ({ ...f, pengurangan: parseInt(e.target.value) || 0 }))} />
        <Input label="Tanggal" type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} />
        <Input label="Keterangan" value={form.keterangan} onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))} placeholder="Deskripsi prestasi..." />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
          <Btn variant="gold" onClick={handleSave}>Simpan</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ===================== MODUL QIROATI =====================
function ModulQiroati({ user, siswa, hafalan, setHafalan }) {
  const [modal, setModal] = useState(false);
  const [searchSiswa, setSearchSiswa] = useState("");
  const [kelasFilter, setKelasFilter] = useState("");
  const [tipeFilter, setTipeFilter] = useState("");
  const [form, setForm] = useState({ nisn:"", kelas:"", tanggal: new Date().toISOString().split("T")[0], capaian:"", tipe:"Tahfidz", kelancaran:"Lancar", status:"Lulus", guru: user.name });

  const TIPE_OPTIONS = ["Tahfidz", "Tahsin", "Jilid 1", "Jilid 2", "Jilid 3", "Jilid 4", "Tajwid Ghorib"];
  const filteredSiswa = siswa.filter(s => (form.kelas === "" || s.kelas === form.kelas) && (searchSiswa === "" || s.nama.toLowerCase().includes(searchSiswa.toLowerCase())));
  const filtered = hafalan.filter(h => (tipeFilter === "" || h.tipe === tipeFilter) && (kelasFilter === "" || h.kelas === kelasFilter));

  const handleSiswaSelect = (s) => { setForm(f => ({ ...f, nisn: s.nisn, kelas: s.kelas })); setSearchSiswa(s.nama); };
  const handleSave = () => {
    const s = siswa.find(s => s.nisn === form.nisn);
    if (!s || !form.capaian) return;
    setHafalan(prev => [...prev, { id: Date.now(), ...form, nama: s.nama }]);
    setModal(false);
  };

  // Rankings
  const rankHafalan = siswa.map(s => ({ nama: s.nama, kelas: s.kelas, total: hafalan.filter(h => h.nisn === s.nisn && h.status === "Lulus").length })).sort((a, b) => b.total - a.total).slice(0, 5);
  const rankRajin = siswa.map(s => ({ nama: s.nama, kelas: s.kelas, total: hafalan.filter(h => h.nisn === s.nisn).length })).sort((a, b) => b.total - a.total).slice(0, 5);
  const hafalanKelas = KELAS_LIST.slice(0, 6).map(k => ({ label: k, value: hafalan.filter(h => h.kelas === k && h.status === "Lulus").length }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.emeraldDark }}>📖 Modul Qiroati</div>
          <div style={{ color: C.gray600, fontSize: 13 }}>Tahfidz • Tahsin • Jilid 1-4 • Tajwid Ghorib</div>
        </div>
        {["admin", "qiroati"].includes(user.role) && <Btn onClick={() => { setForm({ nisn:"", kelas:"", tanggal: new Date().toISOString().split("T")[0], capaian:"", tipe:"Tahfidz", kelancaran:"Lancar", status:"Lulus", guru: user.name }); setSearchSiswa(""); setModal(true); }}>+ Input Setoran</Btn>}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 20 }}>
        {TIPE_OPTIONS.map(t => (
          <StatCard key={t} icon={t.includes("Jilid") ? "📚" : t === "Tajwid Ghorib" ? "📜" : t === "Tahfidz" ? "📖" : "✍️"} label={t} value={hafalan.filter(h => h.tipe === t).length} color={C.emerald} sub="setoran" />
        ))}
      </div>

      {/* Charts + Rankings */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 12 }}>📊 Hafalan per Kelas</div>
          <SimpleBar data={hafalanKelas} color={C.emerald} height={130} />
        </Card>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 12 }}>🏅 Top Hafalan</div>
          {rankHafalan.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7, fontSize: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: 99, background: i < 3 ? C.gold : C.gray100, color: i < 3 ? C.white : C.gray700, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10 }}>{i + 1}</div>
              <div style={{ flex: 1, fontWeight: 600 }}>{r.nama}</div>
              <Badge color={C.emeraldDark} bg={C.emeraldLight}>{r.total}</Badge>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 12 }}>⭐ Paling Rajin Setor</div>
          {rankRajin.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7, fontSize: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: 99, background: i < 3 ? C.emerald : C.gray100, color: i < 3 ? C.white : C.gray700, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10 }}>{i + 1}</div>
              <div style={{ flex: 1, fontWeight: 600 }}>{r.nama}</div>
              <Badge>{r.total}x</Badge>
            </div>
          ))}
        </Card>
      </div>

      {/* Filter + Tabel */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <select value={tipeFilter} onChange={e => setTipeFilter(e.target.value)} style={{ border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }}>
            <option value="">Semua Tipe</option>
            {TIPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={kelasFilter} onChange={e => setKelasFilter(e.target.value)} style={{ border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }}>
            <option value="">Semua Kelas</option>
            {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </Card>

      <Card>
        <Table
          cols={["Tanggal", "Nama", "Kelas", "Tipe", "Capaian", "Kelancaran", "Status"]}
          rows={filtered}
          renderRow={(h) => <>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{formatDate(h.tanggal)}</td>
            <td style={{ padding: "10px 12px", fontWeight: 600 }}>{h.nama}</td>
            <td style={{ padding: "10px 12px" }}><Badge>{h.kelas}</Badge></td>
            <td style={{ padding: "10px 12px" }}><Badge color={C.emeraldDark} bg={C.emeraldLight}>{h.tipe}</Badge></td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{h.capaian}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{h.kelancaran}</td>
            <td style={{ padding: "10px 12px" }}><Badge color={h.status === "Lulus" ? C.emeraldDark : C.red} bg={h.status === "Lulus" ? C.emeraldLight : C.redLight}>{h.status}</Badge></td>
          </>}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Input Setoran Qiroati">
        <Select label="Filter Kelas" value={form.kelas} onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))} options={[{ value: "", label: "Semua Kelas" }, ...KELAS_LIST.map(k => ({ value: k, label: k }))]} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 5 }}>Cari Siswa</label>
          <input value={searchSiswa} onChange={e => setSearchSiswa(e.target.value)} placeholder="Ketik nama siswa..." style={{ width: "100%", border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          {searchSiswa && !siswa.find(s => s.nama === searchSiswa) && (
            <div style={{ border: `1px solid ${C.gray200}`, borderRadius: 8, maxHeight: 150, overflowY: "auto", marginTop: 4 }}>
              {filteredSiswa.filter(s => s.nama.toLowerCase().includes(searchSiswa.toLowerCase())).map(s => (
                <div key={s.nisn} onClick={() => handleSiswaSelect(s)} style={{ padding: "8px 12px", cursor: "pointer", fontSize: 13, borderBottom: `1px solid ${C.gray100}` }}>
                  {s.nama} — {s.kelas}
                </div>
              ))}
            </div>
          )}
          {form.nisn && <div style={{ fontSize: 12, color: C.emerald, marginTop: 4 }}>✓ Dipilih: {searchSiswa}</div>}
        </div>
        <Select label="Tipe Qiroati" value={form.tipe} onChange={e => setForm(f => ({ ...f, tipe: e.target.value }))} options={TIPE_OPTIONS.map(t => ({ value: t, label: t }))} />
        <Input label="Capaian (Surat/Ayat/Halaman/Bab)" value={form.capaian} onChange={e => setForm(f => ({ ...f, capaian: e.target.value }))} placeholder="Contoh: Al-Baqarah 1-10 / Jilid 3 Hal 5 / Bab Imalah" />
        <Select label="Kelancaran Bacaan" value={form.kelancaran} onChange={e => setForm(f => ({ ...f, kelancaran: e.target.value }))} options={[{ value: "Lancar", label: "Lancar" }, { value: "Cukup Lancar", label: "Cukup Lancar" }, { value: "Kurang Lancar", label: "Kurang Lancar" }]} />
        <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} options={[{ value: "Lulus", label: "Lulus ✓" }, { value: "Tidak Lulus", label: "Tidak Lulus ✗" }, { value: "Mengulang", label: "Mengulang 🔄" }]} />
        <Input label="Tanggal" type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
          <Btn onClick={handleSave}>Simpan</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ===================== MODUL VOCAB =====================
function ModulVocab({ user, siswa, vocab, setVocab }) {
  const [modal, setModal] = useState(false);
  const [searchSiswa, setSearchSiswa] = useState("");
  const [kelasFilter, setKelasFilter] = useState("");
  const [form, setForm] = useState({ nisn:"", kelas:"", tanggal: new Date().toISOString().split("T")[0], jumlah:0, keterangan:"", guru: user.name });

  const filteredSiswa = siswa.filter(s => (form.kelas === "" || s.kelas === form.kelas) && (searchSiswa === "" || s.nama.toLowerCase().includes(searchSiswa.toLowerCase())));
  const filtered = vocab.filter(v => kelasFilter === "" || v.kelas === kelasFilter);

  const handleSiswaSelect = (s) => { setForm(f => ({ ...f, nisn: s.nisn, kelas: s.kelas })); setSearchSiswa(s.nama); };
  const handleSave = () => {
    const s = siswa.find(s => s.nisn === form.nisn);
    if (!s || form.jumlah <= 0) return;
    setVocab(prev => [...prev, { id: Date.now(), ...form, nama: s.nama }]);
    setModal(false);
  };

  const rankVocab = siswa.map(s => ({ nama: s.nama, kelas: s.kelas, total: totalVocabSiswa(s.nisn, vocab) })).sort((a, b) => b.total - a.total).slice(0, 5);
  const vocabKelas = KELAS_LIST.slice(0, 8).map(k => ({ label: k, value: vocab.filter(v => v.kelas === k).reduce((s, v) => s + v.jumlah, 0) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.emeraldDark }}>🔤 Modul Vocab Bilingual</div>
          <div style={{ color: C.gray600, fontSize: 13 }}>Pantau setoran kosa kata Bahasa Inggris/Arab siswa</div>
        </div>
        {["admin", "bilingual", "walas"].includes(user.role) && <Btn onClick={() => { setForm({ nisn:"", kelas:"", tanggal: new Date().toISOString().split("T")[0], jumlah:0, keterangan:"", guru: user.name }); setSearchSiswa(""); setModal(true); }}>+ Input Vocab</Btn>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 12 }}>📊 Total Vocab per Kelas</div>
          <SimpleBar data={vocabKelas} color={C.gold} height={130} />
        </Card>
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 12 }}>🏅 Top Vocab Siswa</div>
          {rankVocab.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7, fontSize: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: 99, background: i < 3 ? C.gold : C.gray100, color: i < 3 ? C.white : C.gray700, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10 }}>{i + 1}</div>
              <div style={{ flex: 1, fontWeight: 600 }}>{r.nama}</div>
              <Badge color={C.gold} bg={C.goldLight}>{r.total} kata</Badge>
            </div>
          ))}
        </Card>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <select value={kelasFilter} onChange={e => setKelasFilter(e.target.value)} style={{ border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }}>
          <option value="">Semua Kelas</option>
          {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </Card>

      <Card>
        <Table
          cols={["Tanggal", "Nama", "Kelas", "Jumlah Vocab", "Keterangan", "Guru"]}
          rows={filtered}
          renderRow={(v) => <>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{formatDate(v.tanggal)}</td>
            <td style={{ padding: "10px 12px", fontWeight: 600 }}>{v.nama}</td>
            <td style={{ padding: "10px 12px" }}><Badge>{v.kelas}</Badge></td>
            <td style={{ padding: "10px 12px", fontWeight: 700, color: C.gold }}>{v.jumlah} kata</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{v.keterangan}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{v.guru}</td>
          </>}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Input Setoran Vocab">
        <Select label="Filter Kelas" value={form.kelas} onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))} options={[{ value: "", label: "Semua Kelas" }, ...KELAS_LIST.map(k => ({ value: k, label: k }))]} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 5 }}>Cari Siswa</label>
          <input value={searchSiswa} onChange={e => setSearchSiswa(e.target.value)} placeholder="Ketik nama siswa..." style={{ width: "100%", border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          {searchSiswa && !siswa.find(s => s.nama === searchSiswa) && (
            <div style={{ border: `1px solid ${C.gray200}`, borderRadius: 8, maxHeight: 150, overflowY: "auto", marginTop: 4 }}>
              {filteredSiswa.filter(s => s.nama.toLowerCase().includes(searchSiswa.toLowerCase())).map(s => (
                <div key={s.nisn} onClick={() => handleSiswaSelect(s)} style={{ padding: "8px 12px", cursor: "pointer", fontSize: 13, borderBottom: `1px solid ${C.gray100}` }}>
                  {s.nama} — {s.kelas}
                </div>
              ))}
            </div>
          )}
          {form.nisn && <div style={{ fontSize: 12, color: C.emerald, marginTop: 4 }}>✓ Dipilih: {searchSiswa}</div>}
        </div>
        <Input label="Jumlah Vocab" type="number" value={form.jumlah} onChange={e => setForm(f => ({ ...f, jumlah: parseInt(e.target.value) || 0 }))} />
        <Input label="Keterangan (Unit/Topik)" value={form.keterangan} onChange={e => setForm(f => ({ ...f, keterangan: e.target.value }))} placeholder="Contoh: Unit 3, Family & Friends" />
        <Input label="Tanggal" type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
          <Btn variant="gold" onClick={handleSave}>Simpan</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ===================== MODUL ABSENSI =====================
function ModulAbsensi({ user, siswa, absensi, setAbsensi }) {
  const [modal, setModal] = useState(false);
  const [kelasFilter, setKelasFilter] = useState(user.kelas || "7A");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [bulkAbsensi, setBulkAbsensi] = useState({});

  const siswaKelas = siswa.filter(s => s.kelas === kelasFilter);
  const absensiFiltered = absensi.filter(a => a.kelas === kelasFilter);

  const initBulk = () => {
    const b = {};
    siswaKelas.forEach(s => { b[s.nisn] = "Hadir"; });
    setBulkAbsensi(b);
  };

  const handleSaveAbsensi = () => {
    const newAbsensi = Object.entries(bulkAbsensi).map(([nisn, status]) => {
      const s = siswaKelas.find(s => s.nisn === nisn);
      return { id: Date.now() + Math.random(), nisn, nama: s?.nama, kelas: kelasFilter, tanggal, status, keterangan: "" };
    });
    setAbsensi(prev => [...prev.filter(a => !(a.kelas === kelasFilter && a.tanggal === tanggal)), ...newAbsensi]);
    setModal(false);
  };

  // Stats absensi kelas
  const hadir = absensiFiltered.filter(a => a.status === "Hadir").length;
  const sakit = absensiFiltered.filter(a => a.status === "Sakit").length;
  const izin = absensiFiltered.filter(a => a.status === "Izin").length;
  const alpa = absensiFiltered.filter(a => a.status === "Alpa").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.emeraldDark }}>📋 Absensi Siswa</div>
          <div style={{ color: C.gray600, fontSize: 13 }}>Rekap kehadiran harian per kelas</div>
        </div>
        <Btn onClick={() => { initBulk(); setModal(true); }}>+ Input Absensi</Btn>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <select value={kelasFilter} onChange={e => setKelasFilter(e.target.value)} style={{ border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }}>
            {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <StatCard icon="✅" label="Hadir" value={hadir} color={C.emerald} />
          <StatCard icon="🤒" label="Sakit" value={sakit} color={C.gold} />
          <StatCard icon="📝" label="Izin" value={izin} color={C.blue} />
          <StatCard icon="❌" label="Alpa" value={alpa} color={C.red} />
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>Riwayat Absensi Kelas {kelasFilter}</div>
        <Table
          cols={["Tanggal", "Nama", "Status", "Keterangan"]}
          rows={absensiFiltered.slice(-20).reverse()}
          renderRow={(a) => <>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{formatDate(a.tanggal)}</td>
            <td style={{ padding: "10px 12px", fontWeight: 600 }}>{a.nama}</td>
            <td style={{ padding: "10px 12px" }}>
              <Badge color={a.status === "Hadir" ? C.emeraldDark : a.status === "Sakit" ? C.gold : a.status === "Izin" ? C.blue : C.red}
                bg={a.status === "Hadir" ? C.emeraldLight : a.status === "Sakit" ? C.goldLight : a.status === "Izin" ? C.blueLight : C.redLight}>
                {a.status}
              </Badge>
            </td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{a.keterangan || "-"}</td>
          </>}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={`Input Absensi Kelas ${kelasFilter}`}>
        <Input label="Tanggal" type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} />
        <div style={{ maxHeight: 300, overflowY: "auto" }}>
          {siswaKelas.map(s => (
            <div key={s.nisn} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.gray100}` }}>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s.nama}</div>
              <select value={bulkAbsensi[s.nisn] || "Hadir"} onChange={e => setBulkAbsensi(b => ({ ...b, [s.nisn]: e.target.value }))}
                style={{ border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "4px 8px", fontSize: 12, outline: "none" }}>
                {["Hadir", "Sakit", "Izin", "Alpa"].map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
          <Btn onClick={handleSaveAbsensi}>Simpan Absensi</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ===================== MODUL CATATAN =====================
function ModulCatatan({ user, siswa, catatan, setCatatan }) {
  const [modal, setModal] = useState(false);
  const [kelasFilter, setKelasFilter] = useState("");
  const [searchSiswa, setSearchSiswa] = useState("");
  const [form, setForm] = useState({ nisn:"", kelas:"", tanggal: new Date().toISOString().split("T")[0], catatan:"", guru: user.name, tindakLanjut:"" });

  const filteredSiswa = siswa.filter(s => (form.kelas === "" || s.kelas === form.kelas) && (searchSiswa === "" || s.nama.toLowerCase().includes(searchSiswa.toLowerCase())));
  const filtered = catatan.filter(c => kelasFilter === "" || c.kelas === kelasFilter);

  const handleSiswaSelect = (s) => { setForm(f => ({ ...f, nisn: s.nisn, kelas: s.kelas })); setSearchSiswa(s.nama); };
  const handleSave = () => {
    const s = siswa.find(s => s.nisn === form.nisn);
    if (!s || !form.catatan) return;
    setCatatan(prev => [...prev, { id: Date.now(), ...form, nama: s.nama }]);
    setModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.emeraldDark }}>📝 Catatan Kejadian</div>
          <div style={{ color: C.gray600, fontSize: 13 }}>Rekam kejadian penting per siswa</div>
        </div>
        <Btn onClick={() => { setForm({ nisn:"", kelas:"", tanggal: new Date().toISOString().split("T")[0], catatan:"", guru: user.name, tindakLanjut:"" }); setSearchSiswa(""); setModal(true); }}>+ Tambah Catatan</Btn>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <select value={kelasFilter} onChange={e => setKelasFilter(e.target.value)} style={{ border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }}>
            <option value="">Semua Kelas</option>
            {KELAS_LIST.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </Card>

      <Card>
        <Table
          cols={["Tanggal", "Nama", "Kelas", "Catatan Kejadian", "Tindak Lanjut", "Guru"]}
          rows={filtered}
          renderRow={(c) => <>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{formatDate(c.tanggal)}</td>
            <td style={{ padding: "10px 12px", fontWeight: 600 }}>{c.nama}</td>
            <td style={{ padding: "10px 12px" }}><Badge>{c.kelas}</Badge></td>
            <td style={{ padding: "10px 12px", fontSize: 12, maxWidth: 250 }}>{c.catatan}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{c.tindakLanjut || "-"}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{c.guru}</td>
          </>}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Input Catatan Kejadian">
        <Select label="Filter Kelas" value={form.kelas} onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))} options={[{ value: "", label: "Semua Kelas" }, ...KELAS_LIST.map(k => ({ value: k, label: k }))]} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 5 }}>Cari Siswa</label>
          <input value={searchSiswa} onChange={e => setSearchSiswa(e.target.value)} placeholder="Ketik nama siswa..." style={{ width: "100%", border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          {searchSiswa && !siswa.find(s => s.nama === searchSiswa) && (
            <div style={{ border: `1px solid ${C.gray200}`, borderRadius: 8, maxHeight: 150, overflowY: "auto", marginTop: 4 }}>
              {filteredSiswa.filter(s => s.nama.toLowerCase().includes(searchSiswa.toLowerCase())).map(s => (
                <div key={s.nisn} onClick={() => handleSiswaSelect(s)} style={{ padding: "8px 12px", cursor: "pointer", fontSize: 13, borderBottom: `1px solid ${C.gray100}` }}>
                  {s.nama} — {s.kelas}
                </div>
              ))}
            </div>
          )}
          {form.nisn && <div style={{ fontSize: 12, color: C.emerald, marginTop: 4 }}>✓ Dipilih: {searchSiswa}</div>}
        </div>
        <Input label="Tanggal" type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 5 }}>Catatan Kejadian</label>
          <textarea value={form.catatan} onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))} rows={3} placeholder="Tuliskan kejadian yang terjadi..." style={{ width: "100%", border: `1.5px solid ${C.gray200}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
        </div>
        <Input label="Tindak Lanjut" value={form.tindakLanjut} onChange={e => setForm(f => ({ ...f, tindakLanjut: e.target.value }))} placeholder="Dipanggil orang tua, konseling, dll..." />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
          <Btn onClick={handleSave}>Simpan</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ===================== MODUL GURU =====================
function ModulGuru({ user, guru, setGuru, users, setUsers }) {
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ nip:"", nama:"", jabatan:"Guru", kelas:"", username:"", password:"", aktif:true });

  if (!["admin"].includes(user.role)) return <div style={{ padding: 40, textAlign: "center", color: C.gray600 }}>Anda tidak memiliki akses ke halaman ini.</div>;

  const openAdd = () => { setEdit(null); setForm({ nip:"", nama:"", jabatan:"Guru", kelas:"", username:"", password:"", aktif:true }); setModal(true); };
  const openEdit = (g) => { setEdit(g.id); setForm({ ...g }); setModal(true); };
  const handleSave = () => {
    if (edit) {
      setGuru(prev => prev.map(g => g.id === edit ? { ...form, id: edit } : g));
      setUsers(prev => prev.map(u => u.username === form.username ? { ...u, name: form.nama, password: form.password } : u));
    } else {
      const newId = Date.now();
      setGuru(prev => [...prev, { ...form, id: newId }]);
      setUsers(prev => [...prev, { id: newId, username: form.username, password: form.password, role: "walas", name: form.nama }]);
    }
    setModal(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, color: C.emeraldDark }}>👨‍🏫 Data Guru & Akun Login</div>
          <div style={{ color: C.gray600, fontSize: 13 }}>Kelola data guru dan akun login sistem</div>
        </div>
        <Btn onClick={openAdd}>+ Tambah Guru</Btn>
      </div>

      <Card>
        <Table
          cols={["NIP", "Nama", "Jabatan", "Kelas", "Username", "Status", "Aksi"]}
          rows={guru}
          renderRow={(g) => <>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{g.nip}</td>
            <td style={{ padding: "10px 12px", fontWeight: 600 }}>{g.nama}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{g.jabatan}</td>
            <td style={{ padding: "10px 12px" }}>{g.kelas ? <Badge>{g.kelas}</Badge> : "-"}</td>
            <td style={{ padding: "10px 12px", fontSize: 12 }}>{g.username}</td>
            <td style={{ padding: "10px 12px" }}><Badge color={g.aktif ? C.emeraldDark : C.red} bg={g.aktif ? C.emeraldLight : C.redLight}>{g.aktif ? "Aktif" : "Non-Aktif"}</Badge></td>
            <td style={{ padding: "10px 12px" }}>
              <Btn small variant="ghost" onClick={() => openEdit(g)} style={{ marginRight: 6 }}>✏️ Edit</Btn>
            </td>
          </>}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={edit ? "Edit Data Guru" : "Tambah Guru Baru"}>
        <Input label="NIP" value={form.nip} onChange={e => setForm(f => ({ ...f, nip: e.target.value }))} />
        <Input label="Nama Lengkap & Gelar" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} />
        <Select label="Jabatan" value={form.jabatan} onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))} options={[
          { value: "Guru", label: "Guru" },
          { value: "Wali Kelas", label: "Wali Kelas" },
          { value: "Guru BK", label: "Guru BK" },
          { value: "Guru Qiroati", label: "Guru Qiroati" },
          { value: "PJ Bilingual", label: "PJ Bilingual" },
          { value: "Kesiswaan", label: "Kesiswaan" },
        ]} />
        {form.jabatan === "Wali Kelas" && (
          <Select label="Kelas" value={form.kelas} onChange={e => setForm(f => ({ ...f, kelas: e.target.value }))} options={KELAS_LIST.map(k => ({ value: k, label: k }))} />
        )}
        <Input label="Username Login" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
        <Input label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <input type="checkbox" id="aktifGuru" checked={form.aktif} onChange={e => setForm(f => ({ ...f, aktif: e.target.checked }))} />
          <label htmlFor="aktifGuru" style={{ fontSize: 13 }}>Akun Aktif</label>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Batal</Btn>
          <Btn onClick={handleSave}>Simpan</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ===================== MODUL LAPORAN =====================
function ModulLaporan({ user, siswa, pelanggaran, apresiasi, hafalan, vocab, catatan, absensi }) {
  const [tab, setTab] = useState("pelanggaran");

  const tabs = [
    { key: "pelanggaran", label: "⚠️ Pelanggaran" },
    { key: "hafalan", label: "📖 Hafalan" },
    { key: "vocab", label: "🔤 Vocab" },
    { key: "catatan", label: "📝 Catatan Kejadian" },
    { key: "absensi", label: "📋 Absensi" },
    { key: "rekap", label: "📊 Rekap Siswa" },
  ];

  // SP Summary
  const spSummary = siswa.map(s => {
    const poin = getAkumulasiPoin(s.nisn, pelanggaran, apresiasi);
    return { ...s, poin, sp: getSP(poin) };
  });

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 20, color: C.emeraldDark, marginBottom: 20 }}>📊 Laporan & Rekap</div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: tab === t.key ? 700 : 400, background: tab === t.key ? C.emerald : C.gray100, color: tab === t.key ? C.white : C.gray700, fontSize: 13 }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "pelanggaran" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 20 }}>
            <StatCard icon="⚠️" label="Total Pelanggaran" value={pelanggaran.length} color={C.red} />
            <StatCard icon="📋" label="SP1 (90)" value={spSummary.filter(s => s.poin >= 90 && s.poin < 179).length} color={C.red} />
            <StatCard icon="🟡" label="SP2 (180)" value={spSummary.filter(s => s.poin >= 180 && s.poin < 269).length} color={C.red} />
            <StatCard icon="🔴" label="SP3 / Kritis (270)" value={spSummary.filter(s => s.poin >= 270).length} color={C.red} />
          </div>
          <Card>
            <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>Rekap SP Semua Siswa (dengan Poin &gt; 50)</div>
            <Table
              cols={["Nama", "Kelas", "Total Poin", "Status SP", "Tindak Lanjut"]}
              rows={spSummary.filter(s => s.poin > 0).sort((a, b) => b.poin - a.poin)}
              renderRow={(s) => <>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{s.nama}</td>
                <td style={{ padding: "10px 12px" }}><Badge>{s.kelas}</Badge></td>
                <td style={{ padding: "10px 12px", fontWeight: 700, color: s.poin >= 100 ? C.red : C.gold }}>{s.poin}</td>
                <td style={{ padding: "10px 12px" }}><span style={{ background: s.sp.bg, color: s.sp.color, padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{s.sp.level}</span></td>
                <td style={{ padding: "10px 12px", fontSize: 12 }}>
                  {s.poin >= 300 ? "Kesiswaan & Orang Tua" : s.poin >= 200 ? "Kesiswaan" : s.poin >= 100 ? "Guru BK" : "Wali Kelas"}
                </td>
              </>}
            />
          </Card>
        </div>
      )}

      {tab === "hafalan" && (
        <div>
          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>📊 Rekap Hafalan per Kelas</div>
            <SimpleBar data={KELAS_LIST.slice(0, 8).map(k => ({ label: k, value: hafalan.filter(h => h.kelas === k && h.status === "Lulus").length }))} color={C.emerald} height={150} />
          </Card>
          <Card>
            <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>Tabel Setoran Hafalan</div>
            <Table
              cols={["Tanggal", "Nama", "Kelas", "Tipe", "Capaian", "Status"]}
              rows={hafalan.slice().reverse()}
              renderRow={(h) => <>
                <td style={{ padding: "10px 12px", fontSize: 12 }}>{formatDate(h.tanggal)}</td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{h.nama}</td>
                <td style={{ padding: "10px 12px" }}><Badge>{h.kelas}</Badge></td>
                <td style={{ padding: "10px 12px" }}><Badge color={C.emeraldDark} bg={C.emeraldLight}>{h.tipe}</Badge></td>
                <td style={{ padding: "10px 12px", fontSize: 12 }}>{h.capaian}</td>
                <td style={{ padding: "10px 12px" }}><Badge color={h.status === "Lulus" ? C.emeraldDark : C.red} bg={h.status === "Lulus" ? C.emeraldLight : C.redLight}>{h.status}</Badge></td>
              </>}
            />
          </Card>
        </div>
      )}

      {tab === "vocab" && (
        <div>
          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>📊 Rekap Vocab per Kelas</div>
            <SimpleBar data={KELAS_LIST.slice(0, 8).map(k => ({ label: k, value: vocab.filter(v => v.kelas === k).reduce((s, v) => s + v.jumlah, 0) }))} color={C.gold} height={150} />
          </Card>
          <Card>
            <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>Ranking Vocab Siswa</div>
            <Table
              cols={["Rank", "Nama", "Kelas", "Total Vocab"]}
              rows={siswa.map(s => ({ ...s, total: totalVocabSiswa(s.nisn, vocab) })).sort((a, b) => b.total - a.total).filter(s => s.total > 0)}
              renderRow={(s, i) => <>
                <td style={{ padding: "10px 12px", fontWeight: 700, color: i < 3 ? C.gold : C.gray700 }}>#{i + 1}</td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{s.nama}</td>
                <td style={{ padding: "10px 12px" }}><Badge>{s.kelas}</Badge></td>
                <td style={{ padding: "10px 12px", fontWeight: 700, color: C.gold }}>{s.total} kata</td>
              </>}
            />
          </Card>
        </div>
      )}

      {tab === "catatan" && (
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>📝 Catatan Kejadian Seluruh Kelas</div>
          <Table
            cols={["Tanggal", "Nama", "Kelas", "Catatan", "Tindak Lanjut", "Guru"]}
            rows={catatan.slice().reverse()}
            renderRow={(c) => <>
              <td style={{ padding: "10px 12px", fontSize: 12 }}>{formatDate(c.tanggal)}</td>
              <td style={{ padding: "10px 12px", fontWeight: 600 }}>{c.nama}</td>
              <td style={{ padding: "10px 12px" }}><Badge>{c.kelas}</Badge></td>
              <td style={{ padding: "10px 12px", fontSize: 12, maxWidth: 250 }}>{c.catatan}</td>
              <td style={{ padding: "10px 12px", fontSize: 12 }}>{c.tindakLanjut || "-"}</td>
              <td style={{ padding: "10px 12px", fontSize: 12 }}>{c.guru}</td>
            </>}
          />
        </Card>
      )}

      {tab === "absensi" && (
        <div>
          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>📊 Rekap Kehadiran per Kelas</div>
            <SimpleBar data={KELAS_LIST.slice(0, 8).map(k => ({ label: k, value: absensi.filter(a => a.kelas === k && a.status === "Hadir").length }))} color={C.emerald} height={130} />
          </Card>
          <Card>
            <Table
              cols={["Tanggal", "Nama", "Kelas", "Status"]}
              rows={absensi.slice().reverse()}
              renderRow={(a) => <>
                <td style={{ padding: "10px 12px", fontSize: 12 }}>{formatDate(a.tanggal)}</td>
                <td style={{ padding: "10px 12px", fontWeight: 600 }}>{a.nama}</td>
                <td style={{ padding: "10px 12px" }}><Badge>{a.kelas}</Badge></td>
                <td style={{ padding: "10px 12px" }}>
                  <Badge color={a.status === "Hadir" ? C.emeraldDark : a.status === "Sakit" ? C.gold : a.status === "Izin" ? C.blue : C.red}
                    bg={a.status === "Hadir" ? C.emeraldLight : a.status === "Sakit" ? C.goldLight : a.status === "Izin" ? C.blueLight : C.redLight}>
                    {a.status}
                  </Badge>
                </td>
              </>}
            />
          </Card>
        </div>
      )}

      {tab === "rekap" && (
        <Card>
          <div style={{ fontWeight: 700, color: C.emeraldDark, marginBottom: 14 }}>📋 Rekap Lengkap Per Siswa</div>
          <Table
            cols={["Nama", "Kelas", "Hafalan", "Vocab", "Poin Pelanggaran", "Kehadiran", "Status"]}
            rows={siswa}
            renderRow={(s) => {
              const poin = getAkumulasiPoin(s.nisn, pelanggaran, apresiasi);
              const sp = getSP(poin);
              return <>
                <td style={{ padding: "10px 12px" }}>
  {/* 1. Menampilkan Status Pelanggaran (misal: Pelanggaran Berat SP1) */}
  <span style={{ 
    color: sp.color, 
    backgroundColor: sp.bg, 
    padding: "4px 10px", 
    borderRadius: "6px", 
    fontWeight: "bold",
    fontSize: "13px",
    display: "inline-block"
  }}>
    {sp.level}
  </span>
  
  {/* 2. Menampilkan Siapa Penanggung Jawabnya */}
  <div style={{ fontSize: "12px", color: "#374151", marginTop: "6px" }}>
    <strong>PJ:</strong> {sp.pj}
  </div>
  
  {/* 3. Menampilkan Alur Tindak Lanjut Sekolah */}
  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px", maxWidth: "250px", lineHeight: "1.3" }}>
    <strong>Tindak Lanjut:</strong> {sp.tindakLanjut}
  </div>
</td>
 </>;
    }}
          />
        </Card>
      )}
    </div>
  );
}
