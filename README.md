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

## 🛠️ Fitur Utama Website
- **3D Card Hover**: Efek miring halus ketika cursor diarahkan ke kartu penawaran.
- **Mouse Tracker Blob**: Gradient cahaya yang bergerak mulus mengikuti cursor di background.
- **Dynamic Calculator**: Simulasi kalkulasi penghematan biaya langganan yang terintegrasi otomatis dengan pesan WhatsApp order.
- **Dark/Light Mode**: Perpindahan tema instan yang disimpan di `localStorage` browser pengunjung.
