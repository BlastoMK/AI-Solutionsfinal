import React, { useState } from 'react';
import { BsEnvelopeFill, BsTrash, BsReplyFill } from 'react-icons/bs';
import ReplyForm from './ReplyForm';
import axios from 'axios';

const EnquiriesTable = ({ enquiries, fetchData, token }) => {
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    
    try {
      await axios.delete(`/api/admin/enquiries/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    }
  };

  return (
    <div className='admin-table-full'>
      <div className='admin-table-header'>
        <h4>Customer Enquiries ({enquiries.length})</h4>
        <div className='admin-table-actions'>
          <input type="text" placeholder="Search enquiries..." />
          <button className='admin-button'>Filter</button>
        </div>
      </div>
      
      <table className='admin-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Received</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map(enquiry => (
            <tr key={enquiry._id}>
              <td>{enquiry.name}</td>
              <td>{enquiry.email}</td>
              <td>{enquiry.company || '-'}</td>
              <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
              <td>
                <span className={`status-badge ${
                  enquiry.repliedAt ? 'completed' : 'pending'
                }`}>
                  {enquiry.repliedAt ? 'Replied' : 'Pending'}
                </span>
              </td>
              <td>
                <button 
                  className='admin-button small'
                  onClick={() => setSelectedEnquiry(enquiry)}
                >
                  <BsEnvelopeFill />
                </button>
                <button 
                  className='admin-button small danger'
                  onClick={() => handleDeleteEnquiry(enquiry._id)}
                >
                  <BsTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEnquiry && (
        <ReplyForm 
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onReplySent={() => {
            setSelectedEnquiry(null);
            fetchData();
          }}
          token={token}
        />
      )}
    </div>
  );
};

export default EnquiriesTable;