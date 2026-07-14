// Initialize Lucide Icons
lucide.createIcons();

// ==========================================
// 1. MOBILE MENU TOGGLE
// ==========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// ==========================================
// 2. SCROLLED NAVBAR STYLING
// ==========================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ==========================================
// 3. MOUSE TRACKING GLOW BLOB (Google AI Vibe)
// ==========================================
const interactiveBlob = document.getElementById('interactiveBlob');

if (interactiveBlob) {
  let mouseX = 0;
  let mouseY = 0;
  let blobX = 0;
  let blobY = 0;
  
  // Smooth follow behavior
  const speed = 0.08;

  window.addEventListener('mousemove', (e) => {
    // Show blob when mouse is active
    interactiveBlob.style.opacity = '1';
    mouseX = e.clientX + window.scrollX;
    mouseY = e.clientY + window.scrollY;
  });

  window.addEventListener('mouseout', () => {
    interactiveBlob.style.opacity = '0';
  });

  function animateBlob() {
    // Calculate distance
    const distX = mouseX - blobX;
    const distY = mouseY - blobY;
    
    // Lerp (Linear Interpolation)
    blobX += distX * speed;
    blobY += distY * speed;
    
    interactiveBlob.style.left = `${blobX}px`;
    interactiveBlob.style.top = `${blobY}px`;
    
    requestAnimationFrame(animateBlob);
  }
  animateBlob();
}

// ==========================================
// 4. 3D TILT EFFECT ON CARDS
// ==========================================
const cards = document.querySelectorAll('.service-card, .feature-card, .calculator-container, .contact-box');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation degree (max 8 degrees)
    const rotateX = ((centerY - y) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * 6;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

// ==========================================
// 5. INTERACTIVE SAVINGS CALCULATOR
// ==========================================
const appItems = document.querySelectorAll('.calc-app-item');
const durationSlider = document.getElementById('calcDuration');
const durationVal = document.getElementById('durationVal');
const retailTotalEl = document.getElementById('retailTotal');
const jajanTotalEl = document.getElementById('jajanTotal');
const savingsTotalEl = document.getElementById('savingsTotal');
const calcCta = document.getElementById('calcCta');

// Format number to IDR
function formatIDR(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num).replace('IDR', 'Rp');
}

function updateCalculator() {
  let retailTotal = 0;
  let jajanTotal = 0;
  const duration = parseInt(durationSlider.value);
  
  durationVal.textContent = duration;

  appItems.forEach(item => {
    if (item.classList.contains('selected')) {
      const retail = parseInt(item.getAttribute('data-retail'));
      const jajan = parseInt(item.getAttribute('data-jajan'));
      
      retailTotal += retail;
      jajanTotal += jajan;
    }
  });

  // Calculate total across duration
  const finalRetail = retailTotal * duration;
  const finalJajan = jajanTotal * duration;
  const finalSavings = finalRetail - finalJajan;

  retailTotalEl.textContent = formatIDR(finalRetail);
  jajanTotalEl.textContent = formatIDR(finalJajan);
  savingsTotalEl.textContent = formatIDR(finalSavings);
}

// Toggle app selection
appItems.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('selected');
    updateCalculator();
  });
});

// Slider input change
if (durationSlider) {
  durationSlider.addEventListener('input', updateCalculator);
}

// WhatsApp prefilled message dynamic creation
if (calcCta) {
  calcCta.addEventListener('click', () => {
    const selectedApps = [];
    appItems.forEach(item => {
      if (item.classList.contains('selected')) {
        selectedApps.push(item.getAttribute('data-name'));
      }
    });

    if (selectedApps.length === 0) {
      alert('Silakan pilih minimal 1 aplikasi terlebih dahulu!');
      return;
    }

    const duration = durationSlider.value;
    const finalJajanText = jajanTotalEl.textContent;
    const finalSavingsText = savingsTotalEl.textContent;

    const waNumber = '6285764985114';
    let text = `Halo Jajan Digital! 👋\n\n`;
    text += `Saya tertarik untuk memesan paket aplikasi premium berikut:\n`;
    selectedApps.forEach((app, idx) => {
      text += `${idx + 1}. *${app}*\n`;
    });
    text += `\n📅 *Durasi:* ${duration} Bulan\n`;
    text += `💰 *Estimasi Biaya:* ${finalJajanText}\n`;
    text += `✨ *Hemat Hingga:* ${finalSavingsText}\n\n`;
    text += `Mohon info detail metode pembayaran dan proses aktivasinya. Terima kasih!`;

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
    window.open(waUrl, '_blank');
  });
}

// Initialize calculator calculation
updateCalculator();

// ==========================================
// 6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// ==========================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // If the target is the about section, trigger statistics animation
      if (entry.target.querySelector('#statNum') || entry.target.id === 'tentang') {
        animateStats();
      }
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
  el.classList.add('reveal'); // Ensure reveal class is applied
  revealObserver.observe(el);
});

// ==========================================
// 7. STATS COUNT-UP ANIMATION
// ==========================================
let statsAnimated = false;
function animateStats() {
  if (statsAnimated) return;
  const statNumEl = document.getElementById('statNum');
  if (!statNumEl) return;
  
  statsAnimated = true;
  let currentVal = 0;
  const targetVal = 10000; // 10K
  const duration = 2000; // 2 seconds
  const stepTime = 30; // ms
  const increments = targetVal / (duration / stepTime);

  const counter = setInterval(() => {
    currentVal += increments;
    if (currentVal >= targetVal) {
      statNumEl.textContent = '10.000+';
      clearInterval(counter);
    } else {
      statNumEl.textContent = `${Math.floor(currentVal).toLocaleString('id-ID')}+`;
    }
  }, stepTime);
}

// ==========================================
// 8. THEME TOGGLER (DARK / LIGHT MODE)
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check stored theme preference
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'light') {
  body.classList.add('light-theme');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    
    // Save theme preference in localStorage
    if (body.classList.contains('light-theme')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  });
}
