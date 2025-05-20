import { useState } from 'react';
import './admin-.css'; 
import AdminHeader from './admin-header';
import AdminSidebar from './admin-sidebar';
import AdminHome from './admin-home';

function AdminApp() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='admin-grid-container'>
      <AdminHeader OpenSidebar={OpenSidebar} />
      <AdminSidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <AdminHome />
    </div>
  );
}

export default AdminApp;