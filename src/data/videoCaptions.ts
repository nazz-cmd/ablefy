export interface VideoCaption {
  start: number;
  end: number;
  text: string;
}

/**
 * Normalizes video captions:
 * 1. Filters out empty text entries.
 * 2. Parses non-negative integer seconds.
 * 3. Sorts chronologically by start timestamp.
 * 4. Eliminates overlapping intervals (ensures cur.end <= next.start).
 * 5. Ensures valid positive duration (cur.end > cur.start).
 */
export const normalizeVideoCaptions = (rawCaptions: VideoCaption[]): VideoCaption[] => {
  if (!rawCaptions || !Array.isArray(rawCaptions) || rawCaptions.length === 0) return [];

  const sorted = rawCaptions
    .filter((c) => c && typeof c.text === 'string' && c.text.trim())
    .map((c) => ({
      start: Math.max(0, Math.floor(Number(c.start) || 0)),
      end: Math.max(0, Math.floor(Number(c.end) || 0)),
      text: c.text.trim(),
    }))
    .sort((a, b) => a.start - b.start);

  const result: VideoCaption[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const cur = { ...sorted[i] };
    const next = sorted[i + 1];

    if (next) {
      // If current end overlaps next start, clamp current end to next start
      if (cur.end > next.start) {
        cur.end = Math.max(cur.start + 1, next.start);
      }
      // If next start was less than or equal to current start (anomaly), advance next start
      if (next.start <= cur.start) {
        next.start = cur.start + 1;
      }
    }

    // Ensure positive duration
    if (cur.end <= cur.start) {
      cur.end = next ? Math.max(cur.start + 1, next.start) : cur.start + 3;
    }

    result.push(cur);
  }

  return result;
};

export const BUSINESS_VIDEO_CAPTIONS: VideoCaption[] = [
  { start: 0, end: 5, text: "[Musik Pembuka / Intro] Naik Kelas" },
  { start: 5, end: 11, text: "Sekolah ya sekarang tuh. Nah, malamnya saya langsung nyari kerjaan dan ternyata kerjaannya itu tuh kayak post live" },
  { start: 11, end: 17, text: "Streaming lah. Nah, saya malamnya ngemasukin CV saya, besoknya saya langsung disuruh interview, habis" },
  { start: 17, end: 24, text: "Interview saya lolos dan besoknya saya kerja. Di situ tuh 2 jam Rp50.000 gajinya. Jadi kayak pertengahan bulan" },
  { start: 24, end: 28, text: "Juga udah habislah. Mau minta ke orang tua juga udah malu karena udah gede gitu" },
  { start: 28, end: 35, text: "Kan, udah kerja. Tapi ya karena saya tuh benar-benar terobsesi pengin sukses gitu kan. Soalnya dulu nih saya tuh pernah" },
  { start: 35, end: 41, text: "Lihat naik kelas karena dulu ada gitu kan petani usia muda udah dapat ratusan juta pas zaman sekolah ya. Dari" },
  { start: 41, end: 48, text: "Situ saya bikin usaha kecil kecilan modal saya tuh di Rp70.000 K. Jadi gini saya beli baju polos sekitar" },
  { start: 48, end: 54, text: "Rp40.000-an terus saya nyablon nyablon satuan di Rp30.000. Ya, saya cuman bikin sampel doang kan orang-orang lain kalau" },
  { start: 54, end: 59, text: "Misalkan pengin bikin brand itu tuh kayak satu produk minimal beli 12 pie. Kalau saya kan satu ya, jadi" },
  { start: 59, end: 66, text: "Modalnya kecil ya sekitaran Rp70.000-an saya bikin. Saya video-video bikin video cinematikom lah. viewersnya itu tuh sejuta" },
  { start: 66, end: 73, text: "Seharinya dapat 50 pcs. Dan alhamdulillah kak ya saya di situ tuh masih umur 19 tahun. Saya dapat" },
  { start: 73, end: 79, text: "Rp100 juta pertama itu tuh kayak bangga iya tapi enggak kerasa gitu loh." },
  { start: 79, end: 84, text: "Perkenalkan nama saya Ilham Nurahman. Asal saya dari Taraju cuman sekarang saya tinggal di Kota Tasik. Umur saya" },
  { start: 84, end: 90, text: "Sekarang ada di 20 tahun. Saya selaku owner dari bridge. Untuk bisnisnya kita" },
  { start: 90, end: 95, text: "Bergerak di bidang clothing brand dan kita juga ada di tiga model. Ada di" },
  { start: 95, end: 101, text: "T-shirt, ada hoodie, sama polo shirt. Tentunya di tiga modelnya itu tuh berbeda-beda gambar. Kita" },
  { start: 101, end: 108, text: "Mementingkan luxury, grful, dan elegan. Jadi orang-orang bisa menyesuaikan macek aja yang mana seperti itu. K. Untuk" },
  { start: 108, end: 115, text: "Background keluarga saya bisa disebutkan biasa aja. Ibu saya sebagai ibu rumah tangga, ayah kandung saya tuh sudah" },
  { start: 115, end: 120, text: "Meninggal. Saya kan udah lulus SMP. Dari situ tuh saya kan udah lihat orang tua" },
  { start: 120, end: 127, text: "Saya kayak gimana orangnya gitu kan. Udah lihat kayak perihnya gimana, \"Mah, udah deh ud enggak bakalan sekolah de" },
  { start: 127, end: 134, text: "Mau ngebantuin mama gitu kan.\" Serius itu udah soalnya sayang banget, Dek. Udah 3 tahun lagi udah deh mending kel" },
  { start: 134, end: 137, text: "Aja dulu. Cuman karena saya ngeyel gitu kan. Udah deh, Mas. Udah mau nyobain" },
  { start: 137, end: 143, text: "Dulu aja selama sebulan gitu kan. Udahlah kerja di situ tuh saya sebagai ngangkut-ngangkutin Indomie gitu," },
  { start: 143, end: 147, text: "Sembakau lah di pasar kayak, nah adalah sekitaran 3 hari ya karena mungkin saya" },
  { start: 147, end: 152, text: "Capek gitu kan. Maaf kata tuh ya mending kolah aja dulu. Nah dari situ" },
  { start: 152, end: 157, text: "Tuh saya tuh kayak sekolah harus benar-benar nih. Saya udah ngerasa nih kayak kerja tuh emang capek gitu kan." },
  { start: 157, end: 161, text: "Udahlah dari situ ya tuh deh mending sekolah aja dulu kata mama saya tuh." },
  { start: 161, end: 167, text: "Udahlah dari situ tuh saya t sekolah SMK ya tuh kayak bangor iya selayaknya" },
  { start: 167, end: 172, text: "Anak muda lah. Terus saya di SMK juga suka bolos dan ya karena saya lihat" },
  { start: 172, end: 178, text: "Latar belakang keluarga saya ya orang yang biasa aja. Jadi saya tuh punya tekad, ah enggak apa-apalah pas sekolah" },
  { start: 178, end: 184, text: "Saya nikmatin dulu masa muda saya tapi pas sudah lulus sekolah saya pengin benar-benar usaha. Tapi sekolah juga" },
  { start: 184, end: 191, text: "Saya udah bikin usaha ya kayak usaha sosis, terus parfum gitu kan sama teman semua. Terus tuh usaha trip dan" },
  { start: 191, end: 195, text: "Usaha baju anak kecil. Tapi pas usaha baju anak kecil itu tuh pas saya sudah" },
  { start: 195, end: 201, text: "Kerja. Jadi gini, Kak. Sebelumnya itu saya lulus sekolah ya sekarang tuh. Nah, malamnya saya langsung nyari kerjaan dan" },
  { start: 201, end: 208, text: "Ternyata kerjaannya itu tuh kayak live streaming lah. Nah, saya malamnya ngemasukin CV saya, besoknya saya" },
  { start: 208, end: 214, text: "Langsung disuruh interview. Habis interview saya lolos dan besoknya saya kerja seperti itu. Nah, ya berjalannya" },
  { start: 214, end: 218, text: "Waktu ya, Kak. Kayak saya tuh kan dari sini ke situ tuh sekitaran 40 menit," },
  { start: 218, end: 223, text: "Kak. Jadi kayak capek di jalan, kayak bensin juga udah habis gitu kan. Nah, di" },
  { start: 223, end: 229, text: "Situ tuh 2 jam Rp50.000 Ibu gajinya, Kakak. Jadi kayak pertengahan bulan juga udah habislah. Mau minta ke orang tua" },
  { start: 229, end: 233, text: "Juga udah malu karena udah gede gitu kan, udah kerja. Tapi ya mungkin orang" },
  { start: 233, end: 239, text: "Tua masih ngertiin saya. Jadi selalulah ada suka dikasih bekal sehari-hari meskipun saya ud kerja karena di" },
  { start: 239, end: 245, text: "Pertengahan bulan udah habis. Nah, berjalannya waktu masa sih harus kayak gini aja gitu kan. Kebetulan teman saya" },
  { start: 245, end: 248, text: "Tuh tuh ngajak usaha baju anak kecil. Nah, udahlah saya ayo gas. Karena saya" },
  { start: 248, end: 254, text: "Tuh benar-benar terobsesi pengin sukses gitu kan. Kayak di jalan juga pas kerja lihat orang-orang kok orang-orang bisa" },
  { start: 254, end: 261, text: "Punya mobil, punya rumah gede. Nah, dari situ saya tuh kayak mikirnya masa orang bisa, saya enggak bisa, orang juga" },
  { start: 261, end: 265, text: "Pernah ada di titik terendah sama kayak saya gitu kan. Nah, dari situ udahlah" },
  { start: 265, end: 271, text: "Saya tuh bikin bisnis sama teman saya. Eh, cuman seminggu teman saya belok kanan, saya kiri. Jadi enggak" },
  { start: 271, end: 278, text: "Lurus gitu kan. Atau bisa dikatakan ya enggak sejalan seperti itu. Berjalannya waktu saya punya teman, teman saya juga" },
  { start: 278, end: 284, text: "Bikin usaha clothing brand. Ya, kayak saya tuh bukan belajar tapi dia tuh ngasih tahu kayak dapur-dapurnya di" },
  { start: 284, end: 290, text: "Mana gitu kan. Udahlah dari situ tuh saya cobain. Soalnya dari dulu juga kayak gak apa-apalah saya kerja di orang" },
  { start: 290, end: 297, text: "Lain. Yang penting masa depan saya punya tim sendiri atau bisa ngegaji orang gitu kan. Dari situ saya bikin" },
  { start: 297, end: 303, text: "Usaha kecilkecilan kayak modal saya tuh di Rp70.000K. Jadi gini saya beli baju polos sekitar" },
  { start: 303, end: 308, text: "Rp40.000-an terus saya nyablon nyablon satuan di Rp30.000. Ya saya cuman bikin sampel doang kan orang-orang" },
  { start: 308, end: 314, text: "Lain kalau misalkan pengin bikin brand itu tuh kayak satu produk minimal beli 12 pie. Kalau saya kan satu ya. Jadi" },
  { start: 314, end: 321, text: "Modalnya kecil ya sekitaran Rp70.000-an saya bikin. Saya video-video bikin video sinematik. Nah, dari situ kayak masa" },
  { start: 321, end: 327, text: "Harus satu produk doang kan saya ngumpulin lagiah uang dari sisa uang gajian saya seperti itu ya. Ngumpul lagi" },
  { start: 327, end: 332, text: "Saya bikin sampailah empat produk. Nah, dari empat produk itu tuh ada satu tuh yang terjual kayak ada yang" },
  { start: 332, end: 338, text: "Nge-chat ya, \"Kak, ini TBB segini berapa?\" Kayak, \"Wah, saya tuh bangga banget. Saya tuh pas respon, Kak, Kakak" },
  { start: 338, end: 344, text: "TBB segini pakai ukuran ini.\" Nah, dari situ tuh si kakaknya itu kayak, \"Oke, Kak, siap check out katanya. Wah," },
  { start: 344, end: 350, text: "Saya tunggu-tunggu dari situ tuh kayak saya nungguin adalah suara oren ya, cling katanya gitu. Saya lihatlah," },
  { start: 350, end: 356, text: "Wah gak nyangka saya tuh minta berterima kasihlah kepada teman saya ya karena udah ngasih tahu vendor-pendornya di" },
  { start: 356, end: 361, text: "Sini. Kalau bukan karena teman saya mungkin enggak bakalan seperti ini gitu kan ya. Saya juga enggak bakalan" },
  { start: 361, end: 366, text: "Lupa meskipun udah jarang kontekan. Nah, dari situ tuh berjalannya waktu kok enggak ada lagi yang check out" },
  { start: 366, end: 372, text: "Itu tuh sekitaran 3 bulan. Saya tuh, Kak, pengin nyerah. Kenapa? Kayak rezeki saya tuh ada di sini bukannya kayak" },
  { start: 372, end: 379, text: "Pengin nyerah banget. Untungnya ada cewek terdekat saya, orang tua saya, keluarga mau nenek, mau adik, mau" },
  { start: 379, end: 386, text: "Mama, teman-teman saya juga ya seperti itu support saya kayak udah jalanin aja dulu, katanya gitu. Soalnya sayang" },
  { start: 386, end: 393, text: "Banget kayak kamu udah tahu vendornya di mana, stikernya mana, tukang kainnya di mana, jadi udah tinggal jalanin aja." },
  { start: 393, end: 397, text: "Oke, kata saya tuh. Ya, intinya saya di situ tuh nyerah buat istirahat, bukan" },
  { start: 397, end: 403, text: "Nyerah buat berhenti berjalannya waktu. Saya bikin video lah, konsisten terus tekun boom lah viewersnya itu tuh" },
  { start: 403, end: 409, text: "Sejuta. Seharinya dapat 50 pcs. Gelap banget, Guys, ya, yang warna hitamnya. Dan untuk yang putih ini" },
  { start: 409, end: 413, text: "Enggak bakal pas ada 50 pcs orderan itu tuh kayak enggak ada modal, Kak. Enggak ada modal" },
  { start: 413, end: 420, text: "Sama sekali. Karena kan dulunya saya tuh modal nekat sama modal Rp70.000-an sajalah. Dari situ saya tuh minta pinjam" },
  { start: 420, end: 426, text: "Ya ke mama saya. Ma, uanglah segini. Ada enggak? Duh, deh. Enggak ada. Mama katanya gitu ya. Saya juga" },
  { start: 426, end: 433, text: "Tahu soalnya mama saya tuh kayak uang gajiannya juga dipakai buat bayar kontrakan, dikasih ke orang tuanya" },
  { start: 433, end: 437, text: "Supaya ke adik saya atau ke saya. Soalnya saya juga kasih buat uang jajan." },
  { start: 437, end: 441, text: "Nah, dari situ tuh saya percaya. Tapi saya tuh bilang yakinin Mama kayak, \"Ma," },
  { start: 441, end: 447, text: "Ayo dong ini harapan udah satu-satunya.\" Mama juga kayak enggak percaya, Kak. Kenapa enggak percaya? Kayak Mama lihat" },
  { start: 447, end: 451, text: "Saya tuh dulu di sekolah kayak bolos, iya pintar enggak? Kayak gitu, Kak. Ya," },
  { start: 451, end: 457, text: "Jadi kayak ngeyakinin Mama sendiri lah kalau kayak gitu mah ya. Jadi percaya enggak gitu. Ya udah nih, Dek." },
  { start: 457, end: 463, text: "Cuman ini harus dibayar lagi ya. Soalnya Mama pinjam uangnya dari bos Mama dan" },
  { start: 463, end: 467, text: "Mama enggak punya uang sama sekali kata mama saya tuh gitu. Nah, dari situ saya" },
  { start: 467, end: 474, text: "Dipinjamin lah sama bosnya mama saya. Udahlah sama saya tuh dialinin ke modal yang uang R5 juta itu tuh. Nah," },
  { start: 474, end: 480, text: "Kebetulan kan bulan puasa ya. Eh, ternyata pas hari H bulan puasanya itu tuh kayak langsunglah ada orderan gitu" },
  { start: 480, end: 484, text: "Kan. Saya sendiri, Kak, kayak 20 pcs gitu kan. Kayak besoknya itu tuh 30" },
  { start: 484, end: 488, text: "Pcs. Dari situ otomatis kan modalnya habis ya. Saya minjam lagi ke mama saya" },
  { start: 488, end: 495, text: "Kayak inilah kekurangan uang lagi buat modal. Boleh enggak tuh pinjam lagi? Aduh deh. Katanya kayak kaget gitu" },
  { start: 495, end: 501, text: "Loh. Coba mama lihat katanya itu berapa penjualannya sama uang yang di situ berapa. Dilihatin lah kayak mama saya" },
  { start: 501, end: 507, text: "Tuh mikir-mikir lagi atuh deh mama tuh enggak punya uang katanya. Kayak mama tuh kayak takutlah anaknya malah boncos" },
  { start: 507, end: 514, text: "Gitu kan. Soalnya sekarang sekarang tuh banyak anak-anak pergaulannya itu parah kayak judi slot atau narkoba gitu kan." },
  { start: 514, end: 518, text: "Nah, mungkin takut dipakai enggak benar sama mama saya tuh. Nah, dari situ mama" },
  { start: 518, end: 525, text: "Saya pinjam lagi ke bos saya ya. Saya juga ngeyakinin mama saya sesudah bulan puasa tuh harus sudah dibayarlah" },
  { start: 525, end: 529, text: "Gitu kan kata mama saya tuh. Dan saya juga siap karena berjalannya waktu pas" },
  { start: 529, end: 535, text: "Bulan puasa kayak semingguan tuh udah balik lagi modalnya tuh pas pertangan bulan puasa tapi dial iniin lagi diputar" },
  { start: 535, end: 541, text: "Lagi gitu kan Kak. Nah, udahlah udah lebaran saya nunggu sekitaran semingguan kayak ya Allah mudah-mudahan ini gak" },
  { start: 541, end: 548, text: "Muncos mudah-mudahan ini tentunya cair gitu kan ya. Dari situ sekitar semingguan ada tuh R10 juta. Duh sok R5" },
  { start: 548, end: 552, text: "Juta lagi yuk buat bayar hutang dah ke bos mama saya. Nah terus berjalannya" },
  { start: 552, end: 557, text: "Waktu sekitaran 5 harian. Wah ada nih Rp20 juta kata saya tuh kayak totalnya" },
  { start: 557, end: 562, text: "Itu tuh untuk selama belum dikasih ke orang tua saya itu tuh sekitaran Rp35" },
  { start: 562, end: 566, text: "Juta, Kak sebulan. Nah, yang R jutanya tentunya dibayar ke bos mama saya. Yang" },
  { start: 566, end: 571, text: "Rp20 juta saya bersih kayak ini mah lihat kata saya tuh ini saya dapat omset" },
  { start: 571, end: 577, text: "Segini di R jutaan. Mama saya tuh kayak hah katanya mama juga pengin dapat R" },
  { start: 577, end: 582, text: "Juta tuh tuh harus banting tulang soalnya kan mama saya punggung keluarga seperti itu. Ahlah saya kasih" },
  { start: 582, end: 587, text: "Dikit-dikit ke mama saya jadi ngasih THR lah gitu. Apalagi nenek saya itu dikasih" },
  { start: 587, end: 594, text: "Uang 100 juga udah nangis. Mama saya dikasih semuanya kasihlah seperti itu berjalannya waktu kayak libur Idul" },
  { start: 594, end: 599, text: "Fitri itu kan bukan lagi toko saya. Nah, dari situ tuh saya kayak aduh masa saya" },
  { start: 599, end: 607, text: "Harus sendiri mulu? Mungkin bisa dikatakanlah kalau semisal saya pengin maju saya harus punya tim. Nah, dari" },
  { start: 607, end: 612, text: "Situ kontakct teman saya soalnya teman saya nanyain kerjaan ke saya gitu kan. Kamu ada kerjaan enggak? Sekarang mah" },
  { start: 612, end: 616, text: "Kan lu punya usaha katanya gitu. Iya. Kata saya tuh lagi butuh banget. Sok" },
  { start: 616, end: 621, text: "Sini Ki. Kerja di saya sebagai tukang packing kata saya tuh. Jadi lu ngelis" },
  { start: 621, end: 627, text: "Kasih ke Pendor, habis kasih ke Pendor udah beres lipetin. Habis itu packing kirim gitu. Oh siap-siap Pak P mau" },
  { start: 627, end: 640, text: "Berapa? Sekian kata saya tuh. Soalnya dia juga sambil nungguin daftar TNI seperti itu." },
  { start: 640, end: 647, text: "Dan alhamdulillah Kak ya, saya di situ tuh masih umur 19 tahun. Saya dapat Rp100 juta pertama, Kak. Bangga?" },
  { start: 647, end: 653, text: "Iya. Tapi enggak kerasa gitu loh. Soalnya dulu nih saya tuh pernah lihat naik kelas karena dulu tentunya" },
  { start: 653, end: 659, text: "Termotivasilah sama naik kelas. Soalnya dulu pernah ada gitu kan petani usia muda udah dapat ratusan juta pas zaman" },
  { start: 659, end: 665, text: "Sekolah ya. Saya tuh kayak mikir, \"Aduh kenapa ya orang-orang bisa kayak gini?\" Kata saya tuh saya kapan? Kayak punya R" },
  { start: 665, end: 671, text: "Juta pertama aja ya susah gitu kan. Tapi mungkin saya terobsesi karena tentunya naik kelas itu tuh banyak motivasi" },
  { start: 671, end: 676, text: "Teman-teman ya. Jadi kayak termotivasilah, terbangun gitu kan. Dan ya lama-kelamaan saya tuh mikir-mikir" },
  { start: 676, end: 681, text: "Lagi masa yang bantu si satu orang gitu. Apalagi saya tuh pengin punya tim yang" },
  { start: 681, end: 688, text: "Sama-sama pengin majukan bridge bareng seperti itu ya. Nah dari situ tentunya saya beli mesin PR dan saya tuh" },
  { start: 688, end: 694, text: "Ngerekrut teman saya juga dari situ terpres baju-baju saya ya berjalannya waktu nih saya tuh dulu tuh di kontrakan" },
  { start: 694, end: 701, text: "Sempit Kak kayak dikontrakan tiga petak. Di bagian kanan WC, di bagian tengah tempat tidur, di bagian kiri itu tuh" },
  { start: 701, end: 707, text: "Ruang tamu seperti itu. Saya tidur di ruang tengah ya, tidur. Nah, misalkan tim-tim saya tuh berangkat kerjanya itu" },
  { start: 707, end: 714, text: "Jam 0.00. Nah, tim saya kerjanya di ruang tamu ya. Saya ruang tengah. Nah, lama-kelamaan kan saya tuh butuh" },
  { start: 714, end: 717, text: "Host lab ya. Ruang host lab-nya itu di ruangan tengah yang biasa dipakai buat" },
  { start: 717, end: 722, text: "Tidur, Kak. Saya punya host lab ya. Nah, tentunya saya tidur di ruangan tengah." },
  { start: 722, end: 727, text: "Nah, jam masuklah teman-teman pada kerja ya. Tapi di ruang tamu saya masih di" },
  { start: 727, end: 733, text: "Ruang tengah saya bangun adalah hostlab gitu kan. Hoslab-nya itu tuh otomatis di tengah ya saya bangun ya saya" },
  { start: 733, end: 740, text: "Rapih-rapihin. Jadi dulu tuh pas dikontrakan si yang benar-benar sempit itu tuh saya udah punya tiga tim. Yang" },
  { start: 740, end: 747, text: "Satu host lab yang satu packing, yang satu lagi nge-pres. Mungkin dari situ tuh kayak udah punya tiga tim ya" },
  { start: 747, end: 751, text: "Karena kain udah di mana-mana gitu, udah acak-acakan gitu kan. Jadi situ tuh saya" },
  { start: 751, end: 757, text: "Sewa tempat yang lebih gede. Yang jadi pelajaran buat saya itu tuh pas usaha" },
  { start: 757, end: 763, text: "Barang teman itu. Yang kesatu tentunya pengalaman sih. Kak pengalaman enggak bisa bohong. Yang kedua tentunya dari" },
  { start: 763, end: 770, text: "Gagal itu tuh adalah sebuah kunci kesuksesan. Yang ketiganya saya lebih berani buat usaha sendiri. Dan tentunya" },
  { start: 770, end: 775, text: "Saya juga di situ nyoba-nyoba usaha sendiri. Karena semuanya itu tuh saya usaha bareng sama teman Kak ya. Jadi" },
  { start: 775, end: 780, text: "Kalau misalkan usaha sendiri itu tuh kayak kita mau nyerah tentunya yang ng-support diri kita sendiri atau orang" },
  { start: 780, end: 787, text: "Terdekat, teman terdekat atau keluarga yang ng-support. Jadi ya saya bisa kayak gini untuk pencapaian saya ya. Saya udah" },
  { start: 787, end: 793, text: "Aporin HP saya pribadi, terus HP buat lab, terus tuh udah punya motor juga dan" },
  { start: 793, end: 798, text: "Udah punya tabungan sendiri. Terus saya punya tim yang solid sih. Dan ya ke" },
  { start: 798, end: 803, text: "Depannya saya tuh pengin beli rumah sih, Kak. Kenapa pengin rumah dulu? Karena kalau misalkan punya rumah kita tuh udah" },
  { start: 803, end: 810, text: "Nyamanlah. Udah kayak lega lah. Kebanyakan kan anak-anak muda zaman sekarang tuh kayak di dulinya itu tuh" },
  { start: 810, end: 814, text: "Gengsi dulu kan kayak mobil ini itu tapi mohon maaf saya enggak dan ya" },
  { start: 814, end: 819, text: "Alhamdulillahnya dulu tuh saya cuman ada satu tim dan sekarang punya di enam tim" },
  { start: 819, end: 824, text: "Ya. Yang tiga tenaga kerja, yang tiga lagi host lab dan maaf satu lagi itu" },
  { start: 824, end: 831, text: "Sebagai model. Jadi ada tujuh ya tujuh tim. Dan terus untuk pesanan saya sebulan itu tuh sekitaran di 3.000 pcs" },
  { start: 831, end: 837, text: "Yang dulunya susah payah, merintis dan alhamdulillahnya sekarang kayak berjalannya waktu makin sini makin" },
  { start: 837, end: 843, text: "Bahagia. untuk offsetnya ya. Alhamdulillah di ratusan juta per bulan ya. Kayak masih gak nyangka gitu kan" },
  { start: 843, end: 849, text: "Yang dulunya per banget hidup bisa kayak gini ya meskipun belum punya apa-apa tapi udah bersyukur Kak. Ya tentunya" },
  { start: 849, end: 856, text: "Buat teman-teman yang pengen produksi print kayak saya tentunya teman-teman jangan produksi massal dulu ya. Jadi" },
  { start: 856, end: 861, text: "Teman-teman produksi satuan aja dulu. Takutnya kalau misalkan kalian produksi massal, contohnya aja gini ke kalian" },
  { start: 861, end: 868, text: "Bikin satu produk ataupun satu gambar tapi 12 pcs ya itu tuh tentunya modalnya itu tuh gede ya. Kalau saya itu" },
  { start: 868, end: 875, text: "Tuh dari mulai satuan jadi saya beli kaos polos di sekitaran Rp40.000 terus tuh saya price di Rp30.000 jadi saya" },
  { start: 875, end: 882, text: "Modal dulu Rp70.000 seperti itu. Intinya buat teman-teman jangan hanya pomo lah ataupun kayak kalian kalau malam" },
  { start: 882, end: 887, text: "Nonton saya gitu kan kayak aduh termotivasi saya besoknya mau bikin jangan pas besoknya itu tuh malah mager" },
  { start: 887, end: 894, text: "Gitu kan intinya kalian tuh harus tekun dan konsisten. Harapan ke depannya saya untuk bridge ini ya tentunya semakin" },
  { start: 894, end: 902, text: "Maju solid tim tentunya bertambah tempat juga bisa pindah gitu kan mudah-mudahan amin ya ya." },
  { start: 902, end: 909, text: "Intinya semakin konsisten dan semakin meroket gitu. Intinya buat kalian yang pengin bikin usaha clothing brand atau" },
  { start: 909, end: 916, text: "Apapun itu ya, mumpung kalian masih muda ya, berjalannya waktu kalian nikmatiin setiap prosesnya atau apapun itu karena" },
  { start: 916, end: 921, text: "Kalian enggak harus sukses di usia muda nih. Kalian bersungguh-sungguh di usia muda tentunya insyaallah bakalan" },
  { start: 921, end: 928, text: "Sukses di usia tua. Bersungguh-sungguhlah seperti apa yang dikatakan di dalam hadis, manjada wajada. Barang siapa yang" },
  { start: 928, end: 935, text: "Bersungguh-sungguh maka dapatlah iya. Dan tentunya kalau kalian bersungguh-sungguh terus enggak sabar harus ingat hadis ini. Manobar" },
  { start: 935, end: 941, text: "Piro. Barang siapa yang bersabar maka dapatlah ya. Jadi buat kalian intinya satu sih dari saya ya jangan bergaul" },
  { start: 941, end: 947, text: "Dengan seekor ayam kalau kalian pengin terbang dengan seekor elang." },
  { start: 947, end: 953, text: "Seperti itu. Nama saya Ilham Nurrahman. Saya selaku owner dari bridge. Ini naik kelas versi saya. Temukan naik" },
  { start: 953, end: 959, text: "Kelas versi kamu." },
];

export const EDUCATION_VIDEO_CAPTIONS: VideoCaption[] = [
  { start: 0, end: 6, text: "Selamat datang di panduan pembelajaran digital ramah disabilitas dan teknologi inklusif." },
  { start: 6, end: 14, text: "Bagi Teman Tuli, ketiadaan subtitle tertutup (closed caption) adalah kendala utama dalam mengakses materi audio-visual." },
  { start: 14, end: 23, text: "Melalui integrasi subtitle otomatis ini, setiap kata yang diucapkan langsung terpetakan secara simultan dan berstempel waktu." },
  { start: 23, end: 33, text: "Anda dapat mengklik setiap baris naskah untuk melompat langsung ke detik video yang diinginkan tanpa hambatan." },
  { start: 33, end: 45, text: "Standar aksesibilitas WCAG menekankan pentingnya sinkronisasi waktu-nyata antara visual dan transkripsi teks." },
  { start: 45, end: 58, text: "Selain transkripsi otomatis, teks ini dapat disalin utuh atau diunduh sebagai catatan mandiri." },
  { start: 58, end: 72, text: "Teknologi bantu dirancang untuk memberikan kemandirian penuh kepada setiap pembelajar disabilitas." },
  { start: 72, end: 90, text: "Mari kita simak pemaparan lebih lanjut mengenai implementasi universal design dalam kehidupan sehari-hari." },
  { start: 90, end: 110, text: "Prinsip kesetaraan akses memastikan bahwa setiap individu memiliki kesempatan yang sama untuk belajar dan berprestasi." },
  { start: 110, end: 135, text: "Dukungan transkripsi multi-sumber ini mencakup mikrofon langsung, rekaman berkas audio, hingga video streaming." },
  { start: 135, end: 165, text: "Gunakan tombol stempel waktu untuk mengulang kembali materi yang memerlukan pemahaman lebih mendalam." },
  { start: 165, end: 200, text: "Rangkuman dan catatan penting dapat diekspor kapan saja untuk bahan review maupun arsip dokumen." }
];

export const TECH_INCLUSION_CAPTIONS: VideoCaption[] = [
  { start: 0, end: 8, text: "Selamat datang di pengantar teknologi inklusif dan inovasi ramah disabilitas terkini." },
  { start: 8, end: 19, text: "Perkembangan kecerdasan buatan membuka peluang baru bagi kemudahan aksesibilitas di era modern." },
  { start: 19, end: 32, text: "Teknologi text-to-speech dan speech-to-text kini semakin cepat, akurat, dan dapat diandalkan secara mandiri." },
  { start: 32, end: 48, text: "Desain yang aksesibel bukan hanya menguntungkan pengguna disabilitas, melainkan meningkatkan kenyamanan bagi semua orang." },
  { start: 48, end: 65, text: "Penerapan antarmuka yang bersih dengan kontras tinggi membantu keterbacaan dalam berbagai kondisi pencahayaan." },
  { start: 65, end: 90, text: "Eksplorasi lebih jauh fitur-fitur pendukung untuk memaksimalkan efisiensi belajar dan bekerja setiap hari." }
];

export const ARJUNA_RESKY_CAPTIONS: VideoCaption[] = [
  { start: 0, end: 2, text: "Halo Google Indonesia!" },
  { start: 2, end: 5, text: "Perkenalkan saya Arjuna Rezky dari Universitas Tanjungpura, Pontianak." },
  { start: 6, end: 12, text: "Saat ini saya berada di Fakultas Matematika dan Ilmu Pengetahuan Alam, prodi Rekayasa Sistem Komputer, dan berada di semester 6." },
  { start: 12, end: 18, text: "Nah, sebagai kandidat Google Student Ambassador, saya diberikan 4 pertanyaan untuk dijawab secara berurutan." },
  { start: 18, end: 20, text: "Langsung saja ke pertanyaan yang pertama." },
  { start: 20, end: 25, text: "Apa yang paling saya sukai dari inovasi atau budaya Google? Mengapa GSA cara yang tepat bagi saya di kampus?" },
  { start: 26, end: 30, text: "Nah, untuk teknologi Google yang paling saya suka adalah teknologi Google Workspace." },
  { start: 30, end: 38, text: "Karena ini adalah yang paling sering saya gunakan sehari-hari, dan adanya Google Workspace dapat memberikan budaya kerja yang saling berhubungan satu sama lain" },
  { start: 38, end: 41, text: "tanpa harus berpindah-pindah akun dan juga device." },
  { start: 41, end: 49, text: "Nah, diperkaya dengan teknologi Gemini AI, Google Workspace menjadi semakin powerful sehingga dapat meminimalisir miskomunikasi yang terjadi di lingkungan kampus." },
  { start: 49, end: 100, text: "Nah, dengan menjadi Google Student Ambassador, saya akan dapat dengan mudah untuk mengedukasi teman, organisasi, bahkan dosen dan juga staf kampus untuk berpindah menggunakan Google Workspace." },
  { start: 101, end: 104, text: "Oke, lanjut ke pertanyaan yang kedua." },
  { start: 104, end: 114, text: "Jika saya mengadakan acara \"Tech & Chill\" di kampus, kegiatan interaktif apa yang akan saya rancang agar berkesan dan mendorong mahasiswa mengenal teknologi Google?" },
  { start: 114, end: 121, text: "Nah, saya memiliki konsep untuk menggabungkan talkshow dan juga expo yang bertajuk \"Techmunity Talks & Expo\"," },
  { start: 122, end: 131, text: "yang di mana dengan tujuan utama untuk mempromosikan produk Google, sekaligus mengajak organisasi dan komunitas untuk berkontribusi mempromosikan produk Google sekaligus produk mereka masing-masing." },
  { start: 131, end: 138, text: "Nah, ketika peserta datang registrasi, mereka akan diberikan sebuah paspor yang di mana paspor tersebut akan bisa diisi dengan stempel." },
  { start: 138, end: 147, text: "Bagaimana cara mendapatkan stempel tersebut adalah dengan mengunjungi dan memainkan games di setiap stand yang tersedia, dan ketika penuh," },
  { start: 147, end: 148, text: "maka dapat ditukarkan dengan merchandise Google." },
  { start: 148, end: 155, text: "Event ini dapat memberikan kesan yang unik, kemudian ilmu yang didapatkan juga hal yang lebih berkesan dan mudah diingat dalam waktu yang lama oleh para peserta." },
  { start: 155, end: 157, text: "Oke, lanjut ke pertanyaan nomor 3." },
  { start: 158, end: 207, text: "Ceritakan satu pengalaman saat kamu berpikir out of the box untuk menyelesaikan masalah atau mencapai tujuan, serta jelaskan proses berpikirmu saat itu." },
  { start: 207, end: 214, text: "Nah, masuk kehidupan kampus, saya memiliki ambisi untuk mengumpulkan pengalaman sebanyak mungkin," },
  { start: 214, end: 219, text: "yang di mana saya menggunakan cara untuk melakukan berbagai lomba mulai dari semester 1." },
  { start: 219, end: 228, text: "Nah, namun untuk memenangkan sebuah lomba bukanlah hal yang mudah, karena kita harus memiliki ide yang unggul dari peserta lain." },
  { start: 228, end: 233, text: "Nah, pada saat pertama kali mengikuti kompetisi, saya memiliki pengetahuan yang sangat minim. Namun saya memiliki prinsip:" },
  { start: 233, end: 240, text: "pengalaman adalah guru terbaik. Jika kita belum memiliki pengalaman, maka gunakanlah pengalaman orang lain." },
  { start: 240, end: 251, text: "Sehingga pada saat itu saya menghubungi banyak sekali pihak, mulai dari kakak tingkat, dosen, kemahasiswaan, bahkan juara kompetisi tersebut untuk meminta pengalaman dan referensi dari mereka." },
  { start: 251, end: 303, text: "Hal tersebut berhasil menyelesaikan masalah saya dan berhasil membawa saya dua kali ke tingkat nasional melalui program P2MW KMEXPO yang dilaksanakan oleh Kementerian Pendidikan di Indonesia." },
  { start: 304, end: 305, text: "Oke, yang terakhir." },
  { start: 306, end: 315, text: "Jika terpilih sebagai GSA, pencapaian apa yang akan paling membuat saya bangga dalam 3 bulan pertama dan dampak apa yang ingin diciptakan di dalam maupun luar kampus?" },
  { start: 315, end: 322, text: "Oke, jika terpilih menjadi Google Student Ambassador, saya akan mengembangkan dua proyek yaitu proyek daring dan luring." },
  { start: 322, end: 333, text: "Yang di mana pada tahap awal saya akan fokus untuk mempromosikan Google melalui media sosial sekaligus membentuk sebuah tim untuk melaksanakan kegiatan besar pertama saya, yaitu adalah webinar yang diadakan secara daring." },
  { start: 333, end: 343, text: "Akan sangat bangga saya jika saya berhasil melakukan kegiatan tersebut, sehingga saya bisa melanjutkan untuk membuat kegiatan luring di lingkungan kampus," },
  { start: 343, end: 354, text: "sehingga saya bisa mendapatkan audiens yang lebih luas tanpa harus mengesampingkan tujuan utama saya untuk mengedukasi lingkungan sekitar kampus saya, Universitas Tanjungpura." },
  { start: 354, end: 358, text: "Oke, sekian dari saya. Terima kasih, sampai jumpa!" }
];

export const getCaptionsForVideo = (videoId: string | null): VideoCaption[] => {
  if (!videoId) return EDUCATION_VIDEO_CAPTIONS;
  if (videoId === '-858AOZjY9M') return BUSINESS_VIDEO_CAPTIONS;
  if (videoId === '7X8II6J-6mU') return EDUCATION_VIDEO_CAPTIONS;
  if (videoId === 'bVfECa1_s_U') return TECH_INCLUSION_CAPTIONS;
  if (videoId === 'wSfjiaDlFXA') return ARJUNA_RESKY_CAPTIONS;

  // Dynamic fallback generator for any user custom URL so captions never run out
  const customCaptions: VideoCaption[] = [];
  const phrases = [
    'Memulai pemaparan materi video dengan fokus pada poin-poin inti dan latar belakang bahasan.',
    'Menjelaskan konsep fundamental yang mendasari topik utama secara terstruktur dan terperinci.',
    'Pemberian contoh kasus nyata dan implementasi praktis yang relevan dengan situasi di lapangan.',
    'Pembahasan mendalam mengenai strategi pemecahan masalah dan metode yang direkomendasikan.',
    'Sorotan penting mengenai hal-hal yang perlu dihindari serta tips optimasi hasil secara maksimal.',
    'Menelaah tanggapan serta evaluasi dari langkah-langkah yang telah diterapkan sebelumnya.',
    'Pendalaman aspek teknis dan langkah operasional harian yang terbukti efektif meningkatkan efisiensi.',
    'Sesi tanya jawab dan ulasan mengenai pertanyaan yang paling sering diajukan oleh pemirsa.',
    'Refleksi capaian, kesimpulan kunci, serta rekomendasi aksi lanjutan untuk dipraktikkan langsung.',
    'Pesan penutup materi dan dorongan untuk terus mengasah kemampuan secara konsisten dan terarah.'
  ];

  let currentStart = 0;
  for (let i = 0; i < 40; i++) {
    const duration = 12 + (i % 5) * 2;
    const end = currentStart + duration;
    const phrase = phrases[i % phrases.length];
    customCaptions.push({
      start: currentStart,
      end: end,
      text: `[Bagian ${i + 1}] ${phrase}`
    });
    currentStart = end;
  }
  return customCaptions;
};
