const { useState, useEffect } = React;

const ServiceOption = ({ service, onSelect, isSelected }) => (
    <div 
        className={`service-item ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(service)}
    >
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <p className="price">${service.price}</p>
    </div>
);

const BookingForm = ({ selectedService, onBookingComplete }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the booking data to your server
        console.log('Booking submitted:', { ...formData, service: selectedService });
        onBookingComplete();
    };

    return (
        <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="time">Time</label>
                <input
                    type="time"
                    id="time"
                    name="time"
                    className="form-control"
                    value={formData.time}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="btn">Book Appointment</button>
        </form>
    );
};

const PaymentForm = ({ amount, onPaymentComplete }) => {
    const handlePayment = () => {
        FlutterwaveCheckout({
            public_key: "FLUTTERWAVE_PUBLIC_KEY",
            tx_ref: Date.now(),
            amount: amount,
            currency: "NGN",
            payment_options: "card,mobilemoney,ussd",
            customer: {
                email: "user@example.com",
                phone_number: "08102909304",
                name: "John Doe",
            },
            callback: function (data) {
                console.log(data);
                if (data.status === "successful") {
                    onPaymentComplete();
                }
            },
            onclose: function() {
                // close modal
            },
            customizations: {
                title: "Dee Aesthetics",
                description: "Payment for services",
                logo: "https://assets.piedpiper.com/logo.png",
            },
        });
    };

    return (
        <div className="payment-form">
            <h2>Payment</h2>
            <p>Total Amount: ${amount}</p>
            <button onClick={handlePayment} className="btn">Pay Now</button>
        </div>
    );
};

const App = () => {
    const [step, setStep] = useState('services');
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        { id: 1, name: 'Classic Lashes', description: 'Natural-looking lash enhancement', price: 80 },
        { id: 2, name: 'Volume Lashes', description: 'Fuller, more dramatic look', price: 100 },
        { id: 3, name: 'Hybrid Lashes', description: 'Best of both classic and volume', price: 90 },
    ];

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setStep('booking');
    };

    const handleBookingComplete = () => {
        setStep('payment');
    };

    const handlePaymentComplete = () => {
        setStep('confirmation');
    };

    return (
        <div className="container">
            <div className="logo">
                <img src="/placeholder.svg?height=150&width=150" alt="Dee Aesthetics Logo" />
            </div>
            <p className="tagline">Flawless Lashes for Every Occasion</p>

            {step === 'services' && (
                <section className="services">
                    <h2>Our Services</h2>
                    {services.map(service => (
                        <ServiceOption
                            key={service.id}
                            service={service}
                            onSelect={handleServiceSelect}
                            isSelected={selectedService && selectedService.id === service.id}
                        />
                    ))}
                </section>
            )}

            {step === 'booking' && (
                <BookingForm
                    selectedService={selectedService}
                    onBookingComplete={handleBookingComplete}
                />
            )}

            {step === 'payment' && (
                <PaymentForm
                    amount={selectedService.price}
                    onPaymentComplete={handlePaymentComplete}
                />
            )}

            {step === 'confirmation' && (
                <div className="confirmation">
                    <h2>Booking Confirmed!</h2>
                    <p>Thank you for choosing Dee Aesthetics. We look forward to seeing you soon!</p>
                </div>
            )}

            <section className="contact">
                <h2>Contact Us</h2>
                <p>Phone: (123) 456-7890</p>
                <p>Email: info@deeaesthetics.com</p>
                <div className="social-icons">
                    <a href="#" target="_blank" rel="noopener noreferrer"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg" alt="Instagram" /></a>
                    <a href="#" target="_blank" rel="noopener noreferrer"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/facebook.svg" alt="Facebook" /></a>
                    <a href="#" target="_blank" rel="noopener noreferrer"><img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/tiktok.svg" alt="TikTok" /></a>
                </div>
            </section>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));

