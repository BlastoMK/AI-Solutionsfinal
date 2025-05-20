import React, { useEffect, useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminStatsCards({ stats }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/admin/stats/chart');
        const data = await res.json();
        setChartData(data);
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
      }
    };
    fetchChartData();
  }, []);

  return (
    <div className='admin-main-cards'>
  <div className='admin-card'>
    <div className='admin-card-inner'>
      <h3>ENQUIRIES</h3>
      <BsFillArchiveFill className='admin-card_icon' />
    </div>
    <h1>{stats?.enquiries || 0}</h1>
  </div>
  
  <div className='admin-card'>
    <div className='admin-card-inner'>
      <h3>EVENTS</h3>
      <BsFillGrid3X3GapFill className='admin-card_icon' />
    </div>
    <h1>{stats?.events || 0}</h1>
  </div>
  
  <div className='admin-card'>
    <div className='admin-card-inner'>
      <h3>REGISTRATIONS</h3>
      <BsPeopleFill className='admin-card_icon' />
    </div>
    <h1>{stats?.registrations || 0}</h1>
  </div>
</div>
  );
}