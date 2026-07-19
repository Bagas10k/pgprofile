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
  // OMNICHAT DATA STORAGE & INITIALIZATION
  // ==========================================
  const DEFAULT_TRIGGERS = [
    {
      keyword: "katalog, daftar produk, produk, aplikasi",
      response: "Berikut adalah daftar aplikasi premium terlaris kami saat ini! Semua akun legal, aman, dan bergaransi penuh:\n\n* **Netflix Premium (UHD 4K)**: Mulai dari Rp 35.000 / bulan.\n* **Canva Pro**: Mulai dari Rp 15.000 / bulan.\n* **Office 365 + OneDrive 1TB**: Mulai dari Rp 25.000 / bulan.\n* **ChatGPT Plus (GPT-4)**: Mulai dari Rp 49.000 / bulan.\n\nSilakan pilih salah satu opsi di bawah ini untuk memulai!",
      buttons: [
        { label: "Beli Langsung", action: "flow:beli_langsung" },
        { label: "Tanya Admin CS", action: "hubungi admin" }
      ]
    },
    {
      keyword: "ongkir, biaya kirim, kirim",
      response: "Untuk seluruh pembelian produk digital di Jajan Digital, biaya pengirimannya adalah **Rp 0 (GRATIS)**! Akun premium Anda akan dikirimkan langsung secara instan via E-mail atau WhatsApp Anda. 🚀",
      buttons: [
        { label: "Kembali ke Katalog", action: "katalog" }
      ]
    },
    {
      keyword: "garansi, klaim, aman, legal",
      response: "Semua akun premium di Jajan Digital dilindungi oleh **Garansi Penuh (Full Warranty)** selama masa aktif langganan Anda.\n\n* Jika premium mati, tim support kami akan memulihkan atau mengganti akun dalam waktu 3 - 24 jam.\n* Metode yang kami gunakan adalah *invite* tim resmi, legal, dan aman langsung dari developer.",
      buttons: [
        { label: "Beli Langsung", action: "flow:beli_langsung" },
        { label: "Tanya CS WhatsApp", action: "hubungi admin" }
      ]
    }
  ];

  const DEFAULT_FLOWS = {
    "beli_langsung": {
      id: "beli_langsung",
      name: "Beli Langsung",
      steps: [
        { key: "app", type: "options", text: "Aplikasi premium apa yang ingin Anda pesan hari ini?", options: ["Netflix UHD", "Canva Pro", "Spotify Premium", "ChatGPT Plus", "CapCut Pro"] },
        { key: "duration", type: "options", text: "Berapa lama durasi langganan yang Anda inginkan?", options: ["1 Bulan", "3 Bulan", "6 Bulan", "12 Bulan"] },
        { key: "name", type: "text", text: "Boleh ketikkan Nama Lengkap Anda untuk pendaftaran akun?" },
        { key: "address", type: "text", text: "Terakhir, ketikkan alamat Email / nomor WhatsApp Anda untuk pengiriman akun:" }
      ]
    }
  };

  const DEFAULT_SYSTEM_PROMPT = "Anda adalah asisten AI dari Jajan Digital. Toko kami menjual lisensi aplikasi premium murah, legal, dan aman bergaransi (seperti Netflix, Spotify, Canva Pro, ChatGPT, CapCut, Office 365). Jawab pertanyaan pelanggan dengan singkat, santun, ramah, dan solutif. Jika ada pelanggan yang mengunggah gambar/bukti transfer, sarankan mereka untuk langsung mengirimnya ke CS WhatsApp 085764985114.";
  const DEFAULT_AI_BUTTONS = [
    { label: "Beli Langsung 🛒", action: "flow:beli_langsung" },
    { label: "Hubungi Admin 💬", action: "hubungi admin" }
  ];

  // Load or Initialize localStorage
  let apiPool = JSON.parse(localStorage.getItem('ai_api_pool')) || [];
  let triggers = JSON.parse(localStorage.getItem('ai_triggers')) || DEFAULT_TRIGGERS;
  let botSettings = JSON.parse(localStorage.getItem('ai_bot_settings')) || {
    system_instruction: DEFAULT_SYSTEM_PROMPT,
    fallback_buttons: DEFAULT_AI_BUTTONS
  };

  function saveToStorage() {
    localStorage.setItem('ai_api_pool', JSON.stringify(apiPool));
    localStorage.setItem('ai_triggers', JSON.stringify(triggers));
    localStorage.setItem('ai_bot_settings', JSON.stringify(botSettings));
  }

  // ==========================================
  // STATE MACHINE & FLOWS ENGINE (LAYER 1)
  // ==========================================
  let sessionState = {
    activeFlowId: null,
    currentStepIndex: 0,
    collectedData: {}
  };

  function startFlow(flowId) {
    const flow = DEFAULT_FLOWS[flowId];
    if (!flow) return;

    sessionState.activeFlowId = flowId;
    sessionState.currentStepIndex = 0;
    sessionState.collectedData = {};

    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      askFlowStep();
    }, 800);
  }

  function askFlowStep() {
    const flow = DEFAULT_FLOWS[sessionState.activeFlowId];
    const step = flow.steps[sessionState.currentStepIndex];

    let buttons = null;
    if (step.type === 'options') {
      buttons = step.options.map(opt => ({ label: opt, action: opt }));
    }

    appendMessage('assistant', step.text, null, buttons);
  }

  function processFlowStep(userInput) {
    const flow = DEFAULT_FLOWS[sessionState.activeFlowId];
    const step = flow.steps[sessionState.currentStepIndex];

    // Save user response
    sessionState.collectedData[step.key] = userInput;

    // Progress to next step
    sessionState.currentStepIndex++;

    if (sessionState.currentStepIndex < flow.steps.length) {
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        askFlowStep();
      }, 800);
    } else {
      // Flow Finished
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        finishFlow();
      }, 1000);
    }
  }

  function finishFlow() {
    const data = sessionState.collectedData;
    const waText = `Halo Jajan Digital, saya ingin memesan premium:\n\n` +
      `- Aplikasi: ${data.app}\n` +
      `- Durasi: ${data.duration}\n` +
      `- Nama Pembeli: ${data.name}\n` +
      `- E-mail/WhatsApp: ${data.address}\n\n` +
      `Mohon dibantu konfirmasi pemesanan dan metode pembayarannya. Terima kasih!`;

    const waUrl = `https://wa.me/6285764985114?text=${encodeURIComponent(waText)}`;
    
    const summary = `Baik Kak, pemesanan Anda sudah siap! Berikut adalah ringkasan data belanjaan Anda:\n\n` +
      `* **Aplikasi**: ${data.app}\n` +
      `* **Durasi**: ${data.duration}\n` +
      `* **Nama**: ${data.name}\n` +
      `* **Email/Kontak**: ${data.address}\n\n` +
      `Silakan klik tombol di bawah untuk langsung terhubung ke WhatsApp CS kami untuk melakukan konfirmasi & pembayaran.`;

    appendMessage('assistant', summary, null, [
      { label: "🚀 Kirim ke WhatsApp (Beli)", action: waUrl },
      { label: "Batal", action: "batal" }
    ]);

    // Reset State
    sessionState.activeFlowId = null;
  }

  function findKeywordTrigger(text) {
    const cleanText = text.toLowerCase().trim();
    return triggers.find(t => {
      const keywords = t.keyword.split(',').map(k => k.trim().toLowerCase());
      return keywords.some(k => cleanText.includes(k));
    });
  }

  // ==========================================
  // AUTO-CIRCLE API ROUTER ENGINE (LAYER 3)
  // ==========================================
  async function generateAiReplyWithAutoCircle(userMessage, systemPrompt) {
    const activeKeys = apiPool
      .filter(k => k.is_active)
      .sort((a, b) => b.priority - a.priority);

    if (activeKeys.length === 0) {
      console.warn("No active API Keys found in the pool. Falling back to local responses.");
      return null;
    }

    let attempts = 0;
    let success = false;
    let replyText = "";
    const maxAttempts = Math.min(activeKeys.length, 3);

    // Dynamic Context Injection - Feed database knowledge to AI
    const databaseContext = `\n\n[KNOWLEDGE BASE DARI DATABASE TOKO]:
- Daftar Triggers Kata Kunci yang Tersedia: ${triggers.map(t => t.keyword).join(', ')}
- Alur Pilihan Tombol Auto-Flow Aktif: Beli Langsung (flow:beli_langsung)
- Kontak Layanan: WhatsApp 085764985114
- Kebijakan Pengiriman: Rp 0 (Gratis Ongkir Akun Digital)`;

    const fullInstruction = systemPrompt + databaseContext;

    while (attempts < maxAttempts && !success) {
      const currentApi = activeKeys[attempts];
      console.log(`[Auto-Circle Router] Memanggil API ${currentApi.provider.toUpperCase()} (ID: ${currentApi.id}, Prioritas: ${currentApi.priority})`);
      
      try {
        if (currentApi.provider === 'gemini') {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${currentApi.api_key}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: userMessage }] }],
              systemInstruction: { parts: [{ text: fullInstruction }] }
            })
          });

          const data = await response.json();
          if (!response.ok || data.error) {
            throw new Error(data.error?.message || `HTTP Error ${response.status}`);
          }

          replyText = data.candidates[0].content.parts[0].text;
          success = true;
          console.log(`[Auto-Circle Router] Sukses menggunakan API ID: ${currentApi.id}`);
        } else if (currentApi.provider === 'grok') {
          throw new Error("Grok API SDK is not configured (Mock API fallback simulated).");
        }
      } catch (error) {
        console.error(`[Auto-Circle Router] API Key ID ${currentApi.id} Gagal: ${error.message}`);
        
        currentApi.error_count = (currentApi.error_count || 0) + 1;
        if (currentApi.error_count >= 3) {
          currentApi.is_active = false;
          console.warn(`[Auto-Circle Router] API Key ID ${currentApi.id} dinonaktifkan permanen karena eror >= 3 kali.`);
        }
        saveToStorage();
        renderApiPoolTable();

        attempts++;
      }
    }

    if (!success) {
      return null;
    }

    return replyText;
  }

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
      if (part.startsWith('<pre>')) return part;
      return part.replace(/\n/g, '<br>');
    }).join('</pre>');

    // Format simple bulleted lists (* text)
    formatted = formatted.replace(/^\*\s(.*)$/gm, '• $1');

    return formatted;
  }

  function handleButtonAction(label, action) {
    if (action.startsWith('flow:')) {
      const flowId = action.split(':')[1];
      appendMessage('user', label);
      startFlow(flowId);
    } else if (action.startsWith('http')) {
      window.open(action, '_blank');
    } else if (action === 'hubungi admin') {
      window.open('https://wa.me/6285764985114', '_blank');
    } else if (action === 'batal') {
      appendMessage('user', "Batal");
      sessionState.activeFlowId = null;
      appendMessage('assistant', "Pemesanan dibatalkan. Ada hal lain yang bisa saya bantu?");
    } else {
      chatInput.value = action;
      handleSendMessage();
    }
  }

  function appendMessage(sender, text, image = null, buttons = null) {
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

    if (image) {
      const img = document.createElement('img');
      img.src = image;
      img.className = 'message-image-attachment';
      img.alt = 'Uploaded image attachment';
      bubble.appendChild(img);
    }

    if (text) {
      const textContainer = document.createElement('div');
      textContainer.className = 'message-text';
      textContainer.innerHTML = formatMessageText(text);
      bubble.appendChild(textContainer);
    }

    if (buttons && buttons.length > 0) {
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'message-buttons-container';
      
      buttons.forEach(btnInfo => {
        const btn = document.createElement('button');
        btn.className = 'chat-inline-btn';
        
        let iconHtml = '';
        if (btnInfo.action.startsWith('flow:')) {
          iconHtml = '<i data-lucide="shopping-cart"></i>';
        } else if (btnInfo.action.startsWith('http')) {
          iconHtml = '<i data-lucide="external-link"></i>';
        } else {
          iconHtml = '<i data-lucide="message-square"></i>';
        }
        
        btn.innerHTML = `${iconHtml}<span>${btnInfo.label}</span>`;
        btn.addEventListener('click', () => {
          handleButtonAction(btnInfo.label, btnInfo.action);
        });
        buttonsContainer.appendChild(btn);
      });
      
      bubble.appendChild(buttonsContainer);
    }

    messageRow.appendChild(avatar);
    messageRow.appendChild(bubble);
    chatContentContainer.appendChild(messageRow);

    scrollToBottom();
    lucide.createIcons();
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

  function generateLocalFallbackResponse(userText, hasImage) {
    const text = userText.toLowerCase();
    if (hasImage) {
      return `Saya melihat gambar yang Anda lampirkan. 📸\n\nJika ini adalah **bukti transfer**, silakan kirim langsung ke WhatsApp kami di 085764985114 agar segera diaktifkan. Ada kendala akun premium yang ingin ditanyakan?`;
    }
    return `Mohon maaf, sistem AI kami sedang melakukan pemeliharaan rutin. Silakan pilih menu tombol di bawah atau tanyakan seputar katalog, ongkir, dan garansi.`;
  }

  async function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text && !attachedImageBase64) return;

    appendMessage('user', text, attachedImageBase64);
    
    const promptText = text;
    const hasImage = attachedImageBase64 !== null;

    chatInput.value = '';
    chatInput.style.height = '24px';
    clearImageAttachment();

    showTypingIndicator();

    setTimeout(async () => {
      removeTypingIndicator();

      // Layer 1.1: Active Flow State Machine
      if (sessionState.activeFlowId) {
        processFlowStep(promptText || "Opsi Dipilih");
        return;
      }

      // Layer 1.2: Keyword Trigger Machine
      const matchedTrigger = findKeywordTrigger(promptText);
      if (matchedTrigger) {
        appendMessage('assistant', matchedTrigger.response, null, matchedTrigger.buttons);
        return;
      }

      // Layer 2 & 3: AI Fallback with Auto-Circle
      const aiResponse = await generateAiReplyWithAutoCircle(promptText, botSettings.system_instruction);
      
      if (aiResponse) {
        appendMessage('assistant', aiResponse, null, botSettings.fallback_buttons);
      } else {
        const fallbackText = generateLocalFallbackResponse(promptText, hasImage);
        appendMessage('assistant', fallbackText, null, DEFAULT_AI_BUTTONS);
      }
    }, 1200);
  }

  sendBtn.addEventListener('click', handleSendMessage);

  // Suggestion Cards click binding
  suggestionCards.forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.getAttribute('data-prompt');
      chatInput.value = prompt;
      chatInput.style.height = '24px';
      chatInput.style.height = (chatInput.scrollHeight - 4) + 'px';
      updateInputState();
      chatInput.focus();
    });
  });

  // Reset chat / New Chat click
  newChatBtn.addEventListener('click', () => {
    const rows = document.querySelectorAll('.message-row');
    rows.forEach(row => row.remove());
    welcomeScreen.style.display = 'flex';
    clearImageAttachment();
    chatInput.value = '';
    chatInput.style.height = '24px';
    updateInputState();
    sessionState.activeFlowId = null;
  });

  // History Items click simulation
  historyItems.forEach(item => {
    item.addEventListener('click', () => {
      historyItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const title = item.querySelector('span').innerText;
      
      const rows = document.querySelectorAll('.message-row');
      rows.forEach(row => row.remove());
      welcomeScreen.style.display = 'none';

      appendMessage('user', `Tanya seputar: ${title}`);
      
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        let reply = "";
        let buttons = null;
        
        if (title.includes("Rekomendasi")) {
          reply = "Untuk rekomendasi aplikasi premium terlaris kami, silakan gunakan paket **Netflix Premium** untuk kebutuhan streaming film, atau **Canva Pro** untuk kebutuhan editing grafis Anda. Keduanya memiliki tingkat kepuasan pelanggan di atas 98%.";
          buttons = [
            { label: "Beli Netflix", action: "flow:beli_langsung" },
            { label: "Beli Canva Pro", action: "flow:beli_langsung" }
          ];
        } else if (title.includes("Pembayaran")) {
          reply = "Seluruh metode pembayaran digital (QRIS, DANA, GoPay, OVO, ShopeePay) serta Transfer Bank (BCA, Mandiri, BRI, BNI) diproses dalam hitungan menit saja. Konfirmasi transaksi dilakukan langsung di WhatsApp Customer Service kami.";
          buttons = [
            { label: "Tanya CS", action: "hubungi admin" }
          ];
        } else {
          reply = "Garansi produk kami mencakup **garansi uang kembali** atau **pemulihan premium gratis** jika dalam masa langganan terjadi kendala pada akun Anda. Tim kami siap membantu memproses klaim Anda dalam waktu singkat.";
          buttons = [
            { label: "Beli Langsung", action: "flow:beli_langsung" },
            { label: "Tanya CS", action: "hubungi admin" }
          ];
        }
        appendMessage('assistant', reply, null, buttons);
      }, 1000);

      if (window.innerWidth <= 768) {
        chatSidebar.classList.remove('active');
      }
    });
  });

  // ==========================================
  // SETTINGS MODAL INTERFACES & DOM BINDINGS
  // ==========================================
  const settingsToggleBtn = document.getElementById('settingsToggleBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const closeModalBtn2 = document.getElementById('closeModalBtn2');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const modalTabBtns = document.querySelectorAll('.modal-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  const addApiForm = document.getElementById('add-api-form');
  const apiProviderSelect = document.getElementById('api-provider');
  const apiKeyInput = document.getElementById('api-key');
  const apiPriorityInput = document.getElementById('api-priority');
  const apiPoolList = document.getElementById('api-pool-list');

  const addTriggerForm = document.getElementById('add-trigger-form');
  const triggerKeywordInput = document.getElementById('trigger-keyword');
  const triggerResponseInput = document.getElementById('trigger-response');
  const triggerBtn1LabelInput = document.getElementById('trigger-btn1-label');
  const triggerBtn1ActionInput = document.getElementById('trigger-btn1-action');
  const triggersList = document.getElementById('triggers-list');

  const systemInstructionInput = document.getElementById('system-instruction');
  const flowStepsEditor = document.getElementById('flow-steps-editor');
  const aiBtn1LabelInput = document.getElementById('ai-btn1-label');
  const aiBtn1ActionInput = document.getElementById('ai-btn1-action');
  const aiBtn2LabelInput = document.getElementById('ai-btn2-label');
  const aiBtn2ActionInput = document.getElementById('ai-btn2-action');

  settingsToggleBtn.addEventListener('click', () => {
    loadSettingsIntoModal();
    settingsModal.classList.add('active');
  });

  function closeModal() {
    settingsModal.classList.remove('active');
  }

  closeModalBtn.addEventListener('click', closeModal);
  closeModalBtn2.addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeModal);

  modalTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalTabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  function loadSettingsIntoModal() {
    renderApiPoolTable();
    renderTriggersTable();
    renderFlowStepsEditor();

    systemInstructionInput.value = botSettings.system_instruction;
    aiBtn1LabelInput.value = botSettings.fallback_buttons[0]?.label || '';
    aiBtn1ActionInput.value = botSettings.fallback_buttons[0]?.action || '';
    aiBtn2LabelInput.value = botSettings.fallback_buttons[1]?.label || '';
    aiBtn2ActionInput.value = botSettings.fallback_buttons[1]?.action || '';
  }

  function renderApiPoolTable() {
    apiPoolList.innerHTML = '';
    if (apiPool.length === 0) {
      apiPoolList.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Belum ada API Key. Masukkan kunci baru di atas.</td></tr>`;
      return;
    }

    apiPool.forEach((item, index) => {
      const maskedKey = item.api_key.substring(0, 8) + '...' + item.api_key.substring(item.api_key.length - 4);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.provider.toUpperCase()}</strong></td>
        <td><code>${maskedKey}</code></td>
        <td>${item.priority}</td>
        <td>${item.error_count || 0}</td>
        <td>
          <span class="status-badge ${item.is_active ? 'active' : 'error'}">
            ${item.is_active ? 'Aktif' : 'Terkena Limit'}
          </span>
        </td>
        <td>
          <button class="delete-btn" data-index="${index}"><i data-lucide="trash-2"></i></button>
        </td>
      `;
      apiPoolList.appendChild(tr);
    });

    apiPoolList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        apiPool.splice(index, 1);
        saveToStorage();
        renderApiPoolTable();
      });
    });
    lucide.createIcons();
  }

  addApiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const provider = apiProviderSelect.value;
    const key = apiKeyInput.value.trim();
    const priority = parseInt(apiPriorityInput.value) || 1;

    if (key) {
      apiPool.push({
        id: Date.now(),
        provider: provider,
        api_key: key,
        priority: priority,
        error_count: 0,
        is_active: true
      });
      apiKeyInput.value = '';
      apiPriorityInput.value = '1';
      saveToStorage();
      renderApiPoolTable();
    }
  });

  function renderTriggersTable() {
    triggersList.innerHTML = '';
    if (triggers.length === 0) {
      triggersList.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Belum ada keyword trigger. Tambahkan di atas.</td></tr>`;
      return;
    }

    triggers.forEach((item, index) => {
      const btnInfo = item.buttons && item.buttons[0] ? `${item.buttons[0].label} (${item.buttons[0].action})` : '-';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><code>${item.keyword}</code></td>
        <td><span style="display: block; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.response}</span></td>
        <td>${btnInfo}</td>
        <td>
          <button class="delete-btn" data-index="${index}"><i data-lucide="trash-2"></i></button>
        </td>
      `;
      triggersList.appendChild(tr);
    });

    triggersList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'));
        triggers.splice(index, 1);
        saveToStorage();
        renderTriggersTable();
      });
    });
    lucide.createIcons();
  }

  addTriggerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = triggerKeywordInput.value.trim();
    const response = triggerResponseInput.value.trim();
    const btnLabel = triggerBtn1LabelInput.value.trim();
    const btnAction = triggerBtn1ActionInput.value.trim();

    if (keyword && response) {
      const newTrigger = {
        keyword: keyword,
        response: response,
        buttons: []
      };

      if (btnLabel && btnAction) {
        newTrigger.buttons.push({
          label: btnLabel,
          action: btnAction
        });
      }

      triggers.push(newTrigger);
      triggerKeywordInput.value = '';
      triggerResponseInput.value = '';
      triggerBtn1LabelInput.value = '';
      triggerBtn1ActionInput.value = '';
      
      saveToStorage();
      renderTriggersTable();
    }
  });

  function renderFlowStepsEditor() {
    flowStepsEditor.innerHTML = '';
    const flow = DEFAULT_FLOWS.beli_langsung;
    flow.steps.forEach((step, idx) => {
      const div = document.createElement('div');
      div.className = 'flow-step-row';
      div.innerHTML = `
        <span class="step-number">${idx + 1}</span>
        <input type="text" class="step-question-input" data-index="${idx}" value="${step.text}" placeholder="Pertanyaan langkah ${idx + 1}" required>
      `;
      flowStepsEditor.appendChild(div);
    });
  }

  saveSettingsBtn.addEventListener('click', () => {
    botSettings.system_instruction = systemInstructionInput.value.trim() || DEFAULT_SYSTEM_PROMPT;

    const stepInputs = flowStepsEditor.querySelectorAll('.step-question-input');
    stepInputs.forEach(input => {
      const idx = parseInt(input.getAttribute('data-index'));
      DEFAULT_FLOWS.beli_langsung.steps[idx].text = input.value.trim();
    });

    const btn1Label = aiBtn1LabelInput.value.trim();
    const btn1Action = aiBtn1ActionInput.value.trim();
    const btn2Label = aiBtn2LabelInput.value.trim();
    const btn2Action = aiBtn2ActionInput.value.trim();

    botSettings.fallback_buttons = [];
    if (btn1Label && btn1Action) {
      botSettings.fallback_buttons.push({ label: btn1Label, action: btn1Action });
    }
    if (btn2Label && btn2Action) {
      botSettings.fallback_buttons.push({ label: btn2Label, action: btn2Action });
    }

    saveToStorage();
    closeModal();
    
    appendMessage('assistant', "✅ Pengaturan OmniChat Engine berhasil diperbarui dan disimpan!");
  });

});
