import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CreateAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo, dispatch } = useApp();

    const [formData, setFormData] = useState({
        name: userInfo.deliveryAddress?.name || '',
        mobile: userInfo.mobile || '',
        email: userInfo.email || '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isCreating, setIsCreating] = useState(false);

    // Check if user came from order
    const fromOrder = location.state?.fromOrder;
    const orderData = location.state?.orderData;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid 10-digit mobile number';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateAccount = async () => {
        if (!validateForm()) return;

        setIsCreating(true);

        try {
            // For now, just mark user as verified and save info
            // In production, you'd create account on backend
            dispatch({
                type: 'SET_USER_VERIFIED',
                payload: {
                    mobile: formData.mobile,
                    email: formData.email,
                    deliveryAddress: userInfo.deliveryAddress,
                    isVerified: true,
                    verifiedAt: new Date().toISOString()
                }
            });

            // Show success message
            alert('Account created successfully! You can now track all your orders.');

            // Navigate to orders page or home
            if (fromOrder && orderData) {
                navigate(`/track-order/${orderData.orderId}`);
            } else {
                navigate('/orders');
            }
        } catch (error) {
            console.error('Account creation error:', error);
            alert('Failed to create account. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleSkip = () => {
        if (fromOrder && orderData) {
            navigate(`/track-order/${orderData.orderId}`);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">👤</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
                    <p className="text-gray-600">
                        {fromOrder
                            ? 'Quick account setup to track your orders'
                            : 'Join us for a better experience'
                        }
                    </p>
                </div>

                {/* Benefits */}
                {fromOrder && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-green-800 mb-2">✨ Account Benefits:</h3>
                        <ul className="space-y-1 text-sm text-green-700">
                            <li>✓ Track all your orders</li>
                            <li>✓ Faster checkout</li>
                            <li>✓ Order history</li>
                            <li>✓ Exclusive offers</li>
                        </ul>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${errors.name ? 'border-red-500' : 'border-gray-200'
                                    }`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="10-digit mobile number"
                                value={formData.mobile}
                                onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${errors.mobile ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                maxLength="10"
                                disabled={userInfo.mobile} // Disable if already set
                            />
                            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'
                                    }`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'
                                    }`}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                                    }`}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col space-y-3 pt-4">
                            <button
                                onClick={handleCreateAccount}
                                disabled={isCreating}
                                className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform shadow-md hover:shadow-lg ${isCreating
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:scale-105 active:scale-95'
                                    }`}
                            >
                                {isCreating ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            <button
                                onClick={handleSkip}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                Skip for Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    By creating an account, you agree to our{' '}
                    <a href="/terms" className="text-orange-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default CreateAccount;
