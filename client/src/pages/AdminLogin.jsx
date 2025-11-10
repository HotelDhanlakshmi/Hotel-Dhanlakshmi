import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sentOtp, setSentOtp] = useState('');

  const validateMobile = (mobile) => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

  const handleSendOtp = async () => {
    if (!validateMobile(mobile)) {
      setErrors({ mobile: 'Please enter a valid 10-digit mobile number' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5000/api/admin/send-otp', {
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
      const response = await fetch('http://localhost:5000/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
      });

      const data = await response.json();
      
      if (data.success) {
        // Save admin session
        localStorage.setItem('admin_session', JSON.stringify({
          mobile,
          loginTime: new Date().toISOString(),
          token: data.token
        }));
        
        navigate('/admin/dashboard');
      } else {
        setErrors({ otp: data.error || 'Invalid OTP' });
      }
    } catch (error) {
      setErrors({ otp: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-3xl">👨‍💼</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-orange-100 marathi-text">
            हॉटेल धनलक्ष्मी प्रशासन
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6">
          {/* Step 1: Mobile Number */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🔐 Admin Login
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Enter your registered admin mobile number
              </p>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="tel"
                    placeholder="Enter admin mobile number"
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
                🔐 Verify Admin OTP
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
                      'Login'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-orange-100 text-sm">
            Only authorized admin mobile numbers can access this panel
          </p>
          <button
            onClick={() => navigate('/')}
            className="text-orange-200 hover:text-white text-sm underline mt-2"
          >
            ← Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
