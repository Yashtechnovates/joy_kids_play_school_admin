import Modal from '../common/Modal';
import Button from '../common/Button';
import { Calendar, Clock, Users, BookOpen, Target } from 'lucide-react';

const AcademicModal = ({ isOpen, onClose, activity }) => {
  if (!activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activity.title} size="lg">
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600"><Calendar size={16} /> {activity.date} at {activity.time}</div>
          <div className="flex items-center gap-2 text-gray-600"><Clock size={16} /> Duration: {activity.duration}</div>
          <div className="flex items-center gap-2 text-gray-600"><Users size={16} /> Class: {activity.class}</div>
          <div className="flex items-center gap-2 text-gray-600"><BookOpen size={16} /> Instructor: {activity.instructor}</div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
          <p className="text-gray-600">{activity.description}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Materials Required</h3>
          <p className="text-gray-600">{activity.materials}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Target size={18} /> Learning Outcomes</h3>
          <ul className="list-disc list-inside text-gray-600">
            {activity.learningOutcomes?.map((outcome, i) => <li key={i}>{outcome}</li>)}
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Enrollment Status</span>
            <span className="font-semibold">{activity.enrolled}/{activity.capacity} students</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${(activity.enrolled / activity.capacity) * 100}%` }}></div>
          </div>
        </div>
        
        <Button onClick={onClose} className="w-full">Close</Button>
      </div>
    </Modal>
  );
};

export default AcademicModal;