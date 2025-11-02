import { useState } from 'react';
import { useApp } from '../context/AppContext';

const AuthModal = () => {
  const { showAuthModal, authMode, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  if (!showAuthModal) return null;

  const handleClose = () => {
    dispatch({ type: 'HIDE_AUTH_MODAL' });
    setCurrentStep(1);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      address: { street: '', city: '', state: '', pincode: '' }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    dispatch({ 
      type: 'SET_USER', 
      payload: { 
        name: formData.name || 'User',
        email: formData.email,
        phone: formData.phone 
      } 
    });
    handleClose();
  };

  const handleSignupNext = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete signup
      dispatch({ 
        type: 'SET_USER', 
        payload: { 
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        } 
      });
      handleClose();
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter your email or phone"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter your password"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        Login
      </button>
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AUTH_MODE', payload: 'signup' })}
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          Sign up
        </button>
      </p>
    </form>
  );

  const renderSignupStep1 = () => (
    <form onSubmit={handleSignupNext} className="space-y-4">
      <div className="text-center mb-4">
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-2 bg-orange-500 rounded"></div>
          <div className="w-8 h-2 bg-gray-200 rounded"></div>
          <div className="w-8 h-2 bg-gray-200 rounded"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Step 1 of 3: Basic Information</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter your full name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter your phone number"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        Next Step
      </button>
    </form>
  );

  const renderSignupStep2 = () => (
    <form onSubmit={handleSignupNext} className="space-y-4">
      <div className="text-center mb-4">
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-2 bg-orange-500 rounded"></div>
          <div className="w-8 h-2 bg-orange-500 rounded"></div>
          <div className="w-8 h-2 bg-gray-200 rounded"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Step 2 of 3: Security</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Create a password"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Confirm your password"
          required
        />
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Next Step
        </button>
      </div>
    </form>
  );

  const renderSignupStep3 = () => (
    <form onSubmit={handleSignupNext} className="space-y-4">
      <div className="text-center mb-4">
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-2 bg-orange-500 rounded"></div>
          <div className="w-8 h-2 bg-orange-500 rounded"></div>
          <div className="w-8 h-2 bg-orange-500 rounded"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">Step 3 of 3: Delivery Address</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
        <input
          type="text"
          name="address.street"
          value={formData.address.street}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter your street address"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="City"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="State"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
        <input
          type="text"
          name="address.pincode"
          value={formData.address.pincode}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter pincode"
          required
        />
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Complete Signup
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {authMode === 'login' ? 'Welcome Back!' : 'Join Hotel Dhanlakshmi'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {authMode === 'login' && renderLoginForm()}
          {authMode === 'signup' && currentStep === 1 && renderSignupStep1()}
          {authMode === 'signup' && currentStep === 2 && renderSignupStep2()}
          {authMode === 'signup' && currentStep === 3 && renderSignupStep3()}

          {authMode === 'signup' && (
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'SET_AUTH_MODE', payload: 'login' });
                  setCurrentStep(1);
                }}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
