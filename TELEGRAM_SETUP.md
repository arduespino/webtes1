# Setup Telegram Bot - Panduan Lengkap

## Langkah 1: Membuat Bot Telegram

1. Buka aplikasi Telegram dan cari `@BotFather`
2. Mulai chat dengan BotFather dengan mengirim `/start`
3. Kirim command `/newbot` untuk membuat bot baru
4. Ikuti instruksi:
   - Berikan nama untuk bot Anda (contoh: "My Message Bot")
   - Berikan username untuk bot (harus diakhiri dengan "bot", contoh: "mymessagebot")
5. BotFather akan memberikan token bot seperti: `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`
6. **SIMPAN TOKEN INI** - Anda akan membutuhkannya untuk konfigurasi

## Langkah 2: Mendapatkan Chat ID

### Metode 1: Menggunakan Bot
1. Kirim pesan apa saja ke bot yang baru dibuat
2. Buka browser dan akses URL berikut (ganti `<BOT_TOKEN>` dengan token Anda):
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
3. Cari nilai `"id"` di dalam `"chat"` object
4. Chat ID biasanya berupa angka (contoh: `123456789` atau `-123456789`)

### Metode 2: Menggunakan Bot GetID
1. Cari bot `@userinfobot` di Telegram
2. Kirim `/start` ke bot tersebut
3. Bot akan mengirim informasi termasuk chat ID Anda

## Langkah 3: Konfigurasi Environment

1. Buka file `.env.local` di root project
2. Ganti nilai berikut dengan data Anda:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
   TELEGRAM_CHAT_ID=123456789
   ```

## Langkah 4: Test Koneksi

1. Jalankan development server:
   ```bash
   npm run dev
   ```
2. Buka browser ke `http://localhost:3000`
3. Coba kirim pesan test untuk memastikan bot bekerja

## Tips Keamanan

- **JANGAN** commit file `.env.local` ke git repository
- Token bot bersifat rahasia, jangan bagikan ke siapa pun
- Jika token bocor, regenerate token di BotFather dengan command `/revoke`

## Troubleshooting

### Error: "Unauthorized"
- Pastikan token bot sudah benar
- Cek apakah ada spasi atau karakter tambahan di token

### Error: "Chat not found"
- Pastikan Chat ID sudah benar
- Pastikan Anda sudah mengirim pesan ke bot terlebih dahulu

### Error: "Forbidden"
- Bot mungkin diblokir oleh user
- Pastikan bot belum dihapus dari chat

### Error: Lokasi tidak bisa diakses
- Pastikan browser mengizinkan akses lokasi
- Coba akses melalui HTTPS (untuk production)
- Periksa pengaturan lokasi di browser

## Fitur yang Tersedia

✅ Kirim pesan teks ke Telegram
✅ Kirim lokasi dengan koordinat GPS
✅ Reverse geocoding untuk mendapatkan alamat
✅ UI yang responsive dan user-friendly
✅ Status feedback untuk setiap aksi