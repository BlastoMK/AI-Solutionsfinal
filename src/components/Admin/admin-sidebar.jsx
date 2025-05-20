import React from 'react';
import { 
  BsGrid1X2Fill, 
  BsFillArchiveFill, 
  BsPeopleFill, 
  BsListCheck, 
  BsStarFill,
  BsEnvelope,
  BsGearFill,
  BsBoxArrowRight 
} from 'react-icons/bs';
import { Link } from 'react-router-dom';

function AdminSidebar({ openSidebarToggle, OpenSidebar }) {
  const handleLogout = () => {
    // Clear admin authentication data from localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    // Redirect to landing page
    window.location.href = 'http://localhost:3000';
  };

  return (
    <aside id="admin-sidebar" className={openSidebarToggle ? "admin-sidebar-responsive" : ""}>
      <div className='admin-sidebar-title'>
        <div className='admin-sidebar-brand'>
          ADMIN PANEL
        </div>
        <span className='admin-close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='admin-sidebar-list'>
        <li className='admin-sidebar-list-item'>
          <Link to="/admin">
            <BsGrid1X2Fill className='admin-icon' /> Dashboard
          </Link>
        </li>
        <li className='admin-sidebar-list-item'>
          <Link to="/admin/events">
            <BsFillArchiveFill className='admin-icon' /> Events
          </Link>
        </li>
        <li className='admin-sidebar-list-item'>
          <Link to="/admin/registrations">
            <BsListCheck className='admin-icon' /> Registrations
          </Link>
        </li>
        <li className='admin-sidebar-list-item'>
          <Link to="/admin/ratings">
            <BsStarFill className='admin-icon' /> Ratings
          </Link>
        </li>
        <li className='admin-sidebar-list-item'>
          <Link to="/admin/messages">
            <BsEnvelope className='admin-icon' /> Enquiries
          </Link>
        </li>
      </ul>
      
      {/* Logout button at the bottom */}
      <div className='admin-sidebar-footer'>
        <button onClick={handleLogout} className='admin-logout-button'>
          <BsBoxArrowRight className='admin-icon' /> Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;