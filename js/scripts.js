/*!
 * Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
 */
// Scripts

window.addEventListener('DOMContentLoaded', event => {
  // ===== ScrollSpy on sideNav =====
  const sideNav = document.body.querySelector('#sideNav');
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#sideNav',
      rootMargin: '0px 0px -40%',
    });
  }

  // ===== Close navbar when a link is clicked (mobile) =====
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.forEach(function (responsiveNavItem) {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });

  // ===== Smooth scroll for .js-scroll-trigger =====
  const scrollLinks = document.querySelectorAll('.js-scroll-trigger');
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Section highlight flicker (subtle) =====
  const sections = document.querySelectorAll('.resume-section');
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.3 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        section.style.transition = 'background-color 0.5s ease';
        const isDark = document.body.classList.contains('dark-mode');
        section.style.backgroundColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
        setTimeout(() => { section.style.backgroundColor = ''; }, 1000);
      }
    });
  }, observerOptions);
  sections.forEach(section => observer.observe(section));

  // ===== Nav link hover slide effect =====
  responsiveNavItems.forEach(navItem => {
    if (!navItem.querySelector('span.text-content')) {
      const textContent = navItem.textContent.trim();
      navItem.textContent = '';
      const textSpan = document.createElement('span');
      textSpan.className = 'text-content';
      textSpan.textContent = textContent;
      navItem.appendChild(textSpan);
    }
    const textSpan = navItem.querySelector('.text-content');
    textSpan.style.transition = 'transform 0.3s ease, color 0.3s ease';
    textSpan.style.display = 'inline-block';
    navItem.addEventListener('mouseenter', () => {
      textSpan.style.transform = 'translateX(10px)';
      textSpan.style.color = 'var(--bs-primary)';
    });
    navItem.addEventListener('mouseleave', () => {
      textSpan.style.transform = 'translateX(0)';
      textSpan.style.color = '';
    });
  });

  // ===== Social icon lift =====
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach(icon => {
    icon.style.transition = 'transform 0.3s ease';
    icon.addEventListener('mouseenter', () => { icon.style.transform = 'translateY(-5px)'; });
    icon.addEventListener('mouseleave', () => { icon.style.transform = 'translateY(0)'; });
  });

  // ===== Top progress bar =====
  const progressBar = document.createElement('div');
  progressBar.style.position = 'fixed';
  progressBar.style.top = '0';
  progressBar.style.left = '0';
  progressBar.style.height = '4px';
  progressBar.style.backgroundColor = 'var(--bs-primary)';
  progressBar.style.zIndex = '2000';
  progressBar.style.transition = 'width 0.2s ease';
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  });

  // ===== Dark mode toggle with system preference fallback =====
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    const storedPref = localStorage.getItem('dark-mode');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedPref === 'enabled' || (storedPref === null && systemPrefersDark)) {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
    }
    darkModeToggle.addEventListener('change', () => {
      const enabled = darkModeToggle.checked;
      document.body.classList.toggle('dark-mode', enabled);
      localStorage.setItem('dark-mode', enabled ? 'enabled' : 'disabled');
    });
  }

  // ===== GIIS carousel =====
  const giisCarouselEl = document.querySelector('#giisCarousel');
  if (giisCarouselEl && window.bootstrap && bootstrap.Carousel) {
    new bootstrap.Carousel(giisCarouselEl, {
      interval: 4000,
      ride: 'carousel',
      pause: 'hover',
      touch: true,
      wrap: true
    });
  }

  // ===== Chat widget -> backend bridge (with warmup/queue/retry) =====
  if (!window.__chatInited) {
    window.__chatInited = true;

    // Backend endpoint selection
    const PROD_URL = "https://kshitijkaria-github-io.onrender.com/chat";
    const DEV_URL  = "http://localhost:4000/chat";
    const BACKEND_URL = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? DEV_URL : PROD_URL;

    const chatFab   = document.getElementById("chat-fab");
    const chatBox   = document.getElementById("chatbot");
    const chatClose = document.getElementById("chat-close");
    const chatLog   = document.getElementById("chat-log");
    const chatInput = document.getElementById("chat-input");
    const chatSend  = document.getElementById("chat-send");

    // --- UI helpers ---
    let typingEl = null;
    function showTyping(textOverride) {
      if (!chatLog) return;
      typingEl = document.createElement("div");
      typingEl.className = "chat-typing";
      typingEl.innerHTML = `<b>Kshitij:</b> <span aria-live="polite">${textOverride || "typing…"}</span>`;
      chatLog.appendChild(typingEl);
      chatLog.scrollTop = chatLog.scrollHeight;
    }
    function updateTyping(text) { if (typingEl) typingEl.querySelector("span").textContent = text; }
    function hideTyping() {
      if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
      typingEl = null;
    }
    function append(role, text) {
      if (!chatLog) return;
      const div = document.createElement("div");
      div.innerHTML = `<b>${role}:</b> ${text}`;
      chatLog.appendChild(div);
      chatLog.scrollTop = chatLog.scrollHeight;
    }

    // --- Fetch helper ---
    async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
      } finally {
        clearTimeout(t);
      }
    }
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // --- Warmup + queue state ---
    let backendReady = false;
    const pendingMsgs = [];

    async function warmUpBackend() {
      try {
        // Prefer GET /health; if not available, POST a tiny warmup
        const healthURL = BACKEND_URL.replace(/\/chat$/, '/health');
        let ok = false;

        try {
          const res = await fetchWithTimeout(healthURL, {}, 6000);
          ok = res.ok;
        } catch {/* ignore */}

        if (!ok) {
          const res = await fetchWithTimeout(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "__warmup__" })
          }, 8000);
          ok = res.ok;
        }

        backendReady = ok;

        if (ok) {
          while (pendingMsgs.length) {
            const m = pendingMsgs.shift();
            await actuallySendMsg(m);
          }
        }
      } catch {
        // retry once after a short delay
        await sleep(1500);
        try { await warmUpBackend(); } catch {}
      }
    }

    // --- Ask function with one retry/backoff ---
    async function askAboutKshitij(message) {
      try {
        const res = await fetchWithTimeout(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        }, 15000);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json().catch(() => ({}));
        return data.reply || "Sorry, I’m not sure.";
      } catch (err) {
        await sleep(1200); // backoff
        const res2 = await fetchWithTimeout(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        }, 15000);
        if (!res2.ok) throw new Error(`Retry failed: HTTP ${res2.status}`);
        const data2 = await res2.json().catch(() => ({}));
        return data2.reply || "Sorry, I’m not sure.";
      }
    }

    // --- Send flows ---
    async function actuallySendMsg(msg) {
      showTyping();
      try {
        const reply = await askAboutKshitij(msg);
        hideTyping();
        append("Kshitij", reply);
      } catch (e) {
        hideTyping();
        append("Kshitij", "It took a bit to wake up. Please try again now 👍");
      } finally {
        if (chatSend) chatSend.disabled = false;
      }
    }

    async function sendMsg() {
      const msg = (chatInput?.value || "").trim();
      if (!msg) return;
      append("You", msg);
      if (chatInput) chatInput.value = "";
      if (chatSend) chatSend.disabled = true;

      if (!backendReady) {
        pendingMsgs.push(msg);
        showTyping("Waking the server…");
        if (!window.__warmStarted) {
          window.__warmStarted = true;
          warmUpBackend().then(hideTyping).catch(hideTyping);
        }
        return;
      }
      await actuallySendMsg(msg);
    }

    // --- UI wiring ---
    chatFab?.addEventListener("click", () => {
      if (chatBox) chatBox.style.display = "block";
      if (chatFab) { chatFab.style.display = "none"; chatFab.classList.remove("glow"); }
      chatInput?.focus();
    });
    chatClose?.addEventListener("click", () => {
      if (chatBox) chatBox.style.display = "none";
      if (chatFab) { chatFab.style.display = "flex"; chatFab.classList.add("glow"); }
    });
    chatSend?.addEventListener("click", sendMsg);
    chatInput?.addEventListener("keydown", e => { if (e.key === "Enter") sendMsg(); });

    // Kick off warmup shortly after load
    setTimeout(() => {
      if (!window.__warmStarted) {
        window.__warmStarted = true;
        warmUpBackend();
      }
    }, 500);
  }
});
