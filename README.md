# AI Chat App (Multi-Provider)

Aplikasi chat AI open source yang **tidak terkunci ke satu penyedia**. Tinggal masukkan
**domain/base URL API** dari penyedia AI mana pun yang kompatibel dengan spesifikasi
endpoint ala OpenAI (`GET /models`, `POST /chat/completions`), tempel **API key**-nya,
dan aplikasi otomatis mencari & menampilkan semua model yang tersedia dari provider itu.

Provider bisa disimpan lebih dari satu (multi-provider) dan tinggal pindah-pindah lewat
dropdown "Provider tersimpan" di sidebar — cocok untuk Groq, OpenAI, OpenRouter,
Together AI, Mistral, DeepSeek, Fireworks, Cerebras, xAI, atau endpoint self-hosted
(mis. LM Studio / Ollama / vLLM yang expose endpoint ala OpenAI) — apa saja, tinggal isi domainnya.

## Fitur
- **Bring your own provider**: input nama + domain (base URL) + API key → auto-fetch daftar
  model dari endpoint `/models` domain tersebut
- Preset cepat (klik chip) untuk provider populer, tapi field domain tetap bisa diisi manual
  dengan domain apa pun
- Multi-provider tersimpan — pindah provider tanpa isi ulang API key
- Menu dropdown untuk memilih model aktif (per provider)
- **Dua tombol upload**: 📎 *Upload file* (kode/teks/zip) dan 🖼️ *Upload gambar* (galeri/kamera HP). Gambar otomatis dikecilkan & dikonversi ke JPEG sebelum dikirim ke model vision
- Chat streaming (server-sent events) mirip ChatGPT
- Riwayat chat, daftar provider & API key disimpan di localStorage browser (tidak disimpan di server)
- Tanpa framework frontend, tanpa build step — murni HTML/CSS/JS + Express

## Struktur Proyek
```
ai-chat-app/
├── server.js          # backend Express, proxy generik ke domain provider AI manapun
├── package.json
├── .env.example
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```

## Jalankan di Lokal
```bash
npm install
cp .env.example .env
npm start
```
Buka `http://localhost:3000`. Di sidebar:
1. Isi **Nama provider** (bebas, mis. "OpenAI Kerja") atau klik salah satu **preset cepat**.
2. Isi/cek **Domain / base URL API** — contoh:
   - Groq: `https://api.groq.com/openai/v1`
   - OpenAI: `https://api.openai.com/v1`
   - OpenRouter: `https://openrouter.ai/api/v1`
   - Atau domain endpoint OpenAI-compatible lain, termasuk yang self-hosted
3. Tempel **API key** milik provider tersebut.
4. Klik **"Sambungkan & cari model"** — daftar model otomatis muncul di dropdown Model.
5. Pilih model, mulai chat.

Ulangi langkah di atas untuk provider lain — semua tersimpan di dropdown
**"Provider tersimpan"** dan bisa dipindah-pindah kapan saja.

## Cara Kerja Auto-Deteksi Model
Backend (`server.js`) tidak hardcode ke satu provider. Saat frontend kirim `baseUrl` +
`apikey`, backend memanggil `GET {baseUrl}/models` dengan header `Authorization: Bearer <apikey>`
persis seperti spesifikasi OpenAI, lalu menormalkan hasilnya jadi daftar model. Endpoint chat
(`POST {baseUrl}/chat/completions`) juga diproksi generik dengan `stream: true` — jadi provider
apa pun yang ikut format ini otomatis kompatibel tanpa perlu ubah kode.

## Deploy di Pterodactyl Panel

1. **Buat server baru** di Pterodactyl, pilih egg **"Generic Node.js"** (atau egg Node.js versi 18+).
2. **Upload file proyek** ini ke direktori server (lewat SFTP atau file manager panel):
   upload seluruh isi folder `ai-chat-app/`.
3. Di tab **Startup**, set:
   - **Docker Image**: `node:18` (atau yang tersedia)
   - **Startup Command**: `npm install && node server.js`
4. **Variables**: pastikan environment variable port yang dipakai egg (biasanya `SERVER_PORT`
   atau `PORT`) sesuai — `server.js` sudah otomatis membaca `process.env.PORT` **atau**
   `process.env.SERVER_PORT`, jadi tidak perlu ubah kode.
5. **Start** server dari panel. Cek log — jika muncul `AI Chat App berjalan di port ...`
   berarti sudah jalan.
6. Akses lewat `http://IP-NODE:PORT-ALLOCATION` sesuai allocation yang diberikan Pterodactyl.

## Menyambungkan ke Domain (untuk hosting aplikasi ini sendiri)

Setelah aplikasi jalan di IP:PORT dari Pterodactyl, sambungkan domain dengan salah satu cara:

### Opsi A — Reverse proxy Nginx (paling umum)
Di server yang punya akses ke domain (VPS/nginx proxy manager):
```nginx
server {
    listen 80;
    server_name chat.domainkamu.com;

    location / {
        proxy_pass http://IP-NODE:PORT-ALLOCATION;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off; # penting untuk streaming chat
    }
}
```
Tambahkan SSL dengan `certbot --nginx -d chat.domainkamu.com`.

### Opsi B — Cloudflare Tunnel
Jika node Pterodactyl tidak punya IP publik langsung, gunakan `cloudflared tunnel`
untuk mengarahkan domain Cloudflare ke `IP-NODE:PORT-ALLOCATION` tanpa perlu buka port.

### Opsi C — Nginx Proxy Manager (NPM)
Tambahkan Proxy Host baru: Domain = `chat.domainkamu.com`, Forward Hostname/IP = IP node,
Forward Port = port allocation, aktifkan **Websockets Support**, lalu request SSL.

> Pastikan `proxy_buffering off` / opsi setara diaktifkan, karena fitur chat streaming
> memakai `text/event-stream` yang perlu dikirim langsung tanpa dibuffer proxy.

## Provider Bawaan untuk Visitor Baru (opsional)

Secara default, visitor baru harus isi provider + API key sendiri sebelum bisa chat.
Kalau mau visitor baru **langsung bisa chat tanpa isi API key** (pakai kuota kamu):

1. Di `public/config.js`, cek/atur `app.defaultProvider` — `baseUrl`-nya sudah default ke
   Groq (`https://api.groq.com/openai/v1`), boleh diganti provider lain kalau mau.
2. Di server (`.env`, **bukan** `config.js`), isi:
   ```
   DEFAULT_BASE_URL=https://api.groq.com/openai/v1   # harus SAMA PERSIS dengan config.js
   DEFAULT_API_KEY=isi-api-key-asli-kamu-di-sini
   DEFAULT_KEY_DAILY_LIMIT=200                         # batas request/hari, jaga-jaga
   ```
3. Restart server-nya.

`config.js` cuma tahu **baseUrl** (file itu publik, dikirim ke semua browser yang buka
situsnya). Kunci API asli **hanya** hidup di `.env` sisi server dan tidak pernah dikirim
ke frontend — visitor cuma bisa *memakainya* lewat proxy `/api/chat`, tidak bisa
*melihat* kuncinya. Kalau `DEFAULT_API_KEY` dikosongkan, visitor baru tetap dapat
baseUrl Groq otomatis terisi, tapi tetap harus tempel API key mereka sendiri.

## Catatan Keamanan
- Nama provider, domain, dan API key disimpan di **browser (localStorage)**, bukan di
  server — cocok untuk pemakaian pribadi. Jika mau dipakai banyak orang, tambahkan sistem
  login + penyimpanan key per-user di database sebelum dipublikasikan luas.
- Backend hanya meneruskan (proxy) request ke domain yang kamu isi sendiri — pastikan
  domain yang diisi memang endpoint provider AI tepercaya.
- Jangan commit file `.env` berisi key ke repo publik.
- Kalau mengaktifkan provider bawaan (`DEFAULT_API_KEY` di `.env`), kunci itu bisa dipakai
  **siapa saja yang membuka situsnya** (lewat proxy, bukan dilihat langsung) — set
  `DEFAULT_KEY_DAILY_LIMIT` yang wajar dan/atau atur limit pemakaian resmi di dashboard
  provider-nya (Groq dkk biasanya punya rate-limit/budget alert sendiri).

## Lisensi
MIT — bebas dipakai, dimodifikasi, dan disebarluaskan.
