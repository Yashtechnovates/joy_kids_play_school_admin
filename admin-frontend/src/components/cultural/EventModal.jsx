import Modal from '../common/Modal';
import Button from '../common/Button';
import { Calendar, MapPin, Clock, Users, Award } from 'lucide-react';

const EventModal = ({ isOpen, onClose, event }) => {
  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event.title} size="lg">
      <div className="p-6">
        <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-lg mb-4" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600"><Calendar size={16} /> {event.date} | {event.time}</div>
          <div className="flex items-center gap-2 text-gray-600"><MapPin size={16} /> {event.venue}</div>
          <div className="flex items-center gap-2 text-gray-600"><Users size={16} /> {event.participants}</div>
          <div className="flex items-center gap-2 text-gray-600"><Award size={16} /> Chief Guest: {event.chiefGuest}</div>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">About this event</h3>
          <p className="text-gray-600">{event.description}</p>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Requirements</h3>
          <ul className="list-disc list-inside text-gray-600">
            {event.requirements?.map((req, i) => <li key={i}>{req}</li>)}
          </ul>
        </div>
        <Button onClick={onClose} className="w-full">Close</Button>
      </div>
    </Modal>
  );
};

export default EventModal;