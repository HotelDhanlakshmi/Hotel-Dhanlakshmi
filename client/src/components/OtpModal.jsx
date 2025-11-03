import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const OtpModal = () => {
  const { showOtpModal, otpData, dispatch } = useApp();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (showOtpModal && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOtpModal, timer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('कृपया 6 अंकी OTP टाका • Please enter 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Mock OTP verification (in real app, call API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, accept any 6-digit OTP
      if (otpString.length === 6) {
        dispatch({ type: 'VERIFY_OTP_SUCCESS' });
        
        // Create order
        const orderAction = {
          type: 'CREATE_ORDER',
          payload: {
            mobile: otpData.mobile,
            items: otpData.orderData.items,
            total: otpData.orderData.total,
            address: otpData.orderData.address
          }
        };
        
        dispatch(orderAction);
        
        // Navigate to order tracking after a short delay
        setTimeout(() => {
          const orderId = `ORD${Date.now()}`;
          navigate(`/track-order/${orderId}`);
        }, 1000);
      } else {
        setError('अवैध OTP • Invalid OTP');
      }
    } catch (err) {
      setError('OTP सत्यापन अयशस्वी • OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    // Mock resend OTP
    console.log('OTP resent to:', otpData.mobile);
  };

  const handleClose = () => {
    dispatch({ type: 'HIDE_OTP_MODAL' });
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimer(30);
    setCanResend(false);
  };

  if (!showOtpModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="maharashtrian-card rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 maharashtrian-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-saffron">
            <span className="text-white text-2xl">📱</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">OTP Verification</h2>
          <div className="marathi-text text-orange-600 mb-2">OTP सत्यापन</div>
          <p className="text-gray-600 text-sm">
            OTP sent to <span className="font-semibold text-orange-600">{otpData.mobile}</span>
          </p>
          <p className="marathi-text text-gray-500 text-xs mt-1">
            {otpData.mobile} वर OTP पाठवला आहे
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4">
              {error}
            </div>
          )}

          {/* Timer */}
          <div className="text-center text-sm text-gray-500 mb-4">
            {timer > 0 ? (
              <span>Resend OTP in {timer}s • {timer} सेकंदात पुन्हा पाठवा</span>
            ) : (
              <button
                onClick={handleResendOtp}
                className="text-orange-600 hover:text-orange-700 font-medium"
                disabled={isLoading}
              >
                Resend OTP • OTP पुन्हा पाठवा
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all"
            disabled={isLoading}
          >
            Cancel • रद्द करा
          </button>
          <button
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.join('').length !== 6}
            className="flex-1 maharashtrian-gradient hover:shadow-glow text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify • सत्यापित करा'
            )}
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 text-sm">🔒</span>
            <div className="text-xs text-yellow-700">
              <div className="font-medium">Security Notice • सुरक्षा सूचना</div>
              <div className="mt-1">
                Never share your OTP with anyone • आपला OTP कोणाशी शेअर करू नका
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
