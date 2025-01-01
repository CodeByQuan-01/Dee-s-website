document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('booking-form');

    // Initialize EmailJS
    emailjs.init("YOUR_USER_ID"); // Replace with your actual EmailJS user ID

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Send email using EmailJS
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", data)
            .then(function(response) {
                alert("Thank you! Your booking request has been sent. We'll get back to you shortly.");
                form.reset();
                // Here you can add code to initiate Flutterwave payment
                initiateFlutterwavePayment(data);
            }, function(error) {
                alert("Oops! Something went wrong. Please try again later.");
            });
    });

    function initiateFlutterwavePayment(bookingData) {
        FlutterwaveCheckout({
            public_key: "FLUTTERWAVE_PUBLIC_KEY",
            tx_ref: Date.now(),
            amount: calculateAmount(bookingData.service),
            currency: "NGN",
            payment_options: "card,mobilemoney,ussd",
            customer: {
                email: bookingData.email,
                phone_number: bookingData.phone,
                name: bookingData.name,
            },
            callback: function (response) {
                if (response.status === "successful") {
                    alert("Payment successful! Your booking is confirmed.");
                } else {
                    alert("Payment failed. Please try again.");
                }
            },
            onclose: function() {
                // Handle modal close
            },
            customizations: {
                title: "Dee Aesthetics",
                description: "Payment for lash services",
                logo: "https://your-logo-url.com/logo.png",
            },
        });
    }

    function calculateAmount(service) {
        const prices = {
            "Classic Lashes": 80,
            "Volume Lashes": 100,
            "Hybrid Lashes": 90
        };
        return prices[service] || 0;
    }
});

