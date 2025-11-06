/* ============================================
   Gensyn Academy - Professional JavaScript
   Interactive, Performant, Accessible
   ============================================ */

(function() {
    'use strict';

    /* ============================================
       Utility Functions
       ============================================ */
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    /* ============================================
       Smooth Scroll with Offset
       ============================================ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    updateActiveNavLink(href);
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    }

    /* ============================================
       Navigation Bar Effects
       ============================================ */
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        
        // Navbar scroll effect
        const handleScroll = throttle(() => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        
        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
                document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Active section highlighting on scroll
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };
        
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    updateActiveNavLink(`#${id}`);
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    function updateActiveNavLink(href) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }

    function closeMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        
        if (navToggle && navLinks) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /* ============================================
       Count-Up Animation for Stats
       ============================================ */
    function animateCountUp(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    function initCountUpAnimations() {
        const countElements = document.querySelectorAll('.count-up');
        
        const observerOptions = {
            root: null,
            threshold: 0.5
        };
        
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.getAttribute('data-target'));
                    animateCountUp(element, target);
                    observer.unobserve(element);
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        countElements.forEach(element => {
            observer.observe(element);
        });
    }

    /* ============================================
       Course Filter System
       ============================================ */
    function initCourseFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const courseCards = document.querySelectorAll('.course-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter courses with animation
                courseCards.forEach((card, index) => {
                    const level = card.getAttribute('data-level');
                    
                    if (filter === 'all' || level === filter) {
                        setTimeout(() => {
                            card.style.display = 'block';
                            card.style.animation = 'fadeIn 0.5s ease-out forwards';
                        }, index * 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ============================================
       FAQ Accordion
       ============================================ */
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }

    /* ============================================
       Scroll to Top Button
       ============================================ */
    function initScrollToTop() {
        const scrollTopBtn = document.getElementById('scrollTop');
        
        if (!scrollTopBtn) return;
        
        const handleScroll = throttle(() => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ============================================
       Terminal Copy Functionality
       ============================================ */
    function initTerminalCopy() {
        window.copyTerminalCommands = function() {
            const commands = [
                'git clone https://github.com/gensyn-ai/rl-swarm && cd rl-swarm',
                'python3 -m venv .venv && source .venv/bin/activate',
                './run_rl_swarm.sh'
            ];
            
            const commandText = commands.join('\n');
            
            // Copy to clipboard
            navigator.clipboard.writeText(commandText).then(() => {
                const copyBtn = document.querySelector('.copy-btn');
                const originalHTML = copyBtn.innerHTML;
                
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.style.background = '#10b981';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                    copyBtn.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                alert('Failed to copy commands. Please copy manually.');
            });
        };
    }

    /* ============================================
       Progress Bar Animation
       ============================================ */
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const observerOptions = {
            root: null,
            threshold: 0.5
        };
        
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.style.width;
                    
                    // Animate from 0 to target width
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 100);
                    
                    observer.unobserve(progressBar);
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    /* ============================================
       Card Hover Effects with 3D Tilt
       ============================================ */
    function init3DTiltEffect() {
        const cards = document.querySelectorAll('.course-card, .setup-card, .research-card, .community-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 768) return; // Skip on mobile
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ============================================
       Lazy Loading Images
       ============================================ */
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    /* ============================================
       Parallax Scrolling Effect
       ============================================ */
    function initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.floating-card');
        
        const handleScroll = throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16);
        
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', handleScroll);
        }
    }

    /* ============================================
       Toast Notifications
       ============================================ */
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /* ============================================
       Local Storage for Course Progress
       ============================================ */
    function initCourseProgress() {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach((card, index) => {
            const courseId = `course-${index}`;
            const savedProgress = localStorage.getItem(courseId);
            
            if (savedProgress) {
                const progressFill = card.querySelector('.progress-fill');
                const progressText = card.querySelector('.progress-text');
                
                if (progressFill && progressText) {
                    progressFill.style.width = `${savedProgress}%`;
                    progressText.textContent = `${savedProgress}% Complete`;
                }
            }
        });
    }

    /* ============================================
       Performance Monitoring
       ============================================ */
    function logPerformance() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    const connectTime = perfData.responseEnd - perfData.requestStart;
                    const renderTime = perfData.domComplete - perfData.domLoading;
                    
                    console.log('%c Performance Metrics ', 'background: #6366f1; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
                    console.log(`Page Load Time: ${pageLoadTime}ms`);
                    console.log(`Server Response: ${connectTime}ms`);
                    console.log(`Render Time: ${renderTime}ms`);
                }, 0);
            });
        }
    }

    /* ============================================
       Keyboard Navigation Enhancements
       ============================================ */
    function initKeyboardNavigation() {
        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
                
                // Close any open FAQ items
                document.querySelectorAll('.faq-item.active').forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
        
        // Arrow key navigation for FAQ
        const faqItems = document.querySelectorAll('.faq-question');
        faqItems.forEach((question, index) => {
            question.setAttribute('tabindex', '0');
            
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
                
                if (e.key === 'ArrowDown' && index < faqItems.length - 1) {
                    e.preventDefault();
                    faqItems[index + 1].focus();
                }
                
                if (e.key === 'ArrowUp' && index > 0) {
                    e.preventDefault();
                    faqItems[index - 1].focus();
                }
            });
        });
    }

    /* ============================================
       Dark Mode Toggle (Optional Enhancement)
       ============================================ */
    function initDarkMode() {
        const darkMode = localStorage.getItem('darkMode');
        
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
        }
    }

    /* ============================================
       Analytics Event Tracking
       ============================================ */
    function trackEvent(category, action, label) {
        // Placeholder for analytics tracking
        // Replace with your analytics provider (GA, Plausible, etc.)
        console.log('Event:', { category, action, label });
    }

    function initAnalytics() {
        // Track button clicks
        document.querySelectorAll('.btn, .course-btn, .setup-btn').forEach(button => {
            button.addEventListener('click', () => {
                const label = button.textContent.trim();
                trackEvent('Button', 'Click', label);
            });
        });
        
        // Track external links
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', () => {
                trackEvent('External Link', 'Click', link.href);
            });
        });
    }

    /* ============================================
       Animated Entry on Scroll
       ============================================ */
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll('.course-card, .setup-card, .research-card, .stat-card');
        
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observerCallback = (entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }

    /* ============================================
       Live Network Stats Animation
       ============================================ */
    function initLiveNetworkStats() {
        const stats = {
            nodes: { element: document.getElementById('live-nodes'), base: 1272, variation: 20 },
            models: { element: document.getElementById('live-models'), base: 90.3, variation: 0.5, suffix: 'K' },
            verifications: { element: document.getElementById('live-verifications'), base: 234.5, variation: 2, suffix: 'K' },
            compute: { element: document.getElementById('live-compute'), base: 342, variation: 15 },
            rewards: { element: document.getElementById('live-rewards'), base: 2.4, variation: 0.1, prefix: '$', suffix: 'M' },
            countries: { element: document.getElementById('live-countries'), base: 67, variation: 0 }
        };

        function updateStats() {
            Object.values(stats).forEach(stat => {
                if (!stat.element) return;
                
                const randomVariation = (Math.random() - 0.5) * 2 * stat.variation;
                const newValue = stat.base + randomVariation;
                
                let displayValue;
                if (stat.suffix === 'K' || stat.suffix === 'M') {
                    displayValue = newValue.toFixed(1);
                } else {
                    displayValue = Math.round(newValue).toLocaleString();
                }
                
                const prefix = stat.prefix || '';
                const suffix = stat.suffix || '';
                stat.element.textContent = prefix + displayValue + suffix;
                
                // Add subtle animation
                stat.element.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    stat.element.style.transform = 'scale(1)';
                }, 200);
            });
        }

        // Update stats every 3 seconds
        if (document.getElementById('live-nodes')) {
            updateStats();
            setInterval(updateStats, 3000);
        }
    }

    /* ============================================
       Initialize All Features
       ============================================ */
    function init() {
    console.log('%c Gensyn Academy ', 'background: linear-gradient(135deg, #FF9DB5, #FFC9D4); color: #1e293b; padding: 8px 16px; border-radius: 8px; font-size: 16px; font-weight: bold;');
    console.log('%c Professional Edition Loaded ✨', 'color: #FF9DB5; font-size: 12px;');
        
        // Core functionality
        initNavbar();
        initSmoothScroll();
        initScrollToTop();
        
        // Animations
        initCountUpAnimations();
        initProgressBars();
        initScrollAnimations();
        initLiveNetworkStats();
        
        // Interactive features
        initCourseFilters();
        initFAQAccordion();
        initTerminalCopy();
        init3DTiltEffect();
        
        // Enhanced features
        initKeyboardNavigation();
        initLazyLoading();
        initCourseProgress();
        initDarkMode();
        initAnalytics();
        initApplicationVideos();
        
        // Performance
        logPerformance();
        
        // Optional: Parallax (can be disabled for performance)
        if (window.innerWidth > 1024) {
            // initParallaxEffect();
        }
    }

    /* ============================================
       Application Videos - Play on Click
       ============================================ */
    function initApplicationVideos() {
        const videoContainers = document.querySelectorAll('.app-video-container');

        if (!('IntersectionObserver' in window)) {
            // Fallback: try to autoplay all
            videoContainers.forEach(container => {
                const video = container.querySelector('.app-video');
                if (!video) return;
                video.muted = true;
                video.playsInline = true;
                video.loop = true;
                const playPromise = video.play();
                if (playPromise && typeof playPromise.then === 'function') {
                    playPromise.then(() => container.classList.add('playing')).catch(() => {});
                }
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const container = entry.target;
                const video = container.querySelector('.app-video');
                if (!video) return;

                if (entry.isIntersecting) {
                    // Ensure attributes for mobile autoplay compliance
                    video.muted = true;
                    video.playsInline = true;
                    video.loop = true;
                    const playPromise = video.play();
                    if (playPromise && typeof playPromise.then === 'function') {
                        playPromise.then(() => container.classList.add('playing')).catch(() => {});
                    } else {
                        container.classList.add('playing');
                    }
                } else {
                    video.pause();
                    container.classList.remove('playing');
                }
            });
        }, { threshold: 0.25 });

        videoContainers.forEach(container => {
            const video = container.querySelector('.app-video');
            if (!video) return;

            // Click toggle remains for accessibility and control
            container.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                    container.classList.add('playing');
                } else {
                    video.pause();
                    container.classList.remove('playing');
                }
            });

            // Keyboard support (Enter/Space)
            container.addEventListener('keydown', function(e) {
                const key = e.key || e.code;
                if (key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 'Space') {
                    e.preventDefault();
                    if (video.paused) {
                        video.play();
                        container.classList.add('playing');
                    } else {
                        video.pause();
                        container.classList.remove('playing');
                    }
                }
            });

            // Keep the overlay state in sync
            video.addEventListener('ended', function() {
                container.classList.remove('playing');
            });

            observer.observe(container);
        });
    }

    /* ============================================
       DOM Ready
       ============================================ */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ============================================
       Service Worker Registration (Progressive Web App)
       ============================================ */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // navigator.registerServiceWorker('/sw.js')
            //     .then(reg => console.log('Service Worker registered'))
            //     .catch(err => console.log('Service Worker registration failed'));
        });
    }

})();
