import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SmartRouter = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    const currentPath = location.pathname;
    
    // If admin is logged in
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        // Check if session is expired (24 hours)
        if (hoursDiff > 24) {
          localStorage.removeItem('admin_session');
          // If trying to access admin pages with expired session, redirect to login
          if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
            navigate('/admin/login', { replace: true });
          }
        } else {
          // Valid admin session exists
          // If admin tries to access non-admin pages, redirect to dashboard
          if (!currentPath.startsWith('/admin')) {
            navigate('/admin/dashboard', { replace: true });
          }
          // If admin tries to access login page while logged in, redirect to dashboard
          else if (currentPath === '/admin/login') {
            navigate('/admin/dashboard', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error parsing admin session:', error);
        localStorage.removeItem('admin_session');
      }
    } else {
      // No admin session - protect admin routes
      if (currentPath.startsWith('/admin') && currentPath !== '/admin/login') {
        navigate('/admin/login', { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  return children;
};

export default SmartRouter;
