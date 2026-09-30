// File konfigurasi terpusat untuk teks & deskripsi aplikasi

const CONFIG = {
  // Ubah name/tagline/description/footer di bawah ini untuk ganti nama & deskripsi
  // aplikasi - otomatis muncul di judul tab browser, sidebar, footer, dan meta
  // description (dipakai browser/mesin pencari/preview link).
  app: {
    // name/tagline/description/footer boleh diisi STRING BIASA (dipakai sama
    // rata di semua bahasa) atau OBJECT per-bahasa { id, en, ja, es } kayak
    // di bawah ini - kalau object, otomatis ikut berubah sesuai bahasa yang
    // dipilih user di menu "Bahasa". "name" sengaja dibiarkan string biasa
    // (nama brand "Faii" umumnya tidak diterjemahkan), tapi kalau kamu mau
    // nama juga ikut ganti per bahasa, ubah jadi object dengan pola yang
    // sama seperti tagline/description/footer.
    name: 'Faii — AI Chat',
    tagline: {
      id: 'Multi Provider — serah pake ai apa aja, penting punya base url + apikey',
      en: 'Multi Provider — use any AI, it`s important to have a base URL + apikey',
      ja: 'マルチプロバイダー — 任意の AI を使用します。ベース URL と APIkey を用意することが重要です',
      es: 'Proveedor múltiple: use cualquier IA, es importante tener una URL base + apikey'
    },
    description: {
      id: 'Aplikasi chat AI open source multi-provider — tinggal input domain penyedia AI (OpenAI-compatible atau Anthropic native) + API key, model auto-terdeteksi',
      en: 'Open source multi-provider AI chat app - just enter an AI provider domain (OpenAI-compatible or native Anthropic) + API key, models auto-detected',
      ja: 'オープンソースのマルチプロバイダーAIチャットアプリ - OpenAI互換またはAnthropicネイティブのAIプロバイダーのドメインとAPIキーを入力するだけで、モデルは自動検出されます',
      es: 'Aplicación de chat con IA multi-proveedor de código abierto - solo ingresa el dominio de un proveedor de IA (compatible con OpenAI o nativo de Anthropic) + clave API, los modelos se detectan automáticamente'
    },
    footer: {
      id: 'Open source multi-provider AI chat',
      en: 'Open source multi-provider AI chat',
      ja: 'オープンソースのマルチプロバイダーAIチャット',
      es: 'Chat de IA multi-proveedor de código abierto'
    },

    // Provider yang OTOMATIS terisi buat visitor baru yang belum pernah nyimpen
    // provider apa pun (biar mereka bisa langsung chat tanpa harus tahu apa itu
    // "base URL"/"API key"). Cuma baseUrl yang ditaruh di sini - JANGAN PERNAH
    // taruh API key asli di file ini, karena config.js ini file PUBLIK yang
    // dikirim ke browser SIAPA PUN yang buka situsnya (tinggal buka
    // namadomainmu/config.js buat baca isinya apa adanya).
    //
    // Kalau allowWithoutOwnKey = true, visitor baru bisa langsung connect TANPA
    // isi API key sendiri - server yang diam-diam pakai kunci bawaan dari file
    // .env (lihat DEFAULT_API_KEY di README). baseUrl di bawah ini HARUS SAMA
    // PERSIS dengan DEFAULT_BASE_URL di .env, kalau tidak sama kunci bawaan
    // tidak akan kepakai (ini sengaja, biar kunci bawaan tidak diam-diam
    // kepakai buat provider lain yang diketik visitor sendiri).
    defaultProvider: {
      enabled: true,
      name: 'Groq (bawaan)',
      baseUrl: 'https://api.groq.com/openai/v1',
      allowWithoutOwnKey: true
    }
  },

  // Daftar kontak bantuan/admin - muncul lewat tombol "Bantuan" di sidebar.
  // Kosongkan (biarkan string kosong '') field yang tidak dipakai - baris itu
  // otomatis disembunyikan. Kalau SEMUA field kosong, tombol "Bantuan" ikut
  // disembunyikan otomatis.
  //
  // Format tiap field FLEKSIBEL: boleh isi cuma username/handle-nya saja
  // (mis. 'admin_faii'), atau link lengkap (mis. 'https://t.me/admin_faii') -
  // dua-duanya otomatis jadi link yang benar. Untuk email, isi alamat emailnya
  // saja (mis. 'admin@contoh.com').
  support: {
    title: 'Butuh bantuan?',
    email: 'faiii4rever@gmail.com',
    telegram: 'https://t.me/faiixxd',
    tiktok: 'https://www.tiktok.com/@mdzz_low',
    instagram: 'https://www.instagram.com/mdzzaja_',
    sociabuz: 'https://sociabuzz.com/faiixxd'
  },

  // Teks di halaman chat
  chat: {
    headerDefault: 'Belum ada model dipilih',
    connectionIdle: 'Belum tersambung',
    connectionConnected: 'Tersambung',
    connectionError: 'Gagal tersambung',
    emptyHistoryMessage: 'Belum ada percakapan. Pilih/tambah provider, sambungkan, pilih model, lalu mulai chat.',
    inputPlaceholder: 'Ketik pesan...',
    sendButton: 'Kirim',
    clearButton: 'Bersihkan chat',
    attachLabel: 'Upload file',
    attachImageLabel: 'Upload gambar',

    // Kepribadian default AI-nya, dikirim sebagai instruksi (system prompt) di
    // SETIAP pesan - ganti di sini kalau mau AI-nya punya gaya/karakter lain
    // (mis. roleplay pelayan toko, admin ramah, dll), tidak perlu edit app.js.
    // Ini SELALU aktif buat semua obrolan; aturan edit-file (tulis ulang isi
    // file secara utuh dkk) baru ditambahkan otomatis KALAU user memang
    // melampirkan file - jadi tidak numpuk/bikin bingung model waktu user
    // cuma ngobrol/roleplay biasa tanpa lampiran apa pun.
    systemPersona: 'Kamu adalah asisten yang ramah dan sopan, tapi tidak suka basa-basi - langsung ke inti jawaban, tanpa pembukaan panjang atau mengulang-ulang pertanyaan user. SELALU balas dengan bahasa yang sama dengan pesan terakhir user (default-nya Bahasa Indonesia kalau tidak jelas) - jangan pernah beralih ke bahasa lain sendiri (mis. Arab/Inggris) walau model dasarnya punya kecenderungan bahasa tertentu. Kalau user mengajak roleplay atau minta kamu jadi karakter/persona tertentu, ikuti permintaan itu dengan wajar sambil tetap ramah dan sopan.'
  },

  // Teks di sidebar (form provider)
  sidebar: {
    providerSelectNew: '+ Provider baru',
    providerSelectLabel: 'Provider tersimpan',
    presetLabel: 'Preset cepat',
    providerNameLabel: 'Nama provider',
    providerNamePlaceholder: 'mis. Groq, OpenAI, OpenRouter...',
    baseUrlLabel: 'Domain / base URL API',
    baseUrlPlaceholder: 'https://api.contoh.com/v1',
    apikeyLabel: 'API key',
    apikeyPlaceholder: 'Tempel API key di sini...',
    connectButton: 'Sambungkan & cari model',
    deleteButton: 'Hapus provider ini',
    modelLabel: 'Model',
    modelDefault: 'Belum ada model'
  },

  // Pesan status & error
  messages: {
    providerNameRequired: 'Isi nama provider dulu.',
    baseUrlRequired: 'Isi domain/base URL API dulu.',
    baseUrlInvalid: 'Domain harus diawali http:// atau https://',
    apikeyRequired: 'Isi API key dulu.',
    fetchingModels: 'Mencari model dari domain penyedia...',
    modelsFound: (count, providerName) => `Berhasil! ${count} model ditemukan di ${providerName}.`,
    modelsCached: (count) => `${count} model tersimpan (cache).`,
    connectRequired: 'Sambungkan provider dulu.',
    modelRequired: 'Pilih model dulu.',
    fileTooLarge: (max) => `Total isi file terlalu besar (maks ~${max.toLocaleString('id-ID')} karakter). Hapus beberapa file dulu.`,
    maxImagesReached: (max) => `maks ${max} gambar per pesan`,
    imageTooLarge: (max) => `gambar terlalu besar (maks ${max})`,
    totalImageSizeFull: 'total ukuran gambar terlampir sudah penuh',
    binaryFileSkipped: 'jenis file biner, tidak dibaca sebagai teks',
    fileReadError: 'gagal membaca file',
    archiveUnsupported: 'format arsip ini belum bisa dibaca isinya (coba .zip atau .tar.gz)',
    archiveEmpty: 'tidak ada file teks yang bisa dibaca di dalam arsip ini',
    archiveReadError: (msg) => `gagal membaca arsip (${msg})`
  },

  // Teks untuk file attachment
  fileAttachment: {
    analysisPromptSingle: (filename) => `Berikut file yang perlu dianalisis/diedit (${filename}):`,
    analysisPromptMultiple: (count) => `Berikut ${count} file yang perlu dianalisis/diedit:`,
    fallbackTextOnly: 'Tolong edit file berikut sesuai kebutuhan.',
    fallbackImageOnly: 'Tolong lihat gambar yang dilampirkan.',
    fallbackMixed: 'Tolong lihat file dan gambar yang dilampirkan.',
    filesRead: (count) => `${count} file dibaca`,
    binarySkipped: (count) => `${count} biner dilewati`,
    noiseSkipped: (count) => `${count} file noise dilewati`
  },

  // Teks untuk code block
  codeBlock: {
    copyButton: 'Salin',
    downloadButton: 'Unduh',
    copiedFeedback: 'Disalin!',
    downloadedFeedback: 'Terunduh!',
    linesCount: (count) => `${count} baris`,
    zipAllButton: (count) => `Unduh semua sebagai .zip (${count} file)`
  },

  // Preset provider (bisa ditambah/dihapus sesuai kebutuhan)
  presets: [
    { name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1' },
    { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1' },
    { name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1' },
    { name: 'Together AI', baseUrl: 'https://api.together.xyz/v1' },
    { name: 'Mistral', baseUrl: 'https://api.mistral.ai/v1' },
    { name: 'Anthropic', baseUrl: 'https://api.anthropic.com/v1' },
    { name: 'Fireworks', baseUrl: 'https://api.fireworks.ai/inference/v1' },
    { name: 'Cerebras', baseUrl: 'https://api.cerebras.ai/v1' },
    { name: 'xAI (Grok)', baseUrl: 'https://api.x.ai/v1' }
  ],

  // Limit & batasan
  limits: {
    maxTotalFileChars: 200000,
    maxSingleFileChars: 100000,
    maxImagesPerMessage: 6,
    maxTotalImageBytes: 12 * 1024 * 1024,
    maxImageRawBytes: 20 * 1024 * 1024,
    maxImageDim: 1568,
    imageJpegQuality: 0.9,
    archiveEntryMaxChars: 80000,
    archiveEntryMaxBytes: 300000
  }
};

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
