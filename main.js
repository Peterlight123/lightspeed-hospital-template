/**
 * Lightspeed Hospital - Main JavaScript File
 * 
 * Developer: Peter Lightspeed
 * Portfolio: peterlight123.github.io/portfolio
 * Email: petereluwade55@gmail.com
 * 
 * Description: Core functionality for Lightspeed Hospital website
 * Features: Navigation, animations, form handling, and interactive elements
 */

'use strict';

// ===================================
// GLOBAL VARIABLES & CONFIGURATION
// ===================================

const CONFIG = {
    // Animation settings
    ANIMATION_DURATION: 300,
    SCROLL_OFFSET: 100,
    TYPING_SPEED: 50,
    
    // API endpoints (for future backend integration)
    API_BASE_URL: '/api',
    ENDPOINTS: {
        APPOINTMENTS: '/appointments',
        CONTACT: '/contact',
        NEWSLETTER: '/newsletter'
    },
    
    // Hospital information
    HOSPITAL_INFO: {
        name: 'Lightspeed Hospital',
        phone: '+1 (234) 567-890',
        emergency: '+1 (234) 567-911',
        email: 'info@lightspeed-hospital.com',
        address: '123 Healthcare Ave, Medical City, MC 12345'
    }
};

// Global state management
const AppState = {
    isLoading: true,
    currentPage: 'home',
    mobileMenuOpen: false,
    testimonialIndex: 0,
    scrollPosition: 0,
    isScrolling: false
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(target, offset = 0) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Format phone number
 */
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ===================================
// LOADING SCREEN
// ===================================

class LoadingScreen {
    constructor() {
        this.element = document.querySelector('.loading-screen');
        this.duration = 2000; // 2 seconds
    }
    
    init() {
        if (!this.element) return;
        
        // Simulate loading time
        setTimeout(() => {
            this.hide();
        }, this.duration);
        
        // Hide on window load (whichever comes first)
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 500);
        });
    }
    
    hide() {
        if (this.element) {
            this.element.classList.add('hidden');
            AppState.isLoading = false;
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (this.element.parentElement) {
                    this.element.remove();
                }
            }, 500);
        }
    }
}

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

class Navigation {
    constructor() {
        this.header = document.querySelector('.header');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScrollTop = 0;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setActiveLink();
        this.handleScroll();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const target = link.getAttribute('href');
                    smoothScrollTo(target, 100);
                }
                this.closeMobileMenu();
            });
        });
        
        // Handle scroll events
        window.addEventListener('scroll', throttle(() => this.handleScroll(), 10));
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target) && AppState.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768 && AppState.mobileMenuOpen) {
                this.closeMobileMenu();
            }
        }, 250));
    }
    
    toggleMobileMenu() {
        AppState.mobileMenuOpen = !AppState.mobileMenuOpen;
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = AppState.mobileMenuOpen ? 'hidden' : '';
    }
    
    closeMobileMenu() {
        AppState.mobileMenuOpen = false;
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class to header
        if (scrollTop > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Update active navigation link based on scroll position
        this.updateActiveLink();
        
        // Show/hide back to top button
        this.toggleBackToTop(scrollTop);
        
        AppState.scrollPosition = scrollTop;
        this.lastScrollTop = scrollTop;
    }
    
    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    toggleBackToTop(scrollTop) {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }
}

// ===================================
// HERO SECTION ANIMATIONS
// ===================================

class HeroAnimations {
    constructor() {
        this.heroStats = document.querySelectorAll('.stat-number');
        this.heroTitle = document.querySelector('.hero-title');
        this.init();
    }
    
    init() {
        this.animateStats();
        this.typewriterEffect();
    }
    
    animateStats() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.countUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.heroStats.forEach(stat => observer.observe(stat));
    }
    
    countUp(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with appropriate suffix
            const formatted = this.formatStatNumber(Math.floor(current), element.textContent);
            element.textContent = formatted;
        }, 16);
    }
    
    formatStatNumber(num, original) {
        if (original.includes('K')) {
            return `${Math.floor(num / 1000)}K+`;
        } else if (original.includes('%')) {
            return `${num}%`;
        } else if (original.includes('+')) {
            return `${num}+`;
        }
        return num.toString();
    }
    
    typewriterEffect() {
        if (!this.heroTitle) return;
        
        const text = this.heroTitle.textContent;
        const highlightText = this.heroTitle.querySelector('.highlight');
        
        if (highlightText) {
            const beforeText = text.substring(0, text.indexOf(highlightText.textContent));
            const afterText = text.substring(text.indexOf(highlightText.textContent) + highlightText.textContent.length);
            
            this.heroTitle.innerHTML = '';
            
            this.typeText(beforeText, this.heroTitle, () => {
                const span = document.createElement('span');
                span.className = 'highlight';
                this.heroTitle.appendChild(span);
                
                this.typeText(highlightText.textContent, span, () => {
                    this.typeText(afterText, this.heroTitle);
                });
            });
        }
    }
    
    typeText(text, element, callback) {
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
                if (callback) callback();
            }
        }, CONFIG.TYPING_SPEED);
    }
}

// ===================================
// TESTIMONIALS SLIDER
// ===================================

class TestimonialsSlider {
    constructor() {
        this.container = document.querySelector('.testimonials-slider');
        this.items = document.querySelectorAll('.testimonial-item');
        this.prevBtn = document.querySelector('.testimonial-btn.prev');
        this.nextBtn = document.querySelector('.testimonial-btn.next');
        this.dots = document.querySelectorAll('.dot');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        
        if (this.items.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.showSlide(0);
        this.startAutoPlay();
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause auto-play on hover
        if (this.container) {
            this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    showSlide(index) {
        // Hide all slides
        this.items.forEach(item => {
            item.classList.remove('active');
        });
        
        // Remove active class from all dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        if (this.items[index]) {
            this.items[index].classList.add('active');
        }
        
        // Activate current dot
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }
        
        this.currentIndex = index;
        AppState.testimonialIndex = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        this.showSlide(index);
        this.restartAutoPlay();
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    restartAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ===================================
// FORM HANDLING
// ===================================

class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        });
        
        // Real-time validation
        this.setupValidation();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formType = form.getAttribute('data-form-type') || 'contact';
        
        if (this.validateForm(form)) {
            this.submitForm(form, formType);
        }
    }
    
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        this.removeError(input);
        
        // Check if required field is empty
        if (input.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        // Validate email
        else if (type === 'email' && value && !isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
        // Validate phone
        else if (type === 'tel' && value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
        // Validate minimum length
        else if (input.hasAttribute('minlength')) {
            const minLength = parseInt(input.getAttribute('minlength'));
            if (value.length < minLength) {
                errorMessage = `Minimum ${minLength} characters required`;
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showError(input, errorMessage);
        }
        
        return isValid;
    }
    
    showError(input, message) {
        input.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        
        input.parentNode.appendChild(errorElement);
    }
    
    removeError(input) {
        input.classList.remove('error');
        const existingError = input.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    setupValidation() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim()) {
                    this.validateInput(input);
                }
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.removeError(input);
                }
            });
        });
    }
    
    async submitForm(form, formType) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Simulate API call (replace with actual endpoint)
            await this.simulateAPICall(data, formType);
            
            // Success
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    async simulateAPICall(data, formType) {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure (90% success rate)
                if (Math.random() > 0.1) {
                    console.log(`${formType} form submitted:`, data);
                    resolve(data);
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===================================
// BACK TO TOP FUNCTIONALITY
// ===================================

class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        if (this.button) {
            this.init();
        }
    }
    
    init() {
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===================================
// EMERGENCY CONTACT FUNCTIONALITY
// ===================================

class EmergencyContact {
    constructor() {
        this.emergencyBtns = document.querySelectorAll('.emergency-phone, .emergency-btn');
        this.init();
    }
    
    init() {
        this.emergencyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showEmergencyModal();
            });
        });
    }
    
    showEmergencyModal() {
        const modal = document.createElement('div');
        modal.className = 'emergency-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-exclamation-triangle"></i> Emergency Contact</h3>
                    <button class="modal-close" onclick="this.closest('.emergency-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p><strong>For life-threatening emergencies, call:</strong></p>
                    <div class="emergency-numbers">
                        <a href="tel:${CONFIG.HOSPITAL_INFO.emergency}" class="emergency-number">
                            <i class="fas fa-phone"></i>
                            ${CONFIG.HOSPITAL_INFO.emergency}
                        </a>
                        <a href="tel:911" class="emergency-number">
                            <i class="fas fa-ambulance"></i>
                            911
                        </a>
                    </div>
                    <p class="emergency-note">
                        <i class="fas fa-info-circle"></i>
                        If this is a medical emergency, please call 911 or go to your nearest emergency room immediately.
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 10000);
    }
}

// ===================================
// APPOINTMENT BOOKING
// ===================================

class AppointmentBooking {
    constructor() {
        this.bookingBtns = document.querySelectorAll('.book-appointment, .btn-appointment');
        this.init();
    }
    
    init() {
        this.bookingBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openBookingModal();
            });
        });
    }
    
    openBookingModal() {
        // For now, redirect to appointments page
        // In a full implementation, this would open a modal
        window.location.href = 'appointments.html';
    }
}

// ===================================
// PERFORMANCE MONITORING
// ===================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            domContentLoaded: 0,
            firstPaint: 0,
            firstContentfulPaint: 0
        };
        this.init();
    }
    
    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.collectMetrics();
        });
        
        // Monitor Core Web Vitals
        this.observeWebVitals();
    }
    
    collectMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        paint.forEach(entry => {
            if (entry.name === 'first-paint') {
                this.metrics.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
                this.metrics.firstContentfulPaint = entry.startTime;
            }
        });
        
        console.log('Performance Metrics:', this.metrics);
    }
    
    observeWebVitals() {
        // Observe Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Observe First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
    }
}

// ===================================
// MAIN APPLICATION INITIALIZATION
// ===================================

class LightspeedHospitalApp {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Initialize core components
            this.components.loadingScreen = new LoadingScreen();
            this.components.navigation = new Navigation();
            this.components.heroAnimations = new HeroAnimations();
            this.components.testimonialsSlider = new TestimonialsSlider();
            this.components.formHandler = new FormHandler();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.backToTop = new BackToTop();
            this.components.emergencyContact = new EmergencyContact();
            this.components.appointmentBooking = new AppointmentBooking();
            this.components.performanceMonitor = new PerformanceMonitor();
            
            // Initialize loading screen
            this.components.loadingScreen.init();
            
            console.log('🏥 Lightspeed Hospital - All systems initialized successfully!');
            console.log('💻 Developed by Peter Lightspeed');
            console.log('🌐 Portfolio: https://peterlight123.github.io/portfolio');
            console.log('📧 Contact: petereluwade55@gmail.com');
            
        } catch (error) {
            console.error('Error initializing components:', error);
            showNotification('Some features may not work properly. Please refresh the page.', 'warning');
        }
    }
    
    // Public API for external access
    getComponent(name) {
        return this.components[name];
    }
    
    // Utility method to reinitialize components (useful for SPA navigation)
    reinitialize() {
        this.initializeComponents();
    }
}

// ===================================
// GLOBAL ERROR HANDLING
// ===================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // In production, you might want to send this to an error tracking service
});

// ===================================
// INITIALIZE APPLICATION
// ===================================

// Create global app instance
window.LightspeedHospital = new LightspeedHospitalApp();

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LightspeedHospitalApp;
}
