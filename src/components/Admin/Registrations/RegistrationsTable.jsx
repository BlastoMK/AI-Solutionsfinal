import React, { useState } from 'react'; // Added useState import
import { BsEye, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const RegistrationsTable = ({ 
  registrations, 
  setRegistrations,
  events, 
  token 
}) => {
  const [isDeleting, setIsDeleting] = useState(null);

  const handleDeleteRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    
    setIsDeleting(id);
    try {
      await axios.delete(`/api/admin/registrations/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setRegistrations(prev => prev.filter(reg => reg._id !== id));
      
    } catch (err) {
      console.error('Failed to delete registration:', err);
      alert('Failed to delete registration. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className='admin-table-full'>
      <div className='admin-table-header'>
        <h4>Event Registrations ({registrations.length})</h4>
        <div className='admin-table-actions'>
          <input type="text" placeholder="Search registrations..." />
          <button className='admin-button'>Filter</button>
        </div>
      </div>
      <table className='admin-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Event</th>
            <th>Company</th>
            <th>Date Registered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map(reg => (
            <tr key={reg._id}>
              <td>{reg.name}</td>
              <td>{reg.email}</td>
              <td>
                {events.find(e => e._id === reg.eventId)?.title || 'Event not found'}
              </td>
              <td>{reg.company || '-'}</td>
              <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
              <td>
                <button className='admin-button small'>
                  <BsEye />
                </button>
                <button 
                  className='admin-button small danger'
                  onClick={() => handleDeleteRegistration(reg._id)}
                  disabled={isDeleting === reg._id}
                >
                  {isDeleting === reg._id ? 'Deleting...' : <BsTrash />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationsTable;