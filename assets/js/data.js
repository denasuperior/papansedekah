const appData = {
  lokasi: [
    {name:'Papan Sedekah Masjid Al Ikhlas',        address:'Jl. Melati RT 02 RW 04, Desa Sukamaju',           district:'Cibiru',       status:'Aktif',       lat:-6.9344, lng:107.7175},
    {name:'Papan Sedekah Balai RW 03',              address:'Jl. Mawar No. 12, Kelurahan Sejahtera',           district:'Cileunyi',     status:'Aktif',       lat:-6.9389, lng:107.7521},
    {name:'Papan Sedekah Posyandu Kenanga',         address:'Jl. Anggrek RT 05 RW 01, Desa Mandiri',           district:'Ujungberung',  status:'Aktif',       lat:-6.9079, lng:107.7008},
    {name:'Papan Sedekah Musholla Ar-Rahman',       address:'Jl. Dahlia No. 7 RT 03 RW 06, Kel. Rancaekek',   district:'Rancaekek',    status:'Aktif',       lat:-6.9612, lng:107.7830},
    {name:'Papan Sedekah Masjid Nurul Huda',        address:'Jl. Teratai RT 01 RW 02, Desa Cipadung',          district:'Cibiru',       status:'Aktif',       lat:-6.9290, lng:107.7060},
    {name:'Papan Sedekah Posko RW 08',              address:'Jl. Aster RT 04 RW 08, Kel. Mekarjaya',           district:'Gedebage',     status:'Tidak Aktif', lat:-6.9500, lng:107.7350},
    {name:'Papan Sedekah Balai Desa Panyileukan',   address:'Jl. Kencana No. 1, Desa Panyileukan',             district:'Panyileukan',  status:'Aktif',       lat:-6.9450, lng:107.7290},
    {name:'Papan Sedekah Masjid At-Taqwa',          address:'Jl. Melur RT 06 RW 03, Kel. Cisaranten Kidul',    district:'Arcamanik',    status:'Aktif',       lat:-6.9200, lng:107.6990},
    {name:'Papan Sedekah TPQ Darul Falah',          address:'Jl. Cempaka RT 02 RW 05, Desa Sindanglaya',       district:'Arcamanik',    status:'Tidak Aktif', lat:-6.9150, lng:107.6920}
  ],

  relawan: [
    {name:'Siti Aminah',        phone:'0812-1111-2222', job:'Ibu Rumah Tangga', position:'Koordinator', location:'Papan Sedekah Masjid Al Ikhlas'},
    {name:'Ahmad Fauzi',        phone:'0821-3333-4444', job:'Wiraswasta',        position:'Anggota',     location:'Papan Sedekah Masjid Al Ikhlas'},
    {name:'Nur Hasanah',        phone:'0857-5555-6666', job:'Guru',              position:'Koordinator', location:'Papan Sedekah Balai RW 03'},
    {name:'Dede Kurniawan',     phone:'0813-7654-3210', job:'Karyawan Swasta',   position:'Anggota',     location:'Papan Sedekah Balai RW 03'},
    {name:'Rina Marlina',       phone:'0878-2222-9090', job:'Ibu Rumah Tangga', position:'Koordinator', location:'Papan Sedekah Posyandu Kenanga'},
    {name:'Hendra Gunawan',     phone:'0856-4444-7878', job:'Pedagang',          position:'Anggota',     location:'Papan Sedekah Posyandu Kenanga'},
    {name:'Yusuf Hidayatullah', phone:'0819-8765-4321', job:'Pengusaha',         position:'Koordinator', location:'Papan Sedekah Musholla Ar-Rahman'},
    {name:'Dewi Rahayu',        phone:'0822-6666-1234', job:'Bidan',             position:'Koordinator', location:'Papan Sedekah Masjid Nurul Huda'},
    {name:'Asep Saepudin',      phone:'0831-9988-7766', job:'Petani',            position:'Anggota',     location:'Papan Sedekah Balai Desa Panyileukan'},
    {name:'Fitriani Lestari',   phone:'0877-3344-5566', job:'Guru Ngaji',        position:'Koordinator', location:'Papan Sedekah Masjid At-Taqwa'}
  ],

  penerima: [
    {name:'Ibu Marni',            address:'RT 02 RW 04, Sukamaju, Cibiru',          phone:'0812-0000-1111', asnaf:'Miskin',       location:'Papan Sedekah Masjid Al Ikhlas'},
    {name:'Pak Rahmat',           address:'RT 03 RW 02, Sejahtera, Cileunyi',        phone:'0813-7777-8888', asnaf:'Fakir',        location:'Papan Sedekah Balai RW 03'},
    {name:'Keluarga Ibu Lina',    address:'RT 05 RW 01, Mandiri, Ujungberung',       phone:'0857-9999-2222', asnaf:'Fisabilillah', location:'Papan Sedekah Posyandu Kenanga'},
    {name:'Bapak Suharto',        address:'RT 01 RW 06, Rancaekek',                  phone:'0878-1234-5678', asnaf:'Miskin',       location:'Papan Sedekah Musholla Ar-Rahman'},
    {name:'Ibu Aisyah',           address:'RT 04 RW 02, Cipadung, Cibiru',           phone:'0821-4567-8901', asnaf:'Fakir',        location:'Papan Sedekah Masjid Nurul Huda'},
    {name:'Pak Dadang Suparman',  address:'RT 06 RW 08, Mekarjaya, Gedebage',        phone:'0831-2345-6789', asnaf:'Gharim',       location:'Papan Sedekah Posko RW 08'},
    {name:'Ibu Tuti Suharti',     address:'RT 02 RW 05, Panyileukan',                phone:'0856-5678-9012', asnaf:'Miskin',       location:'Papan Sedekah Balai Desa Panyileukan'},
    {name:'Nenek Rohayah',        address:'RT 03 RW 03, Cisaranten Kidul',           phone:'-',              asnaf:'Fakir',        location:'Papan Sedekah Masjid At-Taqwa'},
    {name:'Pak Usman Efendi',     address:'RT 01 RW 05, Sindanglaya, Arcamanik',     phone:'0819-8888-0001', asnaf:'Ibnu Sabil',   location:'Papan Sedekah TPQ Darul Falah'},
    {name:'Keluarga Pak Wahyu',   address:'RT 07 RW 04, Sukamaju, Cibiru',           phone:'-',              asnaf:'Miskin',       location:'Papan Sedekah Masjid Al Ikhlas'}
  ],

  donasi: [
    {donor:'Hamba Allah',          month:'2026-01', location:'Papan Sedekah Masjid Al Ikhlas',       type:'Cash/Rp',       value:'800000',  notes:'Donasi awal tahun'},
    {donor:'Bapak H. Sutrisno',    month:'2026-01', location:'Papan Sedekah Balai RW 03',            type:'Cash/Rp',       value:'500000',  notes:'Infak rutin bulanan'},
    {donor:'Ibu Dewi Kartika',     month:'2026-02', location:'Papan Sedekah Masjid Al Ikhlas',       type:'Cash/Rp',       value:'1000000', notes:'Sedekah jariyah'},
    {donor:'CV Berkah Mandiri',    month:'2026-02', location:'Papan Sedekah Posyandu Kenanga',       type:'Natura/Barang', value:'Minyak goreng 20 liter', notes:'Estimasi Rp400.000'},
    {donor:'Toko Sembako Jaya',    month:'2026-02', location:'Papan Sedekah Balai RW 03',            type:'Natura/Barang', value:'Gula pasir 25 kg',       notes:'Estimasi Rp350.000'},
    {donor:'Ibu Ratna Sari',       month:'2026-03', location:'Papan Sedekah Masjid Al Ikhlas',       type:'Cash/Rp',       value:'500000',  notes:'Untuk paket sayur'},
    {donor:'PT Amanah Sejahtera',  month:'2026-03', location:'Papan Sedekah Musholla Ar-Rahman',     type:'Cash/Rp',       value:'2000000', notes:'CSR perusahaan'},
    {donor:'Bapak Yayan Sofyan',   month:'2026-03', location:'Papan Sedekah Balai RW 03',            type:'Cash/Rp',       value:'300000',  notes:'Donasi pribadi'},
    {donor:'CV Berkah Jaya',       month:'2026-04', location:'Papan Sedekah Balai RW 03',            type:'Natura/Barang', value:'Beras 50 kg',            notes:'Estimasi Rp700.000'},
    {donor:'Hamba Allah',          month:'2026-04', location:'Papan Sedekah Masjid Al Ikhlas',       type:'Cash/Rp',       value:'1500000', notes:'Donasi bulanan'},
    {donor:'Ibu Nining Rahayu',    month:'2026-04', location:'Papan Sedekah Masjid Nurul Huda',      type:'Cash/Rp',       value:'750000',  notes:'Sedekah rutin'},
    {donor:'Komunitas Peduli',     month:'2026-04', location:'Papan Sedekah Balai Desa Panyileukan', type:'Cash/Rp',       value:'1000000', notes:'Kolektif RT 04'}
  ],

  paket: [
    {date:'2026-01-25', location:'Papan Sedekah Masjid Al Ikhlas',       pj:'Siti Aminah',        cost:825000,  created:25, distributed:24, status:'Terverifikasi'},
    {date:'2026-01-26', location:'Papan Sedekah Balai RW 03',            pj:'Nur Hasanah',        cost:495000,  created:15, distributed:15, status:'Terverifikasi'},
    {date:'2026-02-22', location:'Papan Sedekah Masjid Al Ikhlas',       pj:'Siti Aminah',        cost:1155000, created:35, distributed:35, status:'Terverifikasi'},
    {date:'2026-02-23', location:'Papan Sedekah Posyandu Kenanga',       pj:'Rina Marlina',       cost:660000,  created:20, distributed:19, status:'Terverifikasi'},
    {date:'2026-03-28', location:'Papan Sedekah Masjid Al Ikhlas',       pj:'Siti Aminah',        cost:1320000, created:40, distributed:39, status:'Terverifikasi'},
    {date:'2026-03-29', location:'Papan Sedekah Musholla Ar-Rahman',     pj:'Yusuf Hidayatullah', cost:990000,  created:30, distributed:30, status:'Terverifikasi'},
    {date:'2026-03-30', location:'Papan Sedekah Balai RW 03',            pj:'Nur Hasanah',        cost:594000,  created:18, distributed:17, status:'Diajukan'},
    {date:'2026-04-20', location:'Papan Sedekah Masjid Al Ikhlas',       pj:'Siti Aminah',        cost:1650000, created:50, distributed:48, status:'Terverifikasi'},
    {date:'2026-04-21', location:'Papan Sedekah Balai RW 03',            pj:'Nur Hasanah',        cost:990000,  created:30, distributed:30, status:'Diajukan'},
    {date:'2026-04-22', location:'Papan Sedekah Masjid Nurul Huda',      pj:'Dewi Rahayu',        cost:594000,  created:18, distributed:15, status:'Draft'},
    {date:'2026-04-23', location:'Papan Sedekah Balai Desa Panyileukan', pj:'Asep Saepudin',      cost:462000,  created:14, distributed:0,  status:'Draft'}
  ],

  dokumentasi: [
    {title:'Penyaluran Paket Sayur Januari',      date:'2026-01-25', location:'Papan Sedekah Masjid Al Ikhlas',      category:'Penyaluran', desc:'Pembagian paket sayur dan lauk untuk 24 warga sekitar masjid.'},
    {title:'Penerimaan Donasi Perdana Balai RW',  date:'2026-01-26', location:'Papan Sedekah Balai RW 03',           category:'Donasi',     desc:'Serah terima donasi tunai dari donatur rutin di balai RW 03.'},
    {title:'Pengepakan Paket Februari',           date:'2026-02-22', location:'Papan Sedekah Masjid Al Ikhlas',      category:'Persiapan',  desc:'Relawan mempersiapkan dan mengepak 35 paket sedekah untuk distribusi.'},
    {title:'Penyaluran Posyandu Kenanga',         date:'2026-02-23', location:'Papan Sedekah Posyandu Kenanga',      category:'Penyaluran', desc:'Distribusi paket minyak goreng dan sembako ke penerima manfaat.'},
    {title:'Kegiatan Relawan Maret',              date:'2026-03-28', location:'Papan Sedekah Masjid Al Ikhlas',      category:'Persiapan',  desc:'Koordinasi relawan dan persiapan 40 paket sedekah bulan Maret.'},
    {title:'Penyaluran Musholla Ar-Rahman',       date:'2026-03-29', location:'Papan Sedekah Musholla Ar-Rahman',    category:'Penyaluran', desc:'Pendistribusian 30 paket kepada warga kurang mampu di sekitar musholla.'},
    {title:'Penerimaan Beras CV Berkah Jaya',     date:'2026-04-21', location:'Papan Sedekah Balai RW 03',           category:'Donasi',     desc:'Serah terima donasi beras 50 kg dari CV Berkah Jaya untuk penerima manfaat.'},
    {title:'Penyaluran Paket April Masjid',       date:'2026-04-20', location:'Papan Sedekah Masjid Al Ikhlas',      category:'Penyaluran', desc:'Distribusi 48 paket sedekah kepada penerima terdaftar, dokumentasi lengkap.'},
    {title:'Rapat Koordinasi Bulanan',            date:'2026-04-18', location:'Papan Sedekah Masjid Al Ikhlas',      category:'Rapat',      desc:'Rapat evaluasi program April dan perencanaan kegiatan bulan Mei 2026.'}
  ],

  users: [
    {name:'Admin Pusat',         email:'admin@amalbunda.org',    role:'Super Admin', location:'Semua Titik',                           status:'Aktif'},
    {name:'Bendahara LAZ',       email:'keuangan@amalbunda.org', role:'Super Admin', location:'Semua Titik',                           status:'Aktif'},
    {name:'Siti Aminah',         email:'siti@amalbunda.org',     role:'Koordinator', location:'Papan Sedekah Masjid Al Ikhlas',        status:'Aktif'},
    {name:'Nur Hasanah',         email:'nur@amalbunda.org',      role:'Koordinator', location:'Papan Sedekah Balai RW 03',             status:'Aktif'},
    {name:'Rina Marlina',        email:'rina@amalbunda.org',     role:'Koordinator', location:'Papan Sedekah Posyandu Kenanga',        status:'Aktif'},
    {name:'Yusuf Hidayatullah',  email:'yusuf@amalbunda.org',    role:'Koordinator', location:'Papan Sedekah Musholla Ar-Rahman',      status:'Aktif'},
    {name:'Dewi Rahayu',         email:'dewi@amalbunda.org',     role:'Anggota',     location:'Papan Sedekah Masjid Nurul Huda',       status:'Aktif'},
    {name:'Asep Saepudin',       email:'asep@amalbunda.org',     role:'Anggota',     location:'Papan Sedekah Balai Desa Panyileukan',  status:'Aktif'}
  ]
};
