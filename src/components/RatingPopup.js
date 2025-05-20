import React, { useState } from 'react';
import axios from 'axios';
import './RatingPopup.css';

const RatingPopup = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    const API_URL = 'http://localhost:3001/api/ratings';
    console.log('Making request to:', API_URL);
  
    try {
      const response = await axios.post(
        API_URL,
        {
          rating,
          comment,
          pageUrl: window.location.pathname
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Success:', response.data);
      onClose();
    } catch (err) {
      console.error('Full error:', {
        message: err.message,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        },
        response: err.response?.data
      });
      alert('Submission failed. See console for details.');
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

export default RatingPopup;