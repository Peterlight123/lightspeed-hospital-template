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
        if (typeSlots.length === 
