import React from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';

function AdminHeader({ OpenSidebar }) {
  return (
    <header className='admin-header'>
      <div className='admin-menu-icon'>
        <BsJustify className='admin-icon' onClick={OpenSidebar} />
      </div>
      <div className='admin-header-left'>
        <BsSearch className='admin-icon' />
      </div>
      <div className='admin-header-right'>
        <BsFillBellFill className='admin-icon' />
        <BsFillEnvelopeFill className='admin-icon' />
        <BsPersonCircle className='admin-icon' />
      </div>
    </header>
  );
}

export default AdminHeader;