import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsStarFill, BsStar, BsTrash } from 'react-icons/bs';
import AdminSidebar from './admin-sidebar';

function AdminRatings() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admin/ratings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setRatings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ratings');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [token]);

  const handleDeleteRating = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/admin/ratings/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRatings(prev => prev.filter(rating => rating._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete rating');
      console.error('Delete error:', err);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < rating ? 
        <BsStarFill key={i} className="star-filled" /> : 
        <BsStar key={i} className="star-empty" />
    ));
  };

  if (loading) return <div className="admin-loading">Loading ratings...</div>;

  return (
    <div className="admin-container">
      <AdminSidebar 
        openSidebarToggle={sidebarOpen}
        OpenSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="admin-content-container">
        <div className="admin-ratings-container">
          <h2>User Ratings & Feedback</h2>
          
          {error && <div className="admin-error-message">{error}</div>}

          <div className="ratings-table-container">
            <table className="admin-ratings-table">
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map(rating => (
                  <tr key={rating._id}>
                    <td>
                      <div className="star-rating">
                        {renderStars(rating.rating)}
                      </div>
                    </td>
                    <td>{rating.comment || 'No comment'}</td>
                    <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="admin-button danger"
                        onClick={() => handleDeleteRating(rating._id)}
                      >
                        <BsTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRatings;