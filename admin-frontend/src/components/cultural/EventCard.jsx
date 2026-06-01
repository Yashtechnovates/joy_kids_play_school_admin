import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import Card from '../common/Card';

const EventCard = ({ event, onClick }) => {
  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-t-2xl" />
        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs ${event.status === 'Upcoming' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
          {event.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2"><Calendar size={14} /> {event.date}</div>
          <div className="flex items-center gap-2"><Clock size={14} /> {event.time}</div>
          <div className="flex items-center gap-2"><MapPin size={14} /> {event.venue}</div>
          <div className="flex items-center gap-2"><Users size={14} /> {event.participants}</div>
        </div>
        <p className="mt-3 text-gray-500 text-sm line-clamp-2">{event.description}</p>
      </div>
    </Card>
  );
};

export default EventCard;