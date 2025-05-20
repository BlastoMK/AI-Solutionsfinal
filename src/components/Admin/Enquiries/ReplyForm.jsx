import React, { useState } from 'react';
import { BsReplyFill } from 'react-icons/bs';
import axios from 'axios';

const ReplyForm = ({ enquiry, onClose, onReplySent, token }) => {
  const [replySubject, setReplySubject] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendReply = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post(
        `/api/admin/enquiries/${enquiry._id}/reply`,
        { subject: replySubject, content: replyContent },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      onReplySent();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Reply to {enquiry.name}</h3>
        <p><strong>Original enquiry:</strong></p>
        <div className="enquiry-details">
          <p><strong>Company:</strong> {enquiry.company || 'Not provided'}</p>
          <p><strong>Requirements:</strong></p>
          <p>{enquiry.requirements}</p>
        </div>
        
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={replySubject}
            onChange={(e) => setReplySubject(e.target.value)}
            placeholder={`Re: ${enquiry.company || 'Your'} enquiry`}
          />
        </div>
        
        <div className="form-group">
          <label>Reply Content</label>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={8}
            placeholder="Type your reply here..."
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="modal-actions">
          <button 
            className="admin-button"
            onClick={handleSendReply}
            disabled={loading}
          >
            <BsReplyFill /> {loading ? 'Sending...' : 'Send Reply'}
          </button>
          <button 
            className="admin-button secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyForm;