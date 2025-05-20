import React from 'react';
import { 
  BsEnvelopeFill, 
  BsCalendarEvent, 
  BsPeopleFill, 
  BsActivity 
} from 'react-icons/bs';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const DashboardOverview = ({ stats, events, enquiries, registrations }) => {
  // Prepare data for Events vs Registrations chart
  const eventsRegData = events.map(event => ({
    name: event.title.length > 10 ? `${event.title.substring(0, 10)}...` : event.title,
    registrations: event.registrations?.length || 0,
    capacity: event.maxAttendees || 50,
    date: new Date(event.date).toLocaleDateString()
  }));

  // Prepare data for Enquiries vs Registrations (last 6 months)
  const getMonthlyComparisonData = () => {
    const months = [];
    const now = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      
      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthKey = `${monthName} ${date.getFullYear()}`;
      
      // Count enquiries
      const monthlyEnquiries = enquiries.filter(e => {
        const d = new Date(e.createdAt);
        return d.getMonth() === date.getMonth() && 
               d.getFullYear() === date.getFullYear();
      }).length;
      
      // Count registrations
      const monthlyRegistrations = registrations.filter(r => {
        const d = new Date(r.createdAt);
        return d.getMonth() === date.getMonth() && 
               d.getFullYear() === date.getFullYear();
      }).length;
      
      months.push({
        name: monthKey,
        enquiries: monthlyEnquiries,
        registrations: monthlyRegistrations
      });
    }
    
    return months;
  };

  const monthlyComparisonData = getMonthlyComparisonData();

  return (
    <>
      <div className='admin-main-cards'>
        <div className='admin-card'>
          <div className='admin-card-inner'>
            <h3>ENQUIRIES</h3>
            <BsEnvelopeFill className='admin-card_icon' />
          </div>
          <h1>{stats.enquiries}</h1>
        </div>
        <div className='admin-card'>
          <div className='admin-card-inner'>
            <h3>EVENTS</h3>
            <BsCalendarEvent className='admin-card_icon' />
          </div>
          <h1>{stats.events}</h1>
        </div>
        <div className='admin-card'>
          <div className='admin-card-inner'>
            <h3>REGISTRATIONS</h3>
            <BsPeopleFill className='admin-card_icon' />
          </div>
          <h1>{stats.registrations}</h1>
        </div>
        <div className='admin-card'>
          <div className='admin-card-inner'>
            <h3>ACTIVITY</h3>
            <BsActivity className='admin-card_icon' />
          </div>
          <h1>{stats.activity}</h1>
        </div>
      </div>

      <div className='admin-charts-container'>
        <div className='admin-chart'>
          <h4>Events vs Registrations</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventsRegData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'date') return null;
                  return [value, name];
                }}
                labelFormatter={(label) => {
                  const event = eventsRegData.find(e => e.name === label);
                  return `Event: ${label}\nDate: ${event?.date}`;
                }}
              />
              <Legend />
              <Bar dataKey="registrations" fill="#4361ee" name="Registrations" />
              <Bar dataKey="capacity" fill="#4cc9f0" name="Capacity" opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='admin-chart'>
          <h4>Enquiries vs Registrations (Last 6 Months)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="enquiries" 
                stroke="#8884d8" 
                name="Enquiries"
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="registrations" 
                stroke="#82ca9d" 
                name="Registrations" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='admin-tables'>
        <div className='admin-table-container'>
          <h4>Recent Enquiries</h4>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.slice(0, 5).map(enquiry => (
                <tr key={enquiry._id}>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.email}</td>
                  <td>
                    <span className={`status-badge ${enquiry.repliedAt ? 'completed' : 'pending'}`}>
                      {enquiry.repliedAt ? 'Replied' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='admin-table-container'>
          <h4>Upcoming Events</h4>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Registrations</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 5).map(event => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.registrations?.length || 0}/{event.maxAttendees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;