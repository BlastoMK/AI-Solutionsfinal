import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Component } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Pages } from "./components/pages/Pages";
import AdminApp from "./components/Admin/admin-app";
import LoginPage from "./components/Admin/LoginPage";
import "./App.css";
import AdminRatings from './components/Admin/AdminRatings'; // Updated path to match your structure
import "./components/RatingPopup.css";
import axios from "axios";

// Rating Popup Component
const RatingPopup = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post('/api/ratings', {
        rating,
        comment,
        pageUrl: window.location.pathname
      });
      onClose();
    } catch (err) {
      console.error("Rating submission failed:", err);
    }
  };

  return (
    <div className="rating-popup">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>How's your experience so far?</h3>
        <div className="star-rating-horizontal">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <button
                key={index}
                type="button"
                className={starValue <= (hover || rating) ? "star on" : "star off"}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
                aria-label={`Rate ${starValue} star`}
              >
                ★
              </button>
            );
          })}
        </div>
        <textarea
          className="rating-comment"
          placeholder="Optional feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength="200"
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Rating
        </button>
      </div>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Auth Hook
function useAdminAuth() {
  const token = localStorage.getItem("adminToken");
  const adminString = localStorage.getItem("adminUser");
  
  try {
    const admin = adminString ? JSON.parse(adminString) : null;
    return {
      isAuthenticated: !!token && admin?.role === "admin",
      admin: admin || {}
    };
  } catch (e) {
    console.error("Failed to parse admin data:", e);
    return { isAuthenticated: false, admin: {} };
  }
}

// Protected Route Component
function RequireAdmin({ children }) {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}




// Main App Component
function App() {
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true
    });
    AOS.refresh();

    const timer = setTimeout(() => {
      if (!window.location.pathname.startsWith('/admin')) {
        setShowRatingPopup(true);
      }
    }, 30000); // 30 second delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        {/* Rating Popup */}
        {showRatingPopup && !window.location.pathname.startsWith('/admin') && (
          <RatingPopup onClose={() => setShowRatingPopup(false)} />
        )}

        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={<Pages />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Admin Auth Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminApp />
              </RequireAdmin>
            }
          />
          
          {/* Specific Protected Admin Route for Ratings */}
          <Route
            path="/admin/ratings"
            element={
              <RequireAdmin>
                <AdminRatings />
              </RequireAdmin>
            }
          />
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;