// =======================================
// DAFTAR 18 KELAS
// =======================================

const daftarKelas = {
    "KELAS 10": [
        "X RPL 1",
        "X RPL 2",
        "X RPL 3",
        "X MPLB",
        "X AKL",
        "X TSM 1",
        "X TSM 2"
    ],

    "KELAS 11": [
        "XI RPL 1",
        "XI RPL 2",
        "XI AKL",
        "XI MPLB",
        "XI TSM 1",
        "XI TSM 2"
    ],

    "KELAS 12": [
        "XII RPL 1",
        "XII RPL 2",
        "XII MPLB",
        "XII TSM 1",
        "XII TSM 2"
    ]
};

const semuaKelas = Object.values(daftarKelas).flat();


// =======================================
// PENYIMPANAN DATA
// =======================================

function ambilData(kunci, nilaiAwal) {
    try {
        const data = localStorage.getItem(kunci);

        if (data === null) {
            return nilaiAwal;
        }

        return JSON.parse(data);
    } catch (error) {
        console.error("Gagal membaca data:", error);
        return nilaiAwal;
    }
}

let dataSiswa = ambilData("absensiku_siswa", {});
let dataAbsensi = ambilData("absensiku_absensi", []);

let kelasAktif =
    localStorage.getItem("absensiku_kelas") || "";

// Periksa kelas yang tersimpan
if (!semuaKelas.includes(kelasAktif)) {
    kelasAktif = "";
}

// Pastikan data kelas berbentuk array
semuaKelas.forEach(kelas => {
    if (!Array.isArray(dataSiswa[kelas])) {
        dataSiswa[kelas] = [];
    }
});

// Periksa data absensi
if (!Array.isArray(dataAbsensi)) {
    dataAbsensi = [];
}

function simpanData() {
    try {
        localStorage.setItem(
            "absensiku_siswa",
            JSON.stringify(dataSiswa)
        );

        localStorage.setItem(
            "absensiku_absensi",
            JSON.stringify(dataAbsensi)
        );

        localStorage.setItem(
            "absensiku_kelas",
            kelasAktif
        );

        return true;

    } catch (error) {
        alert("Gagal menyimpan data. Periksa penyimpanan browser.");
        console.error(error);
        return false;
    }
}


// =======================================
// TANGGAL
// =======================================

function tanggalHariIni() {
    const sekarang = new Date();

    const tahun = sekarang.getFullYear();
    const bulan = String(
        sekarang.getMonth() + 1
    ).padStart(2, "0");

    const hari = String(
        sekarang.getDate()
    ).padStart(2, "0");

    return `${tahun}-${bulan}-${hari}`;
}

// Isi tanggal otomatis
document.getElementById("tanggal").value =
    tanggalHariIni();

document.getElementById("tanggalAbsensi").value =
    tanggalHariIni();


// =======================================
// PILIH KELAS
// =======================================

function pilihKelas(namaKelas) {

    if (!semuaKelas.includes(namaKelas)) {
        alert("Kelas tidak ditemukan!");
        return;
    }

    kelasAktif = namaKelas;

    simpanData();
    perbaruiHalaman();

    document.getElementById("kelas").scrollIntoView({
        behavior: "smooth"
    });
}


// =======================================
// TAMPILKAN KELAS AKTIF
// =======================================

function tampilkanKelasAktif() {

    const nama = kelasAktif || "Belum memilih kelas";

    document.getElementById("kelasAktif").textContent = nama;
    document.getElementById("kelasSiswa").textContent = nama;
    document.getElementById("kelasAbsensi").textContent = nama;
    document.getElementById("kelasLaporan").textContent = nama;

    document.querySelectorAll(".kelas-list button").forEach(tombol => {

        tombol.classList.toggle(
            "active",
            tombol.textContent.trim() === kelasAktif
        );

    });
}


// =======================================
// TAMPILKAN DAFTAR SISWA
// =======================================

function tampilkanSiswa() {

    const tabel = document.getElementById("daftarMurid");
    const pilihan = document.getElementById("namaSiswa");

    tabel.innerHTML = "";
    pilihan.innerHTML = "";

    if (!kelasAktif) {

        tabel.innerHTML = `
            <tr>
                <td colspan="3">
                    Silakan pilih kelas terlebih dahulu.
                </td>
            </tr>
        `;

        pilihan.innerHTML = `
            <option value="">
                Pilih kelas terlebih dahulu
            </option>
        `;

        document.getElementById("totalMurid").textContent = 0;

        return;
    }

    const siswa = dataSiswa[kelasAktif];

    document.getElementById("totalMurid").textContent =
        siswa.length;

    if (siswa.length === 0) {

        tabel.innerHTML = `
            <tr>
                <td colspan="3">
                    Belum ada siswa di kelas ini.
                </td>
            </tr>
        `;

        pilihan.innerHTML = `
            <option value="">
                Belum ada siswa
            </option>
        `;

        return;
    }

    siswa.forEach((nama, index) => {

        const baris = document.createElement("tr");

        const nomor = document.createElement("td");
        nomor.textContent = index + 1;

        const namaTd = document.createElement("td");
        namaTd.textContent = nama;

        const aksi = document.createElement("td");

        const tombol = document.createElement("button");
        tombol.textContent = "Hapus";

        tombol.onclick = () => hapusSiswa(index);

        aksi.appendChild(tombol);

        baris.append(nomor, namaTd, aksi);

        tabel.appendChild(baris);

        const option = document.createElement("option");

        option.value = nama;
        option.textContent = nama;

        pilihan.appendChild(option);

    });
}


// =======================================
// TAMBAH SISWA
// =======================================

function tambahSiswa() {

    if (!kelasAktif) {
        alert("Pilih kelas terlebih dahulu!");
        return;
    }

    const input = document.getElementById("namaMuridBaru");

    const nama = input.value.trim();

    if (!nama) {
        alert("Masukkan nama siswa!");
        input.focus();
        return;
    }

    const sudahAda = dataSiswa[kelasAktif].some(
        siswa => siswa.toLowerCase() === nama.toLowerCase()
    );

    if (sudahAda) {
        alert("Nama siswa sudah terdaftar!");
        return;
    }

    dataSiswa[kelasAktif].push(nama);

    if (!simpanData()) {
        dataSiswa[kelasAktif].pop();
        return;
    }

    input.value = "";

    perbaruiHalaman();

    alert("Siswa berhasil ditambahkan!");
}


// =======================================
// HAPUS SISWA
// =======================================

function hapusSiswa(index) {

    if (!kelasAktif) return;

    const nama = dataSiswa[kelasAktif][index];

    if (!nama) return;

    const konfirmasi = confirm(
        `Hapus ${nama} dari daftar siswa?\n\nRiwayat absensinya akan tetap tersimpan.`
    );

    if (!konfirmasi) return;

    const siswaDihapus = dataSiswa[kelasAktif].splice(index, 1)[0];

    if (!simpanData()) {
        dataSiswa[kelasAktif].splice(index, 0, siswaDihapus);
        return;
    }

    perbaruiHalaman();
}


// =======================================
// SIMPAN ABSENSI
// =======================================

function simpanAbsensi() {

    if (!kelasAktif) {
        alert("Pilih kelas terlebih dahulu!");
        return;
    }

    const tanggal =
        document.getElementById("tanggalAbsensi").value;

    const nama =
        document.getElementById("namaSiswa").value;

    const status =
        document.getElementById("status").value;

    if (!tanggal) {
        alert("Pilih tanggal absensi!");
        return;
    }

    if (!nama) {
        alert("Pilih nama siswa terlebih dahulu!");
        return;
    }

    if (!dataSiswa[kelasAktif].includes(nama)) {
        alert("Nama siswa tidak terdaftar di kelas ini!");
        return;
    }

    const daftarStatus = [
        "Hadir",
        "Sakit",
        "Izin",
        "Alpa"
    ];

    if (!daftarStatus.includes(status)) {
        alert("Status absensi tidak valid!");
        return;
    }

    // Cek absensi ganda
    const sudahAda = dataAbsensi.some(data =>
        data.kelas === kelasAktif &&
        data.tanggal === tanggal &&
        data.nama === nama
    );

    if (sudahAda) {
        alert(
            "Siswa sudah melakukan absensi pada tanggal tersebut!"
        );
        return;
    }

    const dataBaru = {
        id: Date.now().toString() +
            Math.random().toString(36).slice(2),

        kelas: kelasAktif,
        tanggal: tanggal,
        nama: nama,
        status: status
    };

    dataAbsensi.push(dataBaru);

    if (!simpanData()) {
        dataAbsensi.pop();
        return;
    }

    // Samakan tanggal dashboard
    document.getElementById("tanggal").value = tanggal;

    perbaruiHalaman();

    alert("Absensi berhasil disimpan!");
}


// =======================================
// DASHBOARD
// =======================================

function tampilkanDashboard() {

    const tanggal =
        document.getElementById("tanggal").value;

    const total = kelasAktif
        ? dataSiswa[kelasAktif].length
        : 0;

    const dataHariIni = dataAbsensi.filter(data =>
        data.kelas === kelasAktif &&
        data.tanggal === tanggal
    );

    const hitung = status =>
        dataHariIni.filter(data =>
            data.status === status
        ).length;

    document.getElementById("totalMurid").textContent = total;

    document.getElementById("jumlahHadir").textContent =
        hitung("Hadir");

    document.getElementById("jumlahSakit").textContent =
        hitung("Sakit");

    document.getElementById("jumlahIzin").textContent =
        hitung("Izin");

    document.getElementById("jumlahAlpa").textContent =
        hitung("Alpa");
}


// Perbarui dashboard ketika tanggal berubah
document.getElementById("tanggal").addEventListener(
    "change",
    tampilkanDashboard
);


// =======================================
// TAMPILKAN LAPORAN
// =======================================

function tampilkanLaporan() {

    const tabel = document.getElementById("tabelAbsensi");

    const filter =
        document.getElementById("filterTanggal").value;

    tabel.innerHTML = "";

    if (!kelasAktif) {

        tabel.innerHTML = `
            <tr>
                <td colspan="6">
                    Silakan pilih kelas terlebih dahulu.
                </td>
            </tr>
        `;

        return;
    }

    const laporan = dataAbsensi
        .filter(data =>
            data.kelas === kelasAktif &&
            (!filter || data.tanggal === filter)
        )
        .sort((a, b) =>
            b.tanggal.localeCompare(a.tanggal)
        );

    if (laporan.length === 0) {

        tabel.innerHTML = `
            <tr>
                <td colspan="6">
                    Belum ada data absensi.
                </td>
            </tr>
        `;

        return;
    }

    laporan.forEach((data, index) => {

        const baris = document.createElement("tr");

        const isi = [
            index + 1,
            data.tanggal,
            data.kelas,
            data.nama,
            data.status
        ];

        isi.forEach(nilai => {

            const td = document.createElement("td");

            td.textContent = nilai;

            baris.appendChild(td);

        });

        const aksi = document.createElement("td");

        const tombol = document.createElement("button");

        tombol.textContent = "Hapus";

        tombol.onclick = () => hapusAbsensi(data.id);

        aksi.appendChild(tombol);

        baris.appendChild(aksi);

        tabel.appendChild(baris);

    });
}


// =======================================
// HAPUS ABSENSI
// =======================================

function hapusAbsensi(id) {

    const konfirmasi = confirm(
        "Apakah kamu yakin ingin menghapus catatan absensi ini?"
    );

    if (!konfirmasi) return;

    const indeks = dataAbsensi.findIndex(
        data => data.id === id
    );

    if (indeks === -1) return;

    const dataDihapus = dataAbsensi.splice(indeks, 1)[0];

    if (!simpanData()) {
        dataAbsensi.splice(indeks, 0, dataDihapus);
        return;
    }

    perbaruiHalaman();

    alert("Catatan absensi berhasil dihapus!");
}


// =======================================
// FILTER TANGGAL
// =======================================

function resetFilter() {

    document.getElementById("filterTanggal").value = "";

    tampilkanLaporan();
}


// =======================================
// DOWNLOAD CSV
// =======================================

function downloadCSV() {

    if (!kelasAktif) {
        alert("Pilih kelas terlebih dahulu!");
        return;
    }

    const filter =
        document.getElementById("filterTanggal").value;

    const laporan = dataAbsensi.filter(data =>
        data.kelas === kelasAktif &&
        (!filter || data.tanggal === filter)
    );

    if (laporan.length === 0) {
        alert("Belum ada data absensi untuk diunduh!");
        return;
    }

    const kolom = [
        "Tanggal",
        "Kelas",
        "Nama Siswa",
        "Status"
    ];

    let csv = kolom.join(",") + "\n";

    laporan.forEach(data => {

        const baris = [
            data.tanggal,
            data.kelas,
            data.nama,
            data.status
        ].map(nilai => {

            return '"' +
                String(nilai).replace(/"/g, '""') +
                '"';

        });

        csv += baris.join(",") + "\n";

    });

    const blob = new Blob(
        ["\uFEFF" + csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
        `Laporan-${kelasAktif.replace(/\s+/g, "-")}.csv`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);

}


// =======================================
// PERBARUI SELURUH HALAMAN
// =======================================

function perbaruiHalaman() {

    tampilkanKelasAktif();

    tampilkanSiswa();

    tampilkanDashboard();

    tampilkanLaporan();

}


// =======================================
// MULAI WEBSITE
// =======================================

simpanData();

perbaruiHalaman();