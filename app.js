document.addEventListener('DOMContentLoaded', () => {
   // Initialize all functionality
   initNavigation();
   initStickyHeader();
   initScrollSpy();
   initLazyLoading();
   initInfiniteCarousel();
   initFAQ();

   console.log('🚀 All systems initialized');
});

/**
 * Enhanced Navigation functionality
 */
function initNavigation() {
   const menuOpenBtn = document.querySelector('.nav-open-btn');
   const menuCloseBtn = document.querySelector('.nav-close-btn');
   const navWrapper = document.querySelector('.nav-wrapper');
   const navLinks = document.querySelectorAll('.nav-link');
   const navOverlay = document.getElementById('nav-overlay');

   if (!menuOpenBtn || !menuCloseBtn || !navWrapper || !navOverlay) return;

   // Function to open the menu
   const openMenu = () => {
      navWrapper.classList.add('nav-active');
      navOverlay.classList.add('overlay-active');
      document.body.style.overflow = 'hidden';
   };

   // Function to close the menu
   const closeMenu = () => {
      navWrapper.classList.remove('nav-active');
      navOverlay.classList.remove('overlay-active');
      document.body.style.overflow = '';
   };

   // Add event listeners for menu toggle
   menuOpenBtn.addEventListener('click', openMenu);
   menuCloseBtn.addEventListener('click', closeMenu);

   // Close nav when clicking on overlay
   navOverlay.addEventListener('click', closeMenu);

   // Handle nav link clicks
   navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
         e.preventDefault();
         const targetId = link.getAttribute('href').substring(1);
         const targetSection = document.getElementById(targetId);

         if (targetSection) {
            // Close menu
            closeMenu();

            // Smooth scroll to section
            targetSection.scrollIntoView({ behavior: 'smooth' });

            // Update active link
            updateActiveLink(link);
         }
      });
   });

   // Close nav when clicking outside
   document.addEventListener('click', (e) => {
      if (
         !navWrapper.contains(e.target) &&
         !menuOpenBtn.contains(e.target) &&
         !navOverlay.contains(e.target)
      ) {
         if (navWrapper.classList.contains('nav-active')) {
            closeMenu();
         }
      }
   });

   // Close nav on escape key
   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navWrapper.classList.contains('nav-active')) {
         closeMenu();
      }
   });
}

/**
 * Sticky header functionality
 */
function initStickyHeader() {
   const header = document.querySelector('header');
   if (!header) return;

   const updateHeader = () => {
      const scrollPercent = (window.scrollY / window.innerHeight) * 100;
      if (scrollPercent > 3) {
         header.classList.add('header-active');
      } else {
         header.classList.remove('header-active');
      }
   };

   // Throttle scroll events
   let ticking = false;
   window.addEventListener('scroll', () => {
      if (!ticking) {
         requestAnimationFrame(updateHeader);
         ticking = true;
         setTimeout(() => {
            ticking = false;
         }, 100);
      }
   });
}

/**
 * Scroll Spy functionality
 */
function initScrollSpy() {
   const sections = document.querySelectorAll('section[id]');
   const navLinks = document.querySelectorAll('.nav-link');

   const updateActiveLink = (activeLink) => {
      navLinks.forEach((link) => {
         link.classList.remove('nav-link-active');
      });
      if (activeLink) {
         activeLink.classList.add('nav-link-active');
      }
   };

   const onScroll = () => {
      let current = '';
      sections.forEach((section) => {
         const sectionTop = section.offsetTop;
         const sectionHeight = section.clientHeight;
         if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
         }
      });

      navLinks.forEach((link) => {
         link.classList.remove('nav-link-active');
         if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('nav-link-active');
         }
      });
   };

   window.addEventListener('scroll', onScroll);
}

/**
 * Optimized Lazy Loading System
 */
function initLazyLoading() {
   const lazyImages = document.querySelectorAll('.lazy-image[data-src]');
   const loadedImages = new Set();
   let observer;

   // Load image function
   function loadImage(img) {
      if (loadedImages.has(img)) return;

      const container = img.closest('.image-wrapper');
      const placeholder = container?.querySelector('.image-placeholder');

      // Create preloader
      const imageLoader = new Image();

      imageLoader.onload = () => {
         // Set image source and add loaded class
         img.src = img.dataset.src;
         img.classList.add('loaded', 'fade-in');
         container?.classList.add('loaded');

         // Remove placeholder after transition
         setTimeout(() => {
            if (placeholder) {
               placeholder.style.display = 'none';
            }
         }, 500);

         loadedImages.add(img);
      };

      imageLoader.onerror = () => {
         img.classList.add('error');
         container?.classList.add('error');
         if (placeholder) {
            placeholder.innerHTML =
               '<span style="color: #6c757d; font-size: 14px;">Loading error</span>';
         }
         loadedImages.add(img);
      };

      // Start loading
      imageLoader.src = img.dataset.src;
   }

   // Intersection Observer setup
   if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  loadImage(entry.target);
                  observer.unobserve(entry.target);
               }
            });
         },
         {
            threshold: 0.5,
            rootMargin: '100px',
         }
      );

      // Observe all lazy images
      lazyImages.forEach((img) => {
         observer.observe(img);
      });
   } else {
      // Fallback for browsers without Intersection Observer
      lazyImages.forEach(loadImage);
   }

   // Preload critical images
   function preloadCriticalImages() {
      const logo = document.querySelector('.logo.lazy-image');
      if (logo) loadImage(logo);
   }

   // Preload critical images immediately
   preloadCriticalImages();
}

/**
 * Infinite Carousel functionality
 */
function initInfiniteCarousel() {
   const topRow = document.querySelector('.carousel-row.top');
   const bottomRow = document.querySelector('.carousel-row.bottom');

   //  Define the top and bottom pictures respectively
   const topRowImages = [
      'assets/images/carousel1.png',
      'assets/images/carousel2.png',
      'assets/images/carousel3.png',
      'assets/images/carousel4.png',
      'assets/images/carousel5.png',
   ];

   const bottomRowImages = [
      'assets/images/carousel6.png',
      'assets/images/carousel7.png',
      'assets/images/carousel8.png',
      'assets/images/carousel9.png',
      'assets/images/carousel10.png',
   ];

   //  Create image elements and add to carousel lines
   function createImageElement(url) {
      const img = document.createElement('img');
      img.className = 'carousel-image';
      img.src = url;
      img.alt = 'Past projects';
      img.loading = 'lazy';
      return img;
   }

   //  Initialize the top-level carousel
   for (let i = 0; i < 2; i++) {
      topRowImages.forEach((url) => {
         const img = createImageElement(url);
         topRow.appendChild(img);
      });
   }

   //  Initialize the underlying carousel
   for (let i = 0; i < 2; i++) {
      bottomRowImages.forEach((url) => {
         const img = createImageElement(url);
         bottomRow.appendChild(img);
      });
   }

   //  Pause/restore animation function
   let isPaused = false;
   const pauseOnHover = true;

   if (pauseOnHover) {
      [topRow, bottomRow].forEach((row) => {
         row.addEventListener('mouseenter', () => {
            row.style.animationPlayState = 'paused';
         });

         row.addEventListener('mouseleave', () => {
            if (!isPaused) {
               row.style.animationPlayState = 'running';
            }
         });
      });
   }

   //  Handle page visibility changes
   document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
         [topRow, bottomRow].forEach((row) => {
            row.style.animationPlayState = 'paused';
         });
      } else if (!isPaused) {
         [topRow, bottomRow].forEach((row) => {
            row.style.animationPlayState = 'running';
         });
      }
   });

   //  Optimize performance - 使用requestAnimationFrame来优化动画
   let animationFrameId;
   let lastTime = 0;
   const speedFactor = 0.5; // Factors that control speed

   const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;

      if (deltaTime > 16) {
         // 60fps
         if (!isPaused && !document.hidden) {
            // More complex animation logic can be added here
            lastTime = timestamp;
         }
      }

      animationFrameId = requestAnimationFrame(animate);
   };

   // Start the animation loop
   animationFrameId = requestAnimationFrame(animate);

   // Optimize performance - Intersection Observer
   const observer = new IntersectionObserver(
      (entries) => {
         entries.forEach((entry) => {
            if (!entry.isIntersecting) {
               entry.target.style.animationPlayState = 'paused';
            } else if (!isPaused) {
               entry.target.style.animationPlayState = 'running';
            }
         });
      },
      {
         threshold: 0.1,
         rootMargin: '100px',
      }
   );

   [topRow, bottomRow].forEach((row) => {
      observer.observe(row);
   });

   // 清理函数
   return () => {
      if (animationFrameId) {
         cancelAnimationFrame(animationFrameId);
      }
      [topRow, bottomRow].forEach((row) => {
         observer.unobserve(row);
      });
   };
}

/**
 * FAQ Section Functionality
 */
function initFAQ() {
   const faqCards = document.querySelectorAll('.faq-card');

   // Function to close all FAQ cards except the active one
   const closeOtherCards = (activeCard) => {
      faqCards.forEach((card) => {
         if (card !== activeCard) {
            const heading = card.querySelector('.faq-card-heading');
            const body = card.querySelector('.faq-card-body');
            heading.classList.remove('faqActive');
            body.style.maxHeight = null;
         }
      });
   };

   // Function to toggle FAQ card
   const toggleFAQCard = (card) => {
      const heading = card.querySelector('.faq-card-heading');
      const body = card.querySelector('.faq-card-body');
      const isActive = heading.classList.contains('faqActive');

      // Close all other cards
      closeOtherCards(card);

      // Toggle current card
      heading.classList.toggle('faqActive', !isActive);
      body.style.maxHeight = isActive ? null : `${body.scrollHeight}px`;
   };

   // Add click event listeners to FAQ cards
   faqCards.forEach((card) => {
      const heading = card.querySelector('.faq-card-heading');

      heading.addEventListener('click', () => {
         toggleFAQCard(card);
      });

      // Keyboard accessibility
      heading.addEventListener('keydown', (e) => {
         if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFAQCard(card);
         }
      });
   });

   // Smooth scroll for FAQ CTA
   const faqCTA = document.querySelector('.faq-cta a');
   if (faqCTA) {
      faqCTA.addEventListener('click', (e) => {
         e.preventDefault();
         // Add your CTA action here
         console.log('FAQ CTA clicked');
      });
   }
}
