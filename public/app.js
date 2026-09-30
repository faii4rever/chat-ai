// --- Fix viewport height/offset on mobile browsers that mishandle 100vh/100dvh ---
// (address bar show/hide, keyboard open/close on browsers like Mi Browser / Via Browser / Chrome overlay-keyboard mode)
(function setRealVh() {
  const vv = window.visualViewport;

  function update() {
    const h = (vv && vv.height) || window.innerHeight;
    document.documentElement.style.setProperty('--app-vh', h + 'px');

    // When the on-screen keyboard opens in "overlay" mode, the browser scrolls
    // the visual viewport instead of resizing the layout viewport. That leaves
    // .app (fixed-height) visually pushed down/up relative to the page,
    // showing an empty gap. Pin .app to the visual viewport's offset to fix it.
    if (vv) {
      document.documentElement.style.setProperty('--app-top', vv.offsetTop + 'px');
      window.scrollTo(0, 0);
    }
  }

  update();
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
  if (vv) {
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
  }

  // Keep the focused input scrolled into view once the keyboard/viewport settles.
  document.addEventListener('focusin', (e) => {
    if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) {
      setTimeout(() => {
        e.target.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }, 150);
    }
  });
})();

const els = {
  providerSelect: document.getElementById('provider-select'),
  presetChips: document.getElementById('preset-chips'),
  providerName: document.getElementById('provider-name'),
  providerBaseUrl: document.getElementById('provider-baseurl'),
  apikey: document.getElementById('apikey'),
  btnConnect: document.getElementById('btn-connect'),
  btnDeleteProvider: document.getElementById('btn-delete-provider'),
  btnUpdateModels: document.getElementById('btn-update-models'),
  connectStatus: document.getElementById('connect-status'),
  modelSelect: document.getElementById('model-select'),
  btnClear: document.getElementById('btn-clear'),
  messages: document.getElementById('messages'),
  form: document.getElementById('chat-form'),
  text: document.getElementById('chat-text'),
  btnSend: document.getElementById('btn-send'),
  headerModel: document.getElementById('header-model'),
  headerConn: document.getElementById('header-conn'),
  headerConnText: document.getElementById('header-conn-text'),
  autoSwitchWrap: document.getElementById('auto-switch-wrap'),
  autoToggle: document.getElementById('auto-toggle'),
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  btnOpenSidebar: document.getElementById('btn-open-sidebar'),
  btnCloseSidebar: document.getElementById('btn-close-sidebar'),
  btnAttach: document.getElementById('btn-attach'),
  fileInput: document.getElementById('file-input'),
  btnAttachImage: document.getElementById('btn-attach-image'),
  imageInput: document.getElementById('image-input'),
  fileChips: document.getElementById('file-chips'),
  btnNewChat: document.getElementById('btn-new-chat'),
  sessionList: document.getElementById('session-list'),
  btnOpenSettings: document.getElementById('btn-open-settings'),
  btnCloseSettings: document.getElementById('btn-close-settings'),
  settingsModal: document.getElementById('settings-modal'),
  settingsOverlay: document.getElementById('settings-overlay'),
  btnOpenSupport: document.getElementById('btn-open-support'),
  btnCloseSupport: document.getElementById('btn-close-support'),
  supportModal: document.getElementById('support-modal'),
  supportOverlay: document.getElementById('support-overlay'),
  supportLinks: document.getElementById('support-links'),
  btnOpenLanguage: document.getElementById('btn-open-language'),
  btnCloseLanguage: document.getElementById('btn-close-language'),
  languageModal: document.getElementById('language-modal'),
  languageOverlay: document.getElementById('language-overlay'),
  languageList: document.getElementById('language-list')
};

function openSettings() {
  els.settingsModal.classList.add('open');
  els.settingsOverlay.classList.add('open');
}
function closeSettings() {
  els.settingsModal.classList.remove('open');
  els.settingsOverlay.classList.remove('open');
}
els.btnOpenSettings.addEventListener('click', () => {
  openSettings();
  if (window.innerWidth <= 860) closeSidebar();
});
els.btnCloseSettings.addEventListener('click', closeSettings);
els.settingsOverlay.addEventListener('click', closeSettings);

// ---------- Menu Bahasa (ganti bahasa antarmuka - lihat blok i18n di bawah) ----------
function openLanguage() {
  renderLanguageList();
  els.languageModal.classList.add('open');
  els.languageOverlay.classList.add('open');
}
function closeLanguage() {
  els.languageModal.classList.remove('open');
  els.languageOverlay.classList.remove('open');
}
els.btnOpenLanguage.addEventListener('click', () => {
  openLanguage();
  if (window.innerWidth <= 860) closeSidebar();
});
els.btnCloseLanguage.addEventListener('click', closeLanguage);
els.languageOverlay.addEventListener('click', closeLanguage);

// ---------- Menu Bantuan (kontak admin: email/telegram/tiktok/instagram/sociabuz) ----------
// Semua isinya datang dari config.js -> support (diisi sendiri oleh pemilik situs).
// Field yang kosong otomatis tidak ditampilkan; kalau semuanya kosong, tombol
// "Bantuan" di sidebar ikut disembunyikan (jadi tidak nampilin tombol kosongan).

const SUPPORT_ICONS = {
  email:
    '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3.5 5.5h13a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.4"/><path d="m3.5 6 6.5 5 6.5-5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  telegram:
    '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M17 3.5 2.8 9.1c-.9.36-.9 1.65.02 1.98l3.4 1.2 1.3 4.2c.2.66 1.04.85 1.5.34l1.9-2.1 3.5 2.6c.68.5 1.66.13 1.84-.7l2.4-11.4c.2-.94-.75-1.7-1.66-1.34Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.2 12.3 15 6.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  tiktok:
    '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.2 2.5v9.8a2.7 2.7 0 1 1-2.3-2.67" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.2 3c.4 1.9 1.9 3.4 3.8 3.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  instagram:
    '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="10" r="3.2" stroke="currentColor" stroke-width="1.4"/><circle cx="14.2" cy="5.8" r="0.9" fill="currentColor"/></svg>',
  sociabuz:
    '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8.3 11.7 12 8M8.9 6.6l.6-.6a2.6 2.6 0 0 1 3.7 3.7l-.7.6M11.1 13.4l-.6.6a2.6 2.6 0 1 1-3.7-3.7l.7-.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function buildSupportHref(type, raw) {
  const v = String(raw || '').trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v) || v.startsWith('mailto:')) return v;
  const handle = v.replace(/^@/, '');
  switch (type) {
    case 'email':
      return `mailto:${v}`;
    case 'telegram':
      return `https://t.me/${handle}`;
    case 'tiktok':
      return `https://www.tiktok.com/@${handle}`;
    case 'instagram':
      return `https://www.instagram.com/${handle}`;
    case 'sociabuz':
      return `https://sociabuz.com/${handle}`;
    default:
      return v;
  }
}

const SUPPORT_LABELS = {
  email: 'Email Admin',
  telegram: 'Telegram Admin',
  tiktok: 'TikTok Admin',
  instagram: 'Instagram Admin',
  sociabuz: 'Sociabuz'
};

function renderSupportLinks() {
  const support = (typeof CONFIG !== 'undefined' && CONFIG.support) || null;
  els.supportLinks.innerHTML = '';
  if (!support) {
    els.btnOpenSupport.style.display = 'none';
    return;
  }

  // Catatan: judul modal ("Butuh bantuan?") TIDAK di-set di sini secara
  // langsung dari CONFIG.support.title - itu sudah ditangani applyLocale()
  // lewat data-i18n-text="supportTitle" di index.html + CONFIG_TEXT_MAP
  // (supaya override dari config.js tetap menghormati bahasa yang aktif,
  // bukan asal timpa ke Bahasa Indonesia buat semua locale).

  const types = ['email', 'telegram', 'tiktok', 'instagram', 'sociabuz'];
  let count = 0;
  types.forEach((type) => {
    const href = buildSupportHref(type, support[type]);
    if (!href) return;
    count += 1;
    const row = document.createElement('a');
    row.className = 'support-link-row';
    row.href = href;
    row.target = '_blank';
    row.rel = 'noopener noreferrer';
    row.innerHTML = `
      <span class="support-link-icon">${SUPPORT_ICONS[type]}</span>
      <span class="support-link-text">
        <span class="support-link-label">${SUPPORT_LABELS[type]}</span>
        <span class="support-link-value">${support[type]}</span>
      </span>
      <svg class="support-link-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `;
    els.supportLinks.appendChild(row);
  });

  if (!count) {
    els.btnOpenSupport.style.display = 'none';
    return;
  }
  els.btnOpenSupport.style.display = '';
}
renderSupportLinks();

function openSupport() {
  els.supportModal.classList.add('open');
  els.supportOverlay.classList.add('open');
}
function closeSupport() {
  els.supportModal.classList.remove('open');
  els.supportOverlay.classList.remove('open');
}
els.btnOpenSupport.addEventListener('click', () => {
  openSupport();
  if (window.innerWidth <= 860) closeSidebar();
});
els.btnCloseSupport.addEventListener('click', closeSupport);
els.supportOverlay.addEventListener('click', closeSupport);

// ---------- Terapkan config.js (nama & deskripsi app) ----------
// config.js cuma berisi DATA - di sinilah datanya benar-benar dipakai ke halaman
// (judul tab, judul & tagline di sidebar, footer, meta description untuk SEO/share link).
// Kalau config.js gagal dimuat/rusak, teks default yang sudah ada di index.html tetap dipakai.
//
// name/tagline/description/footer boleh diisi string biasa (dipakai sama di
// semua bahasa) ATAU object per-bahasa { id, en, ja, es } (lihat contoh di
// config.js) - kalau object, dipilih sesuai bahasa UI yang aktif (currentLocale)
// lewat pickLocalized(), jadi ikut berubah setiap ganti bahasa di menu Bahasa.
// TIDAK dipanggil sendiri di sini (butuh currentLocale yang baru dideklarasikan
// di bawah) - dipanggil dari applyLocale() supaya sinkron sama pergantian bahasa.
function pickLocalized(value, locale) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return value[locale] || value.en || value.id || Object.values(value)[0] || '';
  }
  return '';
}

function applyAppConfig() {
  if (typeof CONFIG === 'undefined' || !CONFIG.app) return;
  const { name, tagline, description, footer } = CONFIG.app;
  const locName = pickLocalized(name, currentLocale);
  const locTagline = pickLocalized(tagline, currentLocale);
  const locFooter = pickLocalized(footer, currentLocale);
  const locDescription = pickLocalized(description, currentLocale);
  if (locName) {
    document.title = locName;
    const nameEl = document.getElementById('app-name');
    if (nameEl) nameEl.textContent = locName;
  }
  if (locTagline) {
    const taglineEl = document.getElementById('app-tagline');
    if (taglineEl) taglineEl.textContent = locTagline;
  }
  if (locFooter) {
    const footerEl = document.getElementById('app-footer');
    if (footerEl) footerEl.textContent = locFooter;
  }
  if (locDescription) {
    const metaEl = document.getElementById('meta-description');
    if (metaEl) metaEl.setAttribute('content', locDescription);
  }
}

// ---------- Bahasa antarmuka (i18n) ----------
// Ini nerjemahin teks NAVIGASI/UI aplikasi (tombol, label, placeholder,
// status koneksi, dll) - BUKAN nama/tagline/footer app (itu branding
// custom dari config.js -> CONFIG.app, dibiarkan apa adanya di semua
// bahasa) dan BUKAN isi balasan AI (itu diatur system persona di
// buildSystemPrompt(), yang otomatis ikut bahasa pesan terakhir user).
//
// Elemen statis di index.html ditandai data-i18n-text/-placeholder/-title/
// -aria, lalu applyLocale() mengisi semuanya sekali jalan lewat t(). Kalau
// nanti nambah elemen baru yang perlu diterjemahkan, tinggal tambah
// data-i18n-* di HTML + key barunya di I18N di bawah - tidak perlu ubah
// applyLocale().
const LANGUAGES = [
  { code: 'id', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', native: 'English', flag: '🇺🇸' },
  { code: 'ja', native: '日本語', flag: '🇯🇵' },
  { code: 'es', native: 'Español', flag: '🇪🇸' }
];

const I18N = {
  id: {
    btnNewChat: 'Chat baru',
    menuSettings: 'Pengaturan',
    menuLanguage: 'Bahasa',
    menuSupport: 'Bantuan',
    btnClear: 'Bersihkan chat',
    ariaOpenSidebar: 'Buka menu',
    ariaCloseSidebar: 'Tutup menu',
    settingsModalLabel: 'Pengaturan provider',
    settingsTitle: 'Pengaturan provider & model',
    ariaCloseSettings: 'Tutup pengaturan',
    labelProviderSelect: 'Provider tersimpan',
    optionNewProvider: '+ Provider baru',
    labelPreset: 'Preset cepat',
    labelProviderName: 'Nama provider',
    placeholderProviderName: 'mis. Groq, OpenAI, OpenRouter...',
    labelBaseurl: 'Domain / base URL API',
    placeholderBaseurl: 'https://api.contoh.com/v1',
    labelApikey: 'API key',
    placeholderApikey: 'Tempel API key di sini...',
    btnConnect: 'Sambungkan & cari model',
    btnDeleteProvider: 'Hapus provider ini',
    btnUpdateModels: '🔄 Update model',
    updatingModels: 'Mengambil daftar model terbaru dari provider...',
    updateModelsSuccess: 'Model diperbarui: {{count}} model ditemukan ({{added}} model baru).',
    labelModel: 'Model',
    optionNoModel: 'Belum ada model',
    supportModalLabel: 'Bantuan',
    supportTitle: 'Butuh bantuan?',
    ariaCloseSupport: 'Tutup bantuan',
    languageModalLabel: 'Bahasa',
    languageTitle: 'Bahasa',
    ariaCloseLanguage: 'Tutup',
    headerModelDefault: 'Belum ada model dipilih',
    headerNoProvider: 'Belum ada provider dipilih',
    connIdle: 'Belum tersambung',
    connConnected: 'Tersambung',
    connError: 'Gagal tersambung',
    autoSwitchTitle: 'Auto: pakai provider bawaan otomatis, tanpa perlu isi API key sendiri',
    ariaAttachFile: 'Upload file',
    ariaAttachImage: 'Upload gambar',
    chatPlaceholder: 'Ketik pesan...',
    btnSend: 'Kirim',
    emptyHistory: 'Belum ada percakapan. Pilih/tambah provider, sambungkan, pilih model, lalu mulai chat.',
    connectSuccess: 'Berhasil! {{count}} model ditemukan di {{name}}.',
    connectDefaultFail: 'Gagal menyambungkan provider bawaan.',
    filePending: 'memproses...',
    filesStillPending: 'Masih ada file yang diproses, tunggu sebentar sampai siap semua.',
    copyButton: 'Salin',
    downloadButton: 'Unduh',
    copiedFeedback: 'Disalin!',
    downloadedFeedback: 'Terunduh!',
    linesCount: '{{count}} baris',
    previewButton: 'Pratinjau',
    previewTitle: 'Pratinjau',
    deviceMobile: 'Ponsel',
    deviceTablet: 'Tablet',
    deviceDesktop: 'Desktop',
    previewReload: 'Muat ulang',
    previewNewTab: 'Buka di tab baru',
    previewClose: 'Tutup',
    generatingFile: 'Membuat {{name}}...',
    generatingFileGeneric: 'Sedang membuat file...',
    zipAllButton: 'Unduh semua sebagai .zip ({{count}} file)',
    fetchingModels: 'Mencari model dari domain penyedia...',
    modelsCached: '{{count}} model tersimpan (cache).',
    providerNameRequired: 'Isi nama provider dulu.',
    baseUrlRequired: 'Isi domain/base URL API dulu.',
    baseUrlInvalid: 'Domain harus diawali http:// atau https://',
    apikeyRequired: 'Isi API key dulu.',
    connectRequired: 'Sambungkan provider dulu.',
    modelRequired: 'Pilih model dulu.',
    fileTooLarge: 'Total isi file terlalu besar (maks ~{{max}} karakter). Hapus beberapa file dulu.',
    maxImagesReached: 'maks {{max}} gambar per pesan',
    imageTooLarge: 'gambar terlalu besar (maks {{max}})',
    totalImageSizeFull: 'total ukuran gambar terlampir sudah penuh',
    binaryFileSkipped: 'jenis file biner, tidak dibaca sebagai teks',
    binaryFileUnsupportedEdit: 'jenis file tidak didukung untuk diedit',
    binaryDetectedInText: 'terdeteksi berkas biner, tidak dibaca sebagai teks',
    fileReadError: 'gagal membaca file',
    truncatedNote: 'dipotong, terlalu besar',
    docLegacyUnsupported: 'format .doc lama belum didukung - convert dulu ke .docx',
    archiveUnsupported: 'format arsip ini belum bisa dibaca isinya (coba .zip atau .tar.gz)',
    archiveEmpty: 'tidak ada file teks yang bisa dibaca di dalam arsip ini',
    archiveReadError: 'gagal membaca arsip ({{msg}})',
    docLibNotReady: 'library pembaca dokumen belum siap (koneksi lambat?), coba lampirkan ulang',
    docNoTextExtracted: 'tidak ada teks yang bisa diekstrak (mungkin isinya hasil scan/gambar)',
    docReadError: 'gagal membaca dokumen ({{msg}})',
    zipLibNotReady: 'library pembaca zip belum siap (koneksi lambat?), coba lampirkan ulang',
    analysisPromptSingle: 'Berikut file yang perlu dianalisis/diedit ({{filename}}):',
    analysisPromptMultiple: 'Berikut {{count}} file yang perlu dianalisis/diedit:',
    fallbackTextOnly: 'Tolong edit file berikut sesuai kebutuhan.',
    fallbackImageOnly: 'Tolong lihat gambar yang dilampirkan.',
    fallbackMixed: 'Tolong lihat file dan gambar yang dilampirkan.',
    filesRead: '{{count}} file dibaca',
    binarySkipped: '{{count}} biner dilewati',
    noiseSkipped: '{{count}} file noise dilewati',
    autoDisabled: 'Auto dimatikan - isi provider & API key kamu sendiri di sini.',
    imageReadError: 'gagal membaca gambar ({{msg}})',
    pdfGenerating: 'Membuat PDF...',
    pdfGenerateError: 'Gagal membuat PDF',
    pdfLibNotReady: 'Library pembuat PDF belum siap (koneksi lambat?), coba lagi'
  },
  en: {
    btnNewChat: 'New chat',
    menuSettings: 'Settings',
    menuLanguage: 'Language',
    menuSupport: 'Help',
    btnClear: 'Clear chat',
    ariaOpenSidebar: 'Open menu',
    ariaCloseSidebar: 'Close menu',
    settingsModalLabel: 'Provider settings',
    settingsTitle: 'Provider & model settings',
    ariaCloseSettings: 'Close settings',
    labelProviderSelect: 'Saved providers',
    optionNewProvider: '+ New provider',
    labelPreset: 'Quick presets',
    labelProviderName: 'Provider name',
    placeholderProviderName: 'e.g. Groq, OpenAI, OpenRouter...',
    labelBaseurl: 'API domain / base URL',
    placeholderBaseurl: 'https://api.example.com/v1',
    labelApikey: 'API key',
    placeholderApikey: 'Paste your API key here...',
    btnConnect: 'Connect & find models',
    btnDeleteProvider: 'Delete this provider',
    btnUpdateModels: '🔄 Update models',
    updatingModels: 'Fetching the latest models from the provider...',
    updateModelsSuccess: 'Models updated: {{count}} models found ({{added}} new).',
    labelModel: 'Model',
    optionNoModel: 'No model yet',
    supportModalLabel: 'Help',
    supportTitle: 'Need help?',
    ariaCloseSupport: 'Close help',
    languageModalLabel: 'Language',
    languageTitle: 'Language',
    ariaCloseLanguage: 'Close',
    headerModelDefault: 'No model selected',
    headerNoProvider: 'No provider selected',
    connIdle: 'Not connected',
    connConnected: 'Connected',
    connError: 'Connection failed',
    autoSwitchTitle: 'Auto: use the built-in provider automatically, no API key needed',
    ariaAttachFile: 'Upload file',
    ariaAttachImage: 'Upload image',
    chatPlaceholder: 'Type a message...',
    btnSend: 'Send',
    emptyHistory: 'No conversation yet. Choose/add a provider, connect, pick a model, then start chatting.',
    connectSuccess: 'Success! Found {{count}} models on {{name}}.',
    connectDefaultFail: 'Failed to connect to the built-in provider.',
    filePending: 'processing...',
    filesStillPending: 'Some files are still being processed, wait until they\'re all ready.',
    copyButton: 'Copy',
    downloadButton: 'Download',
    copiedFeedback: 'Copied!',
    downloadedFeedback: 'Downloaded!',
    linesCount: '{{count}} lines',
    previewButton: 'Preview',
    previewTitle: 'Preview',
    deviceMobile: 'Phone',
    deviceTablet: 'Tablet',
    deviceDesktop: 'Desktop',
    previewReload: 'Reload',
    previewNewTab: 'Open in new tab',
    previewClose: 'Close',
    generatingFile: 'Creating {{name}}...',
    generatingFileGeneric: 'Creating file...',
    zipAllButton: 'Download all as .zip ({{count}} files)',
    fetchingModels: 'Searching for models from the provider...',
    modelsCached: '{{count}} models saved (cache).',
    providerNameRequired: 'Enter a provider name first.',
    baseUrlRequired: 'Enter the API domain/base URL first.',
    baseUrlInvalid: 'The domain must start with http:// or https://',
    apikeyRequired: 'Enter an API key first.',
    connectRequired: 'Connect a provider first.',
    modelRequired: 'Choose a model first.',
    fileTooLarge: 'Total file content is too large (max ~{{max}} characters). Remove some files first.',
    maxImagesReached: 'max {{max}} images per message',
    imageTooLarge: 'image too large (max {{max}})',
    totalImageSizeFull: 'total attached image size is full',
    binaryFileSkipped: 'binary file type, not read as text',
    binaryFileUnsupportedEdit: 'this file type is not supported for editing',
    binaryDetectedInText: 'binary file detected, not read as text',
    fileReadError: 'failed to read file',
    truncatedNote: 'truncated, too large',
    docLegacyUnsupported: 'legacy .doc format is not supported yet - convert to .docx first',
    archiveUnsupported: 'this archive format can\'t be read yet (try .zip or .tar.gz)',
    archiveEmpty: 'no readable text files found inside this archive',
    archiveReadError: 'failed to read archive ({{msg}})',
    docLibNotReady: 'document reader library isn\'t ready yet (slow connection?), try attaching again',
    docNoTextExtracted: 'no text could be extracted (it might be a scan/image)',
    docReadError: 'failed to read document ({{msg}})',
    zipLibNotReady: 'zip reader library isn\'t ready yet (slow connection?), try attaching again',
    analysisPromptSingle: 'Here\'s the file to analyze/edit ({{filename}}):',
    analysisPromptMultiple: 'Here are {{count}} files to analyze/edit:',
    fallbackTextOnly: 'Please edit the following file as needed.',
    fallbackImageOnly: 'Please look at the attached image.',
    fallbackMixed: 'Please look at the attached files and images.',
    filesRead: '{{count}} files read',
    binarySkipped: '{{count}} binary skipped',
    noiseSkipped: '{{count}} noise files skipped',
    autoDisabled: 'Auto turned off - enter your own provider & API key here.',
    imageReadError: 'failed to read image ({{msg}})',
    pdfGenerating: 'Generating PDF...',
    pdfGenerateError: 'Failed to generate PDF',
    pdfLibNotReady: 'The PDF generator library isn\'t ready yet (slow connection?), try again'
  },
  ja: {
    btnNewChat: '新しいチャット',
    menuSettings: '設定',
    menuLanguage: '言語',
    menuSupport: 'ヘルプ',
    btnClear: 'チャットを消去',
    ariaOpenSidebar: 'メニューを開く',
    ariaCloseSidebar: 'メニューを閉じる',
    settingsModalLabel: 'プロバイダー設定',
    settingsTitle: 'プロバイダー・モデル設定',
    ariaCloseSettings: '設定を閉じる',
    labelProviderSelect: '保存済みプロバイダー',
    optionNewProvider: '+ 新しいプロバイダー',
    labelPreset: 'クイックプリセット',
    labelProviderName: 'プロバイダー名',
    placeholderProviderName: '例: Groq, OpenAI, OpenRouter...',
    labelBaseurl: 'APIドメイン / ベースURL',
    placeholderBaseurl: 'https://api.example.com/v1',
    labelApikey: 'APIキー',
    placeholderApikey: 'ここにAPIキーを貼り付け...',
    btnConnect: '接続してモデルを検索',
    btnDeleteProvider: 'このプロバイダーを削除',
    btnUpdateModels: '🔄 モデルを更新',
    updatingModels: 'プロバイダーから最新のモデルを取得中...',
    updateModelsSuccess: 'モデルを更新しました：{{count}} 個見つかりました（新規 {{added}} 個）。',
    labelModel: 'モデル',
    optionNoModel: 'モデルがありません',
    supportModalLabel: 'ヘルプ',
    supportTitle: 'お困りですか?',
    ariaCloseSupport: 'ヘルプを閉じる',
    languageModalLabel: '言語',
    languageTitle: '言語',
    ariaCloseLanguage: '閉じる',
    headerModelDefault: 'モデル未選択',
    headerNoProvider: 'プロバイダー未選択',
    connIdle: '未接続',
    connConnected: '接続済み',
    connError: '接続失敗',
    autoSwitchTitle: 'Auto: APIキー不要で組み込みプロバイダーを自動使用',
    ariaAttachFile: 'ファイルをアップロード',
    ariaAttachImage: '画像をアップロード',
    chatPlaceholder: 'メッセージを入力...',
    btnSend: '送信',
    emptyHistory: 'まだ会話がありません。プロバイダーを選択/追加し、接続してモデルを選び、チャットを始めましょう。',
    connectSuccess: '成功！{{name}}で{{count}}個のモデルが見つかりました。',
    connectDefaultFail: '組み込みプロバイダーへの接続に失敗しました。',
    filePending: '処理中...',
    filesStillPending: 'まだ処理中のファイルがあります。すべて準備できるまでお待ちください。',
    copyButton: 'コピー',
    downloadButton: 'ダウンロード',
    copiedFeedback: 'コピーしました！',
    downloadedFeedback: 'ダウンロードしました！',
    linesCount: '{{count}} 行',
    previewButton: 'プレビュー',
    previewTitle: 'プレビュー',
    deviceMobile: 'スマホ',
    deviceTablet: 'タブレット',
    deviceDesktop: 'デスクトップ',
    previewReload: '再読み込み',
    previewNewTab: '新しいタブで開く',
    previewClose: '閉じる',
    generatingFile: '{{name}} を作成中...',
    generatingFileGeneric: 'ファイルを作成中...',
    zipAllButton: 'すべてを.zipでダウンロード ({{count}} ファイル)',
    fetchingModels: 'プロバイダーからモデルを検索中...',
    modelsCached: '{{count}} 個のモデルを保存済み（キャッシュ）。',
    providerNameRequired: '先にプロバイダー名を入力してください。',
    baseUrlRequired: '先にAPIドメイン/ベースURLを入力してください。',
    baseUrlInvalid: 'ドメインは http:// または https:// で始まる必要があります',
    apikeyRequired: '先にAPIキーを入力してください。',
    connectRequired: '先にプロバイダーを接続してください。',
    modelRequired: '先にモデルを選択してください。',
    fileTooLarge: 'ファイルの内容が大きすぎます（最大 約{{max}} 文字）。いくつかファイルを削除してください。',
    maxImagesReached: '1メッセージにつき最大 {{max}} 枚まで',
    imageTooLarge: '画像が大きすぎます（最大 {{max}}）',
    totalImageSizeFull: '添付画像の合計サイズが上限に達しました',
    binaryFileSkipped: 'バイナリファイルのためテキストとして読み込めません',
    binaryFileUnsupportedEdit: 'このファイル形式は編集に対応していません',
    binaryDetectedInText: 'バイナリファイルと判定されたため、テキストとして読み込みませんでした',
    fileReadError: 'ファイルの読み込みに失敗しました',
    truncatedNote: '大きすぎるため切り詰めました',
    docLegacyUnsupported: '旧形式の.docはまだ対応していません - 先に.docxに変換してください',
    archiveUnsupported: 'このアーカイブ形式はまだ読み込めません（.zipまたは.tar.gzをお試しください）',
    archiveEmpty: 'このアーカイブ内に読み込めるテキストファイルが見つかりません',
    archiveReadError: 'アーカイブの読み込みに失敗しました（{{msg}}）',
    docLibNotReady: 'ドキュメント読み込みライブラリの準備がまだできていません（接続が遅い?）。もう一度添付してください',
    docNoTextExtracted: 'テキストを抽出できませんでした（スキャン画像の可能性があります）',
    docReadError: 'ドキュメントの読み込みに失敗しました（{{msg}}）',
    zipLibNotReady: 'zip読み込みライブラリの準備がまだできていません（接続が遅い?）。もう一度添付してください',
    analysisPromptSingle: '分析/編集が必要なファイルです（{{filename}}）：',
    analysisPromptMultiple: '分析/編集が必要な{{count}}個のファイルです：',
    fallbackTextOnly: '以下のファイルを必要に応じて編集してください。',
    fallbackImageOnly: '添付された画像をご確認ください。',
    fallbackMixed: '添付されたファイルと画像をご確認ください。',
    filesRead: '{{count}} ファイルを読み込みました',
    binarySkipped: '{{count}} 個のバイナリをスキップしました',
    noiseSkipped: '{{count}} 個の不要ファイルをスキップしました',
    autoDisabled: 'Autoをオフにしました - ここで自分のプロバイダーとAPIキーを入力してください。',
    imageReadError: '画像の読み込みに失敗しました（{{msg}}）',
    pdfGenerating: 'PDFを作成中...',
    pdfGenerateError: 'PDFの作成に失敗しました',
    pdfLibNotReady: 'PDF作成ライブラリの準備がまだできていません（接続が遅い?）。もう一度お試しください'
  },
  es: {
    btnNewChat: 'Nuevo chat',
    menuSettings: 'Ajustes',
    menuLanguage: 'Idioma',
    menuSupport: 'Ayuda',
    btnClear: 'Borrar chat',
    ariaOpenSidebar: 'Abrir menú',
    ariaCloseSidebar: 'Cerrar menú',
    settingsModalLabel: 'Ajustes del proveedor',
    settingsTitle: 'Ajustes de proveedor y modelo',
    ariaCloseSettings: 'Cerrar ajustes',
    labelProviderSelect: 'Proveedores guardados',
    optionNewProvider: '+ Nuevo proveedor',
    labelPreset: 'Preajustes rápidos',
    labelProviderName: 'Nombre del proveedor',
    placeholderProviderName: 'ej. Groq, OpenAI, OpenRouter...',
    labelBaseurl: 'Dominio / URL base de la API',
    placeholderBaseurl: 'https://api.ejemplo.com/v1',
    labelApikey: 'Clave de API',
    placeholderApikey: 'Pega tu clave de API aquí...',
    btnConnect: 'Conectar y buscar modelos',
    btnDeleteProvider: 'Eliminar este proveedor',
    btnUpdateModels: '🔄 Actualizar modelos',
    updatingModels: 'Obteniendo los modelos más recientes del proveedor...',
    updateModelsSuccess: 'Modelos actualizados: {{count}} modelos encontrados ({{added}} nuevos).',
    labelModel: 'Modelo',
    optionNoModel: 'Sin modelos aún',
    supportModalLabel: 'Ayuda',
    supportTitle: '¿Necesitas ayuda?',
    ariaCloseSupport: 'Cerrar ayuda',
    languageModalLabel: 'Idioma',
    languageTitle: 'Idioma',
    ariaCloseLanguage: 'Cerrar',
    headerModelDefault: 'Ningún modelo seleccionado',
    headerNoProvider: 'Ningún proveedor seleccionado',
    connIdle: 'Sin conexión',
    connConnected: 'Conectado',
    connError: 'Error de conexión',
    autoSwitchTitle: 'Auto: usa el proveedor integrado automáticamente, sin necesidad de tu propia clave de API',
    ariaAttachFile: 'Subir archivo',
    ariaAttachImage: 'Subir imagen',
    chatPlaceholder: 'Escribe un mensaje...',
    btnSend: 'Enviar',
    emptyHistory: 'Aún no hay conversación. Elige/añade un proveedor, conéctate, elige un modelo y empieza a chatear.',
    connectSuccess: '¡Listo! Se encontraron {{count}} modelos en {{name}}.',
    connectDefaultFail: 'No se pudo conectar con el proveedor integrado.',
    filePending: 'procesando...',
    filesStillPending: 'Todavía hay archivos en proceso, espera a que todos estén listos.',
    copyButton: 'Copiar',
    downloadButton: 'Descargar',
    copiedFeedback: '¡Copiado!',
    downloadedFeedback: '¡Descargado!',
    linesCount: '{{count}} líneas',
    previewButton: 'Vista previa',
    previewTitle: 'Vista previa',
    deviceMobile: 'Móvil',
    deviceTablet: 'Tableta',
    deviceDesktop: 'Escritorio',
    previewReload: 'Recargar',
    previewNewTab: 'Abrir en pestaña nueva',
    previewClose: 'Cerrar',
    generatingFile: 'Creando {{name}}...',
    generatingFileGeneric: 'Creando archivo...',
    zipAllButton: 'Descargar todo como .zip ({{count}} archivos)',
    fetchingModels: 'Buscando modelos del proveedor...',
    modelsCached: '{{count}} modelos guardados (caché).',
    providerNameRequired: 'Ingresa primero un nombre de proveedor.',
    baseUrlRequired: 'Ingresa primero el dominio/URL base de la API.',
    baseUrlInvalid: 'El dominio debe empezar con http:// o https://',
    apikeyRequired: 'Ingresa primero una clave de API.',
    connectRequired: 'Conecta primero un proveedor.',
    modelRequired: 'Elige primero un modelo.',
    fileTooLarge: 'El contenido total del archivo es demasiado grande (máx ~{{max}} caracteres). Elimina algunos archivos primero.',
    maxImagesReached: 'máx {{max}} imágenes por mensaje',
    imageTooLarge: 'imagen demasiado grande (máx {{max}})',
    totalImageSizeFull: 'el tamaño total de las imágenes adjuntas está lleno',
    binaryFileSkipped: 'archivo binario, no se lee como texto',
    binaryFileUnsupportedEdit: 'este tipo de archivo no es compatible para editar',
    binaryDetectedInText: 'se detectó un archivo binario, no se leyó como texto',
    fileReadError: 'no se pudo leer el archivo',
    truncatedNote: 'truncado, demasiado grande',
    docLegacyUnsupported: 'el formato .doc antiguo aún no es compatible - convierte primero a .docx',
    archiveUnsupported: 'este formato de archivo comprimido aún no se puede leer (prueba .zip o .tar.gz)',
    archiveEmpty: 'no se encontraron archivos de texto legibles dentro de este archivo comprimido',
    archiveReadError: 'no se pudo leer el archivo comprimido ({{msg}})',
    docLibNotReady: 'la librería de lectura de documentos aún no está lista (¿conexión lenta?), intenta adjuntar de nuevo',
    docNoTextExtracted: 'no se pudo extraer texto (puede ser un escaneo/imagen)',
    docReadError: 'no se pudo leer el documento ({{msg}})',
    zipLibNotReady: 'la librería de lectura de zip aún no está lista (¿conexión lenta?), intenta adjuntar de nuevo',
    analysisPromptSingle: 'Aquí está el archivo para analizar/editar ({{filename}}):',
    analysisPromptMultiple: 'Aquí hay {{count}} archivos para analizar/editar:',
    fallbackTextOnly: 'Por favor edita el siguiente archivo según sea necesario.',
    fallbackImageOnly: 'Por favor revisa la imagen adjunta.',
    fallbackMixed: 'Por favor revisa los archivos e imágenes adjuntos.',
    filesRead: '{{count}} archivos leídos',
    binarySkipped: '{{count}} binarios omitidos',
    noiseSkipped: '{{count}} archivos de ruido omitidos',
    autoDisabled: 'Auto desactivado - ingresa tu propio proveedor y clave de API aquí.',
    imageReadError: 'no se pudo leer la imagen ({{msg}})',
    pdfGenerating: 'Generando PDF...',
    pdfGenerateError: 'No se pudo generar el PDF',
    pdfLibNotReady: 'La librería para generar PDF aún no está lista (¿conexión lenta?), intenta de nuevo'
  }
};

let currentLocale = localStorage.getItem('ai_lang') || 'en';

// Buat format angka (toLocaleString) ikut bahasa UI yang aktif, mis. batas
// karakter file jadi "200.000" di id/es tapi "200,000" di en.
const NUMBER_LOCALE = { id: 'id-ID', en: 'en-US', ja: 'ja-JP', es: 'es-ES' };


// Peta dari key i18n internal ke lokasi field yang BOLEH DIISI di config.js,
// biar config.js bisa override teks tanpa perlu tahu skema I18N internal ini.
// Field config-nya boleh: string biasa (dipakai sama di semua bahasa - lihat
// pickLocalized), object per-bahasa {id,en,ja,es}, ATAU (khusus beberapa
// field messages/fileAttachment/codeBlock warisan config.js versi lama)
// FUNGSI (count, ...) => string - dipanggil langsung dengan argumen dari
// `vars`, urutannya diatur CONFIG_FN_ARGS di bawah.
const CONFIG_TEXT_MAP = {
  labelProviderSelect: ['sidebar', 'providerSelectLabel'],
  optionNewProvider: ['sidebar', 'providerSelectNew'],
  labelPreset: ['sidebar', 'presetLabel'],
  labelProviderName: ['sidebar', 'providerNameLabel'],
  placeholderProviderName: ['sidebar', 'providerNamePlaceholder'],
  labelBaseurl: ['sidebar', 'baseUrlLabel'],
  placeholderBaseurl: ['sidebar', 'baseUrlPlaceholder'],
  labelApikey: ['sidebar', 'apikeyLabel'],
  placeholderApikey: ['sidebar', 'apikeyPlaceholder'],
  btnConnect: ['sidebar', 'connectButton'],
  btnDeleteProvider: ['sidebar', 'deleteButton'],
  labelModel: ['sidebar', 'modelLabel'],
  optionNoModel: ['sidebar', 'modelDefault'],
  headerModelDefault: ['chat', 'headerDefault'],
  connIdle: ['chat', 'connectionIdle'],
  connConnected: ['chat', 'connectionConnected'],
  connError: ['chat', 'connectionError'],
  emptyHistory: ['chat', 'emptyHistoryMessage'],
  chatPlaceholder: ['chat', 'inputPlaceholder'],
  btnSend: ['chat', 'sendButton'],
  btnClear: ['chat', 'clearButton'],
  ariaAttachFile: ['chat', 'attachLabel'],
  ariaAttachImage: ['chat', 'attachImageLabel'],
  copyButton: ['codeBlock', 'copyButton'],
  downloadButton: ['codeBlock', 'downloadButton'],
  copiedFeedback: ['codeBlock', 'copiedFeedback'],
  downloadedFeedback: ['codeBlock', 'downloadedFeedback'],
  linesCount: ['codeBlock', 'linesCount'],
  zipAllButton: ['codeBlock', 'zipAllButton'],
  fetchingModels: ['messages', 'fetchingModels'],
  connectSuccess: ['messages', 'modelsFound'],
  modelsCached: ['messages', 'modelsCached'],
  providerNameRequired: ['messages', 'providerNameRequired'],
  baseUrlRequired: ['messages', 'baseUrlRequired'],
  baseUrlInvalid: ['messages', 'baseUrlInvalid'],
  apikeyRequired: ['messages', 'apikeyRequired'],
  connectRequired: ['messages', 'connectRequired'],
  modelRequired: ['messages', 'modelRequired'],
  fileTooLarge: ['messages', 'fileTooLarge'],
  maxImagesReached: ['messages', 'maxImagesReached'],
  imageTooLarge: ['messages', 'imageTooLarge'],
  totalImageSizeFull: ['messages', 'totalImageSizeFull'],
  binaryFileSkipped: ['messages', 'binaryFileSkipped'],
  fileReadError: ['messages', 'fileReadError'],
  archiveUnsupported: ['messages', 'archiveUnsupported'],
  archiveEmpty: ['messages', 'archiveEmpty'],
  archiveReadError: ['messages', 'archiveReadError'],
  analysisPromptSingle: ['fileAttachment', 'analysisPromptSingle'],
  analysisPromptMultiple: ['fileAttachment', 'analysisPromptMultiple'],
  fallbackTextOnly: ['fileAttachment', 'fallbackTextOnly'],
  fallbackImageOnly: ['fileAttachment', 'fallbackImageOnly'],
  fallbackMixed: ['fileAttachment', 'fallbackMixed'],
  filesRead: ['fileAttachment', 'filesRead'],
  binarySkipped: ['fileAttachment', 'binarySkipped'],
  noiseSkipped: ['fileAttachment', 'noiseSkipped'],
  supportModalLabel: ['support', 'title'],
  supportTitle: ['support', 'title']
};
// Urutan argumen posisional buat field config.js yang berupa FUNGSI (gaya
// config.js versi lama, mis. modelsFound: (count, providerName) => ...).
// Kalau field-nya STRING/object biasa, ini tidak dipakai sama sekali -
// template {{var}}-nya diisi lewat replace biasa di bawah.
const CONFIG_FN_ARGS = {
  connectSuccess: ['count', 'name'],
  modelsCached: ['count'],
  fileTooLarge: ['max'],
  maxImagesReached: ['max'],
  imageTooLarge: ['max'],
  archiveReadError: ['msg'],
  analysisPromptSingle: ['filename'],
  analysisPromptMultiple: ['count'],
  filesRead: ['count'],
  binarySkipped: ['count'],
  noiseSkipped: ['count'],
  linesCount: ['count'],
  zipAllButton: ['count']
};

function resolveConfigValue(path) {
  if (!path || typeof CONFIG === 'undefined') return undefined;
  let obj = CONFIG;
  for (const seg of path) {
    if (obj == null) return undefined;
    obj = obj[seg];
  }
  return obj;
}

function t(key, vars) {
  const cfgVal = resolveConfigValue(CONFIG_TEXT_MAP[key]);
  let str;
  if (typeof cfgVal === 'function') {
    // Fungsi gaya config.js versi lama (mis. messages.modelsFound) SELALU
    // ditulis dalam satu bahasa saja (di file yang kamu isi, itu Indonesia) -
    // bukan per-locale kayak object {id,en,ja,es}. Supaya ganti bahasa di
    // menu Bahasa tetap kepakai buat visitor yang pilih en/ja/es, override
    // fungsi ini HANYA dipakai kalau locale aktifnya 'id'; locale lain tetap
    // pakai kamus bawaan (I18N) di bawah.
    if (currentLocale === 'id') {
      const argNames = CONFIG_FN_ARGS[key] || [];
      const args = argNames.map((n) => vars?.[n]);
      try {
        str = String(cfgVal(...args));
      } catch {
        str = null; // config.js-nya rusak buat field ini - fallback ke bawaan
      }
    }
  } else if (cfgVal && typeof cfgVal === 'object') {
    // Object per-bahasa {id,en,ja,es} - SELALU dipakai, cocok sama locale aktif.
    str = pickLocalized(cfgVal, currentLocale);
  } else if (typeof cfgVal === 'string' && cfgVal) {
    // String biasa - sama kayak fungsi di atas, dianggap override KHUSUS
    // bahasa Indonesia saja (itu bahasa file config.js-mu), biar bahasa lain
    // tidak ikut ketiban teks Indonesia yang di-hardcode di config.
    if (currentLocale === 'id') str = cfgVal;
  }
  if (!str) {
    const dict = I18N[currentLocale] || I18N.id;
    str = dict[key] ?? I18N.id[key] ?? key;
  }
  if (vars) {
    Object.keys(vars).forEach((k) => {
      str = str.replace(new RegExp(`{{${k}}}`, 'g'), vars[k]);
    });
  }
  return str;
}

function renderLanguageList() {
  els.languageList.innerHTML = '';
  LANGUAGES.forEach((l) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-option' + (l.code === currentLocale ? ' active' : '');
    btn.innerHTML =
      `<span class="lang-flag">${l.flag}</span><span class="lang-native">${l.native}</span>` +
      (l.code === currentLocale ? '<span class="lang-check">✓</span>' : '');
    btn.addEventListener('click', () => {
      setLocale(l.code);
      closeLanguage();
    });
    els.languageList.appendChild(btn);
  });
}

// Elemen yang textContent/placeholder/title-nya HANYA teks statis (bukan
// digabung sama data lain, mis. nama model) aman di-refresh total lewat
// applyLocale(). Elemen yang isinya campur data dinamis (header model,
// indikator koneksi) di-refresh lewat fungsi masing-masing
// (updateHeaderModel/setConnIndicator) yang juga sudah pakai t().
function applyLocale(lang) {
  currentLocale = LANGUAGES.some((l) => l.code === lang) ? lang : 'id';
  localStorage.setItem('ai_lang', currentLocale);
  document.documentElement.lang = currentLocale;

  document.querySelectorAll('[data-i18n-text]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n-text'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });

  // Refresh elemen yang isinya bisa campur data dinamis, biar tidak ketimpa
  // balik ke teks default kalau lagi nampilin status nyata (mis. nama
  // model yang lagi aktif, atau status "Tersambung").
  if (typeof updateHeaderModel === 'function') updateHeaderModel();
  if (typeof renderHistory === 'function' && history.length === 0) renderHistory();
  if (typeof populateProviderSelect === 'function') populateProviderSelect();
  applyAppConfig();
  if (els.modelSelect && els.modelSelect.disabled) {
    els.modelSelect.innerHTML = `<option value="">${t('optionNoModel')}</option>`;
  }
  if (els.languageModal && els.languageModal.classList.contains('open')) renderLanguageList();
}

function setLocale(lang) {
  applyLocale(lang);
}

function openSidebar() {
  els.sidebar.classList.add('open');
  els.sidebarOverlay.classList.add('open');
}
function closeSidebar() {
  els.sidebar.classList.remove('open');
  els.sidebarOverlay.classList.remove('open');
}
els.btnOpenSidebar.addEventListener('click', openSidebar);
els.btnCloseSidebar.addEventListener('click', closeSidebar);
els.sidebarOverlay.addEventListener('click', closeSidebar);

function setConnIndicator(state, label) {
  els.headerConn.className = `conn-indicator ${state}`;
  // label optional - kalau tidak dikasih, ambil teks bawaan sesuai state dari
  // kamus bahasa aktif (t()), biar otomatis ikut bahasa yang lagi dipilih.
  const key = state === 'connected' ? 'connConnected' : state === 'error' ? 'connError' : 'connIdle';
  els.headerConnText.textContent = label || t(key);
}


// ---------- Preset provider (domain siap pakai, tinggal isi API key) ----------
const PRESETS = [
  { name: 'Groq', baseUrl: 'https://api.groq.com/openai/v1' },
  { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1' },
  { name: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1' },
  { name: 'Together AI', baseUrl: 'https://api.together.xyz/v1' },
  { name: 'Mistral', baseUrl: 'https://api.mistral.ai/v1' },
  { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1' },
  { name: 'Fireworks', baseUrl: 'https://api.fireworks.ai/inference/v1' },
  { name: 'Cerebras', baseUrl: 'https://api.cerebras.ai/v1' },
  { name: 'xAI (Grok)', baseUrl: 'https://api.x.ai/v1' }
];

function renderPresetChips() {
  els.presetChips.innerHTML = '';
  PRESETS.forEach((p) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = p.name;
    chip.addEventListener('click', () => {
      els.providerName.value = p.name;
      els.providerBaseUrl.value = p.baseUrl;
      els.apikey.value = '';
      els.apikey.focus();
      [...els.presetChips.children].forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
    els.presetChips.appendChild(chip);
  });
}

// ---------- Penyimpanan lokal: multi-provider + riwayat per provider/model ----------
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const store = {
  get providers() {
    try { return JSON.parse(localStorage.getItem('ai_providers') || '[]'); }
    catch { return []; }
  },
  set providers(v) { localStorage.setItem('ai_providers', JSON.stringify(v)); },

  get activeProviderId() { return localStorage.getItem('ai_active_provider') || ''; },
  set activeProviderId(v) { localStorage.setItem('ai_active_provider', v); },

  getModels(providerId) {
    try { return JSON.parse(localStorage.getItem(`ai_models_${providerId}`) || '[]'); }
    catch { return []; }
  },
  setModels(providerId, v) { localStorage.setItem(`ai_models_${providerId}`, JSON.stringify(v)); },

  getModel(providerId) { return localStorage.getItem(`ai_model_${providerId}`) || ''; },
  setModel(providerId, v) { localStorage.setItem(`ai_model_${providerId}`, v); },

  // ---- Sesi chat: tiap sesi punya riwayatnya sendiri ----
  get sessions() {
    try { return JSON.parse(localStorage.getItem('ai_sessions') || '[]'); }
    catch { return []; }
  },
  set sessions(v) { localStorage.setItem('ai_sessions', JSON.stringify(v)); },

  get activeSessionId() { return localStorage.getItem('ai_active_session') || ''; },
  set activeSessionId(v) { localStorage.setItem('ai_active_session', v); },

  getSessionHistory(sessionId) {
    try { return JSON.parse(localStorage.getItem(`ai_history_${sessionId}`) || '[]'); }
    catch { return []; }
  },
  setSessionHistory(sessionId, v) {
    try {
      localStorage.setItem(`ai_history_${sessionId}`, JSON.stringify(v));
    } catch (err) {
      // Kemungkinan besar kuota localStorage penuh (riwayat + gambar terlampir
      // terlalu besar) - jangan sampai ini menghentikan alur kirim pesan.
      console.warn('Gagal menyimpan riwayat chat ke localStorage:', err);
    }
  },
  deleteSessionHistory(sessionId) {
    localStorage.removeItem(`ai_history_${sessionId}`);
  }
};

// ---------- Sesi: judul otomatis, migrasi riwayat lama, ganti/hapus sesi ----------

function sessionTitleFromHistory(hist) {
  const firstUser = (hist || []).find((m) => m.role === 'user');
  const raw = (firstUser && (firstUser.displayText ?? firstUser.content)) || '';
  const text = typeof raw === 'string' ? raw : '';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (!trimmed) return 'Percakapan baru';
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed;
}

function createSession(activate) {
  const session = { id: uid(), title: 'Percakapan baru', createdAt: Date.now(), updatedAt: Date.now(), pinned: false };
  const sessions = store.sessions;
  sessions.unshift(session);
  store.sessions = sessions;
  store.setSessionHistory(session.id, []);
  if (activate !== false) store.activeSessionId = session.id;
  return session;
}

// Pengguna lama cuma punya satu riwayat global (kunci "ai_history") - pindahkan
// itu jadi sesi pertama supaya riwayat lamanya tidak hilang.
function migrateLegacyHistory() {
  if (store.sessions.length) return;
  let legacy = [];
  try { legacy = JSON.parse(localStorage.getItem('ai_history') || '[]'); } catch { legacy = []; }
  const session = createSession(true);
  if (legacy.length) {
    session.title = sessionTitleFromHistory(legacy);
    store.sessions = store.sessions.map((s) => (s.id === session.id ? session : s));
    store.setSessionHistory(session.id, legacy);
  }
  localStorage.removeItem('ai_history');
}

function ensureActiveSession() {
  migrateLegacyHistory();
  const sessions = store.sessions;
  const active = store.activeSessionId;
  if (!active || !sessions.some((s) => s.id === active)) {
    store.activeSessionId = sessions.length ? sessions[0].id : createSession(true).id;
  }
}

// Perbarui judul otomatis + waktu terakhir dipakai untuk sesi yang aktif sekarang.
function touchActiveSession() {
  const sessions = store.sessions;
  const idx = sessions.findIndex((s) => s.id === store.activeSessionId);
  if (idx === -1) return;
  sessions[idx].updatedAt = Date.now();
  sessions[idx].title = sessionTitleFromHistory(history);
  store.sessions = sessions;
  renderSessionList();
}

function toggleSessionPin(id) {
  const sessions = store.sessions.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s));
  store.sessions = sessions;
  renderSessionList();
}

function renderSessionList() {
  const sessions = [...store.sessions].sort((a, b) => {
    if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });
  const activeId = store.activeSessionId;
  els.sessionList.innerHTML = '';
  sessions.forEach((s) => {
    const item = document.createElement('div');
    item.className = `session-item${s.id === activeId ? ' active' : ''}${s.pinned ? ' pinned' : ''}`;

    const pinBtn = document.createElement('button');
    pinBtn.type = 'button';
    pinBtn.className = 'session-item-pin';
    pinBtn.setAttribute('aria-label', s.pinned ? 'Lepas sematan percakapan ini' : 'Sematkan percakapan ini');
    pinBtn.innerHTML = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8.3 3.5h3.4l.5 4.6 2.4 2.1c.3.3.1.8-.3.8h-3.2l-.3 4.5-.8 1-.8-1-.3-4.5H5.7c-.4 0-.6-.5-.3-.8l2.4-2.1.5-4.6Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    pinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSessionPin(s.id);
    });
    item.appendChild(pinBtn);

    const titleEl = document.createElement('span');
    titleEl.className = 'session-item-title';
    titleEl.textContent = s.title || 'Percakapan baru';
    item.appendChild(titleEl);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'session-item-del';
    delBtn.setAttribute('aria-label', 'Hapus percakapan ini');
    delBtn.innerHTML = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m-6 0 .6 9.4A2 2 0 0 0 8.6 17h2.8a2 2 0 0 0 2-1.6L14 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteSession(s.id);
    });
    item.appendChild(delBtn);

    item.addEventListener('click', () => switchSession(s.id));
    els.sessionList.appendChild(item);
  });
}

function switchSession(id) {
  if (id !== store.activeSessionId) {
    store.activeSessionId = id;
    history = store.getSessionHistory(id);
    renderHistory();
    renderSessionList();
  }
  if (window.innerWidth <= 860) closeSidebar();
}

function handleDeleteSession(id) {
  const sessions = store.sessions;
  if (sessions.length <= 1) {
    // Cuma ada satu sesi - kosongkan isinya saja, jangan sampai tidak ada sesi sama sekali.
    if (!confirm('Kosongkan percakapan ini?')) return;
    history = [];
    store.setSessionHistory(id, history);
    touchActiveSession();
    renderHistory();
    return;
  }
  if (!confirm('Hapus percakapan ini? Riwayatnya tidak bisa dikembalikan.')) return;
  const remaining = sessions.filter((s) => s.id !== id);
  store.sessions = remaining;
  store.deleteSessionHistory(id);
  if (store.activeSessionId === id) {
    const next = [...remaining].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
    store.activeSessionId = next ? next.id : '';
    ensureActiveSession();
    history = store.getSessionHistory(store.activeSessionId);
    renderHistory();
  }
  renderSessionList();
}

els.btnNewChat.addEventListener('click', () => {
  const activeHist = store.getSessionHistory(store.activeSessionId);
  if (activeHist.length === 0) {
    // Sesi aktif masih kosong - tidak perlu bikin sesi baru lagi, cukup fokus ke input.
    if (window.innerWidth <= 860) closeSidebar();
    els.text.focus();
    return;
  }
  createSession(true);
  history = store.getSessionHistory(store.activeSessionId);
  renderHistory();
  renderSessionList();
  if (window.innerWidth <= 860) closeSidebar();
  els.text.focus();
});

ensureActiveSession();
let history = store.getSessionHistory(store.activeSessionId);

function getActiveProvider() {
  const providers = store.providers;
  return providers.find((p) => p.id === store.activeProviderId) || null;
}

// ---------- Saklar "Auto" (provider bawaan tanpa API key sendiri) ----------
// Fitur ini numpang di infrastruktur yang sudah ada: config.js -> app.defaultProvider
// (baseUrl publik, mis. Groq) + server.js -> DEFAULT_API_KEY (kunci asli, cuma di .env,
// TIDAK PERNAH dikirim ke browser). Saklar ini cuma UI buat pindah antara provider
// bawaan itu vs provider yang diisi manual oleh user sendiri.
function getDefaultProviderConfig() {
  return (typeof CONFIG !== 'undefined' && CONFIG.app && CONFIG.app.defaultProvider) || null;
}

function findDefaultProvider() {
  return store.providers.find((p) => p.isDefault) || null;
}

// Aktifkan (atau buat kalau belum ada) provider bawaan, jadikan provider aktif,
// lalu cari modelnya di background - dipakai baik saat init (visitor baru)
// maupun saat user nyalain saklar Auto secara manual.
function activateDefaultProvider() {
  const dp = getDefaultProviderConfig();
  if (!dp || !dp.enabled || !dp.baseUrl) return null;

  let provider = findDefaultProvider();
  if (!provider) {
    provider = {
      id: uid(),
      name: dp.name || 'Provider bawaan',
      baseUrl: String(dp.baseUrl).replace(/\/+$/, ''),
      apikey: '',
      isDefault: true
    };
    store.providers = [...store.providers, provider];
  }
  store.activeProviderId = provider.id;

  populateProviderSelect();
  fillFormFromProvider(provider);
  updateHeaderModel();
  syncAutoToggle();

  fetchModels(provider.baseUrl, provider.apikey)
    .then((models) => {
      store.setModels(provider.id, models);
      // Auto SELALU langsung pindah ke AUTO_PROVIDER_PREFERRED_MODEL (kalau
      // memang ada di daftar model provider bawaan ini) begitu berhasil
      // konek - override apa pun model yang kebetulan sudah tersimpan
      // sebelumnya. Ini nutup celah nyata yang kejadian: user kejebak di
      // model lama (allam-2-7b, lalu openai/gpt-oss-20b) yang salah bahasa/
      // tidak bisa baca gambar, walau saklar Auto di-toggle ulang.
      if (models.some((m) => m.id === AUTO_PROVIDER_PREFERRED_MODEL)) {
        store.setModel(provider.id, AUTO_PROVIDER_PREFERRED_MODEL);
      }
      populateModelSelect(models, provider.id);
      setStatus(t('connectSuccess', { count: models.length, name: provider.name }), 'ok');
      setConnIndicator('connected');
    })
    .catch((err) => {
      setStatus(err.message || t('connectDefaultFail'), 'err');
      setConnIndicator('error');
    });

  return provider;
}

// Balik ke mode manual: pindah ke provider lain milik user kalau ada, atau
// kosongkan form + buka Pengaturan biar user bisa isi provider sendiri kalau
// belum punya satu pun selain provider bawaan.
function deactivateDefaultProvider() {
  const others = store.providers.filter((p) => !p.isDefault);
  if (others.length) {
    store.activeProviderId = others[0].id;
    populateProviderSelect();
    fillFormFromProvider(getActiveProvider());
    updateHeaderModel();
  } else {
    store.activeProviderId = '';
    populateProviderSelect();
    fillFormFromProvider(null);
    updateHeaderModel();
    openSettings();
    setStatus(t('autoDisabled'), '');
  }
  syncAutoToggle();
}

// Samakan tampilan saklar dengan kondisi provider aktif saat ini, dan
// sembunyikan saklarnya sama sekali kalau memang tidak ada provider bawaan
// yang dikonfigurasi (config.js -> app.defaultProvider.enabled = false).
function syncAutoToggle() {
  if (!els.autoToggle || !els.autoSwitchWrap) return;
  const dp = getDefaultProviderConfig();
  if (!dp || !dp.enabled || !dp.baseUrl) {
    els.autoSwitchWrap.classList.add('is-hidden');
    return;
  }
  els.autoSwitchWrap.classList.remove('is-hidden');
  const active = getActiveProvider();
  els.autoToggle.checked = !!(active && active.isDefault);
}

if (els.autoToggle) {
  els.autoToggle.addEventListener('change', () => {
    if (els.autoToggle.checked) {
      activateDefaultProvider();
    } else {
      deactivateDefaultProvider();
    }
    if (window.innerWidth <= 860) closeSidebar();
  });
}

function updateHeaderModel() {
  const provider = getActiveProvider();
  const model = provider ? store.getModel(provider.id) : '';
  if (provider && model) {
    els.headerModel.textContent = `${provider.name} · ${model}`;
  } else if (provider) {
    els.headerModel.textContent = provider.name;
  } else {
    els.headerModel.textContent = t('headerNoProvider');
  }
}

function populateProviderSelect() {
  const providers = store.providers;
  els.providerSelect.innerHTML = '';
  providers.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    els.providerSelect.appendChild(opt);
  });
  const newOpt = document.createElement('option');
  newOpt.value = '__new__';
  newOpt.textContent = t('optionNewProvider');
  els.providerSelect.appendChild(newOpt);

  const active = store.activeProviderId;
  if (active && providers.some((p) => p.id === active)) {
    els.providerSelect.value = active;
  } else {
    els.providerSelect.value = '__new__';
  }
}

function updateApiKeyPlaceholder() {
  const baseUrl = els.providerBaseUrl.value.trim();
  els.apikey.placeholder = isDefaultProviderBaseUrl(baseUrl)
    ? 'Kosongkan buat pakai kunci bawaan (gratis, kuota terbatas) - atau isi API key kamu sendiri'
    : 'Tempel API key di sini...';
}
els.providerBaseUrl.addEventListener('input', updateApiKeyPlaceholder);

function fillFormFromProvider(provider) {
  if (!provider) {
    els.providerName.value = '';
    els.providerBaseUrl.value = '';
    els.apikey.value = '';
    els.btnDeleteProvider.style.display = 'none';
    els.btnUpdateModels.style.display = 'none';
    populateModelSelect([]);
    setConnIndicator('idle');
    setStatus('', '');
    updateApiKeyPlaceholder();
    return;
  }
  els.providerName.value = provider.name;
  els.providerBaseUrl.value = provider.baseUrl;
  els.apikey.value = provider.apikey || '';
  els.btnDeleteProvider.style.display = '';
  els.btnUpdateModels.style.display = '';
  const cachedModels = store.getModels(provider.id);
  populateModelSelect(cachedModels, provider.id);
  if (cachedModels.length) {
    setStatus(t('modelsCached', { count: cachedModels.length }), 'ok');
    setConnIndicator('connected');
  } else {
    setStatus('', '');
    setConnIndicator('idle');
  }
}

els.providerSelect.addEventListener('change', () => {
  const val = els.providerSelect.value;
  [...els.presetChips.children].forEach((c) => c.classList.remove('active'));
  if (val === '__new__') {
    store.activeProviderId = '';
    fillFormFromProvider(null);
  } else {
    store.activeProviderId = val;
    fillFormFromProvider(getActiveProvider());
  }
  updateHeaderModel();
  syncAutoToggle();
});

els.btnDeleteProvider.addEventListener('click', () => {
  const provider = getActiveProvider();
  if (!provider) return;
  const providers = store.providers.filter((p) => p.id !== provider.id);
  store.providers = providers;
  localStorage.removeItem(`ai_models_${provider.id}`);
  localStorage.removeItem(`ai_model_${provider.id}`);
  store.activeProviderId = providers.length ? providers[0].id : '';
  populateProviderSelect();
  fillFormFromProvider(getActiveProvider());
  updateHeaderModel();
  syncAutoToggle();
});

// ---------- Deteksi blok kode & fitur salin/unduh ----------

const LANG_EXT = {
  javascript: 'js', js: 'js', jsx: 'jsx', typescript: 'ts', ts: 'ts', tsx: 'tsx',
  python: 'py', py: 'py', html: 'html', css: 'css', json: 'json',
  bash: 'sh', sh: 'sh', shell: 'sh', zsh: 'sh', java: 'java', c: 'c',
  cpp: 'cpp', 'c++': 'cpp', csharp: 'cs', cs: 'cs', php: 'php', ruby: 'rb',
  rb: 'rb', go: 'go', golang: 'go', rust: 'rs', rs: 'rs', sql: 'sql',
  yaml: 'yml', yml: 'yml', markdown: 'md', md: 'md', xml: 'xml', kotlin: 'kt',
  swift: 'swift', dart: 'dart', dockerfile: 'Dockerfile', plaintext: 'txt', text: 'txt',
  env: 'env', dotenv: 'env', ini: 'ini', toml: 'toml'
};

function extForLang(lang) {
  const key = (lang || '').trim().toLowerCase();
  return LANG_EXT[key] || (key || 'txt');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------- Generate PDF: MURNI jsPDF (vector/teks asli), TANPA html2canvas ----------
// Percobaan pertama pakai html2pdf.js (html2canvas + jsPDF): render markdown
// ke elemen offscreen, lalu html2canvas "memotret"-nya jadi gambar buat
// ditempel ke PDF. Ternyata html2canvas TERKENAL tidak reliable buat
// elemen yang diposisikan jauh di luar viewport (position:fixed;
// left:-99999px) - di banyak browser HP, hasilnya kanvas KOSONG (blank page)
// walau di desktop kelihatan baik-baik saja. Ini bug class yang sudah lama
// dilaporkan di banyak proyek yang pakai html2canvas untuk kasus serupa.
//
// Solusinya: jangan screenshot apa pun. Gambar PDF-nya LANGSUNG pakai
// perintah vector jsPDF (doc.text/line/rect) berdasarkan hasil parsing
// markdown sendiri (heading, list, blockquote, hr, tabel dengan garis
// asli, dan bold/italic/code inline). Tidak ada DOM offscreen, tidak ada
// rasterisasi kanvas sama sekali - jadi kelas bug "blank page" itu hilang
// total, dan hasilnya juga teks asli yang bisa di-select/dicari, bukan
// gambar.

function pdfSetFont(doc, run) {
  if (run.code) { doc.setFont('courier', 'normal'); return; }
  if (run.bold && run.italic) { doc.setFont('helvetica', 'bolditalic'); return; }
  if (run.bold) { doc.setFont('helvetica', 'bold'); return; }
  if (run.italic) { doc.setFont('helvetica', 'italic'); return; }
  doc.setFont('helvetica', 'normal');
}

// Pecah satu baris teks jadi potongan {text, bold, italic, code} berdasarkan
// **bold**, _italic_/*italic*, dan `code` - pola sama dengan renderInline()
// yang dipakai di tampilan chat, tapi hasilnya dipakai buat gambar PDF.
function parsePdfInlineRuns(text) {
  const runs = [];
  const re = /\*\*(.+?)\*\*|`(.+?)`|__(.+?)__|_(.+?)_|\*(.+?)\*/;
  let remaining = text;
  let guard = 0;
  while (remaining.length && guard++ < 1000) {
    const m = re.exec(remaining);
    if (!m) { runs.push({ text: remaining, bold: false, italic: false, code: false }); break; }
    if (m.index > 0) runs.push({ text: remaining.slice(0, m.index), bold: false, italic: false, code: false });
    if (m[1] !== undefined) runs.push({ text: m[1], bold: true, italic: false, code: false });
    else if (m[2] !== undefined) runs.push({ text: m[2], bold: false, italic: false, code: true });
    else if (m[3] !== undefined) runs.push({ text: m[3], bold: true, italic: false, code: false });
    else if (m[4] !== undefined) runs.push({ text: m[4], bold: false, italic: true, code: false });
    else if (m[5] !== undefined) runs.push({ text: m[5], bold: false, italic: true, code: false });
    remaining = remaining.slice(m.index + m[0].length);
  }
  return runs;
}

function runsToPdfWords(runs) {
  const words = [];
  runs.forEach((run) => {
    run.text.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      words.push({ text: part, bold: run.bold, italic: run.italic, code: run.code, space: /^\s+$/.test(part) });
    });
  });
  return words;
}

// Gambar satu kumpulan kata dengan word-wrap manual (font berubah per kata
// sesuai bold/italic/code-nya) - return posisi Y setelah baris terakhir.
function drawPdfWrappedWords(doc, words, x, y, maxWidth, fontSize, lineHeight, ensureSpace) {
  doc.setFontSize(fontSize);
  let cx = x;
  let cy = y;
  let lineHasContent = false;
  for (const w of words) {
    if (w.space) {
      if (lineHasContent) { pdfSetFont(doc, w); cx += doc.getTextWidth(' '); }
      continue;
    }
    pdfSetFont(doc, w);
    const wWidth = doc.getTextWidth(w.text);
    if (lineHasContent && cx + wWidth > x + maxWidth) {
      cy += lineHeight;
      cy = ensureSpace(cy, lineHeight);
      cx = x;
      lineHasContent = false;
    }
    pdfSetFont(doc, w);
    doc.text(w.text, cx, cy);
    cx += wWidth;
    lineHasContent = true;
  }
  return cy + lineHeight;
}

const PDF_MARGIN = { left: 48, right: 48, top: 56, bottom: 48 };

// Parser block-level markdown khusus PDF - sengaja terpisah dari
// renderMarkdownInto (yang bikin elemen DOM buat tampilan chat) karena di
// sini yang dihasilkan bukan elemen HTML, tapi koordinat gambar jsPDF.
// Struktur yang dikenali sama: heading #-####, hr ---, blockquote >, list
// -/*/1., tabel |kolom|kolom|, dan paragraf biasa.
function renderMarkdownToPdf(doc, markdown, titleText) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - PDF_MARGIN.left - PDF_MARGIN.right;
  let y = PDF_MARGIN.top;

  function ensureSpace(yPos, need) {
    if (yPos + need > pageHeight - PDF_MARGIN.bottom) {
      doc.addPage();
      return PDF_MARGIN.top;
    }
    return yPos;
  }

  // Cadangan paling aman kalau satu blok (heading/tabel/list/dll) gagal
  // digambar karena markdown-nya aneh/tidak terduga - daripada bikin SELURUH
  // PDF gagal total (user cuma dapat tombol "Gagal"), baris itu digambar
  // sebagai teks polos apa adanya, dan sisanya tetap lanjut normal.
  function safeParagraph(text) {
    try {
      y = ensureSpace(y, 16);
      doc.setTextColor(20, 20, 20);
      const words = runsToPdfWords([{ text: String(text || ''), bold: false, italic: false, code: false }]);
      y = drawPdfWrappedWords(doc, words, PDF_MARGIN.left, y, maxWidth, 10.5, 15, ensureSpace);
      y += 6;
    } catch (err) {
      console.error('[pdf] gagal gambar baris cadangan, dilewati:', err, text);
    }
  }

  doc.setTextColor(20, 20, 20);

  if (titleText) {
    try {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(19);
      doc.splitTextToSize(titleText, maxWidth).forEach((line) => {
        y = ensureSpace(y, 24);
        doc.text(line, PDF_MARGIN.left, y);
        y += 24;
      });
      doc.setDrawColor(60, 60, 60);
      doc.setLineWidth(1.1);
      y += 2;
      doc.line(PDF_MARGIN.left, y, pageWidth - PDF_MARGIN.right, y);
      y += 20;
    } catch (err) {
      console.error('[pdf] gagal gambar judul, dilewati:', err);
    }
  }

  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  let paraBuf = [];

  function flushPara() {
    if (!paraBuf.length) return;
    const text = paraBuf.join(' ');
    paraBuf = [];
    try {
      y = ensureSpace(y, 16);
      const words = runsToPdfWords(parsePdfInlineRuns(text));
      y = drawPdfWrappedWords(doc, words, PDF_MARGIN.left, y, maxWidth, 10.5, 15, ensureSpace);
      y += 6;
    } catch (err) {
      console.error('[pdf] gagal gambar paragraf, fallback ke teks polos:', err, text);
      safeParagraph(text);
    }
  }

  while (i < lines.length) {
    const startI = i; // dipakai buat deteksi "macet di baris yang sama" kalau sebuah blok error sebelum sempat maju i
    try {
      const trimmed = lines[i].trim();

      if (!trimmed) { flushPara(); i++; continue; }

      const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
      if (heading) {
        flushPara();
        const level = Math.min(heading[1].length, 4);
        const sizes = { 1: 18, 2: 15.5, 3: 13, 4: 11.5 };
        const size = sizes[level];
        const words = runsToPdfWords(parsePdfInlineRuns(heading[2]));
        y = ensureSpace(y, size + 12);
        y += 4;
        y = drawPdfWrappedWords(doc, words.map((w) => ({ ...w, bold: true })), PDF_MARGIN.left, y, maxWidth, size, size + 3, ensureSpace);
        y += 4;
        i++;
        continue;
      }

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        flushPara();
        y = ensureSpace(y, 14);
        y += 6;
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.7);
        doc.line(PDF_MARGIN.left, y, pageWidth - PDF_MARGIN.right, y);
        y += 12;
        i++;
        continue;
      }

      if (/^>\s?/.test(trimmed)) {
        flushPara();
        const quoteLines = [];
        while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        const qx = PDF_MARGIN.left + 14;
        const qMaxWidth = maxWidth - 14;
        const startY = y = ensureSpace(y, 16);
        doc.setTextColor(90, 90, 90);
        const words = runsToPdfWords(parsePdfInlineRuns(quoteLines.join(' ')));
        const afterY = drawPdfWrappedWords(doc, words, qx, y, qMaxWidth, 10.5, 15, ensureSpace);
        doc.setDrawColor(160, 160, 160);
        doc.setLineWidth(2);
        doc.line(PDF_MARGIN.left + 4, startY - 9, PDF_MARGIN.left + 4, afterY - 10);
        doc.setTextColor(20, 20, 20);
        y = afterY + 6;
        continue;
      }

      const ul = /^[-*+]\s+(.*)$/.exec(trimmed);
      const ol = /^(\d+)[.)]\s+(.*)$/.exec(trimmed);
      if (ul || ol) {
        flushPara();
        const marker = ul ? '\u2022' : `${ol[1]}.`;
        const text = ul ? ul[1] : ol[2];
        const indent = 16;
        y = ensureSpace(y, 15);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.text(marker, PDF_MARGIN.left, y);
        const words = runsToPdfWords(parsePdfInlineRuns(text));
        y = drawPdfWrappedWords(doc, words, PDF_MARGIN.left + indent, y, maxWidth - indent, 10.5, 15, ensureSpace);
        y += 2;
        i++;
        continue;
      }

      // Tabel markdown: baris "|a|b|" diikuti baris pemisah "|---|---|"
      if (/^\|.*\|\s*$/.test(trimmed) && i + 1 < lines.length && /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[i + 1].trim())) {
        flushPara();
        const splitRow = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
        const headerCells = splitRow(trimmed);
        let tableEndI = i + 2;
        const bodyRows = [];
        while (tableEndI < lines.length && /^\|.*\|\s*$/.test(lines[tableEndI].trim())) {
          bodyRows.push(splitRow(lines[tableEndI]));
          tableEndI++;
        }
        const colCount = Math.max(1, headerCells.length);
        const cellPad = 5;
        // Kalau kolomnya kebanyakan sampai lebar per kolom jadi terlalu
        // sempit buat splitTextToSize (bisa bikin loop kelamaan/aneh di
        // jsPDF), jangan dipaksa jadi tabel - fallback ke baris teks biasa
        // per baris tabel (tetap kebaca, tidak elegan tapi tidak macet).
        const colWidth = maxWidth / colCount;
        if (colWidth - cellPad * 2 < 24) {
          throw new Error(`tabel ${colCount} kolom terlalu sempit buat dirender (colWidth=${colWidth.toFixed(1)}pt)`);
        }
        const fontSize = 9.5;
        const lineH = fontSize + 3.2;
        doc.setFontSize(fontSize);

        const cellLines = (txt) => doc.splitTextToSize(String(txt ?? ''), colWidth - cellPad * 2);

        const drawRow = (cells, isHeader) => {
          const wrapped = cells.map((c) => cellLines(c));
          const rowLineCount = Math.max(1, ...wrapped.map((w) => w.length));
          const rowHeight = rowLineCount * lineH + cellPad * 2 - 2;
          y = ensureSpace(y, rowHeight);
          if (isHeader) {
            doc.setFillColor(232, 232, 232);
            doc.rect(PDF_MARGIN.left, y, maxWidth, rowHeight, 'F');
          }
          doc.setDrawColor(150, 150, 150);
          doc.setLineWidth(0.6);
          for (let c = 0; c <= colCount; c++) {
            const lx = PDF_MARGIN.left + c * colWidth;
            doc.line(lx, y, lx, y + rowHeight);
          }
          doc.line(PDF_MARGIN.left, y, PDF_MARGIN.left + maxWidth, y);
          doc.line(PDF_MARGIN.left, y + rowHeight, PDF_MARGIN.left + maxWidth, y + rowHeight);
          doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
          wrapped.forEach((cellLinesArr, ci) => {
            const cx = PDF_MARGIN.left + ci * colWidth + cellPad;
            let cy = y + cellPad + fontSize * 0.8;
            cellLinesArr.forEach((ln) => { doc.text(ln, cx, cy); cy += lineH; });
          });
          y += rowHeight;
        };

        drawRow(headerCells, true);
        bodyRows.forEach((row) => drawRow(row, false));
        y += 10;
        i = tableEndI;
        continue;
      }

      paraBuf.push(trimmed);
      i++;
    } catch (err) {
      // Satu blok gagal digambar (mis. tabel terlalu sempit, format tidak
      // terduga) - jangan gagalkan SELURUH PDF. Log ke console buat
      // debugging, gambar baris ini sebagai teks polos, lalu tetap lanjut
      // ke baris berikutnya.
      console.error('[pdf] gagal render blok markdown, fallback ke teks polos:', err, lines[startI]);
      safeParagraph(lines[startI]);
      i = startI + 1;
    }
  }
  flushPara();
}

// Cadangan PALING dasar - dijamin tidak pernah throw (tidak ada parsing
// markdown, tidak ada tabel, cuma teks polos dibungkus baris demi baris).
// Dipakai kalau renderMarkdownToPdf entah kenapa masih gagal juga di luar
// semua try/catch di dalamnya, biar user tetap dapat PDF yang isinya
// lengkap (walau tanpa styling), bukan tombol "Gagal" doang.
function renderPlainTextToPdf(doc, markdown, titleText) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - PDF_MARGIN.left - PDF_MARGIN.right;
  let y = PDF_MARGIN.top;
  doc.setTextColor(20, 20, 20);
  if (titleText) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(String(titleText), PDF_MARGIN.left, y);
    y += 26;
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  const rawLines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
  rawLines.forEach((raw) => {
    doc.splitTextToSize(raw || ' ', maxWidth).forEach((line) => {
      if (y + 14 > pageHeight - PDF_MARGIN.bottom) { doc.addPage(); y = PDF_MARGIN.top; }
      doc.text(line, PDF_MARGIN.left, y);
      y += 14;
    });
  });
}

async function generateStyledPdfBlob(markdownContent, titleText) {
  const ready = await ensureJsPdfReady();
  if (!ready) throw new Error(t('pdfLibNotReady'));
  try {
    const doc = new jspdf.jsPDF({ unit: 'pt', format: 'a4' });
    renderMarkdownToPdf(doc, markdownContent, titleText);
    return doc.output('blob');
  } catch (err) {
    console.error('[pdf] renderer utama gagal total, pakai cadangan teks polos:', err);
    const doc2 = new jspdf.jsPDF({ unit: 'pt', format: 'a4' });
    renderPlainTextToPdf(doc2, markdownContent, titleText);
    return doc2.output('blob');
  }
}

function flashButtonLabel(btn, tempLabel, tempClass) {
  const original = btn.dataset.label;
  const iconEl = btn.querySelector('.btn-label');
  if (tempClass) btn.classList.add(tempClass);
  if (iconEl) iconEl.textContent = tempLabel;
  setTimeout(() => {
    if (tempClass) btn.classList.remove(tempClass);
    if (iconEl) iconEl.textContent = original;
  }, 1400);
}

function looksLikeCode(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length < 4) return false;
  const codeLineRe = /[{};]\s*$|^([.#][\w-]+.*\{)|^(function|const|let|var|class|import|export|def |public |private |if\s*\(|for\s*\(|while\s*\(|return |@media|<\/?[a-zA-Z][\w-]*[\s>])/;
  const hits = lines.filter((l) => codeLineRe.test(l)).length;
  return hits / lines.length >= 0.5;
}

function guessLangFromCode(text) {
  if (/<\/?(html|div|span|body|head|section|button)[\s>]/i.test(text)) return 'html';
  if (/[.#][\w-]+\s*\{[\s\S]*:[\s\S]*;/.test(text)) return 'css';
  if (/\b(function|const|let|=>|document\.|console\.)/.test(text)) return 'javascript';
  if (/\b(def |import |print\()/.test(text)) return 'python';
  return '';
}

function parseContentToBlocks(content) {
  // Info-string setelah ``` ditangkap UTUH sampai baris baru (bukan cuma karakter
  // \w+- seperti sebelumnya) - supaya kalau bot menulis nama file lengkap sebagai
  // penanda bahasa (mis. ```package.json``` alih-alih ```json```), titik di
  // "package.json" tidak bikin regex berhenti di tengah dan sisa ".json"-nya
  // ikut "bocor" jadi awalan isi kode (file yang diunduh jadi rusak).
  const regex = /```([^\n`]*)\n?([\s\S]*?)```/g;
  const blocks = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    }
    const { lang, fenceHint } = parseFenceInfo(match[1]);
    blocks.push({ type: 'code', lang, fenceHint, content: match[2].replace(/\n$/, '') });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    blocks.push({ type: 'text', content: content.slice(lastIndex) });
  }

  // Jaga-jaga: kalau model sama sekali tidak pakai pagar ``` tapi isinya
  // jelas-jelas kode (mis. model kecil yang tidak nurut instruksi), tetap
  // perlakukan sebagai blok kode, bukan teks biasa.
  if (blocks.length === 1 && blocks[0].type === 'text') {
    const trimmed = blocks[0].content.trim();
    if (trimmed && looksLikeCode(trimmed)) {
      return [{ type: 'code', lang: guessLangFromCode(trimmed), content: trimmed }];
    }
  }

  return blocks;
}

// Info-string tepat setelah ``` bisa berupa nama bahasa biasa ("json", "js") ATAU
// nama file lengkap yang ditulis bot sebagai penanda ("package.json", "data/truths.json",
// ".env"). Kalau tokennya sendiri terlihat seperti nama file (ada ekstensi dikenal),
// pakai itu LANGSUNG sebagai petunjuk nama file (lebih pasti daripada nebak dari teks
// di atasnya) - bukan dipotong jadi "package" lalu isi kodenya kebocoran ".json".
function parseFenceInfo(raw) {
  const trimmed = (raw || '').trim();
  if (!trimmed) return { lang: '', fenceHint: null };
  const firstToken = cleanPathToken(trimmed.split(/\s+/)[0]);
  if (firstToken.includes('.') && isFilePathToken(firstToken) && hasKnownExt(firstToken)) {
    const ext = fileExtOf(firstToken);
    return { lang: ext, fenceHint: firstToken };
  }
  // Bukan nama file - perlakukan seperti sebelumnya: cuma token kata pertama yang dipakai.
  const langMatch = /^[\w+-]*/.exec(trimmed);
  return { lang: langMatch ? langMatch[0] : '', fenceHint: null };
}

function countLines(code) {
  if (!code) return 0;
  return code.split('\n').length;
}

// ---------- Nama file: petunjuk dari teks, struktur folder, dan isi kode ----------
//
// Nama file kartu/zip ditentukan berurutan dari sumber paling akurat:
//   1. Baris teks TEPAT sebelum blok kode ("data/truths.json", "**.env**", dst) -
//      path folder ikut dipertahankan, bukan cuma nama dasarnya.
//   2. Struktur folder (blok tree ├── └──) yang ditulis bot di pesan yang sama:
//      nama pendek ("truths.json") dicocokkan ke path lengkapnya ("data/truths.json"),
//      dan blok tanpa label sama sekali diisi berurutan dari daftar file di tree.
//   3. Isi kodenya (package.json, tsconfig.json, server.js).
//   4. Nama generik per-bahasa (data.json, script.js) - pilihan TERAKHIR.

// Kata yang kebetulan berpola "nama.ekstensi" tapi bukan nama file.
const NOT_FILE_WORDS = new Set([
  'node.js', 'next.js', 'nuxt.js', 'vue.js', 'react.js', 'express.js', 'nest.js',
  'three.js', 'd3.js', 'chart.js', 'alpine.js', 'ember.js', 'backbone.js',
  'discord.js', 'socket.io', 'deno.js', 'bun.js'
]);
const KNOWN_BARE_FILENAMES = new Set([
  'Dockerfile', 'Procfile', 'Makefile', 'Jenkinsfile', 'Gemfile', 'Caddyfile', 'Vagrantfile'
]);
const KNOWN_FILENAME_EXTS = new Set([
  'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'jsonc', 'html', 'htm', 'css', 'scss', 'sass', 'less',
  'py', 'sh', 'bat', 'ps1', 'yml', 'yaml', 'xml', 'sql', 'md', 'php', 'java', 'c', 'cpp', 'cs', 'rb',
  'go', 'rs', 'kt', 'swift', 'dart', 'lua', 'txt', 'csv', 'tsv', 'log', 'env', 'lock', 'toml', 'ini',
  'cfg', 'conf', 'properties', 'gradle', 'svg', 'vue', 'svelte', 'ejs', 'pug', 'hbs', 'prisma',
  'graphql', 'gql', 'gitignore', 'dockerignore', 'example', 'sample',
  // Dokumen (lihat DOCUMENT_EXT/BINARY_EXT di bagian upload file) - sempat
  // kelewat ditambahkan ke sini waktu fitur PDF/DOCX/XLSX ditambahkan,
  // padahal dipakai juga di sisi SEBALIKNYA (ngenalin nama file yang AI
  // tulis di balasannya, bukan cuma file yang diupload user).
  'pdf', 'docx', 'xlsx', 'xls'
]);

// nama.ext (boleh banyak titik: next.config.js, docker-compose.yml) atau dotfile (.env, .gitignore, .env.example)
const FILE_BASENAME_RE = /^(?:[\w-]+(?:\.[\w-]+)*\.[A-Za-z][A-Za-z0-9]{0,9}|\.[A-Za-z][\w-]*(?:\.[\w-]+)*)$/;
const DOMAIN_LIKE_RE = /^[\w-]+\.(?:com|net|org|io|me|id|dev|app|co|ai|xyz|gg|tv|ly)$/i;

function cleanPathToken(tok) {
  return (tok || '')
    .replace(/^[\s`"'“”‘’*(\[<]+/, '')
    .replace(/[\s`"'“”‘’*)\]>:,;!?]+$/, '')
    .replace(/(\w)\.+$/, '$1')
    .replace(/^\.\//, '');
}

function baseName(path) {
  return String(path || '').split('/').pop();
}

// Ekstensi "logis" sebuah file: ".env" -> "env", "data/truths.json" -> "json"
function fileExtOf(path) {
  const base = baseName(path);
  if (base.startsWith('.') && base.indexOf('.', 1) === -1) return base.slice(1).toLowerCase();
  const dot = base.lastIndexOf('.');
  return dot === -1 ? '' : base.slice(dot + 1).toLowerCase();
}

function normExt(ext) {
  const e = (ext || '').toLowerCase();
  if (e === 'yaml') return 'yml';
  if (e === 'htm') return 'html';
  if (e === 'markdown') return 'md';
  return e;
}

// Apakah token ini terlihat seperti path/nama file (boleh ada folder: data/truths.json)?
function isFilePathToken(tok) {
  if (!tok || tok.length > 80) return false;
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(tok) || tok.startsWith('/')) return false;
  const segs = tok.split('/');
  if (segs.some((s) => !s || s === '.' || s === '..' || !/^[\w@.-]+$/.test(s))) return false;
  if (segs.length > 1 && DOMAIN_LIKE_RE.test(segs[0])) return false;
  const base = segs[segs.length - 1];
  if (NOT_FILE_WORDS.has(base.toLowerCase())) return false;
  return FILE_BASENAME_RE.test(base) || KNOWN_BARE_FILENAMES.has(base);
}

function hasKnownExt(tok) {
  const base = baseName(tok);
  return KNOWN_BARE_FILENAMES.has(base) || base.startsWith('.') || KNOWN_FILENAME_EXTS.has(fileExtOf(base));
}

// Ambil petunjuk nama file dari baris terakhir teks TEPAT sebelum blok kode,
// misal "index.js", "### data/truths.json", "**package.json**", ".env (isi token dari @BotFather)".
function filenameHintFromText(text) {
  if (!text) return null;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let last = lines[lines.length - 1];
  if (!last) return null;
  // label lampiran zip: "arsip.zip » public/app.js" -> ambil sesudah »
  if (last.includes('»')) last = last.slice(last.lastIndexOf('»') + 1).trim();

  // Tahap 1: baris diawali nama file, sisanya cuma keterangan (kurung/strip/komentar) atau kosong.
  const stripped = last
    .replace(/^#{1,6}\s*/, '')
    .replace(/^[-*+]\s+/, '')
    .replace(/^\d+[.)]\s+/, '')
    .replace(/^(?:file|berkas)\s*:\s*/i, '');
  const m = stripped.match(/^(\S+)(\s*(?:[(\[]|[-–—#:]|\/\/).*)?$/);
  if (m) {
    const tok = cleanPathToken(m[1]);
    if (isFilePathToken(tok)) return tok;
  }

  // Tahap 2: cari token nama-file di dalam kalimat ("Berikut file src/server.js:").
  // Ambil kandidat TERAKHIR yang ekstensinya dikenal, supaya kata seperti "e.g" / "v2.0" tidak salah tangkap.
  const cands = last.split(/\s+/).map(cleanPathToken).filter((t) => isFilePathToken(t) && hasKnownExt(t));
  return cands.length ? cands[cands.length - 1] : null;
}

// ---------- Struktur folder (tree ├── └──) ----------
const TREE_LINE_RE = /^([\s│┃|]*)(├──|└──|├─|└─|\|--|\+--|`--|\\--)\s*(.+)$/;

// Kembalikan { files: [path relatif root], root } kalau blok ini memang diagram folder, selain itu null.
function parseTreeBlock(lang, code) {
  const key = (lang || '').trim().toLowerCase();
  if (!code || !(PLAIN_TEXT_LANGS.has(key) || key === 'tree')) return null;
  const lines = code.split('\n').filter((l) => l.trim());
  const treeLines = lines.filter((l) => TREE_LINE_RE.test(l));
  if (treeLines.length < 2 || treeLines.length / lines.length < 0.6) return null;

  let root = null;
  const first = lines[0].trim();
  if (!TREE_LINE_RE.test(lines[0]) && /\/$/.test(first) && !/\s/.test(first)) root = first.replace(/\/$/, '');

  const entries = [];
  const stack = [];
  lines.forEach((line) => {
    const mm = line.match(TREE_LINE_RE);
    if (!mm) return;
    const col = mm[1].length;
    const name = cleanPathToken(mm[3].trim().split(/\s+/)[0]).replace(/^#.*$/, '');
    if (!name) return;
    while (stack.length && stack[stack.length - 1].col >= col) stack.pop();
    const parent = stack.length ? stack[stack.length - 1].path : '';
    const isDir = name.endsWith('/');
    const clean = name.replace(/\/+$/, '');
    const path = parent ? `${parent}/${clean}` : clean;
    stack.push({ col, path });
    entries.push({ path, isDir });
  });

  const files = entries
    .filter((e) => !e.isDir && !entries.some((o) => o.path.startsWith(e.path + '/')) && isFilePathToken(e.path))
    .map((e) => e.path);
  // Folder yang disebut di diagram tapi ternyata tidak diisi file apa pun (mis. "logs/" kosong)
  // tetap ikut dibuat di zip, supaya strukturnya persis sama dengan yang digambar bot.
  const dirs = entries
    .filter((e) => e.isDir)
    .map((e) => e.path)
    .filter((d) => !files.some((f) => f === d || f.startsWith(d + '/')));
  return files.length ? { files, dirs, root } : null;
}

// Cocokkan nama dari teks ke path lengkap di struktur folder:
// "truths.json" -> "data/truths.json", "proyek-bot/index.js" -> "index.js".
function canonicalizePath(name, tree) {
  if (!name || !tree || !tree.files.length) return name;
  let p = name;
  const segs = p.split('/');
  if (segs.length > 1 && tree.roots.has(segs[0])) p = segs.slice(1).join('/');
  const lc = p.toLowerCase();
  const exact = tree.files.find((f) => f.toLowerCase() === lc);
  if (exact) return exact;
  const matches = p.includes('/')
    ? tree.files.filter((f) => f.toLowerCase().endsWith('/' + lc))
    : tree.files.filter((f) => baseName(f).toLowerCase() === lc);
  return matches.length === 1 ? matches[0] : p;
}

// Deteksi nama file "konvensional" dari ISI kodenya sendiri, dipakai sebagai
// fallback sebelum jatuh ke nama generik per-bahasa (mis. "data.json").
// Ini yang bikin package.json/tsconfig.json/dll ke-generate dengan nama
// aslinya (file "utama") alih-alih nama acak seperti "data.json"/"script.js".
function sniffFilenameFromContent(lang, code) {
  const key = (lang || '').trim().toLowerCase();
  if (!code) return null;

  if (key === 'json') {
    let obj;
    try {
      obj = JSON.parse(code);
    } catch {
      return null;
    }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
    if (obj.lockfileVersion !== undefined) return 'package-lock.json';
    if (obj.compilerOptions) return 'tsconfig.json';
    if (obj.name && (obj.dependencies || obj.devDependencies || obj.scripts || obj.main || obj.version)) {
      return 'package.json';
    }
    if (obj.$schema && /eslint/i.test(String(obj.$schema))) return '.eslintrc.json';
    if (obj.compilerOptions === undefined && obj.presets) return '.babelrc';
    return null;
  }

  if (key === 'javascript' || key === 'js') {
    // Entry point server umum (express/koa/fastify + listen) -> server.js,
    // bukan "script.js" generik.
    if (/\b(express|koa|fastify)\s*\(/.test(code) && /\.listen\s*\(/.test(code)) return 'server.js';
  }

  return null;
}

// Kalau tidak ada petunjuk nama sama sekali, pakai nama konvensional yang
// wajar per bahasa (index.html, style.css, dst) - bukan "snippet-1.ext".
const DEFAULT_FILENAME_BY_LANG = {
  html: 'index.html', htm: 'index.html', css: 'style.css',
  javascript: 'script.js', js: 'script.js', jsx: 'App.jsx', tsx: 'App.tsx',
  typescript: 'script.ts', ts: 'script.ts', json: 'data.json',
  python: 'main.py', py: 'main.py', bash: 'run.sh', sh: 'run.sh', shell: 'run.sh', zsh: 'run.sh',
  yaml: 'config.yaml', yml: 'config.yaml', xml: 'data.xml', sql: 'query.sql',
  markdown: 'README.md', md: 'README.md', php: 'index.php', java: 'Main.java',
  c: 'main.c', cpp: 'main.cpp', csharp: 'Program.cs', ruby: 'main.rb', rb: 'main.rb',
  go: 'main.go', rust: 'main.rs', rs: 'main.rs', dockerfile: 'Dockerfile',
  env: '.env', dotenv: '.env', ini: 'config.ini', toml: 'config.toml',
  text: 'notes.txt', plaintext: 'notes.txt'
};

function defaultFilenameForLang(lang) {
  const key = (lang || '').trim().toLowerCase();
  if (DEFAULT_FILENAME_BY_LANG[key]) return DEFAULT_FILENAME_BY_LANG[key];
  const ext = extForLang(lang);
  return ext === 'Dockerfile' ? 'Dockerfile' : `file.${ext}`;
}

// Resolusi nama final untuk sekumpulan blok kode dalam satu pesan:
// hint teks -> isi kode -> file yang belum terpakai di struktur folder (urut, cocok ekstensi)
// -> nama generik per-bahasa. Penomoran dipakai kalau ada nama yang bentrok.
function resolveFilenames(items, tree) {
  const treeFiles = (tree && tree.files) || [];
  const names = items.map(({ lang, hint, content }) => {
    const n = hint || sniffFilenameFromContent(lang, content) || null;
    return n ? canonicalizePath(n, tree) : null;
  });

  const claimed = new Set(names.filter(Boolean).map((n) => n.toLowerCase()));
  items.forEach(({ lang }, i) => {
    if (names[i] || !treeFiles.length) return;
    const want = normExt(extForLang(lang));
    const cand = treeFiles.find((f) => !claimed.has(f.toLowerCase()) && normExt(fileExtOf(f)) === want);
    if (cand) {
      names[i] = cand;
      claimed.add(cand.toLowerCase());
    }
  });

  const used = new Set();
  return items.map(({ lang }, i) => {
    const base = names[i] || deriveDocFilename(lang, items[i].content) || defaultFilenameForLang(lang);
    let name = base;
    if (used.has(name)) {
      const slash = base.lastIndexOf('/') + 1;
      const dot = base.lastIndexOf('.');
      const hasExt = dot > slash;
      const stem = hasExt ? base.slice(0, dot) : base;
      const ext2 = hasExt ? base.slice(dot) : '';
      let n = 2;
      while (used.has(`${stem}-${n}${ext2}`)) n += 1;
      name = `${stem}-${n}${ext2}`;
    }
    used.add(name);
    return name;
  });
}


// ---------- Nama file dokumen otomatis sesuai konteks ----------
// Untuk file dokumen (pdf, md, txt, docx...) yang tidak diberi nama oleh AI,
// jangan pakai "file.pdf" generik. Urutan sumber nama:
//   1) judul (heading #) pertama di dalam isi dokumennya,
//   2) topik dari permintaan user ("buatin pdf tentang asal usul Indonesia"),
//   3) baru nama generik per-bahasa.
let lastUserPrompt = '';
const DOC_LANGS = new Set(['pdf', 'md', 'markdown', 'txt', 'text', 'plaintext', 'doc', 'docx', 'rtf']);

function cleanTitleForFilename(raw) {
  let t = String(raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`~#>\[\]()]/g, ' ')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, ' ')
    .replace(/[\\/:"<>|?\x00-\x1f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(judul|title)\s*:\s*/i, '')
    .replace(/[.\s-]+$/g, '');
  if (t.length > 60) {
    t = t.slice(0, 60);
    const sp = t.lastIndexOf(' ');
    if (sp > 25) t = t.slice(0, sp);
  }
  if (t.length < 3) return '';
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function topicFromPrompt(prompt) {
  let p = String(prompt || '').replace(/\s+/g, ' ').trim();
  if (!p) return '';
  const m = p.match(/\b(?:tentang|mengenai|seputar|soal|perihal|about|regarding|on)\s+(.+)$/i);
  if (m) p = m[1];
  else {
    p = p
      .replace(/^(tolong|please|coba|dong|bisa|kamu)\s+/gi, '')
      .replace(/^(buat(?:in|kan)?|bikin(?:in|kan)?|generate|create|make|tulis(?:kan)?|write)\s+/i, '')
      .replace(/^(sebuah|satu|a|an)\s+/i, '')
      .replace(/^(file|berkas|dokumen|document)\s+/i, '')
      .replace(/^(pdf|docx|word|txt|markdown|md)\s+/i, '');
  }
  p = p.replace(/\b(dong|ya|yaa|donk|please|tolong)\s*[.!?]*$/i, '');
  if (/^(pdf|docx?|word|txt|md|markdown|file|berkas|dokumen|document)$/i.test(p.trim())) return '';
  return cleanTitleForFilename(p);
}

function deriveDocFilename(lang, content) {
  const key = (lang || '').trim().toLowerCase();
  if (!DOC_LANGS.has(key)) return null;
  const heading = String(content || '').match(/^\s{0,3}#{1,3}\s+(.+?)\s*#*\s*$/m);
  const topic = topicFromPrompt(lastUserPrompt);
  let title = '';
  if (heading) {
    // Buang sub-judul: "Asal Usul Jawa: Sejarah dan Budaya" / "... - Sejarah" / "... (Edisi 2)"
    const main = heading[1]
      .replace(/\s*\([^)]*\)\s*$/, '')
      .split(/\s*[:|]\s*|\s+[-\u2013\u2014]\s+/)
      .map((x) => x.trim())
      .find((x) => x.replace(/[*_`#]/g, '').trim().length >= 3);
    title = cleanTitleForFilename(main || heading[1]);
    // Kalau judul diawali topik yang user minta ("asal usul jawa"), pakai topik itu saja.
    if (title && topic && title.length > topic.length && title.toLowerCase().startsWith(topic.toLowerCase())) {
      title = title.slice(0, topic.length);
    }
  }
  if (!title) title = topic;
  if (!title) return null;
  return `${title}.${extForLang(lang)}`;
}

function slugify(s) {
  return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '').slice(0, 40);
}

function timestampSlug() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// Nama zip yang unik tiap kali diunduh (biar browser tidak nanya "download
// lagi?" karena nama filenya selalu sama), dan menyesuaikan tema project
// kalau ada <title> di salah satu blok HTML-nya.
function guessZipName(items) {
  const htmlBlock = items.find((b) => ['html', 'htm'].includes((b.lang || '').toLowerCase()));
  if (htmlBlock) {
    const m = /<title>([^<]+)<\/title>/i.exec(htmlBlock.content);
    const slug = m && m[1] ? slugify(m[1]) : '';
    if (slug) return `${slug}-${timestampSlug()}.zip`;
  }
  return `project-${timestampSlug()}.zip`;
}

function buildCodeBlock(lang, code, filename, onPreview) {
  const wrap = document.createElement('div');
  wrap.className = 'code-block collapsed';

  const header = document.createElement('div');
  header.className = 'code-block-header';
  header.setAttribute('role', 'button');
  header.setAttribute('tabindex', '0');
  header.setAttribute('aria-expanded', 'false');

  const summary = document.createElement('div');
  summary.className = 'code-summary';
  summary.innerHTML = `
    <span class="code-file-icon" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none"><path d="M5 2.5h6.5L15.5 6.5V17a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M11.5 2.5V6.5H15.5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
    </span>`;
  const nameEl = document.createElement('span');
  nameEl.className = 'code-filename';
  nameEl.textContent = filename;
  const metaEl = document.createElement('span');
  metaEl.className = 'code-meta';
  metaEl.textContent = (lang ? lang + ' · ' : '') + t('linesCount', { count: countLines(code) });
  const textEl = document.createElement('div');
  textEl.className = 'code-text';
  textEl.appendChild(nameEl);
  textEl.appendChild(metaEl);
  summary.appendChild(textEl);

  const right = document.createElement('div');
  right.className = 'code-header-right';

  const actions = document.createElement('div');
  actions.className = 'code-actions';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'code-btn';
  copyBtn.dataset.label = t('copyButton');
  copyBtn.innerHTML = `<span class="btn-label">${t('copyButton')}</span>`;
  copyBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      ta.remove();
    }
    flashButtonLabel(copyBtn, t('copiedFeedback'), 'ok');
  });

  const dlBtn = document.createElement('button');
  dlBtn.type = 'button';
  dlBtn.className = 'code-btn';
  dlBtn.dataset.label = t('downloadButton');
  dlBtn.innerHTML = `<span class="btn-label">${t('downloadButton')}</span>`;
  dlBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    // Browser mengganti "/" pada nama unduhan jadi "_" - pakai nama dasar saja;
    // struktur folder tetap utuh di hasil unduh .zip.
    const bname = baseName(filename);
    if (fileExtOf(filename).toLowerCase() === 'pdf') {
      // File .pdf TIDAK bisa cuma "teks disimpan dengan nama .pdf" (itu
      // yang bikin sebelumnya "tidak dapat membuka file PDF" - isinya
      // sebenarnya bukan PDF sama sekali). Render dulu jadi HTML bertema
      // dokumen (font, heading, tabel bergaris), baru dibungkus jadi PDF
      // asli lewat html2pdf.js - lihat generateStyledPdfBlob().
      const iconEl = dlBtn.querySelector('.btn-label');
      const original = dlBtn.dataset.label;
      dlBtn.disabled = true;
      if (iconEl) iconEl.textContent = t('pdfGenerating');
      try {
        // titleText sengaja TIDAK diisi lagi (dulu diisi nama file, mis.
        // "file.pdf" -> judul besar "file" di paling atas PDF) - isi
        // markdown-nya sendiri biasanya sudah punya judul/heading, jadi
        // judul otomatis dari nama file itu cuma jadi baris nyampah di atas.
        const blob = await generateStyledPdfBlob(code);
        downloadBlob(blob, bname);
        flashButtonLabel(dlBtn, t('downloadedFeedback'), 'ok');
      } catch (err) {
        console.error('[pdf] gagal generate PDF (tombol unduh satuan):', err);
        // alert() sengaja dipakai (bukan cuma console.error) supaya pesan
        // error ASLINYA kebaca langsung tanpa perlu buka DevTools - banyak
        // user app ini pakai HP tanpa akses komputer/DevTools sama sekali.
        alert('Gagal membuat PDF:\n\n' + (err?.message || String(err)));
        if (iconEl) iconEl.textContent = original;
        flashButtonLabel(dlBtn, t('pdfGenerateError'), 'err');
      } finally {
        dlBtn.disabled = false;
      }
      return;
    }
    downloadBlob(new Blob([code], { type: 'text/plain;charset=utf-8' }), bname);
    flashButtonLabel(dlBtn, t('downloadedFeedback'), 'ok');
  });

  if (typeof onPreview === 'function') {
    const pvBtn = document.createElement('button');
    pvBtn.type = 'button';
    pvBtn.className = 'code-btn code-btn-preview';
    pvBtn.innerHTML = `<svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M6 4l10 6-10 6z"/></svg><span class="btn-label">${t('previewButton')}</span>`;
    pvBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onPreview(filename);
    });
    actions.appendChild(copyBtn);
    actions.appendChild(pvBtn);
    actions.appendChild(dlBtn);
  } else {
    actions.appendChild(copyBtn);
    actions.appendChild(dlBtn);
  }

  const chevron = document.createElement('span');
  chevron.className = 'code-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.innerHTML = '<svg viewBox="0 0 20 20" fill="none"><path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  right.appendChild(actions);
  right.appendChild(chevron);

  header.appendChild(summary);
  header.appendChild(right);

  function toggle() {
    const nowCollapsed = !wrap.classList.contains('collapsed');
    wrap.classList.toggle('collapsed', nowCollapsed);
    header.setAttribute('aria-expanded', String(!nowCollapsed));
  }

  header.addEventListener('click', toggle);
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });

  const body = document.createElement('div');
  body.className = 'code-block-body';
  const pre = document.createElement('pre');
  const codeEl = document.createElement('code');
  codeEl.textContent = code;
  pre.appendChild(codeEl);
  body.appendChild(pre);

  wrap.appendChild(header);
  wrap.appendChild(body);
  return wrap;
}

// ---------- Markdown ringan untuk teks balasan bot (heading, bold, list, dll) ----------

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInline(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return s;
}

function renderMarkdownInto(container, text) {
  const lines = text.split('\n');
  let i = 0;
  let para = [];

  function flushPara() {
    if (para.length) {
      const p = document.createElement('p');
      p.innerHTML = renderInline(para.join(' ').trim());
      container.appendChild(p);
      para = [];
    }
  }

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (trimmed === '') { flushPara(); i++; continue; }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushPara();
      container.appendChild(document.createElement('hr'));
      i++; continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushPara();
      const level = Math.min(heading[1].length, 4);
      const h = document.createElement('h' + level);
      h.innerHTML = renderInline(heading[2]);
      container.appendChild(h);
      i++; continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushPara();
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const bq = document.createElement('blockquote');
      bq.innerHTML = renderInline(quoteLines.join(' '));
      container.appendChild(bq);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushPara();
      const ul = document.createElement('ul');
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        const li = document.createElement('li');
        li.innerHTML = renderInline(lines[i].trim().replace(/^[-*]\s+/, ''));
        ul.appendChild(li);
        i++;
      }
      container.appendChild(ul);
      continue;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      flushPara();
      const ol = document.createElement('ol');
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        const li = document.createElement('li');
        li.innerHTML = renderInline(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
        ol.appendChild(li);
        i++;
      }
      container.appendChild(ol);
      continue;
    }

    if (/^\|.*\|\s*$/.test(trimmed) && i + 1 < lines.length && /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[i + 1].trim())) {
      flushPara();
      const splitRow = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      const headerCells = splitRow(trimmed);
      i += 2; // lewati baris header + baris pemisah (---|---|---)
      const bodyRows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i].trim())) {
        bodyRows.push(splitRow(lines[i]));
        i++;
      }
      const table = document.createElement('table');
      table.className = 'md-table';
      const thead = document.createElement('thead');
      const headRow = document.createElement('tr');
      headerCells.forEach((cell) => {
        const th = document.createElement('th');
        th.innerHTML = renderInline(cell);
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      bodyRows.forEach((row) => {
        const tr = document.createElement('tr');
        headerCells.forEach((_, ci) => {
          const td = document.createElement('td');
          td.innerHTML = renderInline(row[ci] || '');
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      const scroll = document.createElement('div');
      scroll.className = 'md-table-wrap';
      scroll.appendChild(table);
      container.appendChild(scroll);
      continue;
    }

    para.push(trimmed);
    i++;
  }
  flushPara();
}

const PLAIN_TEXT_LANGS = new Set(['', 'text', 'txt', 'plaintext', 'plain', 'console', 'output', 'log']);

// Status SATU BARIS yang dipakai SELAMA STREAMING - sengaja tidak
// menampilkan isi jawaban sama sekali (bukan teks, bukan kode), biar user
// tidak lihat markdown/kode mentah setengah jadi selagi model masih
// menulis. Kalau lagi di tengah blok kode (``` belum ditutup), labelnya
// jadi nama filenya ("Membuat index.html..."); di luar itu cuma titik-titik
// mengetik biasa. Hasil final lengkap (teks + kartu file) baru muncul
// sekali jadi lewat renderRichInto() setelah stream-nya benar-benar selesai.
function renderStreamingStatus(container, content) {
  const fenceCount = (content.match(/```/g) || []).length;
  let label = null;
  if (fenceCount % 2 === 1) {
    const idx = content.lastIndexOf('```');
    const openRaw = content.slice(idx + 3);
    const breakIdx = openRaw.indexOf('\n');
    const info = breakIdx === -1 ? openRaw : openRaw.slice(0, breakIdx);
    const { lang, fenceHint } = parseFenceInfo(info);
    const name = fenceHint || (lang ? defaultFilenameForLang(lang) : null);
    label = name ? t('generatingFile', { name }) : t('generatingFileGeneric');
  } else if (fenceCount > 0) {
    // Sudah pernah ada minimal satu blok kode yang closed di pesan ini,
    // sekarang lagi lanjut nulis teks lagi - tetap pakai label netral biar
    // tidak flip-flop ke titik-titik polos lalu balik lagi.
    label = t('generatingFileGeneric');
  }

  if (container.dataset.streamLabel === (label || '')) return; // tidak ada perubahan, skip render ulang
  container.dataset.streamLabel = label || '';

  // Status ditaruh di elemen ANAK, bukan mengubah class bubble itu sendiri, supaya
  // tidak ada class/layout sisa yang bocor ke tampilan hasil akhir.
  container.className = 'msg bot';
  container.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'streaming-status';
  const dots = document.createElement('span');
  dots.className = 'generating-dots';
  dots.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  if (label) {
    const textEl = document.createElement('span');
    textEl.className = 'streaming-status-text';
    textEl.textContent = label;
    row.appendChild(textEl);
  }
  row.appendChild(dots);
  container.appendChild(row);
}


// ---------- Mode Preview untuk HTML / CSS / JS ----------

// Gabungkan file HTML + CSS + JS dari pesan yang sama jadi SATU dokumen utuh
// (iframe srcdoc tidak bisa memuat file terpisah). <link href="style.css"> dan
// <script src="app.js"> yang cocok dengan file di pesan diganti isinya langsung;
// kalau HTML tidak mereferensikannya sama sekali, CSS/JS disuntik otomatis.
function buildPreviewDoc(items, filenames, htmlIndex) {
  let html = items[htmlIndex].content;
  const byBase = new Map();
  items.forEach((it, i) => {
    const ext = (fileExtOf(filenames[i]) || '').toLowerCase();
    const lang = (it.lang || '').toLowerCase();
    if (i === htmlIndex) return;
    if (ext === 'css' || lang === 'css') byBase.set(baseName(filenames[i]).toLowerCase(), { type: 'css', code: it.content });
    else if (['js', 'mjs'].includes(ext) || ['js', 'javascript'].includes(lang)) byBase.set(baseName(filenames[i]).toLowerCase(), { type: 'js', code: it.content });
  });
  const used = new Set();
  const safeJs = (c) => c.replace(/<\/script/gi, '<\\/script');
  const safeCss = (c) => c.replace(/<\/style/gi, '<\\/style');

  html = html.replace(/<link\b[^>]*>/gi, (tag) => {
    if (!/stylesheet/i.test(tag)) return tag;
    const m = tag.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!m) return tag;
    const key = baseName(m[1].split('?')[0]).toLowerCase();
    const f = byBase.get(key);
    if (f && f.type === 'css') { used.add(key); return `<style>\n${safeCss(f.code)}\n</style>`; }
    return tag;
  });
  html = html.replace(/<script\b([^>]*)\bsrc\s*=\s*["']([^"']+)["']([^>]*)>\s*<\/script>/gi, (tag, a, src, b) => {
    const key = baseName(src.split('?')[0]).toLowerCase();
    const f = byBase.get(key);
    if (f && f.type === 'js') { used.add(key); return `<script>\n${safeJs(f.code)}\n</script>`; }
    return tag;
  });

  let extraCss = '', extraJs = '';
  byBase.forEach((f, key) => {
    if (used.has(key)) return;
    if (f.type === 'css') extraCss += `<style>\n${safeCss(f.code)}\n</style>\n`;
    else extraJs += `<script>\n${safeJs(f.code)}\n</script>\n`;
  });

  const hasHtmlTag = /<html[\s>]/i.test(html);
  if (!hasHtmlTag) {
    html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>\n${html}\n</body></html>`;
  } else if (!/<meta[^>]+viewport/i.test(html)) {
    html = html.replace(/<head[^>]*>/i, (m) => `${m}<meta name="viewport" content="width=device-width, initial-scale=1">`);
  }
  if (extraCss) html = /<\/head>/i.test(html) ? html.replace(/<\/head>/i, extraCss + '</head>') : extraCss + html;
  if (extraJs) html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, extraJs + '</body>') : html + extraJs;
  return html;
}

let previewModalEl = null;
function openPreviewModal(docHtml, title) {
  closePreviewModal();
  const overlay = document.createElement('div');
  overlay.className = 'preview-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const bar = document.createElement('div');
  bar.className = 'preview-bar';

  const titleEl = document.createElement('div');
  titleEl.className = 'preview-title';
  titleEl.textContent = `${t('previewTitle')} · ${title}`;

  const devices = document.createElement('div');
  devices.className = 'preview-devices';
  const sizes = [['deviceMobile', 390], ['deviceTablet', 820], ['deviceDesktop', 0]];
  const devBtns = [];

  const mkBtn = (cls, label) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.textContent = label;
    return b;
  };

  const stage = document.createElement('div');
  stage.className = 'preview-stage';
  const frame = document.createElement('iframe');
  frame.className = 'preview-frame';
  // Tanpa allow-same-origin: kode di dalam preview TIDAK bisa membaca
  // localStorage/API key milik app ini.
  frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-modals allow-popups');
  frame.srcdoc = docHtml;
  stage.appendChild(frame);

  function setDevice(idx) {
    const w = sizes[idx][1];
    frame.style.width = w ? `${w}px` : '100%';
    frame.classList.toggle('framed', !!w);
    devBtns.forEach((b, i) => b.classList.toggle('active', i === idx));
  }
  sizes.forEach(([key], i) => {
    const b = mkBtn('preview-dev-btn', t(key));
    b.addEventListener('click', () => setDevice(i));
    devBtns.push(b);
    devices.appendChild(b);
  });

  const tools = document.createElement('div');
  tools.className = 'preview-tools';
  const reload = mkBtn('code-btn', t('previewReload'));
  reload.addEventListener('click', () => { frame.srcdoc = docHtml; });
  const newTab = mkBtn('code-btn', t('previewNewTab'));
  newTab.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([docHtml], { type: 'text/html;charset=utf-8' }));
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  });
  const close = mkBtn('code-btn preview-close', '✕');
  close.setAttribute('aria-label', t('previewClose'));
  close.addEventListener('click', closePreviewModal);
  tools.append(reload, newTab, close);

  bar.append(titleEl, devices, tools);
  overlay.append(bar, stage);
  document.body.appendChild(overlay);
  document.body.classList.add('preview-open');
  previewModalEl = overlay;
  // Default: lebar penuh (paling pas di HP); tablet/ponsel bisa dipilih di bar atas.
  setDevice(2);
}

function closePreviewModal() {
  if (previewModalEl) { previewModalEl.remove(); previewModalEl = null; }
  document.body.classList.remove('preview-open');
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePreviewModal(); });

function renderRichInto(container, content) {
  container.innerHTML = '';
  const blocks = parseContentToBlocks(content);

  // Kumpulkan hint nama file dari teks yang mendahului tiap blok kode
  // (misal heading "index.js" atau "**package.json**" persis di atasnya),
  // supaya nama file di kartu & di zip sesuai konteks aslinya, bukan
  // "snippet-1.js" generik.
  // Struktur folder yang ditulis bot (blok tree) dipakai sebagai acuan nama/path file lain
  // di pesan yang sama, dan ditampilkan sebagai teks biasa - bukan kartu file.
  const treeIndex = { files: [], roots: new Set(), dirs: [] };
  blocks.forEach((block) => {
    if (block.type !== 'code') return;
    const info = parseTreeBlock(block.lang, block.content);
    if (!info) return;
    block.plain = true;
    treeIndex.files.push(...info.files);
    treeIndex.dirs.push(...(info.dirs || []));
    if (info.root) treeIndex.roots.add(info.root);
  });

  const codeItems = [];
  blocks.forEach((block, i) => {
    if (block.type !== 'code' || block.plain) return;
    const prev = blocks[i - 1];
    const rawHint = prev && prev.type === 'text' ? filenameHintFromText(prev.content) : null;
    const hint = canonicalizePath(rawHint || block.fenceHint || null, treeIndex);
    // Blok tanpa bahasa / teks polos (contoh format error, output terminal,
    // dll) TIDAK dijadikan kartu file .txt - cukup tampil sebagai teks biasa.
    if (!hint && PLAIN_TEXT_LANGS.has((block.lang || '').trim().toLowerCase())) {
      block.plain = true;
      return;
    }
    codeItems.push({ lang: block.lang, content: block.content, hint });
  });

  // Kalau model (meski sudah diinstruksikan) tetap memecah perubahan untuk
  // SATU file yang sama jadi beberapa blok kode terpisah dengan hint nama
  // yang sama persis, gabungkan isinya jadi satu blok di sini - supaya
  // tidak muncul file duplikat semacam "style-2.css" di UI/hasil unduhan.
  const mergedCodeItems = [];
  const hintToIndex = new Map();
  codeItems.forEach((item) => {
    const key = item.hint ? item.hint.trim().toLowerCase() : null;
    if (key && hintToIndex.has(key)) {
      mergedCodeItems[hintToIndex.get(key)].content += '\n\n' + item.content;
    } else {
      mergedCodeItems.push({ ...item });
      if (key) hintToIndex.set(key, mergedCodeItems.length - 1);
    }
  });

  const filenames = resolveFilenames(mergedCodeItems, treeIndex);

  // Teks dulu semua (urut sesuai aslinya), baru file/kode dikumpulkan jadi satu
  // kelompok di bawahnya - biar rapi, bukan selang-seling teks-kode-teks-kode.
  blocks.forEach((block) => {
    if (block.type === 'code' && block.plain) {
      const pre = document.createElement('pre');
      pre.className = 'plain-pre';
      pre.textContent = block.content;
      container.appendChild(pre);
      return;
    }
    if (block.type !== 'text') return;
    const trimmed = block.content.replace(/^\n+|\n+$/g, '');
    if (trimmed) {
      const p = document.createElement('div');
      p.className = 'msg-text';
      renderMarkdownInto(p, trimmed);
      container.appendChild(p);
    }
  });

  if (mergedCodeItems.length) {
    const filesWrap = document.createElement('div');
    filesWrap.className = 'code-files';
    mergedCodeItems.forEach((b, i) => {
      const isHtml = /^(html?|xhtml)$/i.test(fileExtOf(filenames[i]) || '') || /^html?$/i.test(b.lang || '');
      const onPreview = isHtml
        ? () => openPreviewModal(buildPreviewDoc(mergedCodeItems, filenames, i), baseName(filenames[i]))
        : null;
      filesWrap.appendChild(buildCodeBlock(b.lang, b.content, filenames[i], onPreview));
    });
    container.appendChild(filesWrap);
  }

  // JSZip dimuat lazy (baru diminta saat dipakai, lihat ensureJSZipReady), jadi JANGAN
  // syaratkan JSZip sudah ada di sini - tombol harus tetap muncul, library dimuat saat diklik.
  if (mergedCodeItems.length > 1) {
    const zipBtn = document.createElement('button');
    zipBtn.type = 'button';
    zipBtn.className = 'code-btn zip-all-btn';
    zipBtn.dataset.label = t('zipAllButton', { count: mergedCodeItems.length });
    zipBtn.innerHTML = `<span class="btn-label">${zipBtn.dataset.label}</span>`;
    zipBtn.addEventListener('click', async () => {
      const iconEl = zipBtn.querySelector('.btn-label');
      const original = zipBtn.dataset.label;
      zipBtn.disabled = true;
      try {
        if (iconEl) iconEl.textContent = t('filePending');
        const jszipReady = await ensureJSZipReady();
        if (!jszipReady || typeof JSZip === 'undefined') {
          throw new Error('Library ZIP gagal dimuat (cek koneksi internet lalu coba lagi).');
        }
        if (iconEl) iconEl.textContent = original;
        const zip = new JSZip();
        // Folder kosong dari diagram (kalau ada) dibuat lebih dulu supaya struktur
        // di dalam zip persis sama dengan yang digambar bot, bukan cuma folder
        // yang kebetulan punya file.
        treeIndex.dirs.forEach((d) => zip.folder(d));
        for (let i = 0; i < mergedCodeItems.length; i++) {
          const item = mergedCodeItems[i];
          const name = filenames[i];
          if (fileExtOf(name).toLowerCase() === 'pdf') {
            // Sama kayak tombol unduh satuan - .pdf harus dirender jadi PDF
            // ASLI dulu (lihat generateStyledPdfBlob), bukan teks mentah
            // yang cuma diberi nama .pdf.
            if (iconEl) iconEl.textContent = t('pdfGenerating');
            // titleText sengaja TIDAK diisi (lihat catatan di tombol unduh satuan di atas).
            const pdfBlob = await generateStyledPdfBlob(item.content);
            zip.file(name, pdfBlob);
          } else {
            zip.file(name, item.content);
          }
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(blob, guessZipName(mergedCodeItems));
        flashButtonLabel(zipBtn, t('downloadedFeedback'), 'ok');
      } catch (err) {
        console.error('[zip] gagal membuat .zip:', err);
        alert('Gagal membuat ZIP:\n\n' + (err?.message || String(err)));
        if (iconEl) iconEl.textContent = original;
        flashButtonLabel(zipBtn, t('pdfGenerateError'), 'err');
      } finally {
        zipBtn.disabled = false;
      }
    });
    container.appendChild(zipBtn);
  }

  if (mergedCodeItems.length > 0) container.classList.add('has-code');
}

function renderMessage(role, content, meta) {
  if (role === 'user') lastUserPrompt = content || '';
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  if (role === 'bot') {
    renderRichInto(div, content);
  } else if (role === 'user' && meta && ((meta.fileNames && meta.fileNames.length) || (meta.images && meta.images.length))) {
    if (meta.images && meta.images.length) {
      const imagesRow = document.createElement('div');
      imagesRow.className = 'msg-user-images';
      meta.images.forEach((img) => {
        const el = document.createElement('img');
        el.className = 'msg-user-image';
        el.src = img.dataUrl;
        el.alt = img.name || '';
        imagesRow.appendChild(el);
      });
      div.appendChild(imagesRow);
    }
    if (meta.fileNames && meta.fileNames.length) {
      const filesRow = document.createElement('div');
      filesRow.className = 'msg-user-files';
      meta.fileNames.forEach((name) => {
        const chip = document.createElement('span');
        chip.className = 'msg-file-chip';
        chip.innerHTML = `
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 2.5h6.5L15.5 6.5V17a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M11.5 2.5V6.5H15.5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
          <span class="msg-file-chip-name"></span>`;
        chip.querySelector('.msg-file-chip-name').textContent = name;
        filesRow.appendChild(chip);
      });
      div.appendChild(filesRow);
    }
    if (content) {
      const textEl = document.createElement('div');
      textEl.className = 'msg-user-text';
      textEl.textContent = content;
      div.appendChild(textEl);
    }
  } else {
    div.textContent = content;
  }
  els.messages.appendChild(div);
  els.messages.scrollTop = els.messages.scrollHeight;
  return div;
}

function renderTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'msg bot typing';
  div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  els.messages.appendChild(div);
  els.messages.scrollTop = els.messages.scrollHeight;
  return div;
}

function renderHistory() {
  els.messages.innerHTML = '';
  if (history.length === 0) {
    renderMessage('system', t('emptyHistory'));
    return;
  }
  history.forEach((m) => {
    if (m.role === 'user') {
      renderMessage('user', m.displayText ?? m.content, { fileNames: m.fileNames || [], images: m.images || [] });
    } else {
      renderMessage('bot', m.content);
    }
  });
}

function setStatus(msg, type) {
  els.connectStatus.textContent = msg;
  els.connectStatus.className = `status ${type || ''}`;
}

// Kalau belum ada model tersimpan buat provider ini, jangan asal pilih model
// PERTAMA secara alfabetis - daftar model dari provider (lihat
// normalizeModelList di server.js) diurutkan alfabet, jadi bisa kepilih
// model kecil/khusus cuma karena namanya duluan di abjad (mis. "allam-2-7b" -
// model SDAIA yang dioptimalkan buat bahasa Arab, bukan buat ngobrol umum
// bahasa Indonesia - itu penyebab nyata kenapa provider bawaan/Groq bisa
// kepilih model yang jawabannya ngaco/nyasar/salah bahasa). Coba cocokkan
// dulu ke daftar model umum yang dikenal kuat & masih aktif; kalau tidak ada
// satu pun yang cocok, baru fallback ke model pertama di daftar.
//
// PENTING buat provider Groq khususnya: Groq SERING mematikan/mengganti
// model (lihat console.groq.com/docs/deprecations) - list di bawah ini per
// 25 Sep 2026 (llama-3.3-70b-versatile, llama-3.1-8b-instant, qwen3.6-27b,
// dkk generasi sebelumnya SUDAH dimatikan Groq). Kalau di kemudian hari
// daftar ini basi lagi (default balik kepilih model yang aneh), cek halaman
// deprecations di atas dan update list-nya - bukan salah kode ini, tapi
// katalog modelnya sendiri yang terus berubah.
const PREFERRED_DEFAULT_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gpt-4o-mini',
  'gpt-4o'
];

// Model yang DIPAKSA dipilih setiap kali saklar Auto (provider bawaan)
// diaktifkan/di-toggle ulang - lihat activateDefaultProvider(). Beda dari
// PREFERRED_DEFAULT_MODELS di atas (yang cuma fallback kalau belum ada model
// tersimpan sama sekali), ini SELALU override model yang sedang aktif buat
// provider bawaan, karena provider bawaan tujuannya "pokoknya langsung
// jalan" - Qwen3.8 27B dipilih karena satu-satunya model Groq yang saat ini
// juga mendukung vision (baca gambar), jadi Auto langsung bisa dipakai buat
// chat teks maupun gambar tanpa user perlu ganti model manual. Ganti di sini
// kalau Groq mendeprecate model ini juga di kemudian hari - cek
// console.groq.com/docs/vision buat model vision yang masih aktif.
const AUTO_PROVIDER_PREFERRED_MODEL = 'qwen/qwen3.8-27b';

function pickDefaultModel(models) {
  for (const preferred of PREFERRED_DEFAULT_MODELS) {
    if (models.some((m) => m.id === preferred)) return preferred;
  }
  return models[0].id;
}

function populateModelSelect(models, providerId) {
  els.modelSelect.innerHTML = '';
  if (!models || models.length === 0) {
    els.modelSelect.innerHTML = `<option value="">${t('optionNoModel')}</option>`;
    els.modelSelect.disabled = true;
    return;
  }
  models.forEach((m) => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.context_window ? `${m.id} (ctx ${m.context_window})` : m.id;
    els.modelSelect.appendChild(opt);
  });
  els.modelSelect.disabled = false;

  const pid = providerId || (getActiveProvider() && getActiveProvider().id);
  const saved = pid ? store.getModel(pid) : '';
  if (saved && models.some((m) => m.id === saved)) {
    els.modelSelect.value = saved;
  } else {
    const defaultId = pickDefaultModel(models);
    els.modelSelect.value = defaultId;
    if (pid) store.setModel(pid, defaultId);
  }
  updateHeaderModel();
}

async function fetchModels(baseUrl, apikey) {
  setStatus(t('fetchingModels'), '');
  const url = `/api/models?baseUrl=${encodeURIComponent(baseUrl)}&apikey=${encodeURIComponent(apikey)}`;
  const res = await fetch(url, {
    headers: { 'x-provider-base-url': baseUrl, 'x-provider-key': apikey }
  });
  // Kalau server (atau sesuatu di depannya - reverse proxy, dll) balas bukan
  // JSON sama sekali, res.json() bakal throw SyntaxError yang pesannya mentah
  // banget ("Unexpected token '<'..."), tidak jelas buat user awam. Tangkap
  // di sini dan ganti jadi pesan yang jelas apa yang harus dicek.
  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      `Server tidak membalas dalam format yang diharapkan (bukan JSON, status ${res.status}). ` +
      'Ini biasanya berarti base URL API salah, provider sedang bermasalah, atau server backend app ini sendiri sedang error - cek log console (Restart) di panel Pterodactyl untuk detailnya.'
    );
  }
  if (!res.ok) throw new Error(data.error || 'Gagal mengambil model');
  return data.models;
}

// Cocok dengan config.js -> app.defaultProvider: kalau baseUrl yang lagi diisi persis
// sama dengan baseUrl default DAN allowWithoutOwnKey diaktifkan, tombol connect boleh
// dipencet walau kolom API key dikosongkan - server yang isi kunci bawaan dari .env
// (lihat DEFAULT_API_KEY di server.js). Kunci aslinya sendiri TIDAK PERNAH ada di
// kode/berkas yang dikirim ke browser.
function isDefaultProviderBaseUrl(baseUrl) {
  const dp = (typeof CONFIG !== 'undefined' && CONFIG.app && CONFIG.app.defaultProvider) || null;
  if (!dp || !dp.enabled || !dp.allowWithoutOwnKey || !dp.baseUrl) return false;
  return String(baseUrl || '').replace(/\/+$/, '') === String(dp.baseUrl).replace(/\/+$/, '');
}

els.btnConnect.addEventListener('click', async () => {
  const name = els.providerName.value.trim();
  let baseUrl = els.providerBaseUrl.value.trim().replace(/\/+$/, '');
  const apikey = els.apikey.value.trim();

  if (!name) return setStatus(t('providerNameRequired'), 'err');
  if (!baseUrl) return setStatus(t('baseUrlRequired'), 'err');
  if (!/^https?:\/\//i.test(baseUrl)) return setStatus(t('baseUrlInvalid'), 'err');
  if (!apikey && !isDefaultProviderBaseUrl(baseUrl)) return setStatus(t('apikeyRequired'), 'err');

  els.btnConnect.disabled = true;
  try {
    const models = await fetchModels(baseUrl, apikey);

    const providers = store.providers;
    let provider = getActiveProvider();
    if (!provider || els.providerSelect.value === '__new__') {
      provider = { id: uid(), name, baseUrl, apikey };
      providers.push(provider);
    } else {
      provider.name = name;
      provider.baseUrl = baseUrl;
      provider.apikey = apikey;
      delete provider.isDefault; // diedit manual -> bukan lagi provider bawaan otomatis
    }
    store.providers = providers;
    store.activeProviderId = provider.id;
    store.setModels(provider.id, models);

    populateProviderSelect();
    els.btnDeleteProvider.style.display = '';
    els.btnUpdateModels.style.display = '';
    populateModelSelect(models, provider.id);
    setStatus(t('connectSuccess', { count: models.length, name }), 'ok');
    setConnIndicator('connected');
    syncAutoToggle();
    if (window.innerWidth <= 860) closeSidebar();
  } catch (err) {
    setStatus(err.message, 'err');
    setConnIndicator('error');
  } finally {
    els.btnConnect.disabled = false;
  }
});

els.modelSelect.addEventListener('change', () => {
  const provider = getActiveProvider();
  if (!provider) return;
  store.setModel(provider.id, els.modelSelect.value);
  updateHeaderModel();
});

// Ambil ulang daftar model TERBARU langsung dari base URL provider yang
// lagi aktif - tanpa perlu isi ulang nama/base URL/API key (sudah otomatis
// terisi di form), dan tanpa mengandalkan cache di manapun: /api/models di
// server.js SELALU probe langsung ke provider setiap dipanggil (lihat
// detectProviderFast di server.js), jadi tombol ini dijamin dapat data
// terbaru dari provider, bukan cuma daftar lama yang tersimpan di HP.
els.btnUpdateModels.addEventListener('click', async () => {
  const provider = getActiveProvider();
  const baseUrl = els.providerBaseUrl.value.trim().replace(/\/+$/, '') || provider?.baseUrl || '';
  const apikey = els.apikey.value.trim() || provider?.apikey || '';
  if (!provider || !baseUrl) return setStatus(t('baseUrlRequired'), 'err');
  if (!apikey && !isDefaultProviderBaseUrl(baseUrl)) return setStatus(t('apikeyRequired'), 'err');

  els.btnUpdateModels.disabled = true;
  els.btnConnect.disabled = true;
  setStatus(t('updatingModels'), '');
  try {
    const oldIds = new Set((store.getModels(provider.id) || []).map((m) => m.id));
    const models = await fetchModels(baseUrl, apikey);
    const addedCount = models.filter((m) => !oldIds.has(m.id)).length;

    store.setModels(provider.id, models);
    const keepSelected = models.some((m) => m.id === store.getModel(provider.id));
    populateModelSelect(models, provider.id);
    if (!keepSelected && models.length) {
      store.setModel(provider.id, models[0].id);
      els.modelSelect.value = models[0].id;
      updateHeaderModel();
    }
    setStatus(t('updateModelsSuccess', { count: models.length, added: addedCount }), 'ok');
    setConnIndicator('connected');
  } catch (err) {
    setStatus(err.message, 'err');
  } finally {
    els.btnUpdateModels.disabled = false;
    els.btnConnect.disabled = false;
  }
});

els.btnClear.addEventListener('click', () => {
  history = [];
  store.setSessionHistory(store.activeSessionId, history);
  touchActiveSession();
  renderHistory();
});

els.text.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    els.form.requestSubmit();
  }
});

// ---------- Upload & edit file (html/css/js/zip/dll) ----------

// Batas total karakter isi file yang disisipkan ke satu pesan, biar tidak
// meledakkan context model atau limit body server. Dinaikkan dari 60k -> 200k
// Ambil satu nilai batasan dari config.js -> CONFIG.limits kalau ada &
// berupa angka valid, kalau tidak fallback ke nilai default di kode ini -
// jadi config.js BOLEH mengatur limit ini tapi tidak WAJIB (aman kalau
// field-nya belum diisi/dihapus/config.js gagal dimuat).
function cfgLimit(key, fallback) {
  const v = typeof CONFIG !== 'undefined' && CONFIG.limits ? CONFIG.limits[key] : undefined;
  return typeof v === 'number' && !Number.isNaN(v) ? v : fallback;
}

// karena project bisa tumbuh lebih besar dari itu (file penting seperti
// server.js pernah "kehabisan jatah" waktu total project sudah >100k karakter).
const MAX_TOTAL_FILE_CHARS = cfgLimit('maxTotalFileChars', 200000);
const MAX_SINGLE_FILE_CHARS = cfgLimit('maxSingleFileChars', 100000);

// File biner yang tidak masuk akal untuk "diedit sebagai teks" via chat.
// Ini cuma daftar cepat berdasarkan ekstensi supaya file yang JELAS biner
// (gambar, audio, dokumen office, dll) tidak usah dibaca sebagai teks sama
// sekali. Untuk ekstensi yang tidak dikenal, ada pengecekan isi file di
// looksBinaryText() sebagai jaring pengaman kedua.
const BINARY_EXT = new Set([
  // gambar
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'tiff', 'tif', 'heic', 'heif', 'avif',
  // audio & video
  'mp3', 'mp4', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'mov', 'avi', 'mkv', 'webm', 'wmv',
  // font
  'woff', 'woff2', 'ttf', 'otf', 'eot',
  // dokumen office - pdf/docx/xls/xlsx SEKARANG dibaca lewat DOCUMENT_EXT
  // (lihat extractPdfText/extractDocxText/extractSpreadsheetText di atas),
  // jadi TIDAK lagi di sini. ppt/pptx/odt/ods/odp masih belum ada library
  // ringan buat baca isinya di browser, jadi tetap dianggap biner.
  'doc', 'ppt', 'pptx', 'odt', 'ods', 'odp',
  // biner umum / desain / database
  'exe', 'dll', 'so', 'dylib', 'bin', 'dat', 'class', 'wasm',
  'db', 'sqlite', 'sqlite3', 'psd', 'ai', 'sketch'
]);

// Gambar yang bisa dibaca browser lewat <canvas>/<img> dan dikirim ke model
// vision (kalau providernya mendukung). Ini subset dari BINARY_EXT di atas -
// dicek LEBIH DULU sebelum jatuh ke penolakan umum "jenis file biner".
const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp']);

// Dimensi sisi terpanjang gambar yang dikirim ke model - cukup besar untuk
// dibaca modelnya, tapi tidak bikin payload base64 membengkak.
const MAX_IMAGE_DIM = cfgLimit('maxImageDim', 1568);
const IMAGE_JPEG_QUALITY = cfgLimit('imageJpegQuality', 0.9);
const MAX_IMAGE_RAW_BYTES = cfgLimit('maxImageRawBytes', 20 * 1024 * 1024); // batas ukuran file gambar mentah yang diterima
const MAX_IMAGES_PER_MESSAGE = cfgLimit('maxImagesPerMessage', 6);
const MAX_TOTAL_IMAGE_BYTES = cfgLimit('maxTotalImageBytes', 12 * 1024 * 1024); // batas total ukuran base64 semua gambar terlampir

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error(t('fileReadError')));
    reader.readAsDataURL(file);
  });
}

function loadImageEl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('gagal memuat gambar, coba JPG/PNG'));
    img.src = dataUrl;
  });
}

// Baca gambar, kecilkan kalau kelewat besar, lalu SELALU dienkode ulang lewat
// canvas jadi JPEG. Dengan begitu tipe MIME yang dikirim ke provider selalu
// benar (image/jpeg) - tidak tergantung tipe/ekstensi file asli dari
// galeri/kamera HP, yang kadang kosong atau tidak cocok dengan isi aslinya.
// GIF animasi jadi satu frame (cukup untuk dibaca model).
async function processImageFile(file) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImageEl(objectUrl);
    const { naturalWidth: w, naturalHeight: h } = img;
    if (!w || !h) throw new Error('gambar kosong');
    const scale = Math.min(1, MAX_IMAGE_DIM / Math.max(w, h));
    const outW = Math.max(1, Math.round(w * scale));
    const outH = Math.max(1, Math.round(h * scale));
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    // Latar putih supaya PNG transparan tidak jadi hitam saat jadi JPEG.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outW, outH);
    ctx.drawImage(img, 0, 0, outW, outH);
    const dataUrl = canvas.toDataURL('image/jpeg', IMAGE_JPEG_QUALITY);
    return { dataUrl, width: outW, height: outH };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// Kenali gambar dari tipe MIME, ekstensi, atau (kalau dua-duanya tidak ada,
// mis. dari beberapa picker HP) dari byte awal file.
async function isImageFile(file) {
  if (file.type === 'image/svg+xml') return false;
  if (file.type && file.type.startsWith('image/')) return true;
  if (IMAGE_EXT.has(fileExt(file.name))) return true;
  if (file.type && file.type !== 'application/octet-stream') return false;
  try {
    const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const isPng = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
    const isJpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    const isGif = b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46;
    const isWebp = b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;
    return isPng || isJpeg || isGif || isWebp;
  } catch {
    return false;
  }
}

function dataUrlBytes(dataUrl) {
  const idx = dataUrl.indexOf(',');
  const b64 = idx >= 0 ? dataUrl.slice(idx + 1) : dataUrl;
  return Math.round((b64.length * 3) / 4);
}

function totalAttachedImageBytes() {
  return attachedFiles.reduce((sum, f) => sum + (f.isImage && f.dataUrl ? dataUrlBytes(f.dataUrl) : 0), 0);
}

function formatKB(bytes) {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// Arsip/kompresi: TIDAK pernah dipecah jadi banyak chip terpisah (biar UI
// tidak banjir), tapi isinya (untuk format yang didukung) tetap diekstrak
// di belakang layar supaya AI bisa "membaca" kode yang ada di dalamnya.
const ARCHIVE_EXT = new Set([
  'zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'iso', 'apk', 'dmg', 'jar', 'war'
]);

// Path/folder yang biasanya cuma noise (dependency terinstall, cache, dll)
// dan tidak relevan untuk dibaca AI.
const ARCHIVE_NOISE_RE = /(^|\/)(node_modules|\.git|\.cache|_cacache|\.npm|\.yarn|\.pnpm-store|\.parcel-cache|\.turbo|\.next|\.nuxt|dist|build|out|vendor|__pycache__|\.venv|venv|target|coverage)(\/|$)/i;

// File lock/manifest dependency: isinya cuma hash & versi paket, bukan kode
// yang relevan untuk diedit, tapi ukurannya bisa besar (puluhan KB) dan kalau
// ikut dibaca bisa menghabiskan jatah karakter yang seharusnya untuk file
// kode sungguhan (mis. server.js).
const LOCK_FILE_BASENAMES = new Set([
  'package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml',
  'composer.lock', 'gemfile.lock', 'cargo.lock', 'poetry.lock', 'pipfile.lock'
]);

function isLockFile(name) {
  const base = (name.split('/').pop() || '').toLowerCase();
  return LOCK_FILE_BASENAMES.has(base);
}

const ARCHIVE_ENTRY_MAX_CHARS = cfgLimit('archiveEntryMaxChars', 80000);
// Jangan bahkan coba decode entry yang byte-nya sudah lebih besar dari ini -
// pasti bukan source file yang relevan (npm cache blob dll bisa ratusan KB),
// dan decode UTF-8 untuk ratusan file besar bisa bikin browser di HP lag.
const ARCHIVE_ENTRY_MAX_BYTES = cfgLimit('archiveEntryMaxBytes', 300000);

async function gunzip(file) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('Browser ini tidak mendukung dekompresi gzip');
  }
  const ds = new DecompressionStream('gzip');
  const stream = file.stream().pipeThrough(ds);
  return new Response(stream).arrayBuffer();
}

// Parser TAR minimal (format USTAR), cukup untuk arsip web project biasa.
function parseTar(buffer) {
  const view = new Uint8Array(buffer);
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const entries = [];
  let offset = 0;

  while (offset + 512 <= view.length) {
    const header = view.subarray(offset, offset + 512);
    let allZero = true;
    for (let i = 0; i < 512; i++) {
      if (header[i] !== 0) { allZero = false; break; }
    }
    if (allZero) break;

    let name = decoder.decode(header.subarray(0, 100)).replace(/\0.*$/, '');
    const sizeStr = decoder.decode(header.subarray(124, 136)).replace(/\0.*$/, '').trim();
    const size = parseInt(sizeStr, 8) || 0;
    const typeFlag = String.fromCharCode(header[156]);
    const magic = decoder.decode(header.subarray(257, 263));
    if (magic.startsWith('ustar')) {
      const prefix = decoder.decode(header.subarray(345, 500)).replace(/\0.*$/, '');
      if (prefix) name = prefix + '/' + name;
    }

    offset += 512;
    const dataStart = offset;
    const dataEnd = Math.min(dataStart + size, view.length);
    if ((typeFlag === '0' || typeFlag === '\0') && name) {
      entries.push({ name, size, data: view.subarray(dataStart, dataEnd) });
    }
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  return entries;
}

// JSZip dimuat lewat <script src="..."> di <head> (lihat index.html), TIDAK
// diberi async/defer supaya normalnya sudah siap sebelum app.js jalan. Tapi
// di HP dengan koneksi lambat/putus-putus, fetch script itu bisa saja belum
// selesai (atau CDN-nya sempat gagal) tepat saat user langsung melampirkan
// .zip begitu halaman baru terbuka - itu penyebab paling umum error
// "gagal ekstrak" yang sebenarnya bukan soal file usernya rusak.
//
// Daripada pakai delay tetap (setTimeout sekian detik) yang bisa kepanjangan
// kalau koneksi cepat atau kependekan kalau lambat, sini dicek BERKALA:
// begitu JSZip terdeteksi sudah ada, langsung lanjut - tidak perlu nunggu
// penuh. Kalau sampai batas waktu tetap belum ada (mis. cdnjs kena blokir),
// baru dianggap benar-benar gagal.
//
// Dipakai buat SEMUA library eksternal yang dimuat lewat <script> biasa di
// <head> (JSZip buat .zip, pdf.js buat .pdf, mammoth buat .docx, xlsx buat
// .xls/.xlsx) - checkFn cuma ngecek satu variabel global spesifik per
// library.
// Koneksi banyak user app ini SANGAT lambat (LTE tapi cuma <2 KB/dtk bukan
// hal aneh) - nunggu PASIF pakai timeout tetap (dulu 8 detik) gampang keburu
// nyerah duluan sebelum library-nya (JSZip/pdf.js/mammoth/xlsx/jsPDF,
// masing-masing ~150-350KB) selesai kedownload. Solusinya: JANGAN cuma
// nunggu - kalau library-nya belum ada, AKTIF pasang <script> tag-nya
// sendiri sekarang juga (baru diminta pas dibutuhkan, bukan dari <head>
// yang bikin loading awal jadi lambat buat semua orang walau tidak
// pernah pakai fitur file/PDF-nya sama sekali), lalu tunggu event
// load/error-nya (bukan tebak-tebak waktu). Cache per-URL biar dipanggil
// berkali-kali tidak numpuk banyak <script> tag yang sama.
const scriptLoadPromises = {};
function loadScriptOnce(url, timeoutMs = 90000) {
  if (scriptLoadPromises[url]) return scriptLoadPromises[url];
  scriptLoadPromises[url] = new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = url;
    let done = false;
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      reject(new Error('Timeout memuat library dari ' + url));
    }, timeoutMs);
    el.onload = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(true);
    };
    el.onerror = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      reject(new Error('Gagal memuat library dari ' + url + ' (jaringan bermasalah / domain diblokir?)'));
    };
    document.head.appendChild(el);
  }).catch((err) => {
    delete scriptLoadPromises[url]; // biar percobaan berikutnya boleh coba fetch ulang, bukan nyangkut di promise gagal selamanya
    throw err;
  });
  return scriptLoadPromises[url];
}

// Pastikan satu library eksternal siap dipakai: kalau variabel globalnya
// sudah ada (mis. sudah dimuat lain kali / cache browser), langsung lanjut
// tanpa nunggu apa-apa; kalau belum, pasang scriptnya sekarang dan tunggu
// betulan sampai selesai (bukan poll dengan batas waktu pendek).
//
// SEKARANG mendukung BEBERAPA sumber (mirror) per library: kalau satu CDN
// diblokir jaringan/ISP (mis. cdnjs kena blokir di provider tertentu),
// otomatis coba mirror berikutnya (jsdelivr, lalu unpkg) sebelum benar-benar
// dianggap gagal. `urls` boleh berupa satu string (lama) atau array string.
function loadScriptFromMirrors(urls, timeoutMs) {
  const list = Array.isArray(urls) ? urls : [urls];
  const cacheKey = list.join('|');
  if (scriptLoadPromises[cacheKey]) return scriptLoadPromises[cacheKey];
  const attempt = (idx) => {
    if (idx >= list.length) {
      return Promise.reject(new Error('Semua sumber library gagal dimuat (jaringan bermasalah / domain diblokir?)'));
    }
    return loadScriptOnce(list[idx], timeoutMs).catch((err) => {
      console.warn('[lib] gagal memuat dari', list[idx], '-', err && err.message, '- coba sumber lain...');
      return attempt(idx + 1);
    });
  };
  scriptLoadPromises[cacheKey] = attempt(0).catch((err) => {
    delete scriptLoadPromises[cacheKey]; // biar percobaan berikutnya boleh coba ulang, bukan nyangkut di promise gagal selamanya
    throw err;
  });
  return scriptLoadPromises[cacheKey];
}

async function ensureLib(checkFn, urls) {
  if (checkFn()) return true;
  try {
    await loadScriptFromMirrors(urls);
  } catch (err) {
    console.error('[lib] gagal memuat semua mirror:', err);
  }
  return checkFn();
}

// Tiap library punya beberapa mirror (cdnjs -> jsdelivr -> unpkg), SEMUA
// mengarah ke versi yang sama persis supaya perilakunya tetap konsisten.
// Kalau salah satu domain diblokir provider/jaringan user, browser akan
// otomatis lanjut coba domain berikutnya di daftar ini.
const LIB_URLS = {
  jszip: [
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
    'https://unpkg.com/jszip@3.10.1/dist/jszip.min.js'
  ],
  pdfjs: [
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
    'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js'
  ],
  mammoth: [
    'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
    'https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js',
    'https://unpkg.com/mammoth@1.6.0/mammoth.browser.min.js'
  ],
  xlsx: [
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/xlsx.full.min.js',
    'https://cdn.jsdelivr.net/npm/xlsx@0.13.5/dist/xlsx.full.min.js',
    'https://unpkg.com/xlsx@0.13.5/dist/xlsx.full.min.js'
  ],
  jspdf: [
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js',
    'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',
    'https://unpkg.com/jspdf@2.5.2/dist/jspdf.umd.min.js'
  ]
};

function ensureJSZipReady() { return ensureLib(() => typeof JSZip !== 'undefined', LIB_URLS.jszip); }
function ensurePdfJsReady() { return ensureLib(() => typeof pdfjsLib !== 'undefined', LIB_URLS.pdfjs); }
function ensureMammothReady() { return ensureLib(() => typeof mammoth !== 'undefined', LIB_URLS.mammoth); }
function ensureXlsxReady() { return ensureLib(() => typeof XLSX !== 'undefined', LIB_URLS.xlsx); }

// ---------- Generator PDF cadangan 100% lokal (tanpa internet sama sekali) ----------
// Kalau SEMUA mirror CDN jsPDF di atas gagal (mis. konexi user memblokir
// cdnjs/jsdelivr/unpkg sekaligus, seperti pada kasus screenshot user:
// "Gagal memuat library dari cdnjs...jaringan bermasalah/domain diblokir"),
// PDF tetap harus bisa dibuat. Solusinya: MiniPdfDoc di bawah ini adalah
// implementasi PDF writer sendiri (murni JavaScript, tanpa dependency
// apapun, tidak fetch apa-apa dari internet) yang meniru bagian dari API
// jsPDF yang benar-benar dipakai kode di atas (setFont/setFontSize/text/
// getTextWidth/splitTextToSize/line/rect/setTextColor/setDrawColor/
// setFillColor/setLineWidth/addPage/internal.pageSize/output('blob')).
// Dengan begini pembuatan PDF GARANSI selalu berhasil, online maupun benar-benar offline.
(function () {
  const PAGE_SIZES_PT = { a4: [595.28, 841.89], letter: [612, 792], legal: [612, 1008] };

  // Lebar karakter standar font Helvetica & Helvetica-Bold (per 1000 unit em,
  // metrik font standar Adobe/PDF - dipakai semua PDF reader tanpa perlu
  // embed font). Oblique/italic memakai lebar yang sama dengan pasangan
  // tegaknya (miring cuma transformasi shear, bukan glyph berbeda).
  const HELV_W = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
  const HELVB_W = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];

  function widthOf(fontKey, code) {
    if (fontKey.indexOf('Courier') === 0) return 600; // monospace
    const table = (fontKey === 'Helvetica-Bold' || fontKey === 'Helvetica-BoldOblique') ? HELVB_W : HELV_W;
    if (code >= 32 && code <= 126) return table[code - 32];
    return 556; // fallback rata-rata buat karakter di luar ASCII cetak
  }

  function normColor(r, g, b) {
    if (g === undefined || b === undefined) { g = r; b = r; }
    return [r, g, b];
  }

  // Karakter "pintar" umum (bullet, smart quotes, en/em dash, ellipsis) yang
  // titik kode Unicode-nya (mis. U+2022 buat •) di luar 0-255, tapi di
  // WinAnsiEncoding/Windows-1252 justru punya slot byte sendiri di 0x80-0x9F.
  // Tanpa peta ini karakter itu keliru dianggap "tidak didukung" dan jadi '?'.
  const UNICODE_TO_WINANSI = {
    0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
    0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
    0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92,
    0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
    0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C,
    0x017E: 0x9E, 0x0178: 0x9F
  };

  function pdfEscapeText(str) {
    // PDF font standar (WinAnsiEncoding) cuma dukung 1 byte per karakter
    // (0-255). Karakter umum di luar Latin-1 dasar (bullet, smart quotes,
    // dash panjang, dll) dipetakan dulu ke slot Windows-1252-nya; sisanya
    // (emoji, aksara non-latin) diganti '?' daripada bikin PDF-nya korup.
    let out = '';
    for (let i = 0; i < str.length; i++) {
      let code = str.charCodeAt(i);
      if (code > 255) code = UNICODE_TO_WINANSI[code] || 63; // '?' kalau memang tidak ada padanannya
      const ch = String.fromCharCode(code);
      if (ch === '\\' || ch === '(' || ch === ')') out += '\\' + ch;
      else out += ch;
    }
    return out;
  }

  function fmtNum(n) {
    return (Math.round(n * 100) / 100).toString();
  }

  class MiniPdfDoc {
    constructor(opts) {
      opts = opts || {};
      const fmt = String(opts.format || 'a4').toLowerCase();
      const size = PAGE_SIZES_PT[fmt] || PAGE_SIZES_PT.a4;
      this._pageW = size[0];
      this._pageH = size[1];
      this._pages = [[]];
      this._pageIdx = 0;
      this._fontFamily = 'helvetica';
      this._fontStyle = 'normal';
      this._fontSize = 12;
      this._fillColor = [0, 0, 0];
      this._drawColor = [0, 0, 0];
      this._textColor = [0, 0, 0];
      this._lineWidth = 1;
      const self = this;
      this.internal = { pageSize: { getWidth: () => self._pageW, getHeight: () => self._pageH } };
    }
    addPage() { this._pages.push([]); this._pageIdx = this._pages.length - 1; return this; }
    setFont(family, style) {
      this._fontFamily = String(family || 'helvetica').toLowerCase();
      this._fontStyle = String(style || 'normal').toLowerCase();
      return this;
    }
    setFontSize(size) { this._fontSize = Number(size) || 12; return this; }
    setTextColor(r, g, b) { this._textColor = normColor(r, g, b); return this; }
    setDrawColor(r, g, b) { this._drawColor = normColor(r, g, b); return this; }
    setFillColor(r, g, b) { this._fillColor = normColor(r, g, b); return this; }
    setLineWidth(w) { this._lineWidth = Number(w) || 1; return this; }
    _fontKey() {
      const bold = this._fontStyle.indexOf('bold') !== -1;
      const italic = this._fontStyle.indexOf('italic') !== -1 || this._fontStyle.indexOf('oblique') !== -1;
      const isCourier = this._fontFamily === 'courier';
      if (isCourier) {
        if (bold && italic) return 'Courier-BoldOblique';
        if (bold) return 'Courier-Bold';
        if (italic) return 'Courier-Oblique';
        return 'Courier';
      }
      if (bold && italic) return 'Helvetica-BoldOblique';
      if (bold) return 'Helvetica-Bold';
      if (italic) return 'Helvetica-Oblique';
      return 'Helvetica';
    }
    getTextWidth(text) {
      const str = String(text == null ? '' : text);
      const fontKey = this._fontKey();
      let w = 0;
      for (let i = 0; i < str.length; i++) w += widthOf(fontKey, str.charCodeAt(i));
      return (w / 1000) * this._fontSize;
    }
    splitTextToSize(text, maxWidth) {
      const words = String(text == null ? '' : text).split(/\s+/).filter(Boolean);
      if (!words.length) return [''];
      const lines = [];
      let line = '';
      const pushHardWrap = (word) => {
        // Satu kata sendiri sudah lebih lebar dari maxWidth (mis. URL
        // panjang) - potong paksa per karakter biar tidak infinite loop.
        let rest = word;
        while (this.getTextWidth(rest) > maxWidth && rest.length > 1) {
          let cut = rest.length - 1;
          while (cut > 1 && this.getTextWidth(rest.slice(0, cut)) > maxWidth) cut--;
          lines.push(rest.slice(0, cut));
          rest = rest.slice(cut);
        }
        return rest;
      };
      for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (this.getTextWidth(test) > maxWidth && line) {
          lines.push(line);
          line = this.getTextWidth(word) > maxWidth ? pushHardWrap(word) : word;
        } else if (this.getTextWidth(test) > maxWidth && !line) {
          line = pushHardWrap(word);
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      return lines.length ? lines : [''];
    }
    text(str, x, y) {
      const s = String(str == null ? '' : str);
      if (!s) return this;
      const py = this._pageH - y;
      const col = this._textColor;
      const cmds = this._pages[this._pageIdx];
      cmds.push(`${fmtNum(col[0] / 255)} ${fmtNum(col[1] / 255)} ${fmtNum(col[2] / 255)} rg`);
      cmds.push('BT');
      cmds.push(`/${this._fontKey()} ${fmtNum(this._fontSize)} Tf`);
      cmds.push(`1 0 0 1 ${fmtNum(x)} ${fmtNum(py)} Tm`);
      cmds.push(`(${pdfEscapeText(s)}) Tj`);
      cmds.push('ET');
      return this;
    }
    line(x1, y1, x2, y2) {
      const py1 = this._pageH - y1;
      const py2 = this._pageH - y2;
      const col = this._drawColor;
      const cmds = this._pages[this._pageIdx];
      cmds.push(`${fmtNum(col[0] / 255)} ${fmtNum(col[1] / 255)} ${fmtNum(col[2] / 255)} RG`);
      cmds.push(`${fmtNum(this._lineWidth)} w`);
      cmds.push(`${fmtNum(x1)} ${fmtNum(py1)} m`);
      cmds.push(`${fmtNum(x2)} ${fmtNum(py2)} l`);
      cmds.push('S');
      return this;
    }
    rect(x, y, w, h, style) {
      const py = this._pageH - y - h;
      const cmds = this._pages[this._pageIdx];
      if (style === 'F' || style === 'FD' || style === 'DF') {
        const col = this._fillColor;
        cmds.push(`${fmtNum(col[0] / 255)} ${fmtNum(col[1] / 255)} ${fmtNum(col[2] / 255)} rg`);
        cmds.push(`${fmtNum(x)} ${fmtNum(py)} ${fmtNum(w)} ${fmtNum(h)} re f`);
      } else {
        const col = this._drawColor;
        cmds.push(`${fmtNum(col[0] / 255)} ${fmtNum(col[1] / 255)} ${fmtNum(col[2] / 255)} RG`);
        cmds.push(`${fmtNum(x)} ${fmtNum(py)} ${fmtNum(w)} ${fmtNum(h)} re S`);
      }
      return this;
    }
    output(type) {
      const bytes = buildMiniPdfBytes(this);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      if (type === 'arraybuffer') return bytes.buffer;
      return blob; // 'blob' (dipakai kode di app ini) atau default
    }
    save(filename) {
      const blob = this.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }
  }

  const FONT_LIST = ['Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Helvetica-BoldOblique', 'Courier', 'Courier-Bold', 'Courier-Oblique', 'Courier-BoldOblique'];

  function pad10(n) { return String(n).padStart(10, '0'); }

  // Susun seluruh isi file PDF (header, objek, xref, trailer) sebagai
  // string 1-byte-per-karakter (Latin-1), lalu konversi ke Uint8Array -
  // ini format PDF minimal tapi valid yang dikenali semua PDF reader
  // (dites struktur-nya sesuai spesifikasi PDF 1.4 standar).
  function buildMiniPdfBytes(doc) {
    const count = doc._pages.length;
    const catalogNum = 1;
    const pagesNum = 2;
    const pageNumStart = 3;
    const contentNumStart = pageNumStart + count;
    const fontNumStart = contentNumStart + count;
    const fontResRefs = FONT_LIST.map((name, idx) => `/${name} ${fontNumStart + idx} 0 R`).join(' ');

    let pdf = '%PDF-1.4\n';
    const offsets = {};
    function addObj(num, content) {
      offsets[num] = pdf.length;
      pdf += `${num} 0 obj\n${content}\nendobj\n`;
    }

    addObj(catalogNum, `<< /Type /Catalog /Pages ${pagesNum} 0 R >>`);

    const kids = [];
    for (let i = 0; i < count; i++) kids.push(`${pageNumStart + i} 0 R`);
    addObj(pagesNum, `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${count} >>`);

    for (let i = 0; i < count; i++) {
      addObj(pageNumStart + i, `<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 ${fmtNum(doc._pageW)} ${fmtNum(doc._pageH)}] /Resources << /Font << ${fontResRefs} >> >> /Contents ${contentNumStart + i} 0 R >>`);
    }

    for (let i = 0; i < count; i++) {
      const streamText = doc._pages[i].join('\n') + '\n';
      addObj(contentNumStart + i, `<< /Length ${streamText.length} >>\nstream\n${streamText}endstream`);
    }

    FONT_LIST.forEach((name, idx) => {
      addObj(fontNumStart + idx, `<< /Type /Font /Subtype /Type1 /BaseFont /${name} /Encoding /WinAnsiEncoding >>`);
    });

    const maxObjNum = fontNumStart + FONT_LIST.length - 1;
    const xrefStart = pdf.length;
    let xref = `xref\n0 ${maxObjNum + 1}\n0000000000 65535 f \n`;
    for (let n = 1; n <= maxObjNum; n++) {
      xref += `${pad10(offsets[n])} 00000 n \n`;
    }
    pdf += xref;
    pdf += `trailer\n<< /Size ${maxObjNum + 1} /Root ${catalogNum} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    const bytes = new Uint8Array(pdf.length);
    for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
    return bytes;
  }

  window.MiniPdfDoc = MiniPdfDoc;
})();

// Selalu berhasil (return true): kalau library asli jsPDF gagal dimuat dari
// SEMUA mirror CDN (koneksi user memblokir cdnjs/jsdelivr/unpkg sekaligus),
// otomatis pasang generator PDF bawaan (MiniPdfDoc, murni lokal, tanpa
// internet) supaya fitur "buat PDF" tidak pernah gagal total lagi.
async function ensureJsPdfReady() {
  const realReady = await ensureLib(() => typeof jspdf !== 'undefined' && typeof jspdf.jsPDF === 'function', LIB_URLS.jspdf);
  if (realReady) return true;
  console.warn('[pdf] Semua mirror CDN jsPDF gagal dimuat - memakai generator PDF bawaan (offline, tanpa internet).');
  window.jspdf = window.jspdf || {};
  if (typeof window.jspdf.jsPDF !== 'function') window.jspdf.jsPDF = window.MiniPdfDoc;
  return typeof jspdf !== 'undefined' && typeof jspdf.jsPDF === 'function';
}

// Ekstrak isi arsip (kalau formatnya didukung) jadi daftar { name, content }
// untuk file-file teks di dalamnya. File biner/noise/kegedean di dalam arsip
// dilewati SEBELUM di-decode (biar tidak lag di HP kalau isinya ratusan file
// kayak npm cache). Return null kalau formatnya memang tidak didukung (rar,
// 7z). Return { notReady: true } kalau formatnya didukung tapi library-nya
// belum siap sampai batas waktu (lihat waitForJSZip di atas).
async function extractArchiveEntries(file, ext) {
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const entries = [];
  let usedCount = 0;
  let skippedBinary = 0;
  let skippedNoisy = 0;
  let totalChars = 0;

  function passesPreFilter(name, byteSize) {
    if (ARCHIVE_NOISE_RE.test(name) || isLockFile(name)) { skippedNoisy += 1; return false; }
    const e2 = fileExt(name);
    if (BINARY_EXT.has(e2) || ARCHIVE_EXT.has(e2)) { skippedBinary += 1; return false; }
    if (typeof byteSize === 'number' && byteSize > ARCHIVE_ENTRY_MAX_BYTES) { skippedBinary += 1; return false; }
    return true;
  }

  function tryAdd(name, text) {
    if (looksBinaryText(text)) { skippedBinary += 1; return; }
    if (totalChars >= MAX_TOTAL_FILE_CHARS) return;
    let chunk = text;
    if (chunk.length > ARCHIVE_ENTRY_MAX_CHARS) chunk = chunk.slice(0, ARCHIVE_ENTRY_MAX_CHARS) + '\n... (dipotong, terlalu panjang)';
    const remaining = MAX_TOTAL_FILE_CHARS - totalChars;
    if (chunk.length > remaining) chunk = chunk.slice(0, Math.max(0, remaining));
    if (!chunk) return;
    entries.push({ name, content: chunk });
    totalChars += chunk.length;
    usedCount += 1;
  }

  if (ext === 'zip' || ext === 'jar' || ext === 'war') {
    const ready = await ensureJSZipReady();
    if (!ready) return { entries: [], usedCount: 0, skippedBinary: 0, skippedNoisy: 0, notReady: true };
    const zip = await JSZip.loadAsync(file);
    for (const name of Object.keys(zip.files)) {
      if (totalChars >= MAX_TOTAL_FILE_CHARS) break;
      const entry = zip.files[name];
      if (entry.dir) continue;
      if (!passesPreFilter(name)) continue;
      try {
        const text = await entry.async('string');
        tryAdd(name, text);
      } catch { skippedBinary += 1; }
    }
  } else if (ext === 'tar' || ext === 'gz' || ext === 'tgz') {
    const buffer = ext === 'tar' ? await file.arrayBuffer() : await gunzip(file);
    let tarEntries = [];
    try { tarEntries = parseTar(buffer); } catch { tarEntries = []; }
    if (tarEntries.length === 0) {
      // Bukan tar - kemungkinan cuma satu file yang di-gzip (misal foo.txt.gz)
      const text = decoder.decode(buffer);
      tryAdd(file.name.replace(/\.(gz|tgz)$/i, ''), text);
    } else {
      for (const entry of tarEntries) {
        if (totalChars >= MAX_TOTAL_FILE_CHARS) break;
        if (!passesPreFilter(entry.name, entry.data.length)) continue;
        const text = decoder.decode(entry.data);
        tryAdd(entry.name, text);
      }
    }
  } else {
    return null;
  }

  return { entries, usedCount, skippedBinary, skippedNoisy };
}

// ---------- Ekstrak teks dari dokumen (PDF/DOCX/XLS/XLSX) ----------
// Sama pola-nya dengan extractArchiveEntries: return { notReady: true } kalau
// library-nya (dimuat dari cdnjs, lihat index.html) belum siap sampai batas
// waktu, atau { text, ... } kalau berhasil.
const MAX_PDF_PAGES = 200; // jaring pengaman biar PDF ratusan halaman tidak bikin HP hang

async function extractPdfText(file) {
  const ready = await ensurePdfJsReady();
  if (!ready) return { notReady: true };
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const pageCount = pdf.numPages;
  const pagesToRead = Math.min(pageCount, MAX_PDF_PAGES);
  const pageTexts = [];
  for (let i = 1; i <= pagesToRead; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pageTexts.push(content.items.map((it) => it.str).join(' '));
  }
  const truncated = pageCount > pagesToRead;
  return { text: pageTexts.join('\n\n'), pageCount, truncated };
}

async function extractDocxText(file) {
  const ready = await ensureMammothReady();
  if (!ready) return { notReady: true };
  const buf = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buf });
  return { text: result.value };
}

async function extractSpreadsheetText(file) {
  const ready = await ensureXlsxReady();
  if (!ready) return { notReady: true };
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const parts = wb.SheetNames.map((name) => {
    const csv = XLSX.utils.sheet_to_csv(wb.Sheets[name]);
    return `--- Sheet: ${name} ---\n${csv}`;
  });
  return { text: parts.join('\n\n'), sheetCount: wb.SheetNames.length };
}

// Ekstensi dokumen yang isinya dibaca lewat library di atas (bukan
// dianggap biner mentah kayak sebelumnya). ".doc" lama (format biner
// Word 97-2003, bukan .docx/OOXML) SENGAJA tidak dimasukkan - mammoth.js
// cuma bisa baca .docx, jadi .doc dikasih pesan error tersendiri di
// handleFiles daripada disamaratakan sebagai "biner tidak didukung".
const DOCUMENT_EXT = new Set(['pdf', 'docx', 'xls', 'xlsx']);

// Jaring pengaman kedua: kalau ekstensinya tidak dikenal tapi isinya
// ternyata biner (banyak byte NUL / karakter kontrol / hasil decode rusak),
// jangan dikirim sebagai teks mentah - itu cuma akan jadi sampah di chat.
function looksBinaryText(text) {
  if (!text) return false;
  const sample = text.slice(0, 4000);
  let suspicious = 0;
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    if (code === 0xfffd || (code < 32 && code !== 9 && code !== 10 && code !== 13)) {
      suspicious += 1;
    }
  }
  return sample.length > 0 && suspicious / sample.length > 0.03;
}

function fileExt(name) {
  const m = /\.([a-z0-9]+)$/i.exec(name || '');
  return m ? m[1].toLowerCase() : '';
}

function langForExt(ext) {
  const map = {
    js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
    html: 'html', htm: 'html', css: 'css', json: 'json', py: 'python',
    php: 'php', java: 'java', c: 'c', cpp: 'cpp', cs: 'csharp', rb: 'ruby',
    go: 'go', rs: 'rust', sql: 'sql', yml: 'yaml', yaml: 'yaml',
    xml: 'xml', sh: 'bash', md: 'markdown', txt: 'text'
  };
  return map[ext] || ext || 'text';
}

// { name, content, sizeChars, error? }
let attachedFiles = [];

function totalAttachedChars() {
  return attachedFiles.reduce((sum, f) => sum + (f.content ? f.content.length : 0), 0);
}

function renderFileChips() {
  els.fileChips.innerHTML = '';
  els.fileChips.classList.toggle('show', attachedFiles.length > 0);
  els.btnAttach.classList.toggle('has-files', attachedFiles.some((f) => !f.isImage));
  els.btnAttachImage.classList.toggle('has-files', attachedFiles.some((f) => f.isImage));

  attachedFiles.forEach((f, i) => {
    const chip = document.createElement('div');
    chip.className = 'file-chip'
      + (f.error ? ' err' : '')
      + (f.isImage ? ' file-chip-img' : '')
      + (f.pending ? ' pending' : '');
    // f.previewUrl = preview instan (URL.createObjectURL) yang tampil SEBELUM
    // gambar selesai diproses (resize/re-encode ke dataUrl) - jadi user
    // langsung lihat gambar aslinya, bukan cuma nunggu kotak kosong.
    if (f.isImage && (f.dataUrl || f.previewUrl)) {
      const thumb = document.createElement('img');
      thumb.className = 'fc-thumb';
      thumb.src = f.dataUrl || f.previewUrl;
      thumb.alt = '';
      chip.appendChild(thumb);
    }
    if (f.pending) {
      const spinner = document.createElement('span');
      spinner.className = 'fc-spinner';
      spinner.setAttribute('aria-hidden', 'true');
      chip.appendChild(spinner);
    }
    const name = document.createElement('span');
    name.className = 'fc-name';
    const suffix = f.pending ? t('filePending') : (f.error || f.note);
    name.textContent = suffix ? `${f.name} (${suffix})` : f.name;
    chip.appendChild(name);
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.className = 'fc-remove';
    rm.setAttribute('aria-label', `Hapus ${f.name}`);
    rm.textContent = '✕';
    rm.addEventListener('click', () => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      attachedFiles.splice(i, 1);
      renderFileChips();
    });
    chip.appendChild(rm);
    els.fileChips.appendChild(chip);
  });
}

// Update satu entri attachedFiles by id (dipakai buat nutup status "pending"
// begitu satu file selesai diproses, tanpa nunggu file lain yang mungkin
// masih diproses). Diam-diam no-op kalau entrinya sudah dihapus user
// (mis. dia buru-buru pencet ✕ sebelum proses selesai).
function updateAttachedFile(id, patch) {
  const idx = attachedFiles.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  attachedFiles[idx] = { ...attachedFiles[idx], ...patch };
  return true;
}

function looksLikeImageSync(file) {
  if (file.type === 'image/svg+xml') return false;
  if (file.type && file.type.startsWith('image/')) return true;
  return IMAGE_EXT.has(fileExt(file.name));
}


function addAttachedFile(id, name, content) {
  const ext = fileExt(name);
  if (BINARY_EXT.has(ext)) {
    updateAttachedFile(id, { content: '', error: t('binaryFileUnsupportedEdit'), pending: false });
    return;
  }
  let sliced = content;
  let note = null;
  if (sliced.length > MAX_SINGLE_FILE_CHARS) {
    sliced = sliced.slice(0, MAX_SINGLE_FILE_CHARS);
    note = t('truncatedNote');
  }
  updateAttachedFile(id, { content: sliced, note, pending: false });
}

async function handleFiles(fileList) {
  const files = Array.from(fileList);

  // Munculin chip "memproses..." buat SEMUA file yang baru dipilih SEKALIGUS,
  // sebelum satu pun mulai dibaca/diekstrak - biar user langsung lihat semua
  // file yang lagi diantre, bukan nunggu satu-satu baru muncul. Untuk gambar,
  // langsung tampilkan preview instan (createObjectURL) sambil nunggu proses
  // resize/re-encode-nya kelar di belakang layar.
  const queue = files.map((file) => {
    const id = uid();
    const isImg = looksLikeImageSync(file);
    attachedFiles.push({
      id,
      name: file.name,
      isImage: isImg,
      pending: true,
      previewUrl: isImg ? URL.createObjectURL(file) : null
    });
    return { id, file };
  });
  renderFileChips();

  for (const { id, file } of queue) {
    const ext = fileExt(file.name);

    // Dokumen (PDF/DOCX/XLS/XLSX): diekstrak jadi teks lewat pdf.js/mammoth/
    // xlsx (dimuat dari cdnjs, lihat index.html). ".doc" lama (format biner
    // Word 97-2003) dikasih pesan tersendiri karena mammoth cuma bisa baca
    // .docx, bukan .doc.
    if (ext === 'doc') {
      updateAttachedFile(id, { content: '', error: t('docLegacyUnsupported'), pending: false });
      renderFileChips();
      continue;
    }
    if (DOCUMENT_EXT.has(ext)) {
      try {
        let result;
        if (ext === 'pdf') result = await extractPdfText(file);
        else if (ext === 'docx') result = await extractDocxText(file);
        else result = await extractSpreadsheetText(file); // xls / xlsx

        if (result.notReady) {
          updateAttachedFile(id, { content: '', error: t('docLibNotReady'), pending: false });
          renderFileChips();
          continue;
        }
        let text = result.text || '';
        if (!text.trim()) {
          updateAttachedFile(id, { content: '', error: t('docNoTextExtracted'), pending: false });
          renderFileChips();
          continue;
        }
        let note = null;
        if (ext === 'pdf') {
          note = result.truncated ? `${MAX_PDF_PAGES} dari ${result.pageCount} halaman dibaca` : `${result.pageCount} halaman`;
        } else if (ext === 'xls' || ext === 'xlsx') {
          note = `${result.sheetCount} sheet`;
        }
        if (text.length > MAX_SINGLE_FILE_CHARS) {
          text = text.slice(0, MAX_SINGLE_FILE_CHARS);
          note = note ? `${note}, ${t('truncatedNote')}` : t('truncatedNote');
        }
        updateAttachedFile(id, { content: text, note, pending: false });
      } catch (err) {
        updateAttachedFile(id, { content: '', error: t('docReadError', { msg: err?.message || 'error' }), pending: false });
      }
      renderFileChips();
      continue;
    }

    // Arsip/kompresi: TIDAK pernah dipecah jadi satu chip per file (biar UI
    // tidak banjir kalau isinya ratusan file kecil), tapi isinya tetap
    // diekstrak di balik layar untuk format yang didukung, supaya AI benar-
    // benar bisa membaca kode yang ada di dalamnya sebelum mengerjakan tugas.
    if (ARCHIVE_EXT.has(ext)) {
      const supported = ['zip', 'jar', 'war', 'tar', 'gz', 'tgz'].includes(ext);
      if (!supported) {
        updateAttachedFile(id, { content: '', error: t('archiveUnsupported'), pending: false });
        renderFileChips();
        continue;
      }
      try {
        const result = await extractArchiveEntries(file, ext);
        if (!result) {
          updateAttachedFile(id, { content: '', error: t('archiveUnsupported'), pending: false });
          renderFileChips();
          continue;
        }
        if (result.notReady) {
          updateAttachedFile(id, { content: '', error: t('zipLibNotReady'), pending: false });
          renderFileChips();
          continue;
        }
        if (result.entries.length === 0) {
          updateAttachedFile(id, { content: '', error: t('archiveEmpty'), pending: false });
          renderFileChips();
          continue;
        }
        const noteParts = [t('filesRead', { count: result.usedCount })];
        if (result.skippedBinary) noteParts.push(t('binarySkipped', { count: result.skippedBinary }));
        if (result.skippedNoisy) noteParts.push(t('noiseSkipped', { count: result.skippedNoisy }));
        let combinedContent = result.entries.map((e) => e.content).join('\n');
        if (combinedContent.length > MAX_TOTAL_FILE_CHARS) combinedContent = combinedContent.slice(0, MAX_TOTAL_FILE_CHARS);
        updateAttachedFile(id, {
          content: combinedContent,
          entries: result.entries,
          note: noteParts.join(', '),
          pending: false
        });
      } catch (err) {
        updateAttachedFile(id, { content: '', error: t('archiveReadError', { msg: err?.message || 'error' }), pending: false });
      }
      renderFileChips();
      continue;
    }

    // Gambar (jpg/png/gif/webp/bmp): dibaca sebagai data URL (bukan teks),
    // dikecilkan kalau perlu, lalu dilampirkan supaya bisa dikirim ke model
    // vision sebagai bagian dari pesan.
    if (await isImageFile(file)) {
      const imageCount = attachedFiles.filter((f) => f.isImage && f.dataUrl && f.id !== id).length;
      if (imageCount >= MAX_IMAGES_PER_MESSAGE) {
        updateAttachedFile(id, { isImage: true, error: t('maxImagesReached', { max: MAX_IMAGES_PER_MESSAGE }), pending: false });
        renderFileChips();
        continue;
      }
      if (file.size > MAX_IMAGE_RAW_BYTES) {
        updateAttachedFile(id, { isImage: true, error: t('imageTooLarge', { max: formatKB(MAX_IMAGE_RAW_BYTES) }), pending: false });
        renderFileChips();
        continue;
      }
      try {
        const { dataUrl, width, height } = await processImageFile(file);
        const bytes = dataUrlBytes(dataUrl);
        if (totalAttachedImageBytes() + bytes > MAX_TOTAL_IMAGE_BYTES) {
          updateAttachedFile(id, { isImage: true, error: t('totalImageSizeFull'), pending: false });
        } else {
          updateAttachedFile(id, { isImage: true, dataUrl, width, height, note: formatKB(bytes), pending: false });
        }
      } catch (err) {
        updateAttachedFile(id, { isImage: true, error: t('imageReadError', { msg: err?.message || 'error' }), pending: false });
      }
      // Preview sementara sudah tidak perlu begitu dataUrl asli (atau error) siap.
      const entry = attachedFiles.find((f) => f.id === id);
      if (entry && entry.previewUrl) {
        URL.revokeObjectURL(entry.previewUrl);
        entry.previewUrl = null;
      }
      renderFileChips();
      continue;
    }

    // Jenis file yang jelas-jelas biner dari ekstensinya (audio, video,
    // dokumen office, dll) - lampirkan sebagai referensi saja,
    // jangan dicoba dibaca sebagai teks.
    if (BINARY_EXT.has(ext)) {
      updateAttachedFile(id, { content: '', error: t('binaryFileSkipped'), pending: false });
      renderFileChips();
      continue;
    }

    try {
      const text = await file.text();
      if (looksBinaryText(text)) {
        updateAttachedFile(id, { content: '', error: t('binaryDetectedInText'), pending: false });
      } else {
        addAttachedFile(id, file.name, text);
      }
    } catch {
      updateAttachedFile(id, { content: '', error: t('fileReadError'), pending: false });
    }
    renderFileChips();
  }
}

// btn-attach is now a <label for="file-input">, so a plain click/tap opens the
// system file picker natively (no JS needed for that part, and it can't silently
// no-op). We only need to wire up keyboard activation (Enter / Space), since
// labels aren't keyboard-activatable by default the way buttons are.
els.btnAttach.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    els.fileInput.click();
  }
});
els.fileInput.addEventListener('change', () => {
  if (els.fileInput.files.length) handleFiles(els.fileInput.files);
  els.fileInput.value = '';
});

// Tombol kedua: khusus upload gambar (galeri/kamera). Di HP, picker-nya
// langsung menampilkan Foto/Kamera karena input ini dibatasi ke image/*.
els.btnAttachImage.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    els.imageInput.click();
  }
});
els.imageInput.addEventListener('change', () => {
  if (els.imageInput.files.length) handleFiles(els.imageInput.files);
  els.imageInput.value = '';
});

// Drag & drop file langsung ke jendela chat
els.messages.addEventListener('dragover', (e) => e.preventDefault());
els.messages.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
});

// Paste (Ctrl+V) gambar langsung ke kotak chat — ini cara paling umum orang
// kirim screenshot (copy screenshot lalu paste), tapi sebelumnya TIDAK ada
// handler untuk ini sama sekali, jadi gambar yang di-paste tidak pernah
// ke-attach dan model jadi tidak pernah benar-benar menerima gambarnya.
function extractPastedFiles(clipboardData) {
  if (!clipboardData) return [];
  const files = [];
  const items = clipboardData.items;
  if (items && items.length) {
    for (const item of items) {
      if (item.kind === 'file') {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
  }
  if (!files.length && clipboardData.files?.length) {
    files.push(...Array.from(clipboardData.files));
  }
  return files;
}

function handlePasteEvent(e) {
  const files = extractPastedFiles(e.clipboardData);
  if (!files.length) return; // bukan paste gambar/file -> biarkan paste teks biasa jalan seperti biasa
  e.preventDefault();
  handleFiles(files);
}

els.text.addEventListener('paste', handlePasteEvent);
// Jaga-jaga: tangkap juga di level dokumen supaya paste tetap kena walau
// fokus lagi tidak persis di textarea (mis. baru klik area chat).
document.addEventListener('paste', (e) => {
  if (document.activeElement === els.text) return; // sudah ditangani listener di atas
  handlePasteEvent(e);
});

// Gabungkan pesan teks user + isi file terlampir jadi satu content yang
// dikirim ke AI (file teks/kode dibungkus code block berlabel nama file).
// Kalau ada gambar terlampir, hasilnya berupa array content ala OpenAI
// vision (bagian teks + satu bagian image_url per gambar) alih-alih string
// biasa, supaya bisa dibaca model vision di sisi provider.
function buildMessageWithAttachments(text) {
  const images = attachedFiles.filter((f) => f.isImage && f.dataUrl);
  const validFiles = attachedFiles.filter((f) => !f.isImage && f.content);

  if (attachedFiles.length === 0) return text;

  const parts = [];
  if (text) parts.push(text);

  if (validFiles.length) {
    const totalFileCount = validFiles.reduce((n, f) => n + (f.entries ? f.entries.length : 1), 0);
    parts.push(
      totalFileCount > 1
        ? t('analysisPromptMultiple', { count: totalFileCount })
        : t('analysisPromptSingle', { filename: validFiles[0].name })
    );
    validFiles.forEach((f) => {
      if (f.entries) {
        // Arsip: satu blok kode per file di dalamnya, dengan path aslinya.
        f.entries.forEach((entry) => {
          const lang = langForExt(fileExt(entry.name));
          parts.push(`\`\`\`${lang}\n// file: ${f.name} » ${entry.name}\n${entry.content}\n\`\`\``);
        });
      } else {
        const lang = langForExt(fileExt(f.name));
        parts.push(`\`\`\`${lang}\n// file: ${f.name}\n${f.content}\n\`\`\``);
      }
    });
  }

  const combinedText = parts.join('\n\n');
  if (!images.length) return combinedText;

  const contentParts = [];
  if (combinedText) contentParts.push({ type: 'text', text: combinedText });
  images.forEach((img) => {
    contentParts.push({ type: 'image_url', image_url: { url: img.dataUrl } });
  });
  return contentParts;
}

// Gambar dari pesan lama tidak dikirim ulang terus-menerus (payload bengkak);
// hanya beberapa pesan bergambar terakhir yang menyertakan gambarnya.
const MAX_IMAGE_MESSAGES_IN_CONTEXT = 3;

function buildOutgoingHistory() {
  const imageIdx = [];
  history.forEach((m, i) => { if (Array.isArray(m.content)) imageIdx.push(i); });
  const keep = new Set(imageIdx.slice(-MAX_IMAGE_MESSAGES_IN_CONTEXT));
  return history.map((m, i) => {
    if (!Array.isArray(m.content) || keep.has(i)) return { role: m.role, content: m.content };
    const textOnly = m.content.filter((p) => p.type === 'text').map((p) => p.text).join('\n\n');
    return { role: m.role, content: `${textOnly}\n\n[gambar terlampir di pesan ini sudah tidak dikirim ulang]` };
  });
}

// ---------- System prompt: persona (selalu aktif) + aturan edit-file (kondisional) ----------
// Sebelumnya SEMUA aturan (termasuk aturan panjang khusus edit-file) dikirim
// di SETIAP pesan, walau user cuma ngobrol biasa/roleplay tanpa lampiran
// apa pun. Buat model kecil (mis. model gratis di provider bawaan/Groq),
// instruksi sepanjang itu buat topik yang tidak relevan malah bikin
// jawabannya ngaco/nyasar - kadang modelnya balik "menjelaskan"/menggabung
// potongan instruksi itu sendiri alih-alih menjawab user (contoh nyata:
// user cuma ketik "ulang" pas lagi roleplay, tapi keluar penjelasan jQuery
// ngawur + file palsu, isinya nyampur sama istilah dari aturan di bawah
// kayak "style-2.css"). Makanya aturan edit-file yang berat cuma disisipkan
// kalau memang ada konteks file (dilampirkan sekarang ATAU sebelumnya di
// percakapan ini) - selebihnya cukup persona + aturan format kode yang
// ringan.
//
// Persona defaultnya bisa diganti dari config.js -> CONFIG.chat.systemPersona
// tanpa perlu sentuh app.js.
const DEFAULT_PERSONA = 'Kamu adalah asisten yang ramah dan sopan, tapi tidak suka basa-basi - langsung ke inti jawaban, tanpa pembukaan panjang atau mengulang-ulang pertanyaan user. SELALU balas dengan bahasa yang sama dengan pesan terakhir user (default-nya Bahasa Indonesia kalau tidak jelas) - jangan pernah beralih ke bahasa lain sendiri (mis. Arab/Inggris) walau model dasarnya punya kecenderungan bahasa tertentu. Kalau user mengajak roleplay atau minta kamu jadi karakter/persona tertentu, ikuti permintaan itu dengan wajar sambil tetap ramah dan sopan.';

const CODE_FORMAT_PROMPT = `Kalau jawabanmu berisi kode (HTML, CSS, JavaScript, atau bahasa pemrograman apa pun), SELALU bungkus kode itu di dalam pagar kode markdown tiga backtick dengan tag bahasanya, contoh:
\`\`\`css
.foo { color: red; }
\`\`\`
Jangan pernah menulis kode sebagai teks polos tanpa pagar backtick, walaupun jawabanmu isinya kode semua tanpa penjelasan.

Kalau user minta dibuatkan sesuatu yang sifatnya DOKUMEN JADI buat dibaca/dicetak/dikumpulkan - misalnya soal ujian/kuis, materi/modul/rangkuman pelajaran, kursus, worksheet/lembar kerja, surat, laporan, notulensi, proposal, CV, atau apa pun sejenis itu - buat sebagai file **.pdf** (BUKAN .md, BUKAN .txt), walau user tidak menyebut kata "pdf" secara eksplisit; nama file ".pdf" itu sendiri sudah cukup jadi sinyal ke aplikasi. Kecualikan aturan ini kalau konteksnya jelas-jelas source code/project software (mis. file README.md pendamping kode, dokumentasi API, dll) - itu tetap .md seperti biasa.

Cara nulis file .pdf: tulis isinya sebagai satu blok kode berlabel nama file ".pdf" itu, berisi MARKDOWN BIASA (bukan HTML, bukan ASCII-art tabel manual pakai spasi) - aplikasi akan otomatis me-render markdown itu (heading #/##/###, bold/italic, list -/1., tabel |kolom|kolom|, blockquote >, garis pemisah ---) jadi dokumen PDF asli dengan font, heading, dan tabel bergaris rapi. Jangan sisipkan HTML mentah di dalamnya.`;

const FILE_EDIT_RULES = `ATURAN PALING PENTING kalau kamu mengedit file yang sudah ada (file yang dilampirkan user lewat blok "// file: ..."):
1. SELALU tulis ULANG isi file itu SECARA UTUH dan LENGKAP dari baris pertama sampai baris terakhir di dalam SATU blok kode - bukan cuma bagian yang berubah. JANGAN PERNAH memotong/meringkas isi file dengan komentar seperti "// sisanya sama", "/* ... (sisanya tetap sama) ... */", "// rest unchanged", atau sejenisnya. User akan memakai file hasil balasanmu untuk LANGSUNG MENGGANTI file lamanya secara utuh - kalau ada bagian yang kamu hilangkan/ringkas, kode asli di bagian itu akan HILANG dan project user RUSAK.
2. Untuk SETIAP file, tulis PERSIS SATU blok kode saja yang berisi keseluruhan isi file itu setelah semua perubahan digabung. JANGAN membuat beberapa blok kode terpisah untuk file yang sama (misalnya satu blok berisi sebagian aturan CSS baru dan blok lain berisi sebagian lagi) - itu akan membuat aplikasi menyimpannya sebagai file duplikat alih-alih menyatu dengan file aslinya. Gabungkan SEMUA penambahan/perubahan untuk satu file ke dalam satu blok kode utuh untuk file tersebut.
3. Tulis nama file yang PERSIS SAMA (termasuk huruf besar/kecil dan path-nya kalau ada) seperti yang tertulis di label "// file: ..." pada file yang dilampirkan, sebagai baris teks tepat sebelum blok kodenya (misal heading atau teks biasa berisi nama filenya saja), supaya aplikasi tahu ini edit ke file yang sudah ada, bukan file baru.
4. Kalau ada lebih dari satu file berbeda yang perlu diubah, buat satu blok kode terpisah untuk MASING-MASING file yang benar-benar berbeda (bukan untuk pecahan dari file yang sama).

Kalau user melampirkan file (ditandai dengan blok kode berlabel "// file: ..." di pesan mereka), itu ARTINYA isi file tersebut memang berhasil dibaca dan disertakan di pesan itu. Baca dan analisis dulu SELURUH isi file yang dilampirkan sebelum menjalankan permintaan user - jangan pernah bilang file/kodenya tidak disertakan padahal ada blok "// file: ..." di pesan. Kalau user minta ubah/tambah sesuatu, edit berdasarkan kode yang sudah ada itu (ikuti aturan di atas: tulis ulang utuh, satu blok per file), jangan bikin dari nol kecuali diminta.`;

// Deteksi apakah ada (atau pernah ada) lampiran file di percakapan ini, dari
// tanda "// file: " yang disisipkan buildMessageWithAttachments() - dipakai
// buat mutusin perlu tidaknya FILE_EDIT_RULES disisipkan.
function historyHasFileContext(hist) {
  return hist.some((m) => {
    if (typeof m.content === 'string') return m.content.includes('// file: ');
    if (Array.isArray(m.content)) {
      return m.content.some((p) => p.type === 'text' && typeof p.text === 'string' && p.text.includes('// file: '));
    }
    return false;
  });
}

function buildSystemPrompt(hasFileContext) {
  const persona = (typeof CONFIG !== 'undefined' && CONFIG.chat && CONFIG.chat.systemPersona) || DEFAULT_PERSONA;
  const parts = [persona, CODE_FORMAT_PROMPT];
  if (hasFileContext) parts.push(FILE_EDIT_RULES);
  return parts.join('\n\n');
}

els.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const rawText = els.text.value.trim();
  const hasFiles = attachedFiles.length > 0;
  if (!rawText && !hasFiles) return;

  // Jangan kirim dulu kalau masih ada file/gambar yang lagi diekstrak/dibaca
  // (chip masih nampilin spinner "memproses...") - kalau dipaksa kirim,
  // AI bisa nerima isi kosong/setengah jadi buat file itu.
  if (attachedFiles.some((f) => f.pending)) {
    setStatus(t('filesStillPending'), 'err');
    return;
  }

  const provider = getActiveProvider();
  if (!provider) return setStatus(t('connectRequired'), 'err');
  const model = store.getModel(provider.id);
  if (!model) return setStatus(t('modelRequired'), 'err');

  if (totalAttachedChars() > MAX_TOTAL_FILE_CHARS) {
    setStatus(t('fileTooLarge', { max: MAX_TOTAL_FILE_CHARS.toLocaleString(NUMBER_LOCALE[currentLocale] || 'en-US') }), 'err');
    return;
  }

  const hasImages = attachedFiles.some((f) => f.isImage && f.dataUrl);
  const hasTextFiles = attachedFiles.some((f) => !f.isImage && f.content);
  let fallbackText = t('fallbackTextOnly');
  if (hasImages && !hasTextFiles) fallbackText = t('fallbackImageOnly');
  else if (hasImages && hasTextFiles) fallbackText = t('fallbackMixed');

  const text = buildMessageWithAttachments(rawText || fallbackText);
  const displayText = rawText;
  const fileNames = attachedFiles.filter((f) => !f.isImage).map((f) => f.name);
  const images = attachedFiles
    .filter((f) => f.isImage && f.dataUrl)
    .map((f) => ({ name: f.name, dataUrl: f.dataUrl }));

  els.text.value = '';
  attachedFiles = [];
  renderFileChips();

  history.push({ role: 'user', content: text, displayText, fileNames, images });
  store.setSessionHistory(store.activeSessionId, history);
  touchActiveSession();
  renderMessage('user', displayText, { fileNames, images });

  const botDiv = renderTypingIndicator();
  els.btnSend.disabled = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-provider-key': provider.apikey,
        'x-provider-base-url': provider.baseUrl
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: buildSystemPrompt(historyHasFileContext(history)) }, ...buildOutgoingHistory()],
        baseUrl: provider.baseUrl
      })
    });

    if (!res.ok || !res.body) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Error ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    // Sengaja TIDAK menampilkan isi jawaban sepotong-sepotong saat masih
    // streaming (baik teks mentah maupun kode) - user cuma mau lihat status
    // singkat semacam "Membuat file index.html..." selagi diproses, lalu
    // hasil akhir yang sudah rapi (renderRichInto) muncul sekali jadi
    // setelah stream-nya selesai total. Lihat updateStreamingStatus().
    let statusScheduled = false;
    let streamFinished = false;
    function updateStreamingStatus() {
      if (statusScheduled) return;
      statusScheduled = true;
      requestAnimationFrame(() => {
        statusScheduled = false;
        if (streamFinished) return;
        renderStreamingStatus(botDiv, fullText);
        els.messages.scrollTop = els.messages.scrollHeight;
      });
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            updateStreamingStatus();
          }
        } catch {
          // baris tidak lengkap, biarkan buffer menangani di iterasi berikutnya
        }
      }
    }

    history.push({ role: 'assistant', content: fullText });
    store.setSessionHistory(store.activeSessionId, history);
    touchActiveSession();
    // Lepas class status streaming (display:flex) supaya bubble kembali jadi
    // layout normal bertumpuk ke bawah, bukan teks & kartu file menyamping.
    streamFinished = true;
    botDiv.className = 'msg bot';
    delete botDiv.dataset.streamLabel;
    renderRichInto(botDiv, fullText);
    els.messages.scrollTop = els.messages.scrollHeight;
  } catch (err) {
    botDiv.textContent = `⚠️ ${err.message}`;
    botDiv.className = 'msg system';
  } finally {
    els.btnSend.disabled = false;
  }
});

// init
(function init() {
  // Terapkan bahasa antarmuka yang tersimpan (default: id) - dipanggil
  // paling awal biar teks yang di-render init() di bawah (empty history,
  // dll) sudah dalam bahasa yang benar dari awal, bukan kedip Indonesia dulu.
  applyLocale(currentLocale);

  // Visitor yang BENAR-BENAR baru (belum pernah nyimpen provider apa pun di
  // browser ini) otomatis dikasih provider default dari config.js -> app.defaultProvider,
  // supaya bisa langsung chat tanpa harus tahu apa itu "base URL"/"API key" -
  // ditandai isDefault:true biar saklar Auto di navbar tahu ini provider
  // bawaan (lihat activateDefaultProvider/syncAutoToggle di atas).
  // Kalau mereka nanti tambah/isi provider sendiri, ini tidak dijalankan lagi
  // (baru jalan lagi kalau semua provider dihapus balik ke kosong).
  if (store.providers.length === 0) {
    const dp = getDefaultProviderConfig();
    if (dp && dp.enabled && dp.baseUrl) {
      const provider = { id: uid(), name: dp.name || 'Provider bawaan', baseUrl: String(dp.baseUrl).replace(/\/+$/, ''), apikey: '', isDefault: true };
      store.providers = [provider];
      store.activeProviderId = provider.id;
    }
  }

  renderPresetChips();
  populateProviderSelect();
  const provider = getActiveProvider();
  fillFormFromProvider(provider);
  updateHeaderModel();
  syncAutoToggle();
  renderHistory();
  renderSessionList();

  // refresh daftar model provider aktif di background (cache-first)
  if (provider) {
    fetchModels(provider.baseUrl, provider.apikey)
      .then((models) => {
        store.setModels(provider.id, models);
        // Sama kayak activateDefaultProvider(): kalau ini provider bawaan
        // (visitor baru, belum pernah pilih provider sendiri), paksa ke
        // AUTO_PROVIDER_PREFERRED_MODEL kalau tersedia - biar visitor baru
        // langsung dapat model yang benar (bisa baca gambar, bahasa benar)
        // tanpa perlu tahu apa-apa soal pilih model.
        if (provider.isDefault && models.some((m) => m.id === AUTO_PROVIDER_PREFERRED_MODEL)) {
          store.setModel(provider.id, AUTO_PROVIDER_PREFERRED_MODEL);
        }
        populateModelSelect(models, provider.id);
        setStatus(t('connectSuccess', { count: models.length, name: provider.name }), 'ok');
        setConnIndicator('connected');
      })
      .catch(() => {});
  }
})();
