import { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // --- State for submission ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // null, 'success', or 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- UPDATED SUBMIT FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    try {
      // --- YOUR FORMSPREE LINK IS PASTED HERE ---
      const response = await fetch('https://formspree.io/f/xpwogrny', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
                  disabled={isSubmitting} // --- Disable button when sending ---
                  className="w-full maharashtrian-gradient hover:shadow-glow text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-traditional disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message (संदेश पाठवा)'}
                </button>
              </div>

              {/* --- Show success or error messages --- */}
              {formStatus === 'success' && (
                <p className="text-green-600 text-center">
                  Thank you! Your message has been sent. (तुमचा संदेश पाठवला आहे!)
                </p>
              )}
              {formStatus === 'error' && (
                <p className="text-red-600 text-center">
                  Something went wrong. Please try again. (काहीतरी चूक झाली आहे.)
                </p>
              )}

            </form>
          </div>

          {/* --- Column 2: Contact Details --- */}
          <div className="space-y-8">
            <div className="maharashtrian-card bg-white p-8 rounded-xl shadow-traditional">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Address</h3>
              <p className="text-lg text-gray-600 mb-4">
                Nagar Manmad Road, SH 10,
                <br />
                Rahuri Factory, Maharashtra 413706
              </p>
              <a
                href="#map-location"
                className="font-semibold text-orange-600 hover:underline"
              >
                Get Directions (दिशा-निर्देश मिळवा) →
              </a>
            </div>

            <div className="maharashtrian-card bg-white p-8 rounded-xl shadow-traditional">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Call Us</h3>
              <p className="text-lg text-gray-600 mb-2">
                <strong>Contact (संपर्क):</strong>
                <br />
                {/* --- TODO: Remember to add your real phone number --- */}
                <a href="tel:+919876543210" className="text-orange-600 hover:underline">+91 98765 43210</a>
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

            <div className="w-full rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.9342049029583!2d74.4395874!3d20.2615633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc25ba69a61b87%3A0xcd372971a493642!2sMH%20SH%2010%20%26%20Nagar%20Manmad%20Hwy%2C%20Bardiya%20Nagar%2C%20Manmad%2C%20Maharashtra%20423104!5e0!3m2!1sen!2sin!4v1762800563042!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Dhanlakshmi Location - Kopargaon, Maharashtra"
              ></iframe>
            </div>

            <div className="mt-6 text-center">
              <a
                href="https://maps.app.goo.gl/6oKTuajce6rayvCRA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <span>📍</span>
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;