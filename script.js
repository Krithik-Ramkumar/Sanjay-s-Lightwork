/* ========================================================================
   Sanjay's Lightworks — INTERACTIONS
   Custom cursor · Magnetic elements · Scroll reveals · Gallery system
   ======================================================================== */

(function () {
    'use strict';

    // ---------- ACCESSIBILITY: REDUCED MOTION ----------
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // ---------- DOM READY ----------
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initLoader();
        populateNavLabels();
        if (!prefersReducedMotion && !isMobile) {
            initCustomCursor();
            initMagneticElements();
            initFloatingShapesParallax();
        }
        initNavigation();
        initMobileMenu();
        initProgressIndicator();
        initScrollLabel();
        initScrollReveals();
        initStatCounters();
        initGallery();
        initKeyboardNav();
        initSectionTracking();
        initBookingForm();
    }

    /* ========================================================================
       LOADING SCREEN
       ======================================================================== */
    function initLoader() {
        const loader = document.getElementById('loader');
        const fill = document.getElementById('loaderBarFill');
        const percentage = document.getElementById('loaderPercentage');
        if (!loader) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                fill.style.width = '100%';
                percentage.textContent = '100%';
                setTimeout(() => {
                    loader.classList.add('hidden');
                    afterLoadReveal();
                }, 400);
            } else {
                fill.style.width = progress + '%';
                percentage.textContent = Math.floor(progress) + '%';
            }
        }, 60);
    }

    function afterLoadReveal() {
        const hero = document.querySelector('.section-home');
        if (!hero) return;

        const reveals = hero.querySelectorAll('.reveal-text, .reveal-up, .reveal-word');
        reveals.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('in');
            }, 120 + (i * 70));
        });
    }

    /* ========================================================================
       CUSTOM CURSOR
       ======================================================================== */
    function initCustomCursor() {
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        if (!dot || !ring) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dotX = mouseX;
        let dotY = mouseY;
        let ringX = mouseX;
        let ringY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;

            dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

            requestAnimationFrame(animate);
        }
        animate();

        const interactive = 'a, button, [data-nav], .thumb, .magnetic-link, .magnetic-btn, .magnetic-img, .skill-item, .timeline-item';
        document.querySelectorAll(interactive).forEach(el => {
            const isImg = el.classList.contains('magnetic-img') || el.closest('.thumb');
            const isBtn = el.classList.contains('magnetic-btn') || el.tagName === 'BUTTON';
            
            el.addEventListener('mouseenter', () => {
                dot.classList.add('cursor-hover');
                ring.classList.add('cursor-hover');
                if (isImg) ring.classList.add('cursor-img');
                if (isBtn) ring.classList.add('cursor-btn');
            });
            
            el.addEventListener('mouseleave', () => {
                dot.classList.remove('cursor-hover');
                ring.classList.remove('cursor-hover', 'cursor-img', 'cursor-btn');
            });
        });
    }

    /* ========================================================================
       MAGNETIC ELEMENTS (links, buttons, images)
       ======================================================================== */
    function initMagneticElements() {
        const magnetics = document.querySelectorAll('.magnetic-link, .magnetic-btn, .magnetic-img, .thumb, .nav-link, .btn');
        if (!magnetics.length) return;

        magnetics.forEach(el => {
            const strength = el.classList.contains('magnetic-btn') ? 0.28 :
                             el.classList.contains('magnetic-img') ? 0.22 : 0.18;
            const radius = 140;

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = e.clientX - cx;
                const dy = e.clientY - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < radius) {
                    const tx = dx * strength;
                    const ty = dy * strength;
                    el.style.transform = `translate(${tx}px, ${ty}px)`;
                    el.style.transition = 'transform 0.15s ease-out';
                }
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
                el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                setTimeout(() => {
                    el.style.transition = '';
                    el.style.transform = '';
                }, 620);
            });
        });
    }

    /* ========================================================================
       FLOATING SHAPES PARALLAX
       ======================================================================== */
    function initFloatingShapesParallax() {
        const shapes = document.querySelectorAll('.floating-shapes .shape');
        if (!shapes.length) return;
        const maxOffset = 25;

        window.addEventListener('mousemove', (e) => {
            const mx = (e.clientX / window.innerWidth - 0.5) * 2;
            const my = (e.clientY / window.innerHeight - 0.5) * 2;

            shapes.forEach((shape, i) => {
                const factor = (i + 1) * 0.6;
                const x = mx * maxOffset * factor;
                const y = my * maxOffset * factor;
                shape.style.setProperty('transform',
                    `translate(${x}px, ${y}px) ${shape.classList.contains('shape-2') ? 'rotate(45deg)' : ''}`);
            });
        });
    }

    /* ========================================================================
       POPULATE NAV LABELS for double-text hover
       ======================================================================== */
    function populateNavLabels() {
        document.querySelectorAll('.nav-label').forEach(label => {
            const text = label.textContent.trim();
            label.textContent = '';
            label.dataset.text = text;
        });
    }

    /* ========================================================================
       NAVIGATION (smooth scroll + active state)
       ======================================================================== */
    function initNavigation() {
        const nav = document.getElementById('nav');
        const navLinks = document.querySelectorAll('[data-nav]');
        const overlay = document.querySelector('.page-transition');
        const counter = document.getElementById('transitionCount');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        const sectionNumbers = { home: '01', about: '02', portfolio: '03', book: '04' };

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.dataset.nav;
                if (!target) return;
                const sectionEl = document.getElementById(target);
                if (!sectionEl) return;

                const isInternal = link.closest('.mobile-menu, .nav-links, .progress-indicator');
                if (isInternal) {
                    e.preventDefault();
                    closeMobileMenu();

                    if (overlay && !prefersReducedMotion) {
                        if (counter) counter.textContent = sectionNumbers[target] || '01';
                        overlay.classList.add('active');
                        overlay.classList.remove('out');

                        setTimeout(() => {
                            sectionEl.scrollIntoView({ behavior: 'auto', block: 'start' });
                            setTimeout(() => {
                                overlay.classList.add('out');
                                setTimeout(() => overlay.classList.remove('active', 'out'), 750);
                            }, 120);
                        }, 450);
                    } else {
                        sectionEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    /* ========================================================================
       MOBILE MENU
       ======================================================================== */
    function initMobileMenu() {
        const btn = document.getElementById('menuBtn');
        const menu = document.getElementById('mobileMenu');
        if (!btn || !menu) return;

        btn.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('open');
            btn.classList.toggle('open', isOpen);
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    function closeMobileMenu() {
        const btn = document.getElementById('menuBtn');
        const menu = document.getElementById('mobileMenu');
        if (menu) menu.classList.remove('open');
        if (btn) {
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    /* ========================================================================
       SIDE PROGRESS INDICATOR (dots)
       ======================================================================== */
    function initProgressIndicator() {
        const dots = document.querySelectorAll('.progress-dot');
        if (!dots.length) return;

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const target = dot.dataset.target;
                const el = document.getElementById(target);
                if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            });
        });
    }

    /* ========================================================================
       SCROLL LABEL (rotated, right side)
       ======================================================================== */
    function initScrollLabel() {
        const label = document.getElementById('scrollLabelText');
        if (!label) return;
        const sectionLabels = {
            home: 'HOME',
            about: 'ABOUT',
            portfolio: 'WORK',
            book: 'BOOK NOW'
        };
        window.addEventListener('active-section', (e) => {
            const id = e.detail.id;
            label.style.opacity = '0';
            setTimeout(() => {
                label.textContent = sectionLabels[id] || 'HOME';
                label.style.opacity = '1';
            }, 200);
        });
    }

    /* ========================================================================
       SECTION TRACKING — emits 'active-section' event, updates nav + dots
       ======================================================================== */
    function initSectionTracking() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        const dots = document.querySelectorAll('.progress-dot');

        const options = {
            threshold: 0.4,
            rootMargin: '-10% 0px -20% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;

                    navLinks.forEach(l => l.classList.toggle('active', l.dataset.nav === id));
                    dots.forEach(d => d.classList.toggle('active', d.dataset.target === id));

                    window.dispatchEvent(new CustomEvent('active-section', { detail: { id } }));
                }
            });
        }, options);

        sections.forEach(s => observer.observe(s));
    }

    /* ========================================================================
       SCROLL REVEALS (text, words, up-reveal blocks)
       ======================================================================== */
    function initScrollReveals() {
        const revealTargets = document.querySelectorAll('.reveal-text, .reveal-up, .reveal-word');
        if (!revealTargets.length) return;

        if (prefersReducedMotion) {
            revealTargets.forEach(t => t.classList.add('in'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // stagger words inside the same container
                    const parent = entry.target.parentElement;
                    if (parent && parent.classList.contains('st-line')) {
                        const words = parent.querySelectorAll('.reveal-word');
                        words.forEach((w, i) => {
                            setTimeout(() => w.classList.add('in'), 120 + (i * 90));
                        });
                    } else if (entry.target.classList.contains('reveal-word')) {
                        entry.target.classList.add('in');
                    } else {
                        entry.target.classList.add('in');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

        revealTargets.forEach(t => observer.observe(t));
    }

    /* ========================================================================
       STAT COUNTERS (animated numbers)
       ======================================================================== */
    function initStatCounters() {
        const counters = document.querySelectorAll('.stat-num[data-count]');
        if (!counters.length) return;

        const animateCounter = (el) => {
            const target = parseInt(el.dataset.count, 10);
            const duration = 1600;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);
                el.textContent = value + (target >= 100 ? '+' : '');
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        };

        if (prefersReducedMotion) {
            counters.forEach(el => el.textContent = el.dataset.count + (parseInt(el.dataset.count) >= 100 ? '+' : ''));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach(c => observer.observe(c));
    }

    /* ========================================================================
       GALLERY SYSTEM — Auto-rotate every 7s, cinematic transitions
       ======================================================================== */
    function initGallery() {
        const slides = document.querySelectorAll('.gallery-slide');
        const infoSlides = document.querySelectorAll('.info-slide');
        const thumbs = document.querySelectorAll('.thumb');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const playBtn = document.getElementById('playBtn');
        const playLabel = document.getElementById('playLabel');
        const currentEl = document.getElementById('currentSlide');
        const totalEl = document.getElementById('totalSlides');
        const progressFill = document.getElementById('progressFill');
        if (!slides.length) return;

        const total = slides.length;
        let index = 0;
        let isPlaying = true;
        let lastTick = performance.now();
        let progress = 0;
        const duration = prefersReducedMotion ? 15000 : 7000;
        let transitioning = false;

        if (totalEl) totalEl.textContent = String(total).padStart(2, '0');

        // Initialize first slide without animation
        slides[0].classList.add('active');
        infoSlides[0].classList.add('active');
        if (thumbs[0]) thumbs[0].classList.add('active');
        updateCounter();

        function goTo(newIndex, direction = 1) {
            if (transitioning || newIndex === index) return;
            transitioning = true;

            const currentSlide = slides[index];
            const currentInfo = infoSlides[index];
            const nextIndex = ((newIndex % total) + total) % total;
            const nextSlide = slides[nextIndex];
            const nextInfo = infoSlides[nextIndex];

            // Leaving animation
            currentSlide.classList.add('leaving');
            currentInfo.classList.remove('active');

            // Arriving
            setTimeout(() => {
                currentSlide.classList.remove('active', 'leaving');
                nextSlide.classList.add('active');
                nextInfo.classList.add('active');

                thumbs.forEach((t, i) => t.classList.toggle('active', i === nextIndex));

                index = nextIndex;
                updateCounter();
                resetProgress();

                setTimeout(() => {
                    transitioning = false;
                }, 900);
            }, prefersReducedMotion ? 0 : 650);
        }

        function goNext() { goTo(index + 1, 1); }
        function goPrev() { goTo(index - 1, -1); }

        function updateCounter() {
            if (currentEl) currentEl.textContent = String(index + 1).padStart(2, '0');
        }

        function resetProgress() {
            progress = 0;
            if (progressFill) progressFill.style.width = '0%';
            lastTick = performance.now();
        }

        function tick(now) {
            if (isPlaying && !transitioning) {
                const elapsed = now - lastTick;
                lastTick = now;
                progress += elapsed;
                const pct = Math.min((progress / duration) * 100, 100);
                if (progressFill) progressFill.style.width = pct + '%';
                if (progress >= duration) {
                    goNext();
                }
            } else {
                lastTick = now;
            }
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);

        // Manual controls
        if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); restartOnInteract(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); restartOnInteract(); });

        // Thumbnails
        thumbs.forEach((thumb, i) => {
            thumb.addEventListener('click', () => {
                if (i !== index) {
                    goTo(i, i > index ? 1 : -1);
                    restartOnInteract();
                }
            });
        });

        // Play/Pause
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                isPlaying = !isPlaying;
                playBtn.classList.toggle('paused', !isPlaying);
                if (playLabel) playLabel.textContent = isPlaying ? 'PAUSE' : 'PLAY';
                if (isPlaying) {
                    lastTick = performance.now();
                }
            });
        }

        function restartOnInteract() {
            // user interacted, keep playing state but reset progress
            resetProgress();
            if (!isPlaying) {
                // auto-resume briefly on interaction? keep as-is
            }
        }

        // Pause on hover
        const gallery = document.getElementById('gallery');
        if (gallery && !prefersReducedMotion) {
            gallery.addEventListener('mouseenter', () => {
                if (isPlaying) {
                    isPlaying = false;
                    playBtn?.classList.add('paused');
                    if (playLabel) playLabel.textContent = 'PLAY';
                }
            });
            gallery.addEventListener('mouseleave', () => {
                // resume only if user didn't explicitly pause
                isPlaying = true;
                playBtn?.classList.remove('paused');
                if (playLabel) playLabel.textContent = 'PAUSE';
                lastTick = performance.now();
            });
        }

        // Touch swipe support
        let touchStartX = 0;
        const stage = document.getElementById('galleryStage');
        if (stage) {
            stage.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });
            stage.addEventListener('touchend', (e) => {
                const dx = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(dx) > 50) {
                    if (dx < 0) goNext(); else goPrev();
                    restartOnInteract();
                }
            }, { passive: true });
        }
    }

    /* ========================================================================
       KEYBOARD NAVIGATION (gallery + focus)
       ======================================================================== */
    function initKeyboardNav() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        document.addEventListener('keydown', (e) => {
            // Arrow keys for gallery when on portfolio or generally
            if (e.key === 'ArrowRight') {
                nextBtn?.click();
            } else if (e.key === 'ArrowLeft') {
                prevBtn?.click();
            } else if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Focus management in mobile menu
        const mobileLinks = document.querySelectorAll('.mobile-menu-link');
        mobileLinks.forEach(link => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        });
    }

    /* ========================================================================
       BOOK NOW — booking form submission (emails the owner via Formspree)
       ======================================================================== */
    function initBookingForm() {
        const form = document.getElementById('bookingForm');
        if (!form) return;

        const dateInput = document.getElementById('bookDate');
        if (dateInput) {
            // Prevent picking a date in the past
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            dateInput.min = `${yyyy}-${mm}-${dd}`;
        }

        const submitBtn = document.getElementById('bookSubmitBtn');
        const statusEl = document.getElementById('formStatus');
        const btnTextEl = submitBtn ? submitBtn.querySelector('.btn-text') : null;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (form.action.includes('YOUR_FORM_ID')) {
                if (statusEl) {
                    statusEl.textContent = 'Booking form is not connected to an email service yet. See setup instructions.';
                    statusEl.className = 'form-status error';
                }
                return;
            }

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (submitBtn) submitBtn.setAttribute('disabled', 'true');
            if (btnTextEl) btnTextEl.textContent = 'SENDING...';
            if (statusEl) {
                statusEl.textContent = '';
                statusEl.className = 'form-status';
            }

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (statusEl) {
                        statusEl.textContent = 'Thanks — your booking request has been sent. I\'ll be in touch soon.';
                        statusEl.className = 'form-status success';
                    }
                    form.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                if (statusEl) {
                    statusEl.textContent = 'Something went wrong sending your request. Please try again or email directly.';
                    statusEl.className = 'form-status error';
                }
            } finally {
                if (submitBtn) submitBtn.removeAttribute('disabled');
                if (btnTextEl) btnTextEl.textContent = 'SUBMIT REQUEST';
            }
        });
    }

})();
