document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters to populate booking summary
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service') || 'Classic Lashes';
    const date = urlParams.get('date') || 'January 3, 2024';
    const time = urlParams.get('time') || '2:00 PM';
    const amount = getServicePrice(service);

    // Update booking summary
    document.getElementById('service-name').textContent = service;
    document.getElementById('booking-date').textContent = date;
    document.getElementById('booking-time').textContent = time;
    document.getElementById('total-amount').textContent = `$${amount.toFixed(2)}`;

    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initialize payment button
    const payButton = document.getElementById('payment-button');
    payButton.addEventListener('click', initiatePayment);
});

function getServicePrice(service) {
    const prices = {
        'Classic Lashes': 80,
        'Volume Lashes': 100,
        'Hybrid Lashes': 90
    };
    return prices[service] || 80;
}

function selectPaymentMethod(method) {
    console.log(`Selected payment method: ${method}`);
    // Additional logic for payment method selection
}

function initiatePayment() {
    const amount = parseFloat(document.getElementById('total-amount').textContent.replace('$', ''));
    const service = document.getElementById('service-name').textContent;

    FlutterwaveCheckout({
        public_key: "FLUTTERWAVE_PUBLIC_KEY", // Replace with your actual public key
        tx_ref: Date.now(),
        amount: amount,
        currency: "NGN",
        payment_options: "card,banktransfer,ussd",
        customer: {
            email: "customer@email.com",  // This should be dynamically populated from booking form
            phone_number: "08102909304",  // This should be dynamically populated from booking form
            name: "John Doe",            // This should be dynamically populated from booking form
        },
        callback: function(response) {
            if (response.status === "successful") {
                // Handle successful payment
                alert("Payment successful! Your booking is confirmed.");
                window.location.href = "confirmation.html";
            } else {
                // Handle failed payment
                alert("Payment failed. Please try again.");
            }
        },
        onclose: function() {
            // Handle modal close
        },
        customizations: {
            title: "Dee Aesthetics",
            description: `Payment for ${service}`,
            logo: "https://your-logo-url.com/logo.png",
        },
    });
}

