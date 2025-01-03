// Load environment variables
const config = {
    emailjs: {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        serviceId: process.env.EMAILJS_SERVICE_ID,
        contactTemplate: process.env.EMAILJS_CONTACT_TEMPLATE_ID,
        bookingTemplate: process.env.EMAILJS_BOOKING_TEMPLATE_ID,
        paymentTemplate: process.env.EMAILJS_PAYMENT_TEMPLATE_ID
    },
    paystack: {
        publicKey: process.env.PAYSTACK_PUBLIC_KEY
    },
    site: {
        name: process.env.SITE_NAME,
        email: process.env.SITE_EMAIL,
        phone: process.env.SITE_PHONE
    }
};

// Initialize EmailJS
emailjs.init(config.emailjs.publicKey);

// Navigation
function initNavigation() {
    const header = document.querySelector('.site-header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    let lastScroll = 0;

    // Handle mobile menu toggle
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = mainNav.classList.contains('active');
            toggleMenu(!isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close menu when clicking nav links
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });
    }

    // Handle header scroll behavior
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
            toggleMenu(false);
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // Handle active nav links
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    mainNav.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    function toggleMenu(show) {
        mainNav.classList.toggle('active', show);
        mobileMenuToggle.setAttribute('aria-expanded', show);
        document.body.style.overflow = show ? 'hidden' : '';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileMenu();
    initForms();
    initBookingSystem();
    initPaymentSystem();
    
    // Initialize Lucide icons
    lucide.createIcons();
});

// Mobile Menu
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', 
                mainNav.classList.contains('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Form Handling
function initForms() {
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                await emailjs.sendForm(
                    config.emailjs.serviceId,
                    config.emailjs.contactTemplate,
                    contactForm
                );
                alert('Message sent successfully!');
                contactForm.reset();
            } catch (error) {
                console.error('Failed to send message:', error);
                alert('Failed to send message. Please try again.');
            }
        });
    }
}

// Booking System
function initBookingSystem() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(bookingForm);
            const bookingData = Object.fromEntries(formData.entries());
            
            if (!validateBookingData(bookingData)) return;
            
            try {
                // Send confirmation emails
                await sendBookingEmails(bookingData);
                
                // Store booking data and proceed to payment
                localStorage.setItem('bookingData', JSON.stringify(bookingData));
                window.location.href = 'payment.html';
            } catch (error) {
                console.error('Booking failed:', error);
                alert('Failed to process booking. Please try again.');
            }
        });
    }
}

// Payment System
function initPaymentSystem() {
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
        
        if (!bookingData.email) {
            window.location.href = 'booking.html';
            return;
        }
        
        updatePaymentSummary(bookingData);
        
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            initiatePayment(bookingData);
        });
    }
}

// Utility Functions
function validateBookingData(data) {
    const requiredFields = ['name', 'email', 'phone', 'service', 'date', 'time'];
    const errorMessage = document.getElementById('error-message');
    
    // Check required fields
    for (const field of requiredFields) {
        if (!data[field]) {
            errorMessage.textContent = `Please fill in all required fields`;
            return false;
        }
    }
    
    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errorMessage.textContent = 'Please enter a valid email address';
        return false;
    }
    
    // Validate phone
    if (!/^\d{10,}$/.test(data.phone.replace(/\D/g, ''))) {
        errorMessage.textContent = 'Please enter a valid phone number';
        return false;
    }
    
    return true;
}

async function sendBookingEmails(bookingData) {
    // Send confirmation to customer
    await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.bookingTemplate,
        {
            to_email: bookingData.email,
            customer_name: bookingData.name,
            service_type: bookingData.service,
            appointment_date: bookingData.date,
            appointment_time: bookingData.time
        }
    );
    
    // Send notification to business
    await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.bookingTemplate,
        {
            to_email: config.site.email,
            customer_name: bookingData.name,
            customer_email: bookingData.email,
            customer_phone: bookingData.phone,
            service_type: bookingData.service,
            appointment_date: bookingData.date,
            appointment_time: bookingData.time
        }
    );
}

function updatePaymentSummary(bookingData) {
    const elements = {
        'service-name': bookingData.service,
        'booking-date': bookingData.date,
        'booking-time': bookingData.time,
        'total-amount': calculateAmount(bookingData.service)
    };
    
    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = id === 'total-amount' ? `$${value}` : value;
        }
    }
}

function calculateAmount(service) {
    const prices = {
        'Classic Lashes': 80,
        'Volume Lashes': 100,
        'Hybrid Lashes': 90
    };
    return prices[service] || 0;
}

function initiatePayment(bookingData) {
    const amount = calculateAmount(bookingData.service);
    
    PaystackPop.setup({
        key: config.paystack.publicKey,
        email: bookingData.email,
        amount: amount * 100,
        currency: 'NGN',
        ref: 'DEE' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function(response) {
            if (response.status === 'success') {
                handleSuccessfulPayment(bookingData, response);
            }
        },
        onClose: function() {
            alert('Transaction cancelled');
        }
    }).openIframe();
}

async function handleSuccessfulPayment(bookingData, paymentResponse) {
    try {
        // Send payment confirmation emails
        await sendPaymentEmails(bookingData, paymentResponse);
        
        // Clear booking data and redirect
        localStorage.removeItem('bookingData');
        window.location.href = 'confirmation.html';
    } catch (error) {
        console.error('Error processing payment:', error);
        alert('Payment successful but failed to send confirmation. Please contact support.');
        window.location.href = 'confirmation.html';
    }
}

async function sendPaymentEmails(bookingData, paymentResponse) {
    const emailData = {
        customer_name: bookingData.name,
        service_type: bookingData.service,
        amount_paid: calculateAmount(bookingData.service),
        transaction_id: paymentResponse.reference,
        appointment_date: bookingData.date,
        appointment_time: bookingData.time
    };
    
    // Send confirmation to customer
    await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.paymentTemplate,
        {
            to_email: bookingData.email,
            ...emailData
        }
    );
    
    // Send notification to business
    await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.paymentTemplate,
        {
            to_email: config.site.email,
            customer_email: bookingData.email,
            customer_phone: bookingData.phone,
            ...emailData
        }
    );
}

