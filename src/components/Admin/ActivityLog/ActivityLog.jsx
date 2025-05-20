import React from 'react';
import { 
  BsCalendarEvent,
  BsStarFill,
  BsEnvelopeFill,
  BsPersonPlus,
  BsReplyFill,
  BsPencilSquare,
  BsTrash,
  BsDownload 
} from 'react-icons/bs';
import ActivityItem from './ActivityItem';

const ActivityLog = ({ 
  activities, 
  filteredActivities, 
  setFilteredActivities 
}) => {
  // Activity icons mapping
  const activityIcons = {
    event_created: <BsCalendarEvent className="text-primary" />,
    event_updated: <BsPencilSquare className="text-warning" />,
    event_deleted: <BsTrash className="text-danger" />,
    rating_submitted: <BsStarFill className="text-warning" />,
    enquiry_submitted: <BsEnvelopeFill className="text-info" />,
    registration_created: <BsPersonPlus className="text-success" />,
    enquiry_replied: <BsReplyFill className="text-success" />
  };

  const activityTexts = {
    event_created: 'created event',
    event_updated: 'updated event',
    event_deleted: 'deleted event',
    rating_submitted: 'left a rating',
    enquiry_submitted: 'submitted an enquiry',
    registration_created: 'registered for event',
    enquiry_replied: 'replied to enquiry'
  };

  const formatActivityMetadata = (activity) => {
    switch(activity.action) {
      case 'rating_submitted':
        return `${activity.metadata.rating} stars`;
      case 'event_created':
      case 'event_updated':
      case 'event_deleted':
        return `"${activity.metadata.title}"`;
      default:
        return '';
    }
  };

  const filterActivities = (type) => {
    if (type === 'all') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(a => a.entityType === type));
    }
  };

  const downloadActivityReport = () => {
    const dataToExport = filteredActivities.length > 0 ? filteredActivities : activities;
    const now = new Date();
    
    // CSV header with additional metadata
    let csvContent = [
      ['Report Type', 'Activity Log'],
      ['Generated At', now.toLocaleString()],
      ['Total Records', dataToExport.length],
      [], // Empty row
      ['User', 'Action', 'Details', 'Timestamp', 'Activity Type'] // Column headers
    ].map(row => row.join(',')).join('\n') + '\n';
    
    // Add data rows
    dataToExport.forEach(activity => {
      const row = [
        `"${activity.performedBy.replace(/"/g, '""')}"`, // Escape quotes
        `"${activityTexts[activity.action].replace(/"/g, '""')}"`,
        `"${formatActivityMetadata(activity).replace(/"/g, '""')}"`,
        `"${new Date(activity.createdAt).toLocaleString()}"`,
        `"${activity.entityType}"`
      ];
      csvContent += row.join(',') + '\n';
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity_report_${now.toISOString().slice(0, 10)}_${now.getHours()}${now.getMinutes()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='admin-table-full'>
      <div className='admin-table-header'>
        <h4>System Activity ({activities.length})</h4>
        <div className='admin-table-actions'>
          <select 
            onChange={(e) => filterActivities(e.target.value)}
            className='activity-filter-select'
          >
            <option value="all">All Activities</option>
            <option value="event">Events</option>
            <option value="rating">Ratings</option>
            <option value="enquiry">Enquiries</option>
            <option value="registration">Registrations</option>
          </select>
          
          <button 
            onClick={downloadActivityReport}
            className='download-report-button'
            title="Download CSV Report"
            disabled={activities.length === 0}
          >
            <BsDownload className="download-icon" />
            <span className="download-text">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="activity-feed">
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <ActivityItem 
              key={activity._id}
              activity={activity}
              icons={activityIcons}
              texts={activityTexts}
              formatMetadata={formatActivityMetadata}
            />
          ))
        ) : (
          <div className="no-activities-message">
            No activities found for the selected filter
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;