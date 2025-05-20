import React, { useState } from 'react';
import { BsPlusCircle, BsPencilSquare, BsTrash } from 'react-icons/bs';
import EventForm from './EventForm';
import axios from 'axios';

const EventsManager = ({ events, setEvents, token }) => { // Removed unused props
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateOrUpdateEvent = async (eventData) => {
    setIsProcessing(true);
    try {
      let response;
      if (selectedEvent) {
        response = await axios.put(
          `/api/admin/events/${selectedEvent._id}`,
          eventData,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setEvents(prev => prev.map(event => 
          event._id === selectedEvent._id ? response.data : event
        ));
      } else {
        response = await axios.post(
          '/api/admin/events',
          eventData,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setEvents(prev => [...prev, response.data]);
      }
      setShowEventForm(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Event operation failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    setIsProcessing(true);
    try {
      await axios.delete(`/api/admin/events/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEvents(prev => prev.filter(event => event._id !== id));
    } catch (err) {
      console.error('Failed to delete event:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='admin-table-full'>
      <div className='admin-table-header'>
        <h4>Events Management ({events.length})</h4>
        <button 
          className='admin-button'
          onClick={() => {
            setSelectedEvent(null);
            setShowEventForm(true);
          }}
          disabled={isProcessing}
        >
          <BsPlusCircle style={{ marginRight: '8px' }} />
          {isProcessing ? 'Processing...' : 'Create Event'}
        </button>
      </div>
      
      {showEventForm && (
  <EventForm 
    existingEvent={selectedEvent}
    onClose={() => {
      setShowEventForm(false);
      setSelectedEvent(null);
    }}
    onSubmit={handleCreateOrUpdateEvent}  // Fixed prop name
    isProcessing={isProcessing}
  />
)}
      <table className='admin-table'>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Registrations</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>{event.location}</td>
              <td>{event.registrations?.length || 0}/{event.maxAttendees}</td>
              <td>
                <span className={`status-badge ${
                  new Date(event.date) > new Date() ? 'upcoming' : 'completed'
                }`}>
                  {new Date(event.date) > new Date() ? 'Upcoming' : 'Completed'}
                </span>
              </td>
              <td>
                <button 
                  className='admin-button small'
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventForm(true);
                  }}
                >
                  <BsPencilSquare />
                </button>
                <button 
                  className='admin-button small'
                  onClick={() => handleDeleteEvent(event._id)}
                >
                  <BsTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsManager;