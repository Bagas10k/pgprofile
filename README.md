# Jajan Digital - Landing Page Profile

Landing page modern, elegan, dan interaktif untuk **Jajan Digital** (penyedia layanan lisensi dan akun aplikasi premium legal terpercaya di Indonesia). Didesain dengan tema gelap futuristik khas Google AI, lengkap dengan interaksi blob cahaya, kartu 3D, kalkulator simulasi hemat, dan dukungan mode terang/gelap (dark/light mode).

---

## 🚀 Panduan Setup & Penyebaran (Deployment)

Karena website ini dibangun menggunakan teknologi statis (**HTML5, Vanilla CSS, dan Vanilla JS**), proses setup di server sangat sederhana dan tidak membutuhkan runtime khusus seperti Node.js server-side, PHP, atau database di server.

Berikut adalah beberapa pilihan metode setup di server:

### 1. Deployment Gratis Menggunakan GitHub Pages (Sangat Direkomendasikan)
Karena repository Anda sudah berada di GitHub, Anda bisa mengaktifkan hosting gratis dalam beberapa klik saja:
1. Buka repository Anda di GitHub: [https://github.com/Bagas10k/pgprofile](https://github.com/Bagas10k/pgprofile).
2. Buka tab **Settings** di bagian menu atas repository.
3. Pada sidebar kiri, cari dan klik menu **Pages** (di bagian *Code and automation*).
4. Di bagian **Build and deployment**:
   - Source: Pilih **Deploy from a branch**.
   - Branch: Pilih **main** dan folder **/(root)**.
5. Klik tombol **Save**.
6. Tunggu sekitar 1-2 menit. GitHub akan memberikan link website aktif Anda (misalnya: `https://bagas10k.github.io/pgprofile/`).

---

### 2. cPanel / Shared Hosting (Web Server Tradisional)
Jika Anda menggunakan shared hosting seperti Niagahoster, DomaiNesia, Hostinger, dll:
1. Login ke panel hosting Anda (**cPanel** atau **DirectAdmin**).
2. Buka menu **File Manager** dan arahkan ke direktori root website Anda (biasanya di folder `public_html`).
3. Upload seluruh file dari proyek ini:
   - `index.html`
   - `style.css`
   - `app.js`
   - `.gitignore`
   - Folder `assets/` (beserta isinya: `hero_workspace.png` dan `trust_team.png`)
4. Pastikan file `index.html` berada langsung di folder utama `public_html` agar saat domain Anda diakses, website langsung terbuka.

---

### 3. VPS Linux (Menggunakan Nginx)
Jika Anda menggunakan VPS Linux (Ubuntu/Debian) dan ingin menyajikannya menggunakan Nginx:
1. Hubungkan ke VPS Anda melalui SSH.
2. Install Nginx jika belum terinstall:
   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```
3. Buat direktori baru untuk website Anda:
   ```bash
   sudo mkdir -p /var/www/jajandigital
   ```
4. Upload atau clone repository Anda ke folder tersebut:
   ```bash
   sudo git clone https://github.com/Bagas10k/pgprofile.git /var/www/jajandigital
   ```
5. Konfigurasikan block server Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/jajandigital
   ```
   Masukkan konfigurasi Nginx statis berikut:
   ```nginx
   server {
       listen 80;
       server_name jajandigital.web.id www.jajandigital.web.id; # Ganti dengan domain Anda

       root /var/www/jajandigital;
       index index.html;

       location / {
           try_files $uri $uri/ =404;
       }

       # Caching aset gambar untuk performa lebih cepat
       location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
           expires 7d;
           add_header Cache-Control "public, no-transform";
       }
   }
   ```
6. Aktifkan konfigurasi Nginx dan restart service:
   ```bash
   sudo ln -s /etc/nginx/sites-available/jajandigital /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### 4. Deployment Instan via Vercel atau Netlify
Untuk deployment modern serverless yang otomatis ter-update setiap kali Anda push ke GitHub:
- **Vercel**: Login ke [Vercel](https://vercel.com), klik **Add New > Project**, hubungkan akun GitHub Anda, pilih repository `pgprofile`, lalu klik **Deploy**.
- **Netlify**: Login ke [Netlify](https://netlify.com), klik **Import from Git**, pilih repository `pgprofile`, lalu klik **Deploy Site**.

---

## 💻 Menjalankan di Local Development

Jika Anda ingin melakukan pengembangan atau modifikasi di komputer lokal:
1. Buka folder proyek di Visual Studio Code.
2. Rekomendasi: Gunakan extension **Live Server** (klik kanan pada `index.html` -> *Open with Live Server*).
3. Atau, jalankan server statis menggunakan Node.js/Python di terminal Anda:
   - **Node.js**: `npx http-server`
   - **Python**: `python -m http.server 8080` (lalu akses `http://localhost:8080` di browser).

---

## 🌐 Setup Tunneling (Untuk Server Tanpa IP Publik)

Jika server Anda berjalan di local network (localhost / server rumah / internal VPS) dan tidak memiliki IP Publik, Anda dapat menggunakan layanan **Tunneling** untuk mengekspos website Anda ke internet secara aman dan gratis.

Ada 3 metode utama yang bisa Anda gunakan:

### A. Menggunakan Cloudflare Tunnel (Sangat Direkomendasikan untuk Produksi)
Cloudflare Tunnel (dulu bernama Argo Tunnel) 100% gratis, aman, dan dapat dihubungkan langsung ke **domain kustom** Anda sendiri (misal: `jajandigital.web.id`) tanpa membuka port server Anda ke internet.

**Langkah-langkah setup:**
1. Daftarkan domain Anda di Cloudflare (gratis).
2. Install utility `cloudflared` di server Anda:
   - Linux (Ubuntu/Debian):
     ```bash
     curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
     sudo dpkg -i cloudflared.deb
     ```
3. Login ke akun Cloudflare Anda melalui terminal server:
   ```bash
   cloudflared tunnel login
   ```
4. Buat tunnel baru (misal diberi nama `jajan-tunnel`):
   ```bash
   cloudflared tunnel create jajan-tunnel
   ```
5. Hubungkan tunnel ke subdomain/domain Anda:
   ```bash
   # Ganti subdomain dengan domain kustom Anda
   cloudflared tunnel route dns jajan-tunnel jajandigital.web.id
   ```
6. Jalankan tunnel dan arahkan ke local port server Anda (misal Nginx berjalan di port `80` atau python server di `8080`):
   ```bash
   # Jika menggunakan Nginx lokal
   cloudflared tunnel run --url http://localhost:80 jajan-tunnel
   ```
   *Sekarang domain Anda sudah terhubung secara aman langsung ke server lokal Anda!*

---

### B. Menggunakan Ngrok (Paling Cepat untuk Testing)
Ngrok adalah cara tercepat untuk mengekspos localhost Anda ke internet dengan satu perintah.

**Langkah-langkah setup:**
1. Daftar akun gratis di [ngrok.com](https://ngrok.com).
2. Download dan install Ngrok di server Anda.
3. Hubungkan akun Anda menggunakan token otentikasi (copy dari dashboard ngrok):
   ```bash
   ngrok config add-authtoken <TOKEN_ANDA>
   ```
4. Jalankan local web server Anda (misalnya python server di port `8080`):
   ```bash
   python -m http.server 8080
   ```
5. Buka terminal baru dan jalankan ngrok ke port tersebut:
   ```bash
   ngrok http 8080
   ```
6. Ngrok akan memberikan URL publik gratis (misal: `https://abcd-1234.ngrok-free.app`) yang bisa diakses oleh siapapun dari internet.

---

### C. Menggunakan Pinggy (Paling Simple, Tanpa Install Aplikasi)
Jika Anda tidak ingin menginstall aplikasi tambahan apa pun di server Anda, Anda bisa memanfaatkan SSH Tunneling bawaan sistem operasi menggunakan layanan **Pinggy**.

Cukup jalankan satu perintah SSH berikut di server Anda (arahkan port ke port local server Anda, misal port `8080`):
```bash
ssh -R 80:localhost:8080 loop.pinggy.io
```
Pinggy akan langsung menampilkan URL publik HTTP & HTTPS sementara di layar terminal Anda secara gratis.

---

## 🛠️ Fitur Utama Website
- **3D Card Hover**: Efek miring halus ketika cursor diarahkan ke kartu penawaran.
- **Mouse Tracker Blob**: Gradient cahaya yang bergerak mulus mengikuti cursor di background.
- **Dynamic Calculator**: Simulasi kalkulasi penghematan biaya langganan yang terintegrasi otomatis dengan pesan WhatsApp order.
- **Dark/Light Mode**: Perpindahan tema instan yang disimpan di `localStorage` browser pengunjung.
