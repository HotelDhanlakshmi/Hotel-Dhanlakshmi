import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SmartRouter = ({ children }) => {
  const { userInfo } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data indicates admin
    const adminSession = localStorage.getItem('admin_session');
    const isAdminMobile = ['9876543210', '8765432109'].includes(userInfo.mobile);
    
    // If admin session exists or user mobile is admin mobile, redirect to admin
    if (adminSession || (userInfo.isVerified && isAdminMobile)) {
      const currentPath = window.location.pathname;
      
      // Don't redirect if already on admin pages
      if (!currentPath.startsWith('/admin')) {
        console.log('Admin detected, redirecting to admin panel');
        navigate('/admin/dashboard', { replace: true });
        return;
      }
    }
  }, [userInfo, navigate]);

  return children;
};

export default SmartRouter;
