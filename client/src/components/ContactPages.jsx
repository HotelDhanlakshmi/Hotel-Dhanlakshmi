import { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  // --- State for the contact form ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add your logic to send this form data to your server or an email service
    console.log("Form Data Submitted:", formData);
    alert('Thank you for your message! We will get back to you soon.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-12">
          <div className="marathi-heading text-3xl md:text-4xl mb-4 gradient-text">
            📞 आमच्याशी संपर्क साधा 📞
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question or want to book a party? Fill out the form below or give us a call.
          </p>
          <div className="marathi-text text-lg mt-2 text-orange-600">
            आम्ही तुमच्याकडून ऐकण्यास उत्सुक आहोत!
          </div>
        </div>

        {/* --- Main Content: Form & Details --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* --- Column 1: Contact Form --- */}
          <div className="maharashtrian-card bg-white p-8 rounded-xl shadow-traditional">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name (पूर्ण नाव)</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address (ईमेल)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (फोन नंबर)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject (विषय)</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (संदेश)</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full maharashtrian-gradient hover:shadow-glow text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-traditional"
                >
                  Send Message (संदेश पाठवा)
                </button>
              </div>
            </form>
          </div>

          {/* --- Column 2: Contact Details --- */}
          <div className="space-y-8">
            <div className="maharashtrian-card bg-white p-8 rounded-xl shadow-traditional">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Address</h3>
              <p className="text-lg text-gray-600 mb-4">
                {/* --- Add your hotel's full address here --- */}
                123, Main Road, Near Landmark,
                <br />
                Nagpur, Maharashtra - 440001
              </p>
              <a 
                href="#map-location" // This links to the map section below
                className="font-semibold text-orange-600 hover:underline"
              >
                Get Directions (दिशा-निर्देश मिळवा) &rarr;
              </a>
            </div>
            
            <div className="maharashtrian-card bg-white p-8 rounded-xl shadow-traditional">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Call Us</h3>
              <p className="text-lg text-gray-600 mb-2">
                <strong>Reservations (बुकिंग):</strong>
                <br />
                <a href="tel:+919876543210" className="text-orange-600 hover:underline">+91 98765 43210</a>
              </p>
              <p className="text-lg text-gray-600">
                <strong>Front Desk (रिसेप्शन):</strong>
                <br />
                <a href="tel:07122345678" className="text-orange-600 hover:underline">0712-2345678</a>
              </p>
            </div>

            <div className="maharashtrian-card bg-white p-8 rounded-xl shadow-traditional">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Restaurant Hours</h3>
              <p className="text-lg text-gray-600">
                <strong>Monday - Sunday:</strong>
                <br />
                8:00 AM - 11:00 PM
              </p>
              <p className="text-lg text-gray-600 mt-2 marathi-text">
                (आठवड्याचे सर्व दिवस)
              </p>
            </div>
          </div>
        </div>

        {/* --- Map Section --- */}
        <div id="map-location" className="mt-16">
          <div className="maharashtrian-card bg-white p-8 rounded-xl shadow-traditional">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Find Us Here</h2>
              <div className="marathi-heading text-xl text-orange-600">
                आमचे स्थान
              </div>
            </div>
            
            {/* --- PASTE YOUR IFRAME CODE HERE ---
              Get this from Google Maps -> Share -> Embed a map
              It will look like <iframe src="..."></iframe>
            */}
            <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden relative">
              {/* This is a placeholder. Your iframe will replace this. */}
              {/* <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Your Google Map Will Load Here
              </div> */}
              
              {/* --- Example of what you will paste (Replace with your link) --- */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.5451993209!2d79.02115167667527!3d21.16113164024873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a3116a4f%3A0x6d9531d45c6de8b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1678888888888!5m2!1sen!2sin" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;