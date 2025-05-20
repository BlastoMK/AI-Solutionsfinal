import React, { useEffect, useState } from 'react';
import { BsPencilSquare, BsTrash, BsEye, BsCheckCircle, BsXCircle } from 'react-icons/bs';

function EventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

 // Update your useEffect in EventManagement.jsx:
useEffect(() => {
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();

  // Socket.io listener for new events
  socket.on('event-created', (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  });

  return () => {
    socket.off('event-created');
  };
}, []);
}

export default EventManagement;