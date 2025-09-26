/**
 * ===================================
 * APPOINTMENTS PAGE JAVASCRIPT
 * Lightspeed Hospital - Medical Appointments
 * Developer: Peter Lightspeed
 * Email: petereluwade55@gmail.com
 * Portfolio: https://peterlight123.github.io/portfolio
 * ===================================
 */

// Global Variables
let currentStep = 1;
let appointmentData = {};
let availableSlots = [];
let selectedDoctor = null;
let selectedDate = null;
let selectedTime = null;
let isSubmitting = false;
let calendar = null;

// Configuration
const TOTAL_STEPS = 4;
const MIN_BOOKING_DAYS = 1;
const MAX_BOOKING_DAYS = 90;
const WORKING_HOURS = { start: 8, end: 18 };
const SLOT_DURATION = 30; // minutes

// Services Data
const servicesData = {
    cardiology: {
        id: 'cardiology',
        name: 'Cardiology',
        icon: 'fas fa-heartbeat',
        color: '#e74c3c',
        doctors: [
            { id: 'dr-smith', name: 'Dr. Sarah Smith', specialty: 'Interventional Cardiology', rating: 4.9, experience: 15 },
            { id: 'dr-johnson', name: 'Dr. Michael Johnson', specialty: 'Cardiac Surgery', rating: 4.8, experience: 20 },
            { id: 'dr-williams', name: 'Dr. Emily Williams', specialty: 'Pediatric Cardiology', rating: 4.9, experience: 12 }
        ]
    },
    emergency: {
        id: 'emergency',
        name: 'Emergency Care',
        icon: 'fas fa-ambulance',
        color: '#e74c3c',
        doctors: [
            { id: 'dr-brown', name: 'Dr. James Brown', specialty: 'Emergency Medicine', rating: 4.7, experience: 18 },
            { id: 'dr-davis', name: 'Dr. Lisa Davis', specialty: 'Trauma Surgery', rating: 4.8, experience: 14 }
        ]
    },
    pediatrics: {
        id: 'pediatrics',
        name: 'Pediatrics',
        icon: 'fas fa-baby',
        color: '#3498db',
        doctors: [
            { id: 'dr-wilson', name: 'Dr. Amanda Wilson', specialty: 'General Pediatrics', rating: 4.9, experience: 16 },
            { id: 'dr-taylor', name: 'Dr. Robert Taylor', specialty: 'Pediatric Surgery', rating: 4.8, experience: 22 }
        ]
    },
    orthopedics: {
        id: 'orthopedics',
        name: 'Orthopedics',
        icon: 'fas fa-bone',
        color: '#f39c12',
        doctors: [
            { id: 'dr-anderson', name: 'Dr. David Anderson', specialty: 'Joint Replacement', rating: 4.8, experience: 19 },
            { id: 'dr-thomas', name: 'Dr. Jennifer Thomas', specialty: 'Sports Medicine', rating: 4.9, experience: 13 }
        ]
    },
    neurology: {
        id: 'neurology',
        name: 'Neurology',
        icon: 'fas fa-brain',
        color: '#9b59b6',
        doctors: [
            { id: 'dr-martinez', name: 'Dr. Carlos Martinez', specialty: 'Stroke Specialist', rating: 4.9, experience: 17 },
            { id: 'dr-garcia', name: 'Dr. Maria Garcia', specialty: 'Epilepsy Specialist', rating: 4.8, experience: 14 }
        ]
    },
    radiology: {
        id: 'radiology',
        name: 'Radiology & Imaging',
        icon: 'fas fa-x-ray',
        color: '#27ae60',
        doctors: [
            { id: 'dr-lee', name: 'Dr. Kevin Lee', specialty: 'Diagnostic Radiology', rating: 4.7, experience: 16 },
            { id: 'dr-white', name: 'Dr. Susan White', specialty: 'Interventional Radiology', rating: 4.8, experience: 18 }
        ]
    }
};

// Appointment Types
const appointmentTypes = {
    consultation: { name: 'Consultation', duration: 30, icon: 'fas fa-user-md' },
    followup: { name: 'Follow-up', duration: 20, icon: 'fas fa-redo' },
    procedure: { name: 'Procedure', duration: 60, icon: 'fas fa-procedures' },
    emergency: { name: 'Emergency', duration: 15, icon: 'fas fa-exclamation-triangle' }
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 Appointments page initializing...');
    console.log('💻 Developed by Peter Lightspeed');
    console.log('🌐 Portfolio: https://peterlight123.github.io/portfolio');
    
    initializeAppointments();
});

/**
 * Initialize Appointments Page
 */
function initializeAppointments() {
    try {
        // Hide loading screen
        hideLoadingScreen();
        
        // Parse URL parameters
        parseURLParameters();
        
        // Initialize form wizard
        initializeWizard();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize calendar
        initializeCalendar();
        
        // Load existing appointments
        loadExistingAppointments();
        
        // Initialize animations
        initializeAnimations();
        
        // Setup form validation
        setupFormValidation();
        
        console.log('✅ Appointments page initialized successfully!');
        
    } catch (error) {
        console.error('❌ Error initializing appointments:', error);
        showNotification('Error loading appointments. Please refresh the page.', 'error');
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
 * Parse URL Parameters
 */
function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const categoryParam = urlParams.get('category');
    
    if (serviceParam && servicesData[serviceParam]) {
        appointmentData.service = serviceParam;
        
        // Pre-select service in form
        const serviceSelect = document.querySelector('#service-select');
        if (serviceSelect) {
            serviceSelect.value = serviceParam;
            handleServiceChange(serviceParam);
        }
        
        console.log(`🎯 Pre-selected service: ${serviceParam}`);
    }
    
    if (categoryParam) {
        appointmentData.category = categoryParam;
        console.log(`📂 Service category: ${categoryParam}`);
    }
}

/**
 * Initialize Wizard
 */
function initializeWizard() {
    updateStepIndicator();
    showStep(currentStep);
    updateNavigationButtons();
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Wizard navigation
    const nextBtn = document.querySelector('.btn-next');
    const prevBtn = document.querySelector('.btn-prev');
    const submitBtn = document.querySelector('.btn-submit');
    
    if (nextBtn) nextBtn.addEventListener('click', handleNextStep);
    if (prevBtn) prevBtn.addEventListener('click', handlePrevStep);
    if (submitBtn) submitBtn.addEventListener('click', handleSubmitAppointment);
    
    // Service selection
    const serviceSelect = document.querySelector('#service-select');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', (e) => handleServiceChange(e.target.value));
    }
    
    // Doctor selection
    document.addEventListener('click', function(e) {
        if (e.target.closest('.doctor-card')) {
            handleDoctorSelection(e.target.closest('.doctor-card'));
        }
    });
    
    // Time slot selection
    document.addEventListener('click', function(e) {
        if (e.target.closest('.time-slot')) {
            handleTimeSlotSelection(e.target.closest('.time-slot'));
        }
    });
    
    // Form inputs
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Emergency appointment toggle
    const emergencyToggle = document.querySelector('#emergency-appointment');
    if (emergencyToggle) {
        emergencyToggle.addEventListener('change', handleEmergencyToggle);
    }
    
    // Insurance provider change
    const insuranceSelect = document.querySelector('#insurance-provider');
    if (insuranceSelect) {
        insuranceSelect.addEventListener('change', handleInsuranceChange);
    }
    
    // Phone number formatting
    const phoneInput = document.querySelector('#patient-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
    
    // Date input restrictions
    const dateInput = document.querySelector('#appointment-date');
    if (dateInput) {
        setDateRestrictions(dateInput);
        dateInput.addEventListener('change', handleDateChange);
    }
    
    // Quick actions
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quick-action-btn')) {
            handleQuickAction(e.target.closest('.quick-action-btn'));
        }
    });
    
    // Modal handlers
    document.addEventListener('click', function(e) {
        if (e.target.closest('.modal-close') || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Handle Next Step
 */
function handleNextStep() {
    if (validateCurrentStep()) {
        if (currentStep < TOTAL_STEPS) {
            currentStep++;
            showStep(currentStep);
            updateStepIndicator();
            updateNavigationButtons();
            
            // Load step-specific data
            loadStepData(currentStep);
            
            trackStepProgress(currentStep);
        }
    }
}

/**
 * Handle Previous Step
 */
function handlePrevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateStepIndicator();
        updateNavigationButtons();
        
        trackStepProgress(currentStep, 'backward');
    }
}

/**
 * Show Step
 */
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(stepEl => {
        stepEl.classList.remove('active');
        stepEl.style.display = 'none';
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
        currentStepEl.style.display = 'block';
        
        // Animate step appearance
        setTimeout(() => {
            currentStepEl.style.opacity = '1';
            currentStepEl.style.transform = 'translateX(0)';
        }, 100);
    }
    
    // Update step title
    updateStepTitle(step);
}

/**
 * Update Step Indicator
 */
function updateStepIndicator() {
    const indicators = document.querySelectorAll('.step-indicator');
    
    indicators.forEach((indicator, index) => {
        const stepNumber = index + 1;
        
        indicator.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            indicator.classList.add('completed');
        } else if (stepNumber === currentStep) {
            indicator.classList.add('active');
        }
    });
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        const progress = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * Update Navigation Buttons
 */
function updateNavigationButtons() {
    const nextBtn = document.querySelector('.btn-next');
    const prevBtn = document.querySelector('.btn-prev');
    const submitBtn = document.querySelector('.btn-submit');
    
    // Previous button
    if (prevBtn) {
        prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    }
    
    // Next/Submit buttons
    if (currentStep === TOTAL_STEPS) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'inline-flex';
    } else {
        if (nextBtn) nextBtn.style.display = 'inline-flex';
        if (submitBtn) submitBtn.style.display = 'none';
    }
}

/**
 * Update Step Title
 */
function updateStepTitle(step) {
    const titles = {
        1: 'Select Service & Doctor',
        2: 'Choose Date & Time',
        3: 'Patient Information',
        4: 'Review & Confirm'
    };
    
    const titleElement = document.querySelector('.wizard-title');
    if (titleElement && titles[step]) {
        titleElement.textContent = titles[step];
    }
}

/**
 * Validate Current Step
 */
function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        case 4:
            return true; // Review step doesn't need validation
        default:
            return false;
    }
}

/**
 * Validate Step 1 - Service & Doctor Selection
 */
function validateStep1() {
    const serviceSelect = document.querySelector('#service-select');
    const selectedDoctorCard = document.querySelector('.doctor-card.selected');
    
    if (!serviceSelect || !serviceSelect.value) {
        showNotification('Please select a service.', 'error');
        return false;
    }
    
    if (!selectedDoctorCard) {
        showNotification('Please select a doctor.', 'error');
        return false;
    }
    
    // Store step 1 data
    appointmentData.service = serviceSelect.value;
    appointmentData.doctor = selectedDoctorCard.dataset.doctorId;
    
    return true;
}

/**
 * Validate Step 2 - Date & Time Selection
 */
function validateStep2() {
    const dateInput = document.querySelector('#appointment-date');
    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    
    if (!dateInput || !dateInput.value) {
        showNotification('Please select an appointment date.', 'error');
        return false;
    }
    
    if (!selectedTimeSlot) {
        showNotification('Please select an appointment time.', 'error');
        return false;
    }
    
    // Store step 2 data
    appointmentData.date = dateInput.value;
    appointmentData.time = selectedTimeSlot.dataset.time;
    appointmentData.appointmentType = document.querySelector('#appointment-type')?.value || 'consultation';
    
    return true;
}

/**
 * Validate Step 3 - Patient Information
 */
function validateStep3() {
    const requiredFields = [
        'patient-name',
        'patient-email',
        'patient-phone',
        'patient-dob'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.querySelector(`#${fieldId}`);
        if (!field || !field.value.trim()) {
            showFieldError(field, 'This field is required.');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validate email format
    const emailField = document.querySelector('#patient-email');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address.');
        isValid = false;
    }
    
    // Validate phone format
    const phoneField = document.querySelector('#patient-phone');
    if (phoneField && phoneField.value && !isValidPhone(phoneField.value)) {
        showFieldError(phoneField, 'Please enter a valid phone number.');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return false;
    }
    
    // Store step 3 data
    appointmentData.patientInfo = {
        name: document.querySelector('#patient-name').value,
        email: document.querySelector('#patient-email').value,
        phone: document.querySelector('#patient-phone').value,
        dob: document.querySelector('#patient-dob').value,
        gender: document.querySelector('#patient-gender')?.value,
        address: document.querySelector('#patient-address')?.value,
        emergencyContact: document.querySelector('#emergency-contact')?.value,
        insuranceProvider: document.querySelector('#insurance-provider')?.value,
        insuranceNumber: document.querySelector('#insurance-number')?.value,
        medicalHistory: document.querySelector('#medical-history')?.value,
        currentMedications: document.querySelector('#current-medications')?.value,
        allergies: document.querySelector('#allergies')?.value,
        reasonForVisit: document.querySelector('#reason-visit')?.value
    };
    
    return true;
}

/**
 * Load Step Data
 */
function loadStepData(step) {
    switch (step) {
        case 1:
            loadServices();
            break;
        case 2:
            loadAvailableSlots();
            break;
        case 3:
            // Patient info form is static
            break;
        case 4:
            loadReviewData();
            break;
    }
}

/**
 * Load Services
 */
function loadServices() {
    const serviceSelect = document.querySelector('#service-select');
    if (!serviceSelect) return;
    
    // Clear existing options
    serviceSelect.innerHTML = '<option value="">Select a service...</option>';
    
    // Add service options
    Object.values(servicesData).forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.name;
        serviceSelect.appendChild(option);
    });
    
    // Pre-select if service was passed in URL
    if (appointmentData.service) {
        serviceSelect.value = appointmentData.service;
        handleServiceChange(appointmentData.service);
    }
}

/**
 * Handle Service Change
 */
function handleServiceChange(serviceId) {
    if (!serviceId || !servicesData[serviceId]) {
        clearDoctorsList();
        return;
    }
    
    const service = servicesData[serviceId];
    loadDoctors(service.doctors);
    
    // Update service info display
    updateServiceInfo(service);
    
    appointmentData.service = serviceId;
}

/**
 * Load Doctors
 */
function loadDoctors(doctors) {
    const doctorsContainer = document.querySelector('.doctors-grid');
    if (!doctorsContainer) return;
    
    doctorsContainer.innerHTML = '';
    
    doctors.forEach(doctor => {
        const doctorCard = createDoctorCard(doctor);
        doctorsContainer.appendChild(doctorCard);
    });
    
    // Animate doctor cards
    setTimeout(() => {
        document.querySelectorAll('.doctor-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

/**
 * Create Doctor Card
 */
function createDoctorCard(doctor) {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.dataset.doctorId = doctor.id;
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.3s ease';
    
    card.innerHTML = `
        <div class="doctor-avatar">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80" 
                 alt="${doctor.name}" loading="lazy">
            <div class="doctor-status online"></div>
        </div>
        
        <div class="doctor-info">
            <h4 class="doctor-name">${doctor.name}</h4>
            <p class="doctor-specialty">${doctor.specialty}</p>
            
            <div class="doctor-rating">
                ${generateStarRating(doctor.rating)}
                <span class="rating-value">${doctor.rating}</span>
            </div>
            
            <div class="doctor-experience">
                <i class="fas fa-user-md"></i>
                ${doctor.experience} years experience
            </div>
            
            <div class="doctor-availability">
                <i class="fas fa-clock"></i>
                Available today
            </div>
        </div>
        
        <div class="doctor-actions">
            <button class="btn-select-doctor">
                <i class="fas fa-check"></i>
                Select Doctor
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Handle Doctor Selection
 */
function handleDoctorSelection(doctorCard) {
    // Remove previous selection
    document.querySelectorAll('.doctor-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Select current doctor
    doctorCard.classList.add('selected');
    
    const doctorId = doctorCard.dataset.doctorId;
    selectedDoctor = doctorId;
    appointmentData.doctor = doctorId;
    
    // Update button text
    const selectBtn = doctorCard.querySelector('.btn-select-doctor');
    selectBtn.innerHTML = '<i class="fas fa-check"></i> Selected';
    
    // Show success feedback
    showNotification('Doctor selected successfully!', 'success');
    
    trackDoctorSelection(doctorId);
}

/**
 * Initialize Calendar
 */
function initializeCalendar() {
    const calendarContainer = document.querySelector('#calendar-container');
    if (!calendarContainer) return;
    
    // Create simple calendar
    calendar = new SimpleCalendar(calendarContainer, {
        minDate: new Date(Date.now() + MIN_BOOKING_DAYS * 24 * 60 * 60 * 1000),
        maxDate: new Date(Date.now() + MAX_BOOKING_DAYS * 24 * 60 * 60 * 1000),
        onDateSelect: handleDateSelection,
        disabledDates: getDisabledDates(),
        workingDays: [1, 2, 3, 4, 5, 6] // Monday to Saturday
    });
}

/**
 * Simple Calendar Implementation
 */
class SimpleCalendar {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            minDate: new Date(),
            maxDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            onDateSelect: () => {},
            disabledDates: [],
            workingDays: [1, 2, 3, 4, 5],
            ...options
        };
        
        this.currentDate = new Date();
        this.selectedDate = null;
        
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="calendar-header">
                <button class="calendar-nav prev" data-action="prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h3 class="calendar-title">${this.getMonthYear()}</h3>
                <button class="calendar-nav next" data-action="next">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="calendar-weekdays">
                <div class="weekday">Sun</div>
                <div class="weekday">Mon</div>
                <div class="weekday">Tue</div>
                <div class="weekday">Wed</div>
                <div class="weekday">Thu</div>
                <div class="weekday">Fri</div>
                <div class="weekday">Sat</div>
            </div>
            <div class="calendar-days">
                ${this.generateDays()}
            </div>
        `;
        
        this.attachEvents();
    }
    
    generateDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        let daysHTML = '';
        const today = new Date();
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === today.toDateString();
            const isDisabled = this.isDateDisabled(date);
            const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
            
            let classes = ['calendar-day'];
            if (!isCurrentMonth) classes.push('other-month');
            if (isToday) classes.push('today');
            if (isDisabled) classes.push('disabled');
            if (isSelected) classes.push('selected');
            
            daysHTML += `
                <div class="${classes.join(' ')}" data-date="${date.toISOString().split('T')[0]}">
                    ${date.getDate()}
                </div>
            `;
        }
        
        return daysHTML;
    }
    
    isDateDisabled(date) {
        // Check if date is before min date or after max date
        if (date < this.options.minDate || date > this.options.maxDate) {
            return true;
        }
        
        // Check if date is not a working day
        if (!this.options.workingDays.includes(date.getDay())) {
            return true;
        }
        
        // Check if date is in disabled dates list
        const dateString = date.toISOString().split('T')[0];
        return this.options.disabledDates.includes(dateString);
    }
    
    attachEvents() {
        // Navigation buttons
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.calendar-nav')) {
                const action = e.target.closest('.calendar-nav').dataset.action;
                if (action === 'prev') {
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                } else if (action === 'next') {
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                }
                this.render();
            }
        });
        
        // Date selection
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('calendar-day') && !e.target.classList.contains('disabled')) {
                const dateString = e.target.dataset.date;
                this.selectedDate = new Date(dateString);
                this.options.onDateSelect(this.selectedDate);
                this.render();
            }
        });
    }
    
    getMonthYear() {
        return this.currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
    }
}

/**
 * Handle Date Selection
 */
function handleDateSelection(date) {
    selectedDate = date;
    appointmentData.date = date.toISOString().split('T')[0];
    
    // Update date input
    const dateInput = document.querySelector('#appointment-date');
    if (dateInput) {
        dateInput.value = appointmentData.date;
    }
    
    // Load available time slots for selected date
    loadTimeSlots(date);
    
    showNotification('Date selected successfully!', 'success');
    trackDateSelection(appointmentData.date);
}

/**
 * Load Time Slots
 */
function loadTimeSlots(date) {
    const timeSlotsContainer = document.querySelector('.time-slots-grid');
    if (!timeSlotsContainer) return;
    
    // Show loading state
    timeSlotsContainer.innerHTML = '<div class="loading-slots">Loading available times...</div>';
    
    // Simulate API call to get available slots
    setTimeout(() => {
        const slots = generateTimeSlots(date);
        renderTimeSlots(slots);
    }, 1000);
}

/**
 * Generate Time Slots
 */
function generateTimeSlots(date) {
    const slots = [];
    const startHour = WORKING_HOURS.start;
    const endHour = WORKING_HOURS.end;
    
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const isAvailable = Math.random() > 0.3; // 70% availability simulation
            
            slots.push({
                time,
                available: isAvailable,
                type: getSlotType(hour)
            });
        }
    }
    
    return slots;
}

/**
 * Get Slot Type
 */
function getSlotType(hour) {
    if (hour < 10) return 'morning';
    if (hour < 14) return 'midday';
    if (hour < 17) return 'afternoon';
    return 'evening';
}

/**
 * Render Time Slots
 */
function renderTimeSlots(slots) {
    const timeSlotsContainer = document.querySelector('.time-slots-grid');
    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = '';
    
    // Group slots by type
    const groupedSlots = {
        morning: slots.filter(slot => slot.type === 'morning'),
        midday: slots.filter(slot => slot.type === 'midday'),
        afternoon: slots.filter(slot => slot.type === 'afternoon'),
        evening: slots.filter(slot => slot.type === 'evening')
    };
    
    Object.entries(groupedSlots).forEach(([type, typeSlots]) => {
        if (typeSlots.length === 0) return;
        
        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'time-section-title';
        sectionTitle.innerHTML = `
            <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
            <span class="available-count">${typeSlots.filter(s => s.available).length} available</span>
        `;
        timeSlotsContainer.appendChild(sectionTitle);
        
        const slotsGrid = document.createElement('div');
        slotsGrid.className = 'slots-grid';
        
        typeSlots.forEach(slot => {
            const slotElement = createTimeSlotElement(slot);
            slotsGrid.appendChild(slotElement);
        });
        
        timeSlotsContainer.appendChild(slotsGrid);
    });
    
    // Animate slots appearance
    setTimeout(() => {
        document.querySelectorAll('.time-slot').forEach((slot, index) => {
            setTimeout(() => {
                slot.style.opacity = '1';
                slot.style.transform = 'scale(1)';
            }, index * 50);
        });
    }, 100);
}

/**
 * Create Time Slot Element
 */
function createTimeSlotElement(slot) {
    const slotElement = document.createElement('div');
    slotElement.className = `time-slot ${slot.available ? 'available' : 'unavailable'}`;
    slotElement.dataset.time = slot.time;
    slotElement.style.opacity = '0';
    slotElement.style.transform = 'scale(0.9)';
    slotElement.style.transition = 'all 0.3s ease';
    
    slotElement.innerHTML = `
        <div class="slot-time">${formatTime(slot.time)}</div>
        <div class="slot-status">
            ${slot.available ? 
                '<i class="fas fa-check"></i> Available' : 
                '<i class="fas fa-times"></i> Booked'
            }
        </div>
    `;
    
    if (slot.available) {
        slotElement.addEventListener('click', () => handleTimeSlotSelection(slotElement));
    }
    
    return slotElement;
}

/**
 * Handle Time Slot Selection
 */
function handleTimeSlotSelection(slotElement) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Select current slot
    slotElement.classList.add('selected');
    
    selectedTime = slotElement.dataset.time;
    appointmentData.time = selectedTime;
    
    // Update slot appearance
    slotElement.innerHTML = `
        <div class="slot-time">${formatTime(selectedTime)}</div>
        <div class="slot-status selected">
            <i class="fas fa-check"></i> Selected
        </div>
    `;
    
    showNotification('Time slot selected successfully!', 'success');
    trackTimeSlotSelection(selectedTime);
}

/**
 * Load Review Data
 */
function loadReviewData() {
    const reviewContainer = document.querySelector('.appointment-review');
    if (!reviewContainer) return;
    
    const service = servicesData[appointmentData.service];
    const doctor = service?.doctors.find(d => d.id === appointmentData.doctor);
    
    reviewContainer.innerHTML = `
        <div class="review-section">
            <h3><i class="fas fa-calendar-check"></i> Appointment Details</h3>
            <div class="review-grid">
                <div class="review-item">
                    <label>Service:</label>
                    <span>${service?.name || 'N/A'}</span>
                </div>
                <div class="review-item">
                    <label>Doctor:</label>
                    <span>${doctor?.name || 'N/A'}</span>
                </div>
                <div class="review-item">
                    <label>Date:</label>
                    <span>${formatDate(appointmentData.date)}</span>
                </div>
                <div class="review-item">
                    <label>Time:</label>
                    <span>${formatTime(appointmentData.time)}</span>
                </div>
                <div class="review-item">
                    <label>Type:</label>
                    <span>${appointmentTypes[appointmentData.appointmentType]?.name || 'Consultation'}</span>
                </div>
            </div>
        </div>
        
        <div class="review-section">
            <h3><i class="fas fa-user"></i> Patient Information</h3>
            <div class="review-grid">
                <div class="review-item">
                    <label>Name:</label>
                    <span>${appointmentData.patientInfo?.name || 'N/A'}</span>
                </div>
                <div class="review-item">
                    <label>Email:</label>
                    <span>${appointmentData.patientInfo?.email || 'N/A'}</span>
                </div>
                <div class="review-item">
                    <label>Phone:</label>
                    <span>${appointmentData.patientInfo?.phone || 'N/A'}</span>
                </div>
                <div class="review-item">
                    <label>Date of Birth:</label>
                    <span>${formatDate(appointmentData.patientInfo?.dob)}</span>
                </div>
                ${appointmentData.patientInfo?.insuranceProvider ? `
                    <div class="review-item">
                        <label>Insurance:</label>
                        <span>${appointmentData.patientInfo.insuranceProvider}</span>
                    </div>
                ` : ''}
                ${appointmentData.patientInfo?.reasonForVisit ? `
                    <div class="review-item full-width">
                        <label>Reason for Visit:</label>
                        <span>${appointmentData.patientInfo.reasonForVisit}</span>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="review-section">
            <h3><i class="fas fa-info-circle"></i> Important Information</h3>
            <div class="info-cards">
                <div class="info-card">
                    <i class="fas fa-clock"></i>
                    <div>
                        <h4>Arrival Time</h4>
                        <p>Please arrive 15 minutes before your appointment time</p>
                    </div>
                </div>
                <div class="info-card">
                    <i class="fas fa-id-card"></i>
                    <div>
                        <h4>Required Documents</h4>
                        <p>Bring a valid ID and insurance card</p>
                    </div>
                </div>
                <div class="info-card">
                    <i class="fas fa-phone"></i>
                    <div>
                        <h4>Contact</h4>
                        <p>Call (234) 567-8900 for any changes</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="review-actions">
            <div class="terms-checkbox">
                <input type="checkbox" id="terms-agreement" required>
                <label for="terms-agreement">
                    I agree to the <a href="#" class="terms-link">Terms and Conditions</a> 
                    and <a href="#" class="privacy-link">Privacy Policy</a>
                </label>
            </div>
        </div>
    `;
}

/**
 * Handle Submit Appointment
 */
async function handleSubmitAppointment() {
    if (isSubmitting) return;
    
    // Validate terms agreement
    const termsCheckbox = document.querySelector('#terms-agreement');
    if (!termsCheckbox || !termsCheckbox.checked) {
        showNotification('Please agree to the terms and conditions.', 'error');
        return;
    }
    
    isSubmitting = true;
    
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking Appointment...';
    submitBtn.disabled = true;
    
    try {
        // Generate appointment ID
        const appointmentId = generateAppointmentId();
        appointmentData.id = appointmentId;
        appointmentData.status = 'confirmed';
        appointmentData.createdAt = new Date().toISOString();
        
        // Simulate API call
        await simulateAppointmentBooking(appointmentData);
        
        // Save to local storage
        saveAppointment(appointmentData);
        
        // Show success and redirect
        showSuccessModal(appointmentData);
        
        // Track successful booking
        trackAppointmentBooked(appointmentData);
        
    } catch (error) {
        console.error('Error booking appointment:', error);
        showNotification('Failed to book appointment. Please try again.', 'error');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        isSubmitting = false;
    }
}

/**
 * Simulate Appointment Booking
 */
function simulateAppointmentBooking(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
                resolve(data);
            } else {
                reject(new Error('Booking failed'));
            }
        }, 2000);
    });
}

/**
 * Show Success Modal
 */
function showSuccessModal(appointmentData) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-header">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Appointment Confirmed!</h2>
                <p>Your appointment has been successfully booked.</p>
            </div>
            
            <div class="appointment-summary">
                <h3>Appointment Details</h3>
                <div class="summary-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(appointmentData.date)} at ${formatTime(appointmentData.time)}</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-user-md"></i>
                    <span>Dr. ${getDoctorName(appointmentData.doctor)}</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-hashtag"></i>
                    <span>Appointment ID: ${appointmentData.id}</span>
                </div>
            </div>
            
            <div class="success-actions">
                <button class="btn btn-primary" onclick="downloadAppointmentCard('${appointmentData.id}')">
                    <i class="fas fa-download"></i>
                    Download Appointment Card
                </button>
                <button class="btn btn-secondary" onclick="addToCalendar('${appointmentData.id}')">
                    <i class="fas fa-calendar-plus"></i>
                    Add to Calendar
                </button>
            </div>
            
            <div class="modal-footer">
                <p>A confirmation email has been sent to ${appointmentData.patientInfo.email}</p>
                <button class="btn btn-outline" onclick="closeSuccessModal()">
                    Continue
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal appearance
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
    
    // Auto-redirect after 10 seconds
    setTimeout(() => {
        closeSuccessModal();
    }, 10000);
}

/**
 * Close Success Modal
 */
function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            // Redirect to appointments dashboard
            window.location.href = 'patient-portal.html';
        }, 300);
    }
}

/**
 * Save Appointment
 */
function saveAppointment(appointmentData) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointmentData);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

/**
 * Load Existing Appointments
 */
function loadExistingAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    console.log(`📅 Found ${appointments.length} existing appointments`);
    return appointments;
}

/**
 * Get Disabled Dates
 */
function getDisabledDates() {
    // Return array of disabled dates (holidays, doctor unavailable days, etc.)
    const disabledDates = [];
    
    // Add some sample disabled dates
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (7 - today.getDay()));
    
    // Disable all Sundays for next 3 months
    for (let i = 0; i < 12; i++) {
        const sunday = new Date(nextSunday);
        sunday.setDate(nextSunday.getDate() + (i * 7));
        disabledDates.push(sunday.toISOString().split('T')[0]);
    }
    
    return disabledDates;
}

/**
 * Setup Form Validation
 */
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isValid = validateForm(form);
            if (isValid) {
                // Form is valid, proceed with submission
                console.log('Form is valid');
            }
        });
    });
}

/**
 * Validate Form
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate Field
 */
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Check if required field is empty
    if (required && !value) {
        showFieldError(field, 'This field is required.');
        return false;
    }
    
    // Type-specific validation
    if (value) {
        switch (type) {
            case 'email':
                if (!isValidEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address.');
                    return false;
                }
                break;
            case 'tel':
                if (!isValidPhone(value)) {
                    showFieldError(field, 'Please enter a valid phone number.');
                    return false;
                }
                break;
            case 'date':
                if (!isValidDate(value)) {
                    showFieldError(field, 'Please select a valid date.');
                    return false;
                }
                break;
        }
    }
    
    return true;
}

/**
 * Show Field Error
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

/**
 * Clear Field Error
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Handle Emergency Toggle
 */
function handleEmergencyToggle(e) {
    const isEmergency = e.target.checked;
    
    if (isEmergency) {
        // Show emergency appointment options
        showEmergencyOptions();
        
        // Update appointment type
        const appointmentTypeSelect = document.querySelector('#appointment-type');
        if (appointmentTypeSelect) {
            appointmentTypeSelect.value = 'emergency';
        }
        
        showNotification('Emergency appointment selected. You will be prioritized.', 'info');
    } else {
        hideEmergencyOptions();
    }
    
    trackEmergencyToggle(isEmergency);
}

/**
 * Show Emergency Options
 */
function showEmergencyOptions() {
    const emergencySection = document.querySelector('.emergency-options');
    if (emergencySection) {
        emergencySection.style.display = 'block';
        emergencySection.classList.add('show');
    }
}

/**
 * Hide Emergency Options
 */
function hideEmergencyOptions() {
    const emergencySection = document.querySelector('.emergency-options');
    if (emergencySection) {
        emergencySection.classList.remove('show');
        setTimeout(() => {
            emergencySection.style.display = 'none';
        }, 300);
    }
}

/**
 * Handle Insurance Change
 */
function handleInsuranceChange(e) {
    const insuranceProvider = e.target.value;
    
    if (insuranceProvider && insuranceProvider !== 'none') {
        // Show insurance number field
        const insuranceNumberField = document.querySelector('#insurance-number');
        if (insuranceNumberField) {
            insuranceNumberField.parentNode.style.display = 'block';
            insuranceNumberField.setAttribute('required', '');
        }
        
        // Show insurance benefits info
        showInsuranceBenefits(insuranceProvider);
    } else {
        // Hide insurance number field
        const insuranceNumberField = document.querySelector('#insurance-number');
        if (insuranceNumberField) {
            insuranceNumberField.parentNode.style.display = 'none';
            insuranceNumberField.removeAttribute('required');
        }
        
        hideInsuranceBenefits();
    }
}

/**
 * Show Insurance Benefits
 */
function showInsuranceBenefits(provider) {
    const benefitsContainer = document.querySelector('.insurance-benefits');
    if (!benefitsContainer) return;
    
    const benefits = getInsuranceBenefits(provider);
    
    benefitsContainer.innerHTML = `
        <div class="benefits-header">
            <i class="fas fa-shield-alt"></i>
            <h4>Your ${provider} Benefits</h4>
        </div>
        <div class="benefits-list">
            ${benefits.map(benefit => `
                <div class="benefit-item">
                    <i class="fas fa-check"></i>
                    <span>${benefit}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    benefitsContainer.style.display = 'block';
}

/**
 * Get Insurance Benefits
 */
function getInsuranceBenefits(provider) {
    const benefitsMap = {
        'blue-cross': [
            'Preventive care covered 100%',
            'Specialist visits: $25 copay',
            'Emergency room: $150 copay'
        ],
        'aetna': [
            'Annual wellness exam covered',
            'Specialist visits: $30 copay',
            'Emergency room: $200 copay'
        ],
        'cigna': [
            'Preventive screenings covered',
            'Specialist visits: $35 copay',
            'Emergency room: $175 copay'
        ],
        'united': [
            'Routine checkups covered',
            'Specialist visits: $25 copay',
            'Emergency room: $150 copay'
        ]
    };
    
    return benefitsMap[provider] || ['Coverage details will be verified'];
}

/**
 * Hide Insurance Benefits
 */
function hideInsuranceBenefits() {
    const benefitsContainer = document.querySelector('.insurance-benefits');
    if (benefitsContainer) {
        benefitsContainer.style.display = 'none';
    }
}

/**
 * Handle Quick Action
 */
function handleQuickAction(button) {
    const action = button.dataset.action;
    
    switch (action) {
        case 'emergency':
            handleEmergencyBooking();
            break;
        case 'same-day':
            handleSameDayBooking();
            break;
        case 'telehealth':
            handleTelehealthBooking();
            break;
        case 'reschedule':
            handleReschedule();
            break;
    }
}

/**
 * Handle Emergency Booking
 */
function handleEmergencyBooking() {
    // Pre-fill emergency appointment
    const emergencyToggle = document.querySelector('#emergency-appointment');
    if (emergencyToggle) {
        emergencyToggle.checked = true;
        handleEmergencyToggle({ target: emergencyToggle });
    }
    
    // Jump to step 2 if service is already selected
    if (appointmentData.service) {
        currentStep = 2;
        showStep(currentStep);
        updateStepIndicator();
        updateNavigationButtons();
    }
    
    showNotification('Emergency appointment mode activated.', 'info');
    trackQuickAction('emergency');
}

/**
 * Handle Same Day Booking
 */
function handleSameDayBooking() {
    // Set today's date
    const today = new Date();
    const dateInput = document.querySelector('#appointment-date');
    if (dateInput) {
        dateInput.value = today.toISOString().split('T')[0];
        handleDateChange({ target: dateInput });
    }
    
    // Jump to step 2
    if (appointmentData.service) {
        currentStep = 2;
        showStep(currentStep);
        updateStepIndicator();
        updateNavigationButtons();
    }
    
    showNotification('Searching for same-day appointments...', 'info');
    trackQuickAction('same-day');
}

/**
 * Handle Telehealth Booking
 */
function handleTelehealthBooking() {
    // Set appointment type to telehealth
    const appointmentTypeSelect = document.querySelector('#appointment-type');
    if (appointmentTypeSelect) {
        // Add telehealth option if not exists
        let telehealthOption = appointmentTypeSelect.querySelector('option[value="telehealth"]');
        if (!telehealthOption) {
            telehealthOption = document.createElement('option');
            telehealthOption.value = 'telehealth';
            telehealthOption.textContent = 'Telehealth (Video Call)';
            appointmentTypeSelect.appendChild(telehealthOption);
        }
        appointmentTypeSelect.value = 'telehealth';
    }
    
    showNotification('Telehealth appointment selected. You will receive video call instructions.', 'info');
    trackQuickAction('telehealth');
}

/**
 * Handle Date Change
 */
function handleDateChange(e) {
    const selectedDate = new Date(e.target.value);
    handleDateSelection(selectedDate);
}

/**
 * Set Date Restrictions
 */
function setDateRestrictions(dateInput) {
    const today = new Date();
    const minDate = new Date(today.getTime() + MIN_BOOKING_DAYS * 24 * 60 * 60 * 1000);
    const maxDate = new Date(today.getTime() + MAX_BOOKING_DAYS * 24 * 60 * 60 * 1000);
    
    dateInput.min = minDate.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];
}

/**
 * Handle Keyboard Shortcuts
 */
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Enter to proceed to next step
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (currentStep < TOTAL_STEPS) {
            handleNextStep();
        } else {
            handleSubmitAppointment();
        }
    }
    
    // Escape to go back
    if (e.key === 'Escape' && currentStep > 1) {
        e.preventDefault();
        handlePrevStep();
    }
}

/**
 * Initialize Animations
 */
function initializeAnimations() {
    // Animate wizard steps
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(30px)';
        step.style.transition = 'all 0.3s ease';
    });
    
    // Animate step indicators
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach((indicator, index) => {
        indicator.style.transform = 'scale(0)';
        indicator.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            indicator.style.transform = 'scale(1)';
        }, index * 100);
    });
    
    // Animate form elements
    const formElements = document.querySelectorAll('.form-group, .doctor-card, .time-slot');
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Format Time
 */
function formatTime(time) {
    if (!time) return 'N/A';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Format Date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format Phone Number
 */
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    e.target.value = value;
}

/**
 * Generate Star Rating
 */
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

/**
 * Generate Appointment ID
 */
function generateAppointmentId() {
    const prefix = 'APT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    
    return `${prefix}-${timestamp}-${random}`;
}

/**
 * Get Doctor Name
 */
function getDoctorName(doctorId) {
    for (const service of Object.values(servicesData)) {
        const doctor = service.doctors.find(d => d.id === doctorId);
        if (doctor) {
            return doctor.name;
        }
    }
    return 'Unknown Doctor';
}

/**
 * Clear Doctors List
 */
function clearDoctorsList() {
    const doctorsContainer = document.querySelector('.doctors-grid');
    if (doctorsContainer) {
        doctorsContainer.innerHTML = '<p class="no-doctors">Please select a service to see available doctors.</p>';
    }
}

/**
 * Update Service Info
 */
function updateServiceInfo(service) {
    const serviceInfo = document.querySelector('.service-info');
    if (serviceInfo) {
        serviceInfo.innerHTML = `
            <div class="service-header">
                <i class="${service.icon}" style="color: ${service.color}"></i>
                <h3>${service.name}</h3>
            </div>
            <p>Select from ${service.doctors.length} available doctors</p>
        `;
    }
}

/**
 * Validation Functions
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const minDate = new Date(today.getTime() + MIN_BOOKING_DAYS * 24 * 60 * 60 * 1000);
    const maxDate = new Date(today.getTime() + MAX_BOOKING_DAYS * 24 * 60 * 60 * 1000);
    
    return date >= minDate && date <= maxDate;
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
        warning: 'fas fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${iconMap[type] || iconMap.info}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

/**
 * Remove Notification
 */
function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

/**
 * Close Modal
 */
function closeModal() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
}

/**
 * Download Appointment Card
 */
function downloadAppointmentCard(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (!appointment) {
        showNotification('Appointment not found.', 'error');
        return;
    }
    
    // Create appointment card content
    const cardContent = generateAppointmentCardHTML(appointment);
    
    // Create and download PDF (simplified version)
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Appointment Card - ${appointment.id}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .card { border: 2px solid #007bff; border-radius: 10px; padding: 20px; max-width: 500px; }
                .header { text-align: center; margin-bottom: 20px; }
                .logo { font-size: 24px; font-weight: bold; color: #007bff; }
                .details { margin: 10px 0; }
                .label { font-weight: bold; }
                .qr-code { text-align: center; margin: 20px 0; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            ${cardContent}
            <script>
                window.onload = function() {
                    window.print();
                    window.close();
                }
            </script>
        </body>
        </html>
    `);
    
    trackAppointmentCardDownload(appointmentId);
}

/**
 * Generate Appointment Card HTML
 */
function generateAppointmentCardHTML(appointment) {
    const service = servicesData[appointment.service];
    const doctor = service?.doctors.find(d => d.id === appointment.doctor);
    
    return `
        <div class="card">
            <div class="header">
                <div class="logo">🏥 Lightspeed Hospital</div>
                <h2>Appointment Card</h2>
            </div>
            
            <div class="details">
                <div><span class="label">Appointment ID:</span> ${appointment.id}</div>
                <div><span class="label">Patient:</span> ${appointment.patientInfo.name}</div>
                <div><span class="label">Service:</span> ${service?.name}</div>
                <div><span class="label">Doctor:</span> ${doctor?.name}</div>
                <div><span class="label">Date:</span> ${formatDate(appointment.date)}</div>
                <div><span class="label">Time:</span> ${formatTime(appointment.time)}</div>
                <div><span class="label">Status:</span> ${appointment.status.toUpperCase()}</div>
            </div>
            
            <div class="qr-code">
                <div style="width: 100px; height: 100px; border: 1px solid #ccc; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                    QR Code<br>${appointment.id}
                </div>
            </div>
            
            <div style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
                Please arrive 15 minutes before your appointment time<br>
                Bring a valid ID and insurance card<br>
                For questions, call: (234) 567-8900
            </div>
        </div>
    `;
}

/**
 * Add to Calendar
 */
function addToCalendar(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (!appointment) {
        showNotification('Appointment not found.', 'error');
        return;
    }
    
    const service = servicesData[appointment.service];
    const doctor = service?.doctors.find(d => d.id === appointment.doctor);
    
    // Create calendar event
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes duration
    
    const eventDetails = {
        title: `Medical Appointment - ${service?.name}`,
        description: `Appointment with ${doctor?.name}\nAppointment ID: ${appointment.id}\nPatient: ${appointment.patientInfo.name}`,
        location: 'Lightspeed Hospital, 123 Medical Center Dr, Healthcare City, HC 12345',
        start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    };
    
    // Generate calendar URLs
    const calendarUrls = {
        google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`,
        outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventDetails.title)}&startdt=${eventDetails.start}&enddt=${eventDetails.end}&body=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`,
        yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(eventDetails.title)}&st=${eventDetails.start}&et=${eventDetails.end}&desc=${encodeURIComponent(eventDetails.description)}&in_loc=${encodeURIComponent(eventDetails.location)}`
    };
    
    // Show calendar options modal
    showCalendarOptionsModal(calendarUrls);
    
    trackCalendarAdd(appointmentId);
}

/**
 * Show Calendar Options Modal
 */
function showCalendarOptionsModal(calendarUrls) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay calendar-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add to Calendar</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="calendar-options">
                <a href="${calendarUrls.google}" target="_blank" class="calendar-option">
                    <i class="fab fa-google"></i>
                    <span>Google Calendar</span>
                </a>
                
                <a href="${calendarUrls.outlook}" target="_blank" class="calendar-option">
                    <i class="fab fa-microsoft"></i>
                    <span>Outlook Calendar</span>
                </a>
                
                <a href="${calendarUrls.yahoo}" target="_blank" class="calendar-option">
                    <i class="fab fa-yahoo"></i>
                    <span>Yahoo Calendar</span>
                </a>
                
                <button class="calendar-option" onclick="downloadICSFile('${appointmentId}')">
                    <i class="fas fa-download"></i>
                    <span>Download ICS File</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

/**
 * Download ICS File
 */
function downloadICSFile(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (!appointment) return;
    
    const service = servicesData[appointment.service];
    const doctor = service?.doctors.find(d => d.id === appointment.doctor);
    
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + 30 * 60000);
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Lightspeed Hospital//Appointment System//EN
BEGIN:VEVENT
UID:${appointment.id}@lightspeedhospital.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Medical Appointment - ${service?.name}
DESCRIPTION:Appointment with ${doctor?.name}\\nAppointment ID: ${appointment.id}\\nPatient: ${appointment.patientInfo.name}
LOCATION:Lightspeed Hospital, 123 Medical Center Dr, Healthcare City, HC 12345
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Appointment reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;
    
    // Create and download file
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointment-${appointment.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    closeModal();
}

// ===================================
// ANALYTICS & TRACKING FUNCTIONS
// ===================================

/**
 * Track Step Progress
 */
function trackStepProgress(step, direction = 'forward') {
    console.log(`📊 Step ${step} ${direction === 'forward' ? 'entered' : 'returned to'}`);
    
    // Send to analytics service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'appointment_step_progress', {
            step_number: step,
            direction: direction,
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Track Doctor Selection
 */
function trackDoctorSelection(doctorId) {
    console.log(`👨‍⚕️ Doctor selected: ${doctorId}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'doctor_selected', {
            doctor_id: doctorId,
            service: appointmentData.service,
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Track Date Selection
 */
function trackDateSelection(date) {
    console.log(`📅 Date selected: ${date}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'date_selected', {
            selected_date: date,
            days_in_advance: Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24)),
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Track Time Slot Selection
 */
function trackTimeSlotSelection(time) {
    console.log(`⏰ Time slot selected: ${time}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'time_slot_selected', {
            selected_time: time,
            time_period: getTimePeriod(time),
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Track Emergency Toggle
 */
function trackEmergencyToggle(isEmergency) {
    console.log(`🚨 Emergency toggle: ${isEmergency ? 'ON' : 'OFF'}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'emergency_toggle', {
            is_emergency: isEmergency,
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Track Quick Action
 */
function trackQuickAction(action) {
    console.log(`⚡ Quick action: ${action}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quick_action_used', {
            action_type: action,
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Track Appointment Booked
 */
function trackAppointmentBooked(appointmentData) {
    console.log(`✅ Appointment booked: ${appointmentData.id}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'appointment_booked', {
            appointment_id: appointmentData.id,
            service: appointmentData.service,
            doctor: appointmentData.doctor,
            appointment_type: appointmentData.appointmentType,
            days_in_advance: Math.ceil((new Date(appointmentData.date) - new Date()) / (1000 * 60 * 60 * 24)),
            timestamp: new Date().toISOString()
        });
        
        // Conversion tracking
        gtag('event', 'conversion', {
            send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
            value: 1.0,
            currency: 'USD'
        });
    }
}

/**
 * Track Appointment Card Download
 */
function trackAppointmentCardDownload(appointmentId) {
    console.log(`📄 Appointment card downloaded: ${appointmentId}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'appointment_card_download', {
            appointment_id: appointmentId,
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Track Calendar Add
 */
function trackCalendarAdd(appointmentId) {
    console.log(`📅 Calendar add initiated: ${appointmentId}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'calendar_add', {
            appointment_id: appointmentId,
            timestamp: new Date().toISOString()
        });
    }
}

/**
 * Get Time Period
 */
function getTimePeriod(time) {
    const hour = parseInt(time.split(':')[0]);
    
    if (hour < 10) return 'morning';
    if (hour < 14) return 'midday';
    if (hour < 17) return 'afternoon';
    return 'evening';
}

// ===================================
// ERROR HANDLING & RECOVERY
// ===================================

/**
 * Global Error Handler
 */
window.addEventListener('error', function(e) {
    console.error('❌ Global error:', e.error);
    
    // Log error to analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'javascript_error', {
            error_message: e.message,
            error_filename: e.filename,
            error_lineno: e.lineno,
            timestamp: new Date().toISOString()
        });
    }
    
    // Show user-friendly error message
    showNotification('An unexpected error occurred. Please refresh the page and try again.', 'error');
});

/**
 * Unhandled Promise Rejection Handler
 */
window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled promise rejection:', e.reason);
    
    // Log error to analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'promise_rejection', {
            error_reason: e.reason?.toString() || 'Unknown',
            timestamp: new Date().toISOString()
        });
    }
    
    // Prevent default browser behavior
    e.preventDefault();
    
    // Show user-friendly error message
    showNotification('A network error occurred. Please check your connection and try again.', 'error');
});

/**
 * Save Form Progress
 */
function saveFormProgress() {
    const progressData = {
        currentStep,
        appointmentData,
        selectedDoctor,
        selectedDate,
        selectedTime,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('appointmentProgress', JSON.stringify(progressData));
}

/**
 * Restore Form Progress
 */
function restoreFormProgress() {
    const savedProgress = localStorage.getItem('appointmentProgress');
    
    if (savedProgress) {
        try {
            const progressData = JSON.parse(savedProgress);
            
            // Check if progress is recent (within 1 hour)
            const savedTime = new Date(progressData.timestamp);
            const now = new Date();
            const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
            
            if (hoursDiff < 1) {
                // Restore progress
                currentStep = progressData.currentStep || 1;
                appointmentData = progressData.appointmentData || {};
                selectedDoctor = progressData.selectedDoctor;
                selectedDate = progressData.selectedDate;
                selectedTime = progressData.selectedTime;
                
                // Show restoration notification
                showNotification('Your previous progress has been restored.', 'info');
                
                console.log('📋 Form progress restored');
                return true;
            } else {
                // Clear old progress
                localStorage.removeItem('appointmentProgress');
            }
        } catch (error) {
            console.error('Error restoring progress:', error);
            localStorage.removeItem('appointmentProgress');
        }
    }
    
    return false;
}

/**
 * Auto-save Progress
 */
setInterval(() => {
    if (currentStep > 1 && Object.keys(appointmentData).length > 0) {
        saveFormProgress();
    }
}, 30000); // Save every 30 seconds

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

/**
 * Setup Accessibility Features
 */
function setupAccessibility() {
    // Add ARIA labels and descriptions
    addAriaLabels();
    
    // Setup keyboard navigation
    setupKeyboardNavigation();
    
    // Add screen reader announcements
    setupScreenReaderAnnouncements();
    
    // Setup focus management
    setupFocusManagement();
}

/**
 * Add ARIA Labels
 */
function addAriaLabels() {
    // Step indicators
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        indicator.setAttribute('aria-label', `Step ${index + 1}`);
        indicator.setAttribute('role', 'tab');
    });
    
    // Form sections
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        step.setAttribute('role', 'tabpanel');
        step.setAttribute('aria-labelledby', `step-${index + 1}-indicator`);
    });
    
    // Doctor cards
    document.querySelectorAll('.doctor-card').forEach(card => {
        const doctorName = card.querySelector('.doctor-name')?.textContent;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Select ${doctorName}`);
        card.setAttribute('tabindex', '0');
    });
    
    // Time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        const time = slot.dataset.time;
        const isAvailable = slot.classList.contains('available');
        slot.setAttribute('role', 'button');
        slot.setAttribute('aria-label', `${formatTime(time)} - ${isAvailable ? 'Available' : 'Unavailable'}`);
        if (isAvailable) {
            slot.setAttribute('tabindex', '0');
        }
    });
}

/**
 * Setup Keyboard Navigation
 */
function setupKeyboardNavigation() {
    // Doctor card keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('doctor-card') && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleDoctorSelection(e.target);
        }
    });
    
    // Time slot keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('time-slot') && e.target.classList.contains('available') && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleTimeSlotSelection(e.target);
        }
    });
    
    // Arrow key navigation for doctor cards and time slots
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const focusableElements = document.querySelectorAll('.doctor-card[tabindex="0"], .time-slot.available[tabindex="0"]');
            const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
            
            if (currentIndex !== -1) {
                e.preventDefault();
                let nextIndex;
                
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % focusableElements.length;
                } else {
                    nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
                }
                
                focusableElements[nextIndex].focus();
            }
        }
    });
}

/**
 * Setup Screen Reader Announcements
 */
function setupScreenReaderAnnouncements() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-announcements';
    document.body.appendChild(liveRegion);
}

/**
 * Announce to Screen Reader
 */
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-announcements');
    if (liveRegion) {
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

/**
 * Setup Focus Management
 */
function setupFocusManagement() {
    // Focus first input when step changes
    const originalShowStep = showStep;
    showStep = function(step) {
        originalShowStep(step);
        
        // Focus first focusable element in new step
        setTimeout(() => {
            const currentStepEl = document.querySelector(`[data-step="${step}"]`);
            if (currentStepEl) {
                const firstFocusable = currentStepEl.querySelector('input, select, button, [tabindex="0"]');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }
        }, 100);
        
        // Announce step change
        const stepTitles = {
            1: 'Step 1: Select Service and Doctor',
            2: 'Step 2: Choose Date and Time',
            3: 'Step 3: Enter Patient Information',
            4: 'Step 4: Review and Confirm Appointment'
        };
        
        announceToScreenReader(stepTitles[step] || `Step ${step}`);
    };
}

// Initialize accessibility features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupAccessibility, 1000);
});

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

/**
 * Lazy Load Images
 */
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Debounce Function
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
 * Throttle Function
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

// ===================================
// FINAL INITIALIZATION
// ===================================

// Restore form progress on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        restoreFormProgress();
    }, 500);
});

// Save progress before page unload
window.addEventListener('beforeunload', function() {
    if (currentStep > 1 && Object.keys(appointmentData).length > 0) {
        saveFormProgress();
    }
});

// Setup lazy loading
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupLazyLoading, 1000);
});

console.log('🎉 Appointments.js loaded successfully!');
console.log('👨‍💻 Developed by Peter Lightspeed');
console.log('📧 Contact: petereluwade55@gmail.com');
console.log('🌐 Portfolio: https://peterlight123.github.io/portfolio');

/**
 * ===================================
 * END OF APPOINTMENTS.JS
*/
