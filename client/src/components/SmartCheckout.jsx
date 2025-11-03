import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SmartCheckout = () => {
  const { userInfo } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is verified
    if (userInfo.isVerified && userInfo.mobile && userInfo.deliveryAddress?.name) {
      // User is verified, go to quick checkout
      navigate('/quick-checkout', { replace: true });
    } else {
      // User needs verification, go to setup
      navigate('/setup', { replace: true });
    }
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to checkout...</p>
      </div>
    </div>
  );
};

export default SmartCheckout;
