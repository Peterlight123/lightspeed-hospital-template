/**
 * ===================================
 * SERVICES PAGE JAVASCRIPT
 * Lightspeed Hospital - Medical Services
 * Developer: Peter Lightspeed
 * Email: petereluwade55@gmail.com
 * Portfolio: https://peterlight123.github.io/portfolio
 * ===================================
 */

// Global Variables
let currentFilter = 'all';
let servicesData = [];
let isLoading = false;
let searchTimeout = null;

// Service Categories Configuration
const serviceCategories = {
    all: { name: 'All Services', icon: 'fas fa-hospital', color: '#667eea' },
    emergency: { name: 'Emergency Care', icon: 'fas fa-ambulance', color: '#e74c3c' },
    surgical: { name: 'Surgical Services', icon: 'fas fa-user-md', color: '#f39c12' },
    diagnostic: { name: 'Diagnostic', icon: 'fas fa-x-ray', color: '#27ae60' },
    specialty: { name: 'Specialty Care', icon: 'fas fa-heartbeat', color: '#9b59b6' }
};

// Services Data Structure
const servicesDatabase = [
    {
        id: 'cardiology',
        title: 'Cardiology',
        category: 'specialty',
        description: 'Comprehensive heart care with advanced cardiac procedures and treatments.',
        fullDescription: 'Our Cardiology department offers state-of-the-art cardiac care with a team of experienced cardiologists and cardiac surgeons. We provide comprehensive diagnostic services, interventional procedures, and surgical treatments for all types of heart conditions.',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: 'fas fa-heartbeat',
        features: [
            'Cardiac Catheterization',
            'Echocardiography',
            'Stress Testing',
            'Pacemaker Implantation',
            'Heart Surgery',
            '24/7 Emergency Care'
        ],
        availability: '24/7 Available',
        rating: 4.9,
        doctors: 12,
        procedures: '500+ Monthly',
        waitTime: '15 minutes',
        emergencyAvailable: true,
        tags: ['heart', 'cardiac', 'surgery', 'emergency'],
        contact: {
            phone: '+1 (234) 567-8901',
            email: 'cardiology@lightspeed-hospital.com',
            department: 'Cardiology Department - Floor 3'
        }
    },
    {
        id: 'emergency',
        title: 'Emergency Care',
        category: 'emergency',
        description: '24/7 emergency medical services with rapid response trauma care.',
        fullDescription: 'Our Emergency Department provides round-the-clock emergency medical care with a highly trained team of emergency physicians, nurses, and support staff. We are equipped to handle all types of medical emergencies from minor injuries to life-threatening conditions.',
        image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: 'fas fa-ambulance',
        features: [
            'Trauma Center Level II',
            'Rapid Response Team',
            'Advanced Life Support',
            'Pediatric Emergency Care',
            'Stroke Center',
            'Chest Pain Center'
        ],
        availability: '24/7 Emergency',
        rating: 4.8,
        doctors: 25,
        procedures: '1000+ Monthly',
        waitTime: 'Immediate',
        emergencyAvailable: true,
        tags: ['emergency', 'trauma', '24/7', 'urgent'],
        contact: {
            phone: '+1 (234) 567-911',
            email: 'emergency@lightspeed-hospital.com',
            department: 'Emergency Department - Ground Floor'
        }
    },
    {
        id: 'pediatrics',
        title: 'Pediatrics',
        category: 'specialty',
        description: 'Specialized healthcare services for infants, children, and adolescents.',
        fullDescription: 'Our Pediatrics department provides comprehensive healthcare services for children from birth through adolescence. Our pediatricians are specially trained to address the unique medical needs of growing children in a child-friendly environment.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: 'fas fa-baby',
        features: [
            'Well-Child Checkups',
            'Immunizations',
            'Developmental Screening',
            'Pediatric Surgery',
            'NICU Services',
            'Child Psychology'
        ],
        availability: 'Mon-Fri 8AM-6PM',
        rating: 4.9,
        doctors: 15,
        procedures: '800+ Monthly',
        waitTime: '20 minutes',
        emergencyAvailable: false,
        tags: ['children', 'pediatric', 'babies', 'adolescents'],
        contact: {
            phone: '+1 (234) 567-8902',
            email: 'pediatrics@lightspeed-hospital.com',
            department: 'Pediatrics Department - Floor 2'
        }
    },
    {
        id: 'orthopedics',
        title: 'Orthopedics',
        category: 'surgical',
        description: 'Advanced bone, joint, and musculoskeletal treatments and surgeries.',
        fullDescription: 'Our Orthopedics department specializes in the diagnosis, treatment, and prevention of disorders of the bones, joints, ligaments, tendons, and muscles. We offer both surgical and non-surgical treatments for a wide range of musculoskeletal conditions.',
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: 'fas fa-bone',
        features: [
            'Joint Replacement Surgery',
            'Sports Medicine',
            'Spine Surgery',
            'Fracture Care',
            'Arthroscopic Surgery',
            'Physical Therapy'
        ],
        availability: 'Mon-Sat 7AM-7PM',
        rating: 4.7,
        doctors: 18,
        procedures: '600+ Monthly',
        waitTime: '25 minutes',
        emergencyAvailable: true,
        tags: ['bones', 'joints', 'surgery', 'sports'],
        contact: {
            phone: '+1 (234) 567-8903',
            email: 'orthopedics@lightspeed-hospital.com',
            department: 'Orthopedics Department - Floor 4'
        }
    },
    {
        id: 'neurology',
        title: 'Neurology',
        category: 'specialty',
        description: 'Comprehensive brain and nervous system care with advanced treatments.',
        fullDescription: 'Our Neurology department provides comprehensive care for disorders of the brain, spinal cord, and nervous system. Our neurologists use the latest diagnostic techniques and treatment methods to provide the best possible care for neurological conditions.',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: 'fas fa-brain',
        features: [
            'Stroke Treatment',
            'Epilepsy Care',
            'Movement Disorders',
            'Memory Disorders',
            'Headache Treatment',
            'Neurosurgery'
        ],
        availability: 'Mon-Fri 8AM-5PM',
        rating: 4.8,
        doctors: 10,
        procedures: '400+ Monthly',
        waitTime: '30 minutes',
        emergencyAvailable: true,
        tags: ['brain', 'neurology', 'stroke', 'epilepsy'],
        contact: {
            phone: '+1 (234) 567-8904',
            email: 'neurology@lightspeed-hospital.com',
            department: 'Neurology Department - Floor 5'
        }
    },
    {
        id: 'radiology',
        title: 'Radiology & Imaging',
        category: 'diagnostic',
        description: 'Advanced medical imaging and diagnostic radiology services.',
        fullDescription: 'Our Radiology department offers comprehensive diagnostic imaging services using the latest technology. Our radiologists provide accurate diagnoses to support your healthcare team in developing the most effective treatment plans.',
        image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        icon: 'fas fa-x-ray',
        features: [
            'MRI Scanning',
            'CT Imaging',
            'Ultrasound',
            'X-Ray Services',
            'Mammography',
            'Nuclear Medicine'
        ],
        availability: 'Mon-Sun 6AM-10PM',
        rating: 4.6,
        doctors: 8,
        procedures: '1200+ Monthly',
        waitTime: '10 minutes',
        emergencyAvailable: true,
        tags: ['imaging', 'xray', 'mri', 'ct scan'],
        contact: {
            phone: '+1 (234) 567-8905',
            email: 'radiology@lightspeed-hospital.com',
            department: 'Radiology Department - Basement Level'
        }
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 Services page initializing...');
    console.log('💻 Developed by Peter Lightspeed');
    console.log('🌐 Portfolio: https://peterlight123.github.io/portfolio');
    
    initializeServices();
});

/**
 * Initialize Services Page
 */
function initializeServices() {
    try {
        // Hide loading screen
        hideLoadingScreen();
        
        // Initialize services data
        servicesData = [...servicesDatabase];
        
        // Render initial services
        renderServices();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize animations
        initializeAnimations();
        
        // Setup search functionality
        setupSearch();
        
        // Initialize counters
        animateCounters();
        
        // Setup emergency banner
        setupEmergencyBanner();
        
        console.log('✅ Services page initialized successfully!');
        
    } catch (error) {
        console.error('❌ Error initializing services:', error);
        showNotification('Error loading services. Please refresh the page.', 'error');
    }
}

/**
 * Hide Loading Screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
    
    // Service cards - Learn More buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-learn-more')) {
            e.preventDefault();
            const serviceId = e.target.closest('.service-card').dataset.serviceId;
            openServiceModal(serviceId);
        }
    });
    
    // Modal close buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.modal-close') || e.target.classList.contains('modal-overlay')) {
            closeServiceModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeServiceModal();
        }
    });
    
    // Emergency banner click
    const emergencyBanner = document.querySelector('.emergency-banner');
    if (emergencyBanner) {
        emergencyBanner.addEventListener('click', function(e) {
            if (e.target.closest('.emergency-phone')) {
                trackEmergencyCall();
            }
        });
    }
    
    // Book appointment buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-book')) {
            e.preventDefault();
            const serviceId = e.target.closest('.service-card').dataset.serviceId;
            handleBookAppointment(serviceId);
        }
    });
    
    // Emergency call buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-emergency')) {
            e.preventDefault();
            handleEmergencyCall();
        }
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('[data-form-type="newsletter"]');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // FAQ items
    document.addEventListener('click', function(e) {
        if (e.target.closest('.faq-question')) {
            toggleFAQ(e.target.closest('.faq-item'));
        }
    });
}

/**
 * Handle Filter Click
 */
function handleFilterClick(e) {
    e.preventDefault();
    
    const filterValue = e.target.dataset.filter || e.target.closest('.filter-btn').dataset.filter;
    
    if (filterValue === currentFilter) return;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.closest('.filter-btn').classList.add('active');
    
    // Update current filter
    currentFilter = filterValue;
    
    // Filter and render services
    filterServices(filterValue);
    
    // Track filter usage
    trackFilterUsage(filterValue);
}

/**
 * Filter Services
 */
function filterServices(category) {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            // Show card with animation
            card.classList.remove('hidden');
            card.style.display = 'block';
            
            // Animate in
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 100);
        } else {
            // Hide card with animation
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                card.classList.add('hidden');
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update results count
    updateResultsCount(category);
}

/**
 * Update Results Count
 */
function updateResultsCount(category) {
    const visibleCards = document.querySelectorAll('.service-card:not(.hidden)').length;
    const categoryName = serviceCategories[category]?.name || 'All Services';
    
    // Create or update results indicator
    let resultsIndicator = document.querySelector('.results-indicator');
    if (!resultsIndicator) {
        resultsIndicator = document.createElement('div');
        resultsIndicator.className = 'results-indicator';
        resultsIndicator.style.cssText = `
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 25px;
            color: #667eea;
            font-weight: 600;
        `;
        
        const servicesGrid = document.querySelector('.services-grid');
        servicesGrid.parentNode.insertBefore(resultsIndicator, servicesGrid);
    }
    
    resultsIndicator.innerHTML = `
        <i class="fas fa-filter"></i>
        Showing ${visibleCards} services in "${categoryName}"
    `;
}

/**
 * Render Services
 */
function renderServices() {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = '';
    
    servicesData.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });
    
    // Initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

/**
 * Create Service Card
 */
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.serviceId = service.id;
    card.dataset.category = service.category;
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', Math.random() * 200);
    
    const badgeClass = `service-badge ${service.category}`;
    const availabilityClass = service.emergencyAvailable ? 'emergency-available' : '';
    
    card.innerHTML = `
        <div class="service-image">
            <img src="${service.image}" alt="${service.title}" loading="lazy">
            <div class="service-overlay">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
            </div>
            ${service.emergencyAvailable ? '<div class="availability-indicator emergency"></div>' : '<div class="availability-indicator"></div>'}
        </div>
        
        <div class="service-content">
            <div class="service-header">
                <h3 class="service-title">${service.title}</h3>
                <span class="${badgeClass}">${serviceCategories[service.category].name}</span>
            </div>
            
            <p class="service-description">${service.description}</p>
            
            <ul class="service-features">
                ${service.features.slice(0, 4).map(feature => `
                    <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
                ${service.features.length > 4 ? `<li><i class="fas fa-plus"></i> ${service.features.length - 4} more services</li>` : ''}
            </ul>
            
            <div class="service-footer">
                <div class="service-info">
                    <span class="availability ${availabilityClass}">${service.availability}</span>
                    <div class="rating">
                        ${generateStarRating(service.rating)}
                        <span>${service.rating}</span>
                    </div>
                </div>
                
                <div class="service-stats">
                    <div class="stat-box">
                        <span class="stat-number">${service.doctors}</span>
                        <span class="stat-label">Doctors</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${service.procedures}</span>
                        <span class="stat-label">Procedures</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-number">${service.waitTime}</span>
                        <span class="stat-label">Wait Time</span>
                    </div>
                </div>
                
                <div class="service-actions">
                    <button class="btn-learn-more" data-service-id="${service.id}">
                        <i class="fas fa-info-circle"></i>
                        Learn More
                    </button>
                    <a href="appointments.html?service=${service.id}" class="btn-book">
                        <i class="fas fa-calendar-alt"></i>
                        Book Now
                    </a>
                    ${service.emergencyAvailable ? `
                        <a href="tel:${service.contact.phone}" class="btn-emergency">
                            <i class="fas fa-phone"></i>
                            Emergency
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Generate Star Rating
 */
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

/**
 * Open Service Modal
 */
function openServiceModal(serviceId) {
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) return;
    
    // Create modal if it doesn't exist
    let modal = document.querySelector('.service-modal');
    if (!modal) {
        modal = createServiceModal();
        document.body.appendChild(modal);
    }
    
    // Populate modal content
    populateModal(modal, service);
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Track modal open
    trackModalOpen(serviceId);
}

/**
 * Create Service Modal
 */
function createServiceModal() {
    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close" aria-label="Close modal">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <div class="modal-icon">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <h2 class="modal-title">Service Details</h2>
            </div>
            <div class="modal-body">
                <!-- Content will be populated dynamically -->
            </div>
        </div>
    `;
    return modal;
}

/**
 * Populate Modal
 */
function populateModal(modal, service) {
    const modalIcon = modal.querySelector('.modal-icon i');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    
    modalIcon.className = service.icon;
    modalTitle.textContent = service.title;
    
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${service.image}" alt="${service.title}" loading="lazy">
        </div>
        
        <div class="service-name">${service.title}</div>
        
        <p class="service-full-description">${service.fullDescription}</p>
        
        <div class="service-details">
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span class="detail-label">Availability:</span>
                <span class="detail-value">${service.availability}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-user-md"></i>
                <span class="detail-label">Doctors:</span>
                <span class="detail-value">${service.doctors} specialists</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-procedures"></i>
                <span class="detail-label">Procedures:</span>
                <span class="detail-value">${service.procedures}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-hourglass-half"></i>
                <span class="detail-label">Wait Time:</span>
                <span class="detail-value">${service.waitTime}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-phone"></i>
                <span class="detail-label">Contact:</span>
                <span class="detail-value">${service.contact.phone}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span class="detail-label">Location:</span>
                <span class="detail-value">${service.contact.department}</span>
            </div>
        </div>
        
        <div class="service-features-full">
            <h4>Services & Procedures:</h4>
            <ul>
                ${service.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
            </ul>
        </div>
        
        <div class="service-tags">
            ${service.tags.map(tag => `<span class="service-tag">${tag}</span>`).join('')}
        </div>
        
        <div class="modal-actions">
            <a href="appointments.html?service=${service.id}" class="btn btn-primary">
                <i class="fas fa-calendar-alt"></i>
                Book Appointment
            </a>
            <a href="tel:${service.contact.phone}" class="btn btn-secondary">
                <i class="fas fa-phone"></i>
                Call Department
            </a>
            ${service.emergencyAvailable ? `
                <a href="tel:+1234567911" class="btn btn-emergency">
                    <i class="fas fa-exclamation-triangle"></i>
                    Emergency Call
                </a>
            ` : ''}
        </div>
    `;
}

/**
 * Close Service Modal
 */
function closeServiceModal() {
    const modal = document.querySelector('.service-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Setup Search Functionality
 */
function setupSearch() {
    const searchInput = document.querySelector('.service-search input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(searchTerm);
        }, 300);
    });
}

/**
 * Perform Search
 */
function performSearch(searchTerm) {
    const serviceCards = document.querySelectorAll('.service-card');
    let visibleCount = 0;
    
    serviceCards.forEach(card => {
        const serviceId = card.dataset.serviceId;
        const service = servicesData.find(s => s.id === serviceId);
        
        if (!service) return;
        
        const searchableText = [
            service.title,
            service.description,
            service.fullDescription,
            ...service.features,
            ...service.tags
        ].join(' ').toLowerCase();
        
        if (searchTerm === '' || searchableText.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });
    
    // Update search results
    updateSearchResults(searchTerm, visibleCount);
}

/**
 * Update Search Results
 */
function updateSearchResults(searchTerm, count) {
    let resultsIndicator = document.querySelector('.search-results-indicator');
    
    if (searchTerm === '') {
        if (resultsIndicator) {
            resultsIndicator.remove();
        }
        return;
    }
    
    if (!resultsIndicator) {
        resultsIndicator = document.createElement('div');
        resultsIndicator.className = 'search-results-indicator';
        resultsIndicator.style.cssText = `
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: rgba(39, 174, 96, 0.1);
            border-radius: 25px;
            color: #27ae60;
            font-weight: 600;
        `;
        
        const servicesGrid = document.querySelector('.services-grid');
        servicesGrid.parentNode.insertBefore(resultsIndicator, servicesGrid);
    }
    
    resultsIndicator.innerHTML = `
        <i class="fas fa-search"></i>
        Found ${count} service${count !== 1 ? 's' : ''} matching "${searchTerm}"
    `;
}

/**
 * Initialize Animations
 */
function initializeAnimations() {
    // Animate hero statistics
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        animateCounter(stat);
    });
    
    // Animate service cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Animate Counter
 */
function animateCounter(element) {
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
        
        const suffix = element.textContent.replace(/[\d]/g, '');
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

/**
 * Animate Counters
 */
function animateCounters() {
    const counters = document.querySelectorAll('.service-counter, .stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * Setup Emergency Banner
 */
function setupEmergencyBanner() {
    const emergencyBanner = document.querySelector('.emergency-banner');
    if (!emergencyBanner) return;
    
    // Auto-hide banner after 10 seconds
    setTimeout(() => {
        if (emergencyBanner && !emergencyBanner.classList.contains('clicked')) {
            emergencyBanner.style.transform = 'translateY(-100%)';
        }
    }, 10000);
    
    // Handle banner interactions
    emergencyBanner.addEventListener('click', function(e) {
        if (e.target.closest('.emergency-close')) {
            e.preventDefault();
            emergencyBanner.style.transform = 'translateY(-100%)';
            trackBannerClose();
        } else if (e.target.closest('.emergency-phone')) {
            emergencyBanner.classList.add('clicked');
            trackEmergencyCall();
        }
    });
}

/**
 * Handle Book Appointment
 */
function handleBookAppointment(serviceId) {
    const service = servicesData.find(s => s.id === serviceId);
    if (!service) return;
    
    // Show loading state
    showNotification('Redirecting to appointment booking...', 'info');
    
    // Track appointment booking
    trackAppointmentBooking(serviceId);
    
    // Redirect to appointments page with service pre-selected
    setTimeout(() => {
        window.location.href = `appointments.html?service=${serviceId}&category=${service.category}`;
    }, 1000);
}

/**
 * Handle Emergency Call
 */
function handleEmergencyCall() {
    // Show emergency confirmation
    const confirmed = confirm(
        'You are about to call Emergency Services.\n\n' +
        'For life-threatening emergencies, call 911.\n' +
        'For hospital emergency department, call (234) 567-911.\n\n' +
        'Continue with emergency call?'
    );
    
    if (confirmed) {
        trackEmergencyCall();
        // The tel: link will handle the actual call
        showNotification('Connecting to Emergency Services...', 'emergency');
    }
}

/**
 * Handle Newsletter Submit
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Successfully subscribed to our newsletter!', 'success');
        
        // Track newsletter subscription
        trackNewsletterSubscription(email);
    }, 2000);
}

/**
 * Toggle FAQ
 */
function toggleFAQ(faqItem) {
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        emergency: 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <div class="notification-header">
            <div class="notification-icon">
                <i class="${iconMap[type] || iconMap.info}"></i>
            </div>
            <span class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Handle close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

/**
 * Hide Notification
 */
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

/**
 * Validate Email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Initialize Service Comparison
 */
function initializeServiceComparison() {
    const comparisonTable = document.querySelector('.comparison-table');
    if (!comparisonTable) return;
    
    // Add interactive features to comparison table
    const rows = comparisonTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

/**
 * Initialize Service Timeline
 */
function initializeServiceTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        timelineObserver.observe(item);
    });
}

/**
 * Initialize Service Reviews
 */
function initializeServiceReviews() {
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + (index * 100));
    });
}

/**
 * Initialize Floating Action Button
 */
function initializeFAB() {
    const fab = document.querySelector('.fab');
    if (!fab) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            // Scrolling down - hide FAB
            fab.style.transform = 'translateY(100px)';
        } else if (scrollTop < lastScrollTop) {
            // Scrolling up - show FAB
            fab.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Initialize Back to Top Button
 */
function initializeBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        trackBackToTop();
    });
}

/**
 * Initialize Lazy Loading
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Initialize Progressive Enhancement
 */
function initializeProgressiveEnhancement() {
    // Add CSS class for JavaScript-enabled features
    document.documentElement.classList.add('js-enabled');
    
    // Initialize advanced features only if supported
    if ('IntersectionObserver' in window) {
        initializeAnimations();
        initializeLazyLoading();
    }
    
    if ('requestAnimationFrame' in window) {
        initializeServiceTimeline();
        initializeServiceReviews();
    }
    
    // Initialize basic features for all browsers
    initializeServiceComparison();
    initializeFAB();
    initializeBackToTop();
}

/**
 * Handle Service Rating
 */
function handleServiceRating(serviceId, rating) {
    // Store rating locally
    const ratings = JSON.parse(localStorage.getItem('serviceRatings') || '{}');
    ratings[serviceId] = rating;
    localStorage.setItem('serviceRatings', JSON.stringify(ratings));
    
    // Show thank you message
    showNotification(`Thank you for rating this service ${rating} stars!`, 'success');
    
    // Track rating
    trackServiceRating(serviceId, rating);
}

/**
 * Load User Preferences
 */
function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    
    // Apply saved filter
    if (preferences.lastFilter && preferences.lastFilter !== 'all') {
        const filterBtn = document.querySelector(`[data-filter="${preferences.lastFilter}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    }
    
    // Apply saved search
    if (preferences.lastSearch) {
        const searchInput = document.querySelector('.service-search input');
        if (searchInput) {
            searchInput.value = preferences.lastSearch;
            performSearch(preferences.lastSearch);
        }
    }
}

/**
 * Save User Preferences
 */
function saveUserPreferences() {
    const preferences = {
        lastFilter: currentFilter,
        lastSearch: document.querySelector('.service-search input')?.value || '',
        timestamp: Date.now()
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

/**
 * Initialize Error Handling
 */
function initializeErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        
        // Show user-friendly error message
        showNotification(
            'Something went wrong. Please refresh the page or contact support if the problem persists.',
            'error'
        );
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        e.preventDefault();
    });
}

/**
 * Initialize Performance Monitoring
 */
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            console.log(`📊 Page Load Performance:
                Load Time: ${loadTime}ms
                DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms
                First Paint: ${performance.getEntriesByType('paint')[0]?.startTime || 'N/A'}ms
            `);
            
            // Track performance metrics
            trackPerformance({
                loadTime,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
            });
        }, 0);
    });
}

// ===================================
// ANALYTICS & TRACKING FUNCTIONS
// ===================================

/**
 * Track Filter Usage
 */
function trackFilterUsage(filter) {
    console.log(`🔍 Filter used: ${filter}`);
    
    // Analytics tracking would go here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'filter_services', {
            event_category: 'Services',
            event_label: filter,
            value: 1
        });
    }
}

/**
 * Track Modal Open
 */
function trackModalOpen(serviceId) {
    console.log(`📋 Service modal opened: ${serviceId}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_service_details', {
            event_category: 'Services',
            event_label: serviceId,
            value: 1
        });
    }
}

/**
 * Track Appointment Booking
 */
function trackAppointmentBooking(serviceId) {
    console.log(`📅 Appointment booking initiated: ${serviceId}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'book_appointment', {
            event_category: 'Appointments',
            event_label: serviceId,
            value: 1
        });
    }
}

/**
 * Track Emergency Call
 */
function trackEmergencyCall() {
    console.log('🚨 Emergency call initiated');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'emergency_call', {
            event_category: 'Emergency',
            event_label: 'phone_call',
            value: 1
        });
    }
}

/**
 * Track Newsletter Subscription
 */
function trackNewsletterSubscription(email) {
    console.log(`📧 Newsletter subscription: ${email}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
            event_category: 'Newsletter',
            event_label: 'services_page',
            value: 1
        });
    }
}

/**
 * Track Banner Close
 */
function trackBannerClose() {
    console.log('❌ Emergency banner closed');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'banner_close', {
            event_category: 'UI',
            event_label: 'emergency_banner',
            value: 1
        });
    }
}

/**
 * Track Service Rating
 */
function trackServiceRating(serviceId, rating) {
    console.log(`⭐ Service rated: ${serviceId} - ${rating} stars`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'rate_service', {
            event_category: 'Services',
            event_label: serviceId,
            value: rating
        });
    }
}

/**
 * Track Back to Top
 */
function trackBackToTop() {
    console.log('⬆️ Back to top clicked');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'back_to_top', {
            event_category: 'Navigation',
            event_label: 'services_page',
            value: 1
        });
    }
}

/**
 * Track Performance
 */
function trackPerformance(metrics) {
    console.log('📊 Performance metrics tracked:', metrics);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_performance', {
            event_category: 'Performance',
            custom_map: {
                'custom_parameter_1': 'load_time',
                'custom_parameter_2': 'dom_loaded',
                'custom_parameter_3': 'first_paint'
            },
            custom_parameter_1: metrics.loadTime,
            custom_parameter_2: metrics.domContentLoaded,
            custom_parameter_3: metrics.firstPaint
        });
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce Function
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Throttle Function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format Phone Number
 */
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    
    return phone;
}

/**
 * Get Time Ago
 */
function getTimeAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(debounce / 30)} months ago`;
    
    return `${Math.ceil(diffDays / 365)} years ago`;
}

/**
 * Generate Unique ID
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Check if Element is in Viewport
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
 * Smooth Scroll to Element
 */
function smoothScrollTo(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

/**
 * Copy to Clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        showNotification('Failed to copy to clipboard', 'error');
        return false;
    }
}

// ===================================
// INITIALIZATION
// ===================================

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 Lightspeed Hospital - Services Page');
    console.log('💻 Developed by Peter Lightspeed');
    console.log('📧 Contact: petereluwade55@gmail.com');
    console.log('🌐 Portfolio: https://peterlight123.github.io/portfolio');
    
    // Initialize core functionality
    initializeServices();
    
    // Initialize progressive enhancements
    initializeProgressiveEnhancement();
    
    // Initialize error handling
    initializeErrorHandling();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Load user preferences
    loadUserPreferences();
    
    // Save preferences on page unload
    window.addEventListener('beforeunload', saveUserPreferences);
    
    console.log('✅ Services page fully initialized!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - pause animations, save state
        saveUserPreferences();
    } else {
        // Page is visible - resume animations
        console.log('👁️ Page visible - resuming functionality');
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    showNotification('Connection restored!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are currently offline. Some features may not work.', 'error');
});

// Export functions for testing (if in development)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeServices,
        filterServices,
        openServiceModal,
        closeServiceModal,
        showNotification,
        isValidEmail,
        formatPhoneNumber,
        generateUniqueId
    };
}

/**
 * ===================================
 * END OF SERVICES.Js
 
 * 
 * Developer: Peter Lightspeed
 * Email: petereluwade55@gmail.com
 * Portfolio: https://peterlight123.github.io/portfolio
 * ===================================
 */

