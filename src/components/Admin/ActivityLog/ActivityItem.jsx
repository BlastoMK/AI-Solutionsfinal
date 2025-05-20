import React from 'react';
import { BsActivity } from 'react-icons/bs';

const ActivityItem = ({ activity, icons, texts, formatMetadata }) => {
  return (
    <div className="activity-item" key={activity._id}>
      <div className="activity-icon">
        {icons[activity.action] || <BsActivity />}
      </div>
      <div className="activity-content">
        <p>
          <span className="actor">{activity.performedBy}</span>{' '}
          {texts[activity.action]}{' '}
          <span className="metadata">{formatMetadata(activity)}</span>
        </p>
        <span className="activity-time">
          {new Date(activity.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ActivityItem;