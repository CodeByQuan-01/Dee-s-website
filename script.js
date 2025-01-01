document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('booking-form');
    const formMessage = document.getElementById('form-message');

    // Initialize EmailJS
    (function() {
        emailjs.init("YOUR_USER_ID"); // Replace with your actual EmailJS user ID
    })();

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Send email using EmailJS
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", data)
            .then(function(response) {
                formMessage.textContent = "Thank you! Your booking request has been sent. We'll get back to you shortly.";
                formMessage.style.color = "green";
                form.reset();
            }, function(error) {
                formMessage.textContent = "Oops! Something went wrong. Please try again later.";
                formMessage.style.color = "red";
            });
    });
});

