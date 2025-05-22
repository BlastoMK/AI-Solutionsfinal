import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RegistrationForm } from './RegistrationForm';

export const Blog = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        const response = await axios.get('/api/events/latest');
        setEvents(response.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchLatestEvents();
  }, []);

  return (
    <>
      <section className='blog' id='blog'>
        <div className='container'>
          <div className='heading'>
            <h2>UPCOMING EVENTS</h2>
          </div>
          <div className='grid3'>
           {Array.isArray(events) && events.map((event) => (
              <div className='box' key={event._id}>
                <img 
                  src={`/images/events/${event.cover}`} 
                  alt={event.title}
                  onError={(e) => {
                    e.target.src = '/images/events/workshop.jpg';
                  }}
                />
                <div className='text'>
                  <span>{event.formattedDate || new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                  })}</span>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="event-footer">
                    <span>Location: {event.location}</span>
                    <button 
                      className="register-button"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedEvent && (
        <RegistrationForm
          eventId={selectedEvent._id}
          onClose={() => setSelectedEvent(null)}
          onSuccess={() => setRegistrationSuccess(true)}
        />
      )}

      {registrationSuccess && (
        <div className="success-notification">
          Registration successful! We'll contact you soon.
        </div>
      )}
    </>
  );
};