require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Pterodactyl biasanya menyuntikkan port lewat env PORT atau SERVER_PORT
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

// Provider bawaan opsional lewat .env (fallback jika frontend tidak kirim baseUrl)
const DEFAULT_BASE_URL = (process.env.DEFAULT_BASE_URL || '').trim().replace(/\/+$/, '');

// Kunci API bawaan (opsional) - HANYA diisi lewat .env di server, TIDAK PERNAH lewat
// file yang dikirim ke browser (config.js dkk itu publik, siapa pun bisa baca isinya).
// Cuma dipakai kalau request-nya ke DEFAULT_BASE_URL persis DAN browser tidak kirim
// API key sendiri - supaya visitor baru bisa langsung chat pakai kuota kamu tanpa
// harus daftar API key dulu, tapi kunci ini tidak diam-diam kepakai buat domain lain
// yang diketik visitor sendiri.
const DEFAULT_API_KEY = process.env.DEFAULT_API_KEY || '';

// Batas pemakaian HARIAN khusus buat request yang pakai DEFAULT_API_KEY (bukan yang
// bawa API key sendiri) - jaga-jaga supaya kalau situsnya rame/disalahgunakan, kuota/
// tagihan provider punya kamu tidak jebol. Reset tiap server restart + tiap gonta hari
// (cukup buat proteksi ringan; bukan pengganti batas limit resmi di dashboard provider).
const DEFAULT_KEY_DAILY_LIMIT = Number(process.env.DEFAULT_KEY_DAILY_LIMIT || 200);
let defaultKeyUsage = { day: '', count: 0 };
function defaultKeyQuotaOk() {
  if (!DEFAULT_KEY_DAILY_LIMIT) return true;
  const today = new Date().toISOString().slice(0, 10);
  if (defaultKeyUsage.day !== today) defaultKeyUsage = { day: today, count: 0 };
  if (defaultKeyUsage.count >= DEFAULT_KEY_DAILY_LIMIT) return false;
  defaultKeyUsage.count += 1;
  return true;
}

const ANTHROPIC_VERSION = '2023-06-01';

// Berapa lama maksimal nunggu SATU percobaan (openai-style ATAU anthropic-style)
// sebelum dianggap gagal. Kedua percobaan dijalankan BARENGAN (paralel), jadi
// total waktu tunggu = percobaan yang paling cepat selesai, bukan dijumlah.
const DETECT_TIMEOUT_MS = 6000;

app.use(cors());
// Dinaikkan dari 2mb ke 25mb supaya pesan dengan lampiran gambar (base64)
// tidak ditolak oleh body parser.
app.use(express.json({ limit: '25mb' }));
// no-cache: browser SELALU cek ke server apakah app.js/style.css berubah, jadi
// update file dari panel langsung kepakai tanpa perlu hard refresh manual.
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  setHeaders: (res) => res.setHeader('Cache-Control', 'no-cache')
}));

// ----------------------------- Util -----------------------------

function getApiKey(req) {
  return req.headers['x-provider-key'] || req.query.apikey || req.body?.apikey || '';
}

// Kunci bawaan (DEFAULT_API_KEY) cuma dipakai kalau: (1) browser tidak kirim API
// key sendiri, (2) baseUrl yang diminta PERSIS sama dengan DEFAULT_BASE_URL, dan
// (3) kuota harian belum habis. quotaExceeded dipakai buat kasih pesan yang jelas
// ke visitor ("kuota gratis habis, isi API key sendiri") - bukan cuma "API key wajib diisi".
function resolveApiKey(req) {
  const explicit = getApiKey(req);
  if (explicit) return { apiKey: explicit, quotaExceeded: false };
  if (!DEFAULT_API_KEY || !DEFAULT_BASE_URL) return { apiKey: '', quotaExceeded: false };
  const baseUrl = getBaseUrl(req);
  if (baseUrl !== DEFAULT_BASE_URL) return { apiKey: '', quotaExceeded: false };
  if (!defaultKeyQuotaOk()) return { apiKey: '', quotaExceeded: true };
  return { apiKey: DEFAULT_API_KEY, quotaExceeded: false };
}

// Domain penyedia AI dikirim dari frontend (mis. https://api.groq.com/openai/v1,
// https://api.openai.com/v1, https://openrouter.ai/api/v1, https://api.anthropic.com/v1,
// dll — baik yang mengikuti konvensi OpenAI (GET /models, POST /chat/completions,
// Authorization: Bearer) maupun konvensi Anthropic (GET /models, POST /messages,
// x-api-key). Server otomatis mendeteksi mana yang cocok.
function getBaseUrl(req) {
  const raw =
    req.headers['x-provider-base-url'] || req.query.baseUrl || req.body?.baseUrl || DEFAULT_BASE_URL;
  if (!raw) return null;
  const trimmed = String(raw).trim().replace(/\/+$/, '');
  try {
    const u = new URL(trimmed);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return trimmed;
  } catch {
    return null;
  }
}

// fetch dengan timeout eksplisit lewat AbortController, supaya provider yang
// lambat/mati tidak bikin request nge-hang lama-lama.
async function fetchWithTimeout(url, opts, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opts, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function normalizeModelList(rawModels) {
  return rawModels
    .map((m) => ({
      id: m.id || m.name || m.model,
      owned_by: m.owned_by || m.owner || null,
      context_window: m.context_window || m.context_length || null,
      active: m.active !== undefined ? m.active : true
    }))
    .filter((m) => m.id)
    .sort((a, b) => a.id.localeCompare(b.id));
}

// ----------------------------- Deteksi gaya API (paralel, bukan berurutan) -----------------------------

// Cache ringan di memori: begitu satu (baseUrl + apiKey) berhasil terdeteksi,
// permintaan chat berikutnya tidak perlu deteksi ulang -> langsung cepat.
// PENTING: menyimpan HASIL KEDUA probe (openai & anthropic), bukan cuma satu
// "pemenang" - supaya gaya request bisa dipilih ULANG per model yang dipakai
// (lihat pickStyleForModel), bukan dipaksa satu gaya untuk seluruh provider.
// Ini memperbaiki bug: banyak gateway "OpenAI-compatible" yang sebenarnya
// meneruskan ke Claude/Anthropic di baliknya, tetap membalas 200 OK di kedua
// endpoint /models (auth header tidak divalidasi ketat di listing model) -
// kalau gaya dipukul rata ke 'openai', konten gambar (image_url) dikirim ke
// endpoint yang tidak tahu cara membongkarnya, jadi modelnya "buta" walau
// chat teks biasa tetap jalan (karena teks string biasa lolos apa adanya).
const styleCache = new Map(); // key -> { openai: {ok,models}|null, anthropic: {ok,models}|null, ts }
const STYLE_CACHE_TTL_MS = 30 * 60 * 1000; // 30 menit

function cacheKey(baseUrl, apiKey) {
  return `${baseUrl}::${apiKey}`;
}

function getCachedDetection(baseUrl, apiKey) {
  const entry = styleCache.get(cacheKey(baseUrl, apiKey));
  if (!entry) return null;
  if (Date.now() - entry.ts > STYLE_CACHE_TTL_MS) {
    styleCache.delete(cacheKey(baseUrl, apiKey));
    return null;
  }
  return entry;
}

function setCachedDetection(baseUrl, apiKey, detection) {
  styleCache.set(cacheKey(baseUrl, apiKey), { ...detection, ts: Date.now() });
}

// Sebuah model dianggap "keluarga Claude/Anthropic" dari namanya sendiri
// (mis. "claude-sonnet-5", "claude-3-5-haiku", dst). Ini dipakai supaya
// gaya request yang dipilih SELALU cocok dengan model yang benar-benar
// dipakai user saat itu, bukan asumsi global per-provider.
function looksLikeClaudeModel(model) {
  return /claude/i.test(String(model || ''));
}

// Pilih gaya request ('openai' | 'anthropic') UNTUK MODEL INI SPESIFIK,
// berdasarkan probe mana saja yang benar-benar sukses. Kalau kedua gaya
// sukses (gateway permisif), prioritaskan gaya yang cocok dengan nama
// modelnya sendiri dulu - baru fallback ke default 'openai' kalau nama
// model tidak memberi petunjuk apa pun.
function pickStyleForModel(detection, model) {
  const openaiOk = !!detection.openai?.ok;
  const anthropicOk = !!detection.anthropic?.ok;
  if (openaiOk && anthropicOk) {
    return looksLikeClaudeModel(model) ? 'anthropic' : 'openai';
  }
  if (openaiOk) return 'openai';
  if (anthropicOk) return 'anthropic';
  return null;
}

async function probeOpenAIModels(baseUrl, apiKey) {
  const res = await fetchWithTimeout(
    `${baseUrl}/models`,
    { headers: { Authorization: `Bearer ${apiKey}` } },
    DETECT_TIMEOUT_MS
  );
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`openai:${res.status}:${text.slice(0, 200)}`);
  }
  // Beberapa gateway/reverse-proxy membalas status 200 OK tapi isinya HALAMAN HTML
  // (halaman landing, halaman error custom, dsb), bukan JSON - biasanya karena
  // path endpoint-nya sebenarnya salah/tidak ada. res.json() langsung throw kalau
  // dipaksa di sini (SyntaxError "Unexpected token '<'..."), jadi ambil teks dulu
  // dan parse manual supaya errornya jelas mengarah ke "bukan JSON", bukan pesan
  // parsing mentah yang membingungkan buat user.
  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`openai:non-json:${raw.slice(0, 200).replace(/\s+/g, ' ')}`);
  }
  const rawModels = Array.isArray(data.data) ? data.data : Array.isArray(data.models) ? data.models : [];
  const models = normalizeModelList(rawModels);
  if (!models.length) throw new Error('openai:empty');
  return { style: 'openai', models };
}

async function probeAnthropicModels(baseUrl, apiKey) {
  const res = await fetchWithTimeout(
    `${baseUrl}/models`,
    { headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION } },
    DETECT_TIMEOUT_MS
  );
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`anthropic:${res.status}:${text.slice(0, 200)}`);
  }
  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`anthropic:non-json:${raw.slice(0, 200).replace(/\s+/g, ' ')}`);
  }
  const rawModels = Array.isArray(data.data) ? data.data : Array.isArray(data.models) ? data.models : [];
  const models = normalizeModelList(rawModels);
  if (!models.length) throw new Error('anthropic:empty');
  return { style: 'anthropic', models };
}

// Coba dua gaya API SEKALIGUS (paralel, supaya tetap cepat), TAPI tunggu
// keduanya selesai lalu pilih secara KONSISTEN - bukan siapa pun yang duluan
// selesai. Kalau cuma "siapa duluan sukses" yang dipakai (Promise.any), dan
// gateway-nya kebetulan menjawab 200 OK untuk KEDUA gaya endpoint /models
// (lazim terjadi di banyak gateway yang tidak strict validasi header auth di
// endpoint listing model), gaya yang kepilih jadi acak tergantung mana yang
// lebih cepat di jaringan saat itu - kadang 'openai', kadang 'anthropic'.
// Akibatnya format konten (termasuk gambar) yang dikirim ke provider bisa
// salah bentuk secara tidak konsisten antar sesi/percobaan, walau setupnya
// sama persis. OpenAI-style diprioritaskan kalau dua-duanya sukses, karena
// itu format yang paling umum didukung gateway "provider apa saja".
// Menjalankan KEDUA probe dan mengembalikan hasil KEDUANYA (bukan cuma satu
// "pemenang"), supaya pemanggil bisa memilih gaya per-model lewat
// pickStyleForModel(). `models` & `style` di return value tetap ada untuk
// kompatibilitas pemanggil lama (dropdown daftar model di /api/models).
async function detectProviderFast(baseUrl, apiKey) {
  const [openaiResult, anthropicResult] = await Promise.allSettled([
    probeOpenAIModels(baseUrl, apiKey),
    probeAnthropicModels(baseUrl, apiKey)
  ]);

  const detection = {
    openai: openaiResult.status === 'fulfilled' ? { ok: true, models: openaiResult.value.models } : null,
    anthropic: anthropicResult.status === 'fulfilled' ? { ok: true, models: anthropicResult.value.models } : null
  };

  if (!detection.openai && !detection.anthropic) {
    // Keduanya gagal -> kumpulkan pesan yang paling informatif buat ditampilkan ke user.
    const errors = [openaiResult.reason, anthropicResult.reason].map((e) => e?.message || String(e));
    const detail = errors.join(' | ');
    const err = new Error(
      detail.includes('401') || detail.includes('403')
        ? 'API key ditolak provider (401/403). Cek lagi API key-nya.'
        : detail.includes('404')
        ? 'Endpoint /models tidak ditemukan di domain ini. Cek lagi base URL-nya.'
        : detail.includes('non-json')
        ? `Domain ini membalas dengan HTML/halaman biasa, bukan data model (JSON), waktu dicoba di "${baseUrl}/models". Ini biasanya berarti base URL-nya kurang tepat (path endpoint API-nya beda) atau domain ini bukan endpoint API OpenAI/Anthropic-compatible. Cek lagi dokumentasi API provider ini untuk base URL yang benar.`
        : `Tidak berhasil terhubung ke provider. Detail: ${detail || 'tidak ada respons'}`
    );
    throw err;
  }

  // Gabungkan daftar model dari gaya mana pun yang sukses (buat dropdown),
  // dan tetap sertakan `style` (default 'openai' kalau dua-duanya sukses)
  // untuk pemanggil lama yang cuma butuh satu gaya representatif.
  const mergedModels = [
    ...(detection.openai?.models || []),
    ...(detection.anthropic?.models || [])
  ];
  const uniqueModels = Array.from(new Map(mergedModels.map((m) => [m.id, m])).values()).sort((a, b) =>
    a.id.localeCompare(b.id)
  );

  return {
    style: detection.openai ? 'openai' : 'anthropic',
    models: uniqueModels,
    detection
  };
}

// ----------------------------- GET /api/models -----------------------------

app.get('/api/models', async (req, res) => {
  const baseUrl = getBaseUrl(req);
  if (!baseUrl) return res.status(400).json({ error: 'Domain/base URL penyedia AI wajib diisi.' });
  const { apiKey, quotaExceeded } = resolveApiKey(req);
  if (!apiKey) {
    return res.status(400).json({
      error: quotaExceeded
        ? 'Kuota gratis (kunci bawaan) hari ini sudah habis. Silakan isi API key kamu sendiri di Pengaturan.'
        : 'API key wajib diisi.'
    });
  }

  try {
    const { style, models, detection } = await detectProviderFast(baseUrl, apiKey);
    setCachedDetection(baseUrl, apiKey, detection);
    res.json({ models, style });
  } catch (err) {
    res.status(502).json({ error: err.message || 'Gagal menghubungi penyedia AI.' });
  }
});

// ----------------------------- POST /api/chat -----------------------------

const LANGUAGE_SYSTEM_PROMPT =
  'Selalu balas dalam bahasa yang sama persis dengan bahasa yang dipakai user di pesan terakhirnya. ' +
  'Jika user menulis dalam Bahasa Indonesia, balas 100% dalam Bahasa Indonesia (jangan campur bahasa lain, ' +
  'jangan pakai Bahasa Arab kecuali user memakainya). Jangan minta izin atau konfirmasi soal bahasa, langsung jawab.';

// Deteksi apakah body request yang dikirim ke provider memuat gambar
// (content array berisi image_url/image) - dipakai buat kasih pesan error
// yang jelas kalau provider menolak karena model yang dipilih memang tidak
// mendukung gambar (banyak model teks-saja seperti Groq openai/gpt-oss-*
// menolak dengan pesan teknis semacam "messages[1].content must be a
// string" begitu ada content berbentuk array/gambar - bukan errornya
// aplikasi, tapi modelnya bukan model vision).
function bodyHasImageContent(body) {
  const msgs = Array.isArray(body?.messages) ? body.messages : [];
  return msgs.some(
    (m) => Array.isArray(m.content) && m.content.some((p) => p && (p.type === 'image_url' || p.type === 'image'))
  );
}

function maybeFriendlyVisionError(errText, hadImage) {
  if (!hadImage) return null;
  const lower = String(errText).toLowerCase();
  const looksLikeVisionIssue =
    lower.includes('image') ||
    lower.includes('vision') ||
    lower.includes('multimodal') ||
    lower.includes('content must be a string') ||
    lower.includes('does not support');
  if (!looksLikeVisionIssue) return null;
  return (
    'Model yang dipilih kemungkinan besar TIDAK mendukung gambar (bukan model vision), ' +
    'jadi gambar yang kamu lampirkan ditolak provider. Ganti dulu ke model vision - kalau ' +
    'pakai Groq, coba "qwen/qwen3.8-27b" - lalu kirim ulang.\n\nError asli dari provider: ' +
    errText
  );
}

function buildOpenAIRequestBody(messages, model, temperature) {
  const hasSystemMsg = messages.some((m) => m.role === 'system');
  const finalMessages = hasSystemMsg
    ? messages.map((m) => (m.role === 'system' ? { ...m, content: `${m.content}\n\n${LANGUAGE_SYSTEM_PROMPT}` } : m))
    : [{ role: 'system', content: LANGUAGE_SYSTEM_PROMPT }, ...messages];

  return {
    model,
    messages: finalMessages,
    temperature: temperature ?? 0.7,
    stream: true
  };
}

// Frontend mengirim content ala OpenAI vision untuk pesan berlampiran gambar:
// [{type:'text', text}, {type:'image_url', image_url:{url:'data:<mime>;base64,<data>'}}].
// Gaya Anthropic butuh bentuk lain: {type:'image', source:{type:'base64', media_type, data}}.
// Fungsi ini mengonversi kalau perlu; content string biasa dibiarkan apa adanya.
function toAnthropicContent(content) {
  if (typeof content === 'string' || !Array.isArray(content)) return content;
  const converted = content
    .map((part) => {
      if (part.type === 'text') return { type: 'text', text: part.text };
      if (part.type === 'image_url') {
        const url = part.image_url?.url || '';
        const match = /^data:([^;]+);base64,(.*)$/.exec(url);
        if (!match) {
          console.warn('[toAnthropicContent] data URL gambar tidak cocok pola yang diharapkan, gambar dilewati.');
          return null;
        }
        return { type: 'image', source: { type: 'base64', media_type: match[1], data: match[2] } };
      }
      return null;
    })
    .filter(Boolean);
  if (content.some((p) => p.type === 'image_url') && !converted.some((p) => p.type === 'image')) {
    console.warn('[toAnthropicContent] pesan berisi gambar tapi hasil konversi tidak punya blok image sama sekali.');
  }
  return converted;
}

function buildAnthropicRequestBody(messages, model) {
  // Anthropic tidak menerima role "system" di dalam array messages — harus dipisah
  // jadi field "system" tersendiri di level atas.
  const systemParts = messages.filter((m) => m.role === 'system').map((m) => m.content);
  const systemPrompt = [...systemParts, LANGUAGE_SYSTEM_PROMPT].filter(Boolean).join('\n\n');
  const chatMessages = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: toAnthropicContent(m.content) }));

  return {
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: chatMessages,
    stream: true
  };
}

// Ubah SSE ala Anthropic (content_block_delta / message_stop) jadi SSE ala OpenAI
// (choices[0].delta.content / [DONE]) supaya frontend TIDAK perlu diubah sama sekali —
// dia tetap parsing format OpenAI seperti biasa.
function anthropicChunkToOpenAI(text) {
  return `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;
}

async function proxyOpenAIChat(baseUrl, apiKey, body, res) {
  const providerRes = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!providerRes.ok || !providerRes.body) {
    const errText = await providerRes.text();
    const friendly = maybeFriendlyVisionError(errText, bodyHasImageContent(body));
    return res.status(providerRes.status || 500).json({ error: friendly || `API error: ${errText}` });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const reader = providerRes.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(decoder.decode(value, { stream: true }));
  }
  res.end();
}

async function proxyAnthropicChat(baseUrl, apiKey, body, res) {
  const providerRes = await fetch(`${baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!providerRes.ok || !providerRes.body) {
    const errText = await providerRes.text();
    const friendly = maybeFriendlyVisionError(errText, bodyHasImageContent(body));
    return res.status(providerRes.status || 500).json({ error: friendly || `API error: ${errText}` });
  }


  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const reader = providerRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

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
      if (!payload) continue;
      let chunk;
      try {
        chunk = JSON.parse(payload);
      } catch {
        continue;
      }
      if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
        res.write(anthropicChunkToOpenAI(chunk.delta.text));
      } else if (chunk.type === 'message_stop') {
        break;
      }
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
}

app.post('/api/chat', async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const { model, messages, temperature } = req.body;

  if (!baseUrl) return res.status(400).json({ error: 'Domain/base URL penyedia AI wajib diisi.' });
  const { apiKey, quotaExceeded } = resolveApiKey(req);
  if (!apiKey) {
    return res.status(400).json({
      error: quotaExceeded
        ? 'Kuota gratis (kunci bawaan) hari ini sudah habis. Silakan isi API key kamu sendiri di Pengaturan.'
        : 'API key wajib diisi.'
    });
  }
  if (!model) return res.status(400).json({ error: 'Model belum dipilih.' });
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'Format messages tidak valid.' });

  try {
    // Cache-hit -> langsung tahu hasil kedua probe-nya, tidak ada delay deteksi ulang.
    let detection = getCachedDetection(baseUrl, apiKey);
    if (!detection) {
      const detected = await detectProviderFast(baseUrl, apiKey);
      detection = detected.detection;
      setCachedDetection(baseUrl, apiKey, detection);
    }

    // Gaya request dipilih PER MODEL yang dipakai sekarang, bukan dipukul
    // rata per-provider - ini kuncinya supaya gambar sampai dalam bentuk
    // yang benar ke model Claude/Anthropic walau gateway-nya juga lolos
    // probe gaya OpenAI (lihat komentar di pickStyleForModel).
    const style = pickStyleForModel(detection, model);
    if (!style) {
      return res.status(502).json({ error: 'Tidak berhasil terhubung ke provider untuk model ini.' });
    }

    if (style === 'anthropic') {
      const body = buildAnthropicRequestBody(messages, model);
      await proxyAnthropicChat(baseUrl, apiKey, body, res);
    } else {
      const body = buildOpenAIRequestBody(messages, model, temperature);
      await proxyOpenAIChat(baseUrl, apiKey, body, res);
    }
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Gagal menghubungi penyedia AI: ' + err.message });
    } else {
      res.end();
    }
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ---- Jaring pengaman terakhir: PASTIKAN semua error selalu balik sebagai JSON ----
//
// Tanpa ini, kalau ada error yang lolos dari try/catch di masing-masing route
// (bug tak terduga, dependency error, dll), Express jatuh ke halaman error
// bawaannya sendiri yang formatnya HTML - dan itu PERSIS yang bikin frontend
// gagal parse response ("Unexpected token '<', <!DOCTYPE ... is not valid
// JSON") walau kodenya sendiri sebenarnya sudah benar. Middleware 4-argumen
// ini menangkap SEMUA error yang belum tertangani di route manapun dan selalu
// balas JSON, bukan HTML.
app.use((err, req, res, next) => {
  console.error('[unhandled route error]', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Terjadi error tak terduga di server: ' + (err?.message || String(err)) });
});

// Proses Node TIDAK BOLEH mati diam-diam gara-gara satu request yang error -
// kalau proses mati, SEMUA request berikutnya (termasuk yang tidak ada
// hubungannya sama sekali) akan ditolak oleh reverse proxy di depannya
// dengan halaman error HTML generik sampai server di-restart manual dari
// panel. Log errornya, tapi tetap jalan.
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException] server tetap jalan, tapi ada bug perlu dicek:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection] server tetap jalan, tapi ada bug perlu dicek:', err);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI Chat App berjalan di port ${PORT}`);
});
