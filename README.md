# AkuPayu - Chrome Extension

**Created by Alfi Firdaus**

Chrome extension elegan untuk mengelola dan terhubung ke berbagai server proxy termasuk SOCKS5.

## Fitur

### Proxy Management
- **Multi-Protocol Support**: HTTP, HTTPS, SOCKS4, dan SOCKS5
- **Authentication**: Dukungan untuk proxy yang memerlukan username dan password
- **Save & Load**: Simpan konfigurasi proxy favorit Anda
- **Auto-Restore**: Otomatis menghubungkan kembali proxy saat browser restart

### Privacy & Security
- **User Agent Spoofing**: Ubah User Agent browser dengan 40+ preset populer atau custom
- **WebRTC Protection**: Lindungi IP asli Anda dari kebocoran WebRTC
- **Fingerprint Protection**: Blokir browser fingerprinting tracking (Canvas, WebGL, Audio, dll)
- **Elegant UI**: Antarmuka modern dengan toggle switch dan animasi smooth
- **Manifest v3**: Menggunakan Manifest v3 terbaru dari Chrome

## Struktur File

```
TheKraken1/
├── manifest.json           # Konfigurasi extension
├── popup.html             # Antarmuka pengguna
├── popup.js               # Logic UI dan interaksi
├── background.js          # Service worker untuk proxy management
├── styles.css             # Styling elegan
├── icons/                 # Icon extension
│   └── icon-generator.html # Generator untuk membuat icons
└── README.md             # Dokumentasi ini
```

## Instalasi

### 1. Generate Icons

Sebelum menginstall extension, Anda perlu membuat icon:

1. Buka file `icons/icon-generator.html` di browser
2. Klik tombol "Generate and Download Icons"
3. Icons akan otomatis ter-download (icon16.png, icon32.png, icon48.png, icon128.png)
4. Pindahkan semua icon ke folder `icons/`

**Alternatif**: Anda bisa menggunakan icon sendiri atau membuat icon menggunakan tools desain favorit Anda. Pastikan ukurannya 16x16, 32x32, 48x48, dan 128x128 pixels.

### 2. Load Extension ke Chrome

1. Buka Chrome dan ketik `chrome://extensions/` di address bar
2. Aktifkan "Developer mode" (toggle di pojok kanan atas)
3. Klik "Load unpacked"
4. Pilih folder `TheKraken1`
5. Extension akan muncul di toolbar Chrome

## Cara Menggunakan

### Koneksi Basic

1. Klik icon AkuPayu di toolbar
2. Pilih **Proxy Type** (HTTP, HTTPS, SOCKS4, atau SOCKS5)
3. Masukkan **Host/IP Address** (contoh: 127.0.0.1 atau proxy.example.com)
4. Masukkan **Port** (contoh: 8080, 1080, dll)
5. Klik tombol **Connect**

### Dengan Authentication

Jika proxy Anda memerlukan username dan password:

1. Centang checkbox **Authentication Required**
2. Masukkan **Username**
3. Masukkan **Password**
4. Klik **Connect**

### Menyimpan Proxy

Untuk menyimpan konfigurasi proxy favorit:

1. Isi semua field proxy
2. Klik **Save Current Proxy** di bagian bawah
3. Proxy akan muncul di daftar "Saved Proxies"

### Menggunakan Saved Proxy

1. Lihat daftar di bagian "Saved Proxies"
2. Klik icon **arrow** untuk load proxy ke form
3. Klik **Connect** untuk terhubung
4. Klik icon **X** untuk menghapus proxy yang tersimpan

### Disconnect

Untuk memutuskan koneksi proxy:

1. Klik tombol **Disconnect**
2. Status akan berubah menjadi "Disconnected"

### User Agent

Ubah User Agent browser untuk menyamarkan identitas browser Anda dengan **40+ preset** yang tersedia:

1. Pilih dari dropdown **User Agent**
2. Pilih dari berbagai kategori preset yang terorganisir:
   - **Chrome Desktop**: Windows 10/11, macOS Sonoma/Ventura, Linux
   - **Firefox Desktop**: Windows 10/11, macOS, Linux
   - **Safari**: macOS Sonoma/Ventura, iPhone, iPad
   - **Edge**: Windows 10/11, macOS
   - **Mobile Android**: Chrome, Samsung Internet, Firefox
   - **Mobile iOS**: Chrome, Firefox, Safari
   - **Opera & Others**: Opera, Brave, Vivaldi
   - **Bots & Crawlers**: Googlebot, Bingbot
3. Atau pilih **✏️ Custom** untuk memasukkan User Agent sendiri secara manual
4. Perubahan diterapkan otomatis setelah memilih

**Keuntungan:**
- Tidak perlu copas User Agent string secara manual
- Sudah terorganisir berdasarkan kategori browser dan OS
- Support berbagai versi browser (terbaru dan lama)
- Termasuk preset untuk mobile devices dan tablets

### WebRTC Protection

Aktifkan untuk mencegah kebocoran IP melalui WebRTC:

1. Toggle **WebRTC Protection** switch
2. Hijau = Aktif (IP dilindungi)
3. Abu-abu = Tidak aktif (default behavior)

**Apa itu WebRTC Leak?**
WebRTC dapat mengekspos IP asli Anda meskipun menggunakan proxy. Dengan mengaktifkan fitur ini, WebRTC akan diblokir untuk mencegah kebocoran IP.

**Test WebRTC Leak:**
- Dengan protection OFF: Kunjungi https://browserleaks.com/webrtc
- Dengan protection ON: IP asli tidak akan terlihat

### Fingerprint Protection

Lindungi browser Anda dari fingerprinting tracking dengan fitur anti-fingerprint:

1. Toggle **Fingerprint Protection** switch
2. Hijau = Aktif (fingerprinting diblokir)
3. **PENTING**: Reload/refresh halaman web untuk efek aktif

**Apa itu Browser Fingerprinting?**
Browser fingerprinting adalah teknik tracking yang menggunakan karakteristik unik browser Anda (canvas, WebGL, audio, fonts, hardware info) untuk mengidentifikasi dan melacak Anda tanpa cookies.

**Perlindungan yang Diberikan:**
- ✅ **Canvas Fingerprinting**: Menambahkan noise ke canvas API
- ✅ **WebGL Fingerprinting**: Spoof WebGL renderer & vendor info
- ✅ **Audio Fingerprinting**: Menambahkan noise ke audio context
- ✅ **Screen Resolution**: Spoof screen properties (1920x1080)
- ✅ **Hardware Info**: Spoof CPU cores (4), RAM (8GB), platform
- ✅ **Plugin Enumeration**: Block plugin detection
- ✅ **Font Detection**: Prevent font enumeration
- ✅ **Battery API**: Spoof battery status
- ✅ **Timezone**: Normalize ke UTC

**Test Fingerprint:**
- Kunjungi https://browserleaks.com/canvas
- Kunjungi https://amiunique.org
- Check apakah fingerprint berbeda dengan protection ON/OFF

**Catatan Penting:**
- Fingerprint protection akan aktif setelah page reload
- Beberapa website mungkin terdeteksi menggunakan anti-fingerprint
- Fingerprint akan konsisten dalam session yang sama

## Contoh Konfigurasi

### HTTP Proxy
```
Type: HTTP
Host: 192.168.1.100
Port: 8080
Auth: No
```

### SOCKS5 Proxy dengan Auth
```
Type: SOCKS5
Host: proxy.example.com
Port: 1080
Auth: Yes
Username: myusername
Password: mypassword
```

### Local SOCKS5 (Tor, SSH Tunnel, dll)
```
Type: SOCKS5
Host: 127.0.0.1
Port: 9050
Auth: No
```

## Status Indicator

- **Red dot (Disconnected)**: Tidak ada proxy yang aktif
- **Green dot (Connected)**: Proxy sedang aktif

## Troubleshooting

### Extension tidak muncul
- Pastikan Developer mode aktif di `chrome://extensions/`
- Reload extension dengan klik icon refresh

### Tidak bisa connect
- Periksa Host dan Port sudah benar
- Pastikan proxy server sedang berjalan
- Cek apakah memerlukan authentication

### Authentication gagal
- Pastikan username dan password benar
- Centang checkbox "Authentication Required"

### Proxy tidak persistent
- Extension akan otomatis restore koneksi saat browser restart
- Jika tidak, coba connect ulang

## Permissions

Extension ini memerlukan permissions berikut:

- **proxy**: Untuk mengatur konfigurasi proxy
- **storage**: Untuk menyimpan konfigurasi dan saved proxies
- **webRequest**: Untuk handle authentication
- **webRequestAuthProvider**: Untuk provide credentials ke proxy
- **declarativeNetRequest**: Untuk modify User-Agent headers
- **declarativeNetRequestWithHostAccess**: Untuk apply User-Agent ke semua sites
- **privacy**: Untuk control WebRTC IP handling policy
- **host_permissions**: Untuk apply proxy dan User-Agent ke semua URL

## Privacy & Security

- Semua data disimpan secara lokal di browser Anda
- Tidak ada data yang dikirim ke server external
- Username dan password disimpan di Chrome storage (tidak terenkripsi)
- User Agent dan WebRTC settings disimpan lokal
- Gunakan dengan proxy yang terpercaya

## Tips

1. **Maximum Privacy Setup**: Gunakan Proxy + User Agent + WebRTC Protection + Fingerprint Protection bersamaan untuk privasi maksimal
2. **Test Proxy**: Setelah connect, coba buka website untuk memastikan proxy berfungsi
3. **Save Favorites**: Simpan proxy yang sering digunakan untuk akses cepat
4. **Check Status**: Selalu perhatikan status indicator untuk memastikan koneksi aktif
5. **Multiple Proxies**: Simpan beberapa proxy dan switch sesuai kebutuhan
6. **Test User Agent**: Kunjungi https://www.whatismybrowser.com untuk verify User Agent
7. **Test WebRTC Leak**: Kunjungi https://browserleaks.com/webrtc untuk check IP leak
8. **Test Fingerprint**: Kunjungi https://browserleaks.com/canvas atau https://amiunique.org untuk check fingerprint protection

## Development

Dibuat menggunakan:
- Chrome Extension Manifest v3
- Vanilla JavaScript (no dependencies)
- Modern CSS dengan custom properties dan animations
- Chrome Proxy API
- Chrome Storage API
- Chrome declarativeNetRequest API (User Agent spoofing)
- Chrome Privacy API (WebRTC protection)

## License

Free to use and modify.

## Support

Jika menemukan bug atau memiliki saran, silakan buat issue atau pull request.

---

**Selamat menggunakan AkuPayu!**

Made with ❤️ by Alfi Firdaus
