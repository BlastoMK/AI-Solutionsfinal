import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './admin-.css';
import AdminStatsCards from './admin-statscards';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Initialize Socket.io connection
    const socket = io('http://localhost:3001', {
      reconnectionAttempts: 5,
      auth: { token }
    });
    
    socket.on('connect', () => console.log('⚡️ Connected to WS server'));
    socket.on('event-created', (e) => console.log('New event:', e));

    // Join stats room for updates
    socket.emit('subscribe', 'stats');

    // Listen for new events
    socket.on('event-created', (newEvent) => {
      setEvents(prev => [...prev, newEvent]);
    });

    // Listen for stats updates
    socket.on('stats-updated', () => {
      fetchStats();
    });

    // Initial data fetch
    fetchEvents();
    fetchStats();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/admin/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  return (
    <main className='admin-main-container'>
      <AdminStatsCards stats={stats} />
      
      <div className="admin-table-container">
        <h3>Event Management ({events.length})</h3>
        <table className="admin-events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Registrations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.registrations?.length || 0}/{event.maxAttendees}</td>
                <td>
                  <button className="admin-btn-edit">
                    <BsPencilSquare />
                  </button>
                  <button className="admin-btn-delete">
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}