import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_ENDPOINTS } from '../config/api';

const UserSetup = () => {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP, 3: Address
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: 'Maharashtra',
    pincode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sentOtp, setSentOtp] = useState('');

  const validateMobile = (mobile) => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!address.name.trim()) newErrors.name = 'Name is required';
    if (!address.street.trim()) newErrors.street = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = 'Valid 6-digit pincode required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateMobile(mobile)) {
      setErrors({ mobile: 'Please enter a valid 10-digit mobile number' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(API_ENDPOINTS.SEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });

      const data = await response.json();
      
      if (data.success) {
        setSentOtp(data.otp || ''); // For development
        setStep(2);
      } else {
        setErrors({ mobile: data.error || 'Failed to send OTP' });
      }
    } catch (error) {
      setErrors({ mobile: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter 6-digit OTP' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
      });

      const data = await response.json();
      
      if (data.success) {
        setStep(3);
      } else {
        setErrors({ otp: data.error || 'Invalid OTP' });
      }
    } catch (error) {
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSetup = () => {
    if (!validateAddress()) return;

    // Save user as verified
    const userData = {
      mobile,
      deliveryAddress: address,
      isVerified: true,
      verifiedAt: new Date().toISOString()
    };

    dispatch({
      type: 'SET_USER_VERIFIED',
      payload: userData
    });

    // Redirect to menu or cart
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 maharashtrian-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-traditional">
            <span className="text-3xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Hotel Dhanlakshmi
          </h1>
          <p className="text-gray-600 marathi-text">
            हॉटेल धनलक्ष्मी मध्ये आपले स्वागत आहे
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            3
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-traditional p-6">
          {/* Step 1: Mobile Number */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📱 Enter Mobile Number
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                We'll send you an OTP to verify your number
              </p>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.mobile ? 'border-red-500' : 'border-gray-200'
                    }`}
                    maxLength="10"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={isLoading || !mobile}
                  className="w-full maharashtrian-gradient hover:shadow-glow text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🔐 Verify OTP
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Enter the 6-digit OTP sent to +91 {mobile}
              </p>

              {sentOtp && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-700 text-sm">
                    <strong>Development Mode:</strong> Your OTP is {sentOtp}
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all text-center text-lg tracking-widest ${
                      errors.otp ? 'border-red-500' : 'border-gray-200'
                    }`}
                    maxLength="6"
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || !otp}
                    className="flex-1 maharashtrian-gradient hover:shadow-glow text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🏠 Delivery Address
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                This will be your default delivery address
              </p>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={address.name}
                    onChange={(e) => setAddress({...address, name: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <textarea
                    placeholder="Street Address"
                    value={address.street}
                    onChange={(e) => setAddress({...address, street: e.target.value})}
                    rows="3"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.street ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                        errors.city ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={address.pincode}
                      onChange={(e) => setAddress({...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                        errors.pincode ? 'border-red-500' : 'border-gray-200'
                      }`}
                      maxLength="6"
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({...address, state: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCompleteSetup}
                    className="flex-1 maharashtrian-gradient hover:shadow-glow text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Complete Setup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            This is a one-time setup. Your information will be saved for future orders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSetup;
