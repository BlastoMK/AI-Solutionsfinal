import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsCalendar, BsGeoAlt } from 'react-icons/bs';
import { RegistrationForm } from './RegistrationForm';

const EventsSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
      searchEvents(query);
    }
  }, [location]);

  const searchEvents = async (term) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/events/search?q=${encodeURIComponent(term)}`);
      setEvents(response.data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

 return (
    <section className="events-search">
      <div className="container">
        <h2 className="search-results-title">
          {events.length > 0 ? 'Search Results' : 'Find Events'}
        </h2>
        
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event name, location, or date..."
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="horizontal-results-container">
          {loading ? (
            <div className="loading">Loading events...</div>
          ) : events.length > 0 ? (
            <div className="horizontal-scroll-wrapper">
              {events.map(event => (
                <div className="event-card-horizontal" key={event._id}>
                  <div className="event-image-container">
                    <img 
                      src={`/images/events/${event.cover || 'default.jpg'}`} 
                      alt={event.title}
                      onError={(e) => e.target.src = '/images/events/default.jpg'}
                    />
                  </div>
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <span><BsCalendar /> {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                      <span><BsGeoAlt /> {event.location}</span>
                    </div>
                    <button 
                      className="register-button"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No events found</h3>
              <p>Try different search terms or check back later for new events.</p>
            </div>
          )}
        </div>

        {selectedEvent && (
          <RegistrationForm
            eventId={selectedEvent._id}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </section>
  );
};

export default EventsSearch;