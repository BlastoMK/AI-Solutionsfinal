import React, { useState } from 'react';
import { BsSave, BsX } from 'react-icons/bs';
import axios from 'axios';

export default function CreateEventForm({ onClose, onEventCreated, existingEvent }) {
  const [formData, setFormData] = useState(existingEvent || {
    title: '',
    date: '',
    description: '',
    maxAttendees: 50,
    location: 'Virtual'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      let response;
      
      if (existingEvent) {
        // Update existing event
        response = await axios.put(
          `/api/admin/events/${existingEvent._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        // Create new event
        response = await axios.post(
          '/api/admin/events',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }

      setSuccess(true);
      setTimeout(() => {
        onEventCreated(response.data);
        onClose();
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 
        `Failed to ${existingEvent ? 'update' : 'create'} event. Please try again.`);
      console.error('Event error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxAttendees' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form-container">
        <div className="form-header">
          <h2>{existingEvent ? 'Edit Event' : 'Create New Event'}</h2>
          <button onClick={onClose} className="close-btn">
            <BsX size={24} />
          </button>
        </div>
        
        {success ? (
          <div className="success-message">
            <p>Event {existingEvent ? 'updated' : 'created'} successfully!</p>
          </div>
        ) : (
          <>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  minLength={5}
                />
              </div>

              <div className="form-group">
                <label>Date & Time*</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Max Attendees*</label>
                <input
                  type="number"
                  name="maxAttendees"
                  min="1"
                  max="1000"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location*</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="Virtual">Virtual</option>
                  <option value="Physical">Physical</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  minLength={20}
                  rows={4}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    existingEvent ? 'Updating...' : 'Creating...'
                  ) : (
                    <>
                      <BsSave /> {existingEvent ? 'Update Event' : 'Create Event'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}