'use client';

const AnalyticsRecentCard = ({ title, activities }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${activity.color}`} />
            <span className="text-sm text-gray-600">{activity.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsRecentCard;