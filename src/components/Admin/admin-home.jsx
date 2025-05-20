import React, { useState, useEffect, useCallback } from 'react';
import { 
  BsPeopleFill, 
  BsBarChartFill, 
  BsChatText, 
  BsCalendarEvent, 
  BsActivity 
} from 'react-icons/bs';
import DashboardOverview from './DashboardOverview';
import EventsManager from './Events/EventsManager';
import RegistrationsTable from './Registrations/RegistrationsTable';
import EnquiriesTable from './Enquiries/EnquiriesTable';
import ActivityLog from './ActivityLog/ActivityLog';
import axios from 'axios';
import { io } from 'socket.io-client';

function AdminHome() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    enquiries: 0,
    events: 0,
    registrations: 0,
    activity: 0
  });
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem('adminToken');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsRes, registrationsRes, enquiriesRes, activitiesRes] = await Promise.all([
        axios.get('/api/admin/events', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('/api/admin/registrations', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('/api/admin/enquiries', { headers: { 'Authorization': `Bearer ${token}` } }),
        axios.get('/api/admin/activities', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      setStats({
        enquiries: enquiriesRes.data.length,
        events: eventsRes.data.length,
        registrations: registrationsRes.data.length,
        activity: activitiesRes.data.length
      });

      setEvents(eventsRes.data);
      setRegistrations(registrationsRes.data);
      setEnquiries(enquiriesRes.data);
      setActivities(activitiesRes.data);
      setFilteredActivities(activitiesRes.data);

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load dashboard data');
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      auth: { token },
      reconnectionAttempts: 5
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!socket) return;

    const handleNewEvent = (newEvent) => {
  console.log('Socket event received:', newEvent._id); // Debug log
  setEvents(prev => {
    // Double-check for duplicates
    const exists = prev.some(e => e._id === newEvent._id);
    if (exists) {
      console.log('Duplicate detected, skipping');
      return prev;
    }
    return [...prev, newEvent];
  });
  setStats(prev => ({ ...prev, events: prev.events + 1 }));
};

    const handleUpdatedEvent = (updatedEvent) => {
      setEvents(prev => prev.map(event => 
        event._id === updatedEvent._id ? updatedEvent : event
      ));
    };

    const handleDeletedEvent = (deletedId) => {
      setEvents(prev => prev.filter(event => event._id !== deletedId));
      setStats(prev => ({ ...prev, events: Math.max(0, prev.events - 1) }));
    };

    const handleNewRegistration = () => {
      setStats(prev => ({ ...prev, registrations: prev.registrations + 1 }));
    };

    const handleDeletedRegistration = () => {
      setStats(prev => ({ ...prev, registrations: Math.max(0, prev.registrations - 1) }));
    };

    const handleNewEnquiry = () => {
      setStats(prev => ({ ...prev, enquiries: prev.enquiries + 1 }));
    };

    const handleDeletedEnquiry = () => {
      setStats(prev => ({ ...prev, enquiries: Math.max(0, prev.enquiries - 1) }));
    };

    const handleNewActivity = (activity) => {
      setActivities(prev => [activity, ...prev.slice(0, 99)]);
      setStats(prev => ({ ...prev, activity: prev.activity + 1 }));
    };

    socket.on('event-created', handleNewEvent);
    socket.on('event-updated', handleUpdatedEvent);
    socket.on('event-deleted', handleDeletedEvent);
    socket.on('new-registration', handleNewRegistration);
    socket.on('registration-deleted', handleDeletedRegistration);
    socket.on('new-enquiry', handleNewEnquiry);
    socket.on('enquiry-deleted', handleDeletedEnquiry);
    socket.on('new-activity', handleNewActivity);
    socket.on('stats-updated', fetchData);

    return () => {
      socket.off('event-created', handleNewEvent);
      socket.off('event-updated', handleUpdatedEvent);
      socket.off('event-deleted', handleDeletedEvent);
      socket.off('new-registration', handleNewRegistration);
      socket.off('registration-deleted', handleDeletedRegistration);
      socket.off('new-enquiry', handleNewEnquiry);
      socket.off('enquiry-deleted', handleDeletedEnquiry);
      socket.off('new-activity', handleNewActivity);
      socket.off('stats-updated', fetchData);
    };
  }, [socket, fetchData]);

  if (loading) {
    return (
      <main className='admin-main-container'>
        <div className='admin-loading'>
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='admin-main-container'>
        <div className='admin-error-message'>
          <p>{error}</p>
          <button className='admin-button' onClick={fetchData}>
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className='admin-main-container'>
      <div className='admin-main-title'>
        <h3>ADMIN DASHBOARD</h3>
      </div>

      <div className='admin-tabs'>
        <button 
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BsBarChartFill className="admin-tab-icon" />
          <span>Overview</span>
        </button>
      
        <button 
          className={`admin-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <BsCalendarEvent className="admin-tab-icon" />
          <span>Events</span>
        </button>
        
        <button 
          className={`admin-tab ${activeTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          <BsPeopleFill className="admin-tab-icon" />
          <span>Registrations</span>
        </button>
        
        <button 
          className={`admin-tab ${activeTab === 'enquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('enquiries')}
        >
          <BsChatText className="admin-tab-icon" />
          <span>Enquiries</span>
        </button>
        
        <button 
          className={`admin-tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <BsActivity className="admin-tab-icon" />
          <span>Activity ({activities.length})</span>
        </button>
      </div>

      <div className='admin-tab-content'>
        {activeTab === 'overview' && (
          <DashboardOverview 
            stats={stats}
            events={events}
            enquiries={enquiries}
            registrations={registrations}
          />
        )}

        {activeTab === 'events' && (
          <EventsManager 
            events={events}
            setEvents={setEvents}
            token={token}
          />
        )}

       {activeTab === 'registrations' && (
  <RegistrationsTable 
    registrations={registrations}
    setRegistrations={setRegistrations} 
    events={events}
    token={token}
  />
)}

        {activeTab === 'enquiries' && (
          <EnquiriesTable 
            enquiries={enquiries}
            fetchData={fetchData}
            token={token}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityLog 
            activities={activities}
            filteredActivities={filteredActivities}
            setFilteredActivities={setFilteredActivities}
          />
        )}
      </div>
    </main>
  );
}


export default AdminHome;