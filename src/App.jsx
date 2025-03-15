import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CouponProvider } from './context/CouponContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import CouponManager from "./components/Admin/CouponManager"
import ClaimHistory from './components/Admin/ClaimHistory';


// Add this ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CouponProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
                <Route 
                  path="/admin/coupons" 
                  element={
                    <ProtectedRoute>
                      <CouponManager />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/history" 
                  element={
                    <ProtectedRoute>
                      <ClaimHistory />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CouponProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;