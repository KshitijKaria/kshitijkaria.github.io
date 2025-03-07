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
                section.style.backgroundColor = 'rgba(248, 249, 250, 0.5)'; // Light gray highlight
                setTimeout(() => {
                    section.style.backgroundColor = '';
                }, 1000); // Fade out after 1 second
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
        textSpan.style.color = '#000';
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
    progressBar.style.backgroundColor = '#000';
    progressBar.style.zIndex = '1000';
    progressBar.style.transition = 'width 0.2s ease';
    sideNav.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    });
});