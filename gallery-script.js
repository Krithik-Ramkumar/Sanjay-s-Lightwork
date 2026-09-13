/* ========================================================================
   Sanjay's Lightworks — GALLERY PAGE SCRIPT
   Mobile menu · Gallery system · Lightbox
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
        if (!prefersReducedMotion && !isMobile) {
            initMagneticElements();
        }
        initMobileMenu();
        initScrollReveals();
        initPhotoGallery();
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
            progress += Math.random() * 12 + 3;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                fill.style.width = '100%';
                percentage.textContent = '100%';
                setTimeout(() => {
                    loader.classList.add('hidden');
                    afterLoadReveal();
                }, 200);
            } else {
                fill.style.width = progress + '%';
                percentage.textContent = Math.floor(progress) + '%';
            }
        }, 30);
    }

    function afterLoadReveal() {
        const reveals = document.querySelectorAll('.reveal-text, .reveal-up, .reveal-word');
        reveals.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('in');
            }, 120 + (i * 70));
        });
    }

    /* ========================================================================
       MAGNETIC ELEMENTS
       ======================================================================== */
    function initMagneticElements() {
        const magnetics = document.querySelectorAll('.magnetic-link, .magnetic-btn');
        if (!magnetics.length) return;

        magnetics.forEach(el => {
            const strength = el.classList.contains('magnetic-btn') ? 0.28 : 0.18;
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

    /* ========================================================================
       SCROLL REVEALS
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
       PHOTO GALLERY — Lightbox functionality + Shuffling
       ======================================================================== */
    function initPhotoGallery() {
        const photoGrid = document.getElementById('photoGrid');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxClose = document.getElementById('lightboxClose');

        if (!photoGrid || !lightbox) {
            console.log('Gallery elements not found');
            return;
        }

        // Gallery images
        const galleryImages = [
            'images/gallery-1.jpg',
            'images/gallery-2.jpg',
            'images/gallery-3.jpg',
            'images/gallery-4.jpg',
            'images/gallery-5.jpg',
            'images/gallery-6.jpg',
            'images/gallery-7.jpg',
            'images/gallery-8.jpg',
            'images/gallery-9.jpg',
            'images/gallery-10.jpg',
            'images/gallery-11.jpg',
            'images/gallery-12.jpg',
            'images/gallery-13.jpg',
            'images/gallery-14.jpg',
            'images/gallery-15.jpg',
            'images/gallery-16.jpg',
            'images/gallery-17.jpg',
            'images/gallery-18.jpg',
            'images/gallery-19.jpg'
        ];

        // On mobile, show fewer images for better performance
        const imagesToShow = isMobile ? galleryImages.slice(0, 12) : galleryImages;

        // Shuffle function
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Shuffle images
        const shuffledImages = shuffleArray([...imagesToShow]);

        // Create photo items dynamically
        shuffledImages.forEach((imageSrc, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item reveal-up';
            // Faster animation on mobile
            photoItem.style.transitionDelay = `${index * (isMobile ? 20 : 40)}ms`;

            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Gallery photo ${index + 1}`;
            img.className = 'photo-img';
            img.loading = 'lazy';

            const overlay = document.createElement('div');
            overlay.className = 'photo-overlay';

            const expandIcon = document.createElement('span');
            expandIcon.className = 'photo-expand-icon';
            expandIcon.textContent = '+';

            overlay.appendChild(expandIcon);
            photoItem.appendChild(img);
            photoItem.appendChild(overlay);
            photoGrid.appendChild(photoItem);

            // Add click event for lightbox
            photoItem.addEventListener('click', () => {
                lightboxImg.src = imageSrc;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Trigger reveal animations after a short delay
        setTimeout(() => {
            const photoItems = document.querySelectorAll('.photo-item');
            photoItems.forEach(item => {
                item.classList.add('in');
            });
        }, 200);

        // Lightbox functionality
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                lightboxImg.src = '';
            }, 300);
        }
    }

})();