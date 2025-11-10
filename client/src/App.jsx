import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import CheckoutNew from './pages/CheckoutNew';
import OrderSuccess from './pages/OrderSuccess';
import CreateAccount from './pages/CreateAccount';
import OrderTracking from './pages/OrderTracking';
import TrackOrder from './pages/TrackOrder';
import UnderProgress from './components/UnderProgress';
import Debug from './pages/Debug';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AllOrders from './pages/AllOrders';
import SmartRouter from './components/SmartRouter';
import ContactPage from './components/ContactPages';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <SmartRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutNew />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/track-order/:orderId" element={<OrderTracking />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/orders" element={<AllOrders />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/debug" element={<Debug />} />
              <Route path="/about" element={<UnderProgress pageName="About Us" />} /> 
              <Route path="/contact" element={<ContactPage pageName="Contact Us" />} />
            </Routes>
          </SmartRouter>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
