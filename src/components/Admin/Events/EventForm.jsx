import React, { useState } from 'react';
import { BsSave, BsX, BsCheck } from 'react-icons/bs';
import axios from 'axios';

// Available image options with preview paths
const IMAGE_OPTIONS = [
  { value: 'ai-event.jpg', label: 'AI Event', preview: '/images/events/ai-event.jpg' },
  { value: 'workshop.jpg', label: 'Workshop', preview: '/images/events/workshop.jpg' },
  { value: 'conference.jpg', label: 'Conference', preview: '/images/events/conference.jpg' },
  { value: 'default.jpg', label: 'General Event', preview: '/images/events/default.jpg' }
];

export default function EventForm({ 
  onClose, 
  onSubmit,
  existingEvent,
  isProcessing 
}) {
  const [formData, setFormData] = useState(existingEvent || {
    title: '',
    date: '',
    description: '',
    maxAttendees: 50,
    location: 'Virtual',
    cover: 'default.jpg'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };

      const response = existingEvent
        ? await axios.put(`/api/admin/events/${existingEvent._id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          })
        : await axios.post('/api/admin/events', payload, {
            headers: { Authorization: `Bearer ${token}` }
          });

      setSuccess(true);
      setTimeout(() => {
        onSubmit(response.data);
        onClose();
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 
        `Failed to ${existingEvent ? 'update' : 'create'} event.`);
      console.error('Event submission error:', err);
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
          <button onClick={onClose} className="close-btn" aria-label="Close">
            <BsX size={24} />
          </button>
        </div>
        
        {success ? (
          <div className="success-message">
            <BsCheck size={32} className="success-icon" />
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
                  placeholder="Enter event title"
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
                  placeholder="Describe the event in detail"
                />
              </div>

              <div className="form-group">
                <label>Select Event Image*</label>
                <div className="image-options-grid">
                  {IMAGE_OPTIONS.map((option) => (
                    <label 
                      key={option.value}
                      className={`image-option ${formData.cover === option.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="cover"
                        value={option.value}
                        checked={formData.cover === option.value}
                        onChange={() => setFormData({...formData, cover: option.value})}
                        className="visually-hidden"
                      />
                      <img 
                        src={option.preview} 
                        alt={option.label}
                        onError={(e) => e.target.src = IMAGE_OPTIONS[3].preview}
                      />
                      <span>{option.label}</span>
                      {formData.cover === option.value && (
                        <div className="selection-badge">
                          <BsCheck />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="cancel-btn"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="loading-dots">
                      <span>.</span><span>.</span><span>.</span>
                    </span>
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