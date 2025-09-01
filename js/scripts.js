/*!
 * Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
 */
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    }

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

    const scrollLinks = document.querySelectorAll('.js-scroll-trigger');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const sections = document.querySelectorAll('.resume-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of section is visible
    };
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

responsiveNavItems.forEach(navItem => {
    if (!navItem.querySelector('span.text-content')) {
        const textContent = navItem.textContent.trim();
        navItem.textContent = ''; // Clear original text
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

const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.style.transition = 'transform 0.3s ease';
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-5px)';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0)';
        });
    });

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

    // Dark mode toggle with system preference fallback
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

    // GIIS carousel: autoplay, pause on hover, touch swipe
    const giisCarouselEl = document.querySelector('#giisCarousel');
    if (giisCarouselEl && window.bootstrap && bootstrap.Carousel) {
        new bootstrap.Carousel(giisCarouselEl, {
            interval: 4000,    // auto-switch every 4s
            ride: 'carousel',  // start automatically
            pause: 'hover',    // pause when hovered
            touch: true,       // swipe on touch devices
            wrap: true
        });
    }

    // ===== Chat widget -> backend bridge =====
    // Avoid double init if this script executes twice
    if (!window.__chatInited) {
        window.__chatInited = true;

        // Backend endpoint selection: use Render in prod, localhost in dev
        const PROD_URL = "https://kshitijkaria-github-io.onrender.com/chat";
        const DEV_URL  = "http://localhost:4000/chat";
        const BACKEND_URL = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? DEV_URL : PROD_URL;

        const chatFab   = document.getElementById("chat-fab");
        const chatBox   = document.getElementById("chatbot");
        const chatClose = document.getElementById("chat-close");
        const chatLog   = document.getElementById("chat-log");
        const chatInput = document.getElementById("chat-input");
        const chatSend  = document.getElementById("chat-send");

        let typingEl = null;
        function showTyping() {
            if (!chatLog) return;
            typingEl = document.createElement("div");
            typingEl.className = "chat-typing";
            typingEl.innerHTML = `<b>Kshitij:</b> <span aria-live="polite">typing…</span>`;
            chatLog.appendChild(typingEl);
            chatLog.scrollTop = chatLog.scrollHeight;
        }
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

        async function askAboutKshitij(message) {
            const res = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });
            const data = await res.json();
            return data.reply || "Sorry, I’m not sure.";
        }

        async function sendMsg() {
            const msg = (chatInput?.value || "").trim();
            if (!msg) return;
            append("You", msg);
            if (chatInput) chatInput.value = "";
            chatSend && (chatSend.disabled = true);
            showTyping();
            try {
                const reply = await askAboutKshitij(msg);
                hideTyping();
                append("Kshitij", reply);
            } catch (e) {
                hideTyping();
                append("Kshitij", "Hmm, I couldn’t reach the server.");
            } finally {
                chatSend && (chatSend.disabled = false);
            }
        }

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
    }
});