const ActivityFeed = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`p-2 rounded-full ${activity.iconBg || 'bg-blue-100'}`}>
              <activity.icon size={18} className={activity.iconColor || 'text-blue-600'} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.details}</p>
            </div>
            <p className="text-sm text-gray-400">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;