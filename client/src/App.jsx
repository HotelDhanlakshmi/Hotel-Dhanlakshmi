import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import TrackOrder from './pages/TrackOrder';
import UnderProgress from './components/UnderProgress';
import OtpModal from './components/OtpModal';
import Debug from './pages/Debug';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track-order/:orderId" element={<OrderTracking />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/debug" element={<Debug />} />
            <Route path="/about" element={<UnderProgress pageName="About Us" />} />
            <Route path="/contact" element={<UnderProgress pageName="Contact Us" />} />
          </Routes>
          <OtpModal />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
