import { Calendar, Clock, Users, BookOpen } from 'lucide-react';
import Card from '../common/Card';

const AcademicCard = ({ activity, onClick }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Art: 'bg-pink-100 text-pink-700',
      Language: 'bg-green-100 text-green-700',
      Music: 'bg-purple-100 text-purple-700',
      Science: 'bg-blue-100 text-blue-700',
      Mathematics: 'bg-orange-100 text-orange-700',
      Wellness: 'bg-teal-100 text-teal-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <div className="mb-3">
        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(activity.category)}`}>
          {activity.category}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{activity.title}</h3>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2"><Calendar size={14} /> {activity.date}</div>
        <div className="flex items-center gap-2"><Clock size={14} /> {activity.time} ({activity.duration})</div>
        <div className="flex items-center gap-2"><Users size={14} /> {activity.class}</div>
        <div className="flex items-center gap-2"><BookOpen size={14} /> {activity.instructor}</div>
      </div>
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${(activity.enrolled / activity.capacity) * 100}%` }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{activity.enrolled}/{activity.capacity} enrolled</p>
      </div>
    </Card>
  );
};

export default AcademicCard;