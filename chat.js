document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Elements Selection
  const body = document.body;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const menuToggleBtn = document.getElementById('menu-toggle');
  const chatSidebar = document.getElementById('chat-sidebar');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const attachBtn = document.getElementById('attach-btn');
  const fileInput = document.getElementById('file-input');
  const previewStrip = document.getElementById('preview-strip');
  const previewImage = document.getElementById('preview-image');
  const removePreviewBtn = document.getElementById('remove-preview-btn');
  const chatScroller = document.getElementById('chat-scroller');
  const chatContentContainer = document.getElementById('chat-content-container');
  const welcomeScreen = document.getElementById('welcome-screen');
  const suggestionCards = document.querySelectorAll('.suggestion-card');
  const newChatBtn = document.getElementById('new-chat-btn');
  const historyItems = document.querySelectorAll('.history-item');

  let attachedImageBase64 = null;

  // ==========================================
  // THEME MANAGEMENT (SYNCED WITH LANDING PAGE)
  // ==========================================
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const activeTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', activeTheme);
  });

  // ==========================================
  // MOBILE SIDEBAR TOGGLE
  // ==========================================
  menuToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chatSidebar.classList.toggle('active');
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!chatSidebar.contains(e.target) && e.target !== menuToggleBtn) {
        chatSidebar.classList.remove('active');
      }
    }
  });

  // ==========================================
  // AUTO-GROW TEXTAREA & VALIDATION
  // ==========================================
  function updateInputState() {
    const text = chatInput.value.trim();
    const hasContent = text.length > 0 || attachedImageBase64 !== null;
    sendBtn.disabled = !hasContent;
  }

  chatInput.addEventListener('input', () => {
    // Reset height to compute scrollHeight
    chatInput.style.height = '24px';
    chatInput.style.height = (chatInput.scrollHeight - 4) + 'px';
    updateInputState();
  });

  // ==========================================
  // IMAGE IMPORT / ATTACHMENT HANDLING
  // ==========================================
  attachBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        attachedImageBase64 = event.target.result;
        previewImage.src = attachedImageBase64;
        previewStrip.style.display = 'flex';
        updateInputState();
        chatInput.focus();
      };
      reader.readAsDataURL(file);
    }
  });

  function clearImageAttachment() {
    attachedImageBase64 = null;
    previewImage.src = '';
    previewStrip.style.display = 'none';
    fileInput.value = '';
    updateInputState();
  }

  removePreviewBtn.addEventListener('click', clearImageAttachment);

  // ==========================================
  // CHAT LOGIC / MESSAGE RENDERING
  // ==========================================
  function scrollToBottom() {
    chatScroller.scrollTop = chatScroller.scrollHeight;
  }

  function formatMessageText(text) {
    if (!text) return '';
    
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Convert bold **text** to HTML
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert code blocks ```code``` to pre tags
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Convert inline code `code` to code tags
    formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');

    // Convert newlines to breaks (except inside pre blocks)
    formatted = formatted.split('</pre>').map((part, index, array) => {
      if (index === array.length - 1 && part === '') return '';
      // If it's a pre block, keep as is, otherwise add line breaks
      if (part.startsWith('<pre>')) {
        return part;
      }
      return part.replace(/\n/g, '<br>');
    }).join('</pre>');

    // Format simple bulleted lists (* text)
    formatted = formatted.replace(/^\*\s(.*)$/gm, '• $1');

    return formatted;
  }

  function appendMessage(sender, text, image = null) {
    // Hide welcome state if visible
    if (welcomeScreen.style.display !== 'none') {
      welcomeScreen.style.display = 'none';
    }

    const messageRow = document.createElement('div');
    messageRow.className = `message-row ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? 'U' : 'AI';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    // Append Image if exists
    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.className = 'message-image-attachment';
      img.alt = 'Uploaded image attachment';
      bubble.appendChild(img);
    }

    // Append Text if exists
    if (text) {
      const textContainer = document.createElement('div');
      textContainer.className = 'message-text';
      textContainer.innerHTML = formatMessageText(text);
      bubble.appendChild(textContainer);
    }

    messageRow.appendChild(avatar);
    messageRow.appendChild(bubble);
    chatContentContainer.appendChild(messageRow);

    scrollToBottom();
    return messageRow;
  }

  function showTypingIndicator() {
    const messageRow = document.createElement('div');
    messageRow.className = 'message-row assistant typing-temp';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = 'AI';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;

    bubble.appendChild(indicator);
    messageRow.appendChild(avatar);
    messageRow.appendChild(bubble);
    chatContentContainer.appendChild(messageRow);
    scrollToBottom();
    return messageRow;
  }

  function removeTypingIndicator() {
    const temp = document.querySelector('.typing-temp');
    if (temp) {
      temp.remove();
    }
  }

  // ==========================================
  // RESPONSES DATABASE (MOCK CHAT BOT LOGIC)
  // ==========================================
  function generateAIResponse(userText, hasImage) {
    const text = userText.toLowerCase();
    
    if (hasImage) {
      return `Saya melihat gambar yang Anda kirimkan! 📸\n\nJika gambar tersebut merupakan **bukti transfer/pembayaran**, silakan kirimkan langsung kepada CS WhatsApp kami di nomor **085764985114** agar pesanan Anda dapat diproses secara instan.\n\nApakah gambar ini memiliki kendala teknis lisensi yang perlu kami bantu selesaikan?`;
    }

    if (text.includes('rekomendasi') || text.includes('laris') || text.includes('beli') || text.includes('premium')) {
      return `Berikut adalah beberapa aplikasi premium terpopuler dan terlaris di **Jajan Digital**:\n\n* **Netflix Premium (UHD 4K)**: Mulai dari Rp 35.000 / bulan. Sangat cocok untuk hiburan keluarga.\n* **Canva Pro**: Mulai dari Rp 15.000 / bulan. Akses jutaan elemen desain legal.\n* **Office 365 + OneDrive 1TB**: Mulai dari Rp 25.000 / bulan.\n* **ChatGPT Plus (GPT-4)**: Rp 49.000 / bulan untuk akselerasi teknologi AI.\n\nSemua produk kami dijamin **100% legal, aman, dan bergaransi penuh**. Ingin saya buatkan tautan WhatsApp untuk aplikasi tertentu?`;
    }

    if (text.includes('garansi') || text.includes('klaim') || text.includes('aman')) {
      return `Tentu! Di **Jajan Digital**, semua transaksi dilindungi dengan **Garansi Penuh (Full Warranty)**:\n\n* **Durasi Aktif**: Garansi mencakup masa aktif penuh sesuai paket yang Anda beli (misal: 30 hari penuh).\n* **Proses Klaim Mudah**: Cukup chat CS di WhatsApp kami dengan melampirkan email akun Anda.\n* **Solusi Instan**: Kami akan memulihkan premium Anda atau mengganti akun baru dalam waktu kurang dari 24 jam.\n\nLegalitas kami terjamin karena menggunakan sistem undang tim resmi (invite) langsung dari developer!`;
    }

    if (text.includes('bayar') || text.includes('transfer') || text.includes('aktivasi')) {
      return `Metode pembayaran dan proses aktivasi kami sangat praktis:\n\n1. **Pembayaran**: Mendukung seluruh Bank utama (BCA, Mandiri, BRI) serta E-Wallet populer (DANA, OVO, GoPay, ShopeePay).\n2. **Proses Aktivasi**: Setelah bukti transfer dikirimkan ke WhatsApp CS kami, akun premium Anda akan diaktifkan dalam **3 - 10 menit**.\n\nSilakan lakukan simulasi hemat terlebih dahulu di beranda atau langsung klik **Hubungi Kami** untuk memesan!`;
    }

    if (text.includes('hemat') || text.includes('hitung') || text.includes('kalkulator')) {
      return `Untuk menghitung penghematan bulanan Anda:\n\n1. Silakan gunakan **Kalkulator Simulasi Hemat** di halaman utama (Landing Page).\n2. Pilih aplikasi premium yang ingin Anda gunakan.\n3. Sistem kami akan membandingkan harga resmi dengan harga JGL secara otomatis.\n\nSebagai contoh, berlangganan Netflix + Canva Pro di JGL dapat menghemat uang Anda hingga **Rp 693.000 per bulan**!`;
    }

    return `Terima kasih atas pertanyaan Anda seputar Jajan Digital! 🚀\n\nSaya asisten AI Anda. Saya dapat menjawab pertanyaan seputar:\n* Rekomendasi aplikasi premium terlaris\n* Cara kerja garansi resmi kami\n* Alur pembayaran & konfirmasi instan\n* Simulasi hemat bulanan\n\nAda hal spesifik yang ingin Anda ketahui? Anda juga bisa langsung terhubung dengan CS manusia kami melalui WhatsApp di **085764985114** untuk pemesanan langsung!`;
  }

  function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text && !attachedImageBase64) return;

    // Send User Message
    appendMessage('user', text, attachedImageBase64);
    
    // Store states to send to AI
    const promptText = text;
    const hasImage = attachedImageBase64 !== null;

    // Clear Inputs
    chatInput.value = '';
    chatInput.style.height = '24px';
    clearImageAttachment();

    // Show Typing Indicator
    showTypingIndicator();

    // Mock delay for AI response (1.5 seconds)
    setTimeout(() => {
      removeTypingIndicator();
      const aiResponse = generateAIResponse(promptText, hasImage);
      appendMessage('assistant', aiResponse);
    }, 1500);
  }

  // Bind buttons click
  sendBtn.addEventListener('click', handleSendMessage);

  // Bind Enter key to send (preventing send if Shift+Enter is pressed)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Suggestion Cards click binding
  suggestionCards.forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.getAttribute('data-prompt');
      chatInput.value = prompt;
      // Trigger auto-grow
      chatInput.style.height = '24px';
      chatInput.style.height = (chatInput.scrollHeight - 4) + 'px';
      updateInputState();
      chatInput.focus();
    });
  });

  // New Chat Click (Reset Chat Area)
  newChatBtn.addEventListener('click', () => {
    // Clear chat rows
    const rows = document.querySelectorAll('.message-row');
    rows.forEach(row => row.remove());
    // Show welcome screen
    welcomeScreen.style.display = 'flex';
    clearImageAttachment();
    chatInput.value = '';
    chatInput.style.height = '24px';
    updateInputState();
  });

  // History Items click simulation
  historyItems.forEach(item => {
    item.addEventListener('click', () => {
      historyItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const title = item.querySelector('span').innerText;
      
      // Reset Chat and Simulate opening a past chat
      const rows = document.querySelectorAll('.message-row');
      rows.forEach(row => row.remove());
      welcomeScreen.style.display = 'none';

      appendMessage('user', `Tanya seputar: ${title}`);
      
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        let reply = "";
        if (title.includes("Rekomendasi")) {
          reply = "Untuk rekomendasi aplikasi premium terlaris kami, silakan gunakan paket **Netflix Premium** untuk kebutuhan streaming film, atau **Canva Pro** untuk kebutuhan editing grafis Anda. Keduanya memiliki tingkat kepuasan pelanggan di atas 98%.";
        } else if (title.includes("Pembayaran")) {
          reply = "Seluruh metode pembayaran digital (QRIS, DANA, GoPay, OVO, ShopeePay) serta Transfer Bank (BCA, Mandiri, BRI, BNI) diproses dalam hitungan menit saja. Konfirmasi transaksi dilakukan langsung di WhatsApp Customer Service kami.";
        } else {
          reply = "Garansi produk kami mencakup **garansi uang kembali** atau **pemulihan premium gratis** jika dalam masa langganan terjadi kendala pada akun Anda. Tim kami siap membantu memproses klaim Anda dalam waktu singkat.";
        }
        appendMessage('assistant', reply);
      }, 1000);

      // Close sidebar on mobile
      if (window.innerWidth <= 768) {
        chatSidebar.classList.remove('active');
      }
    });
  });

});
