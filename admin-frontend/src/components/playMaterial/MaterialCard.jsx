import { Package, MapPin, AlertCircle } from 'lucide-react';
import Card from '../common/Card';

const MaterialCard = ({ material, onEdit, onDelete }) => {
  const isLowStock = material.availableQuantity < material.quantity * 0.3;

  return (
    <Card className="relative">
      <div className="flex items-start gap-4">
        <img src={material.image} alt={material.name} className="w-20 h-20 object-cover rounded-lg" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{material.name}</h3>
          <p className="text-sm text-gray-500">{material.category} • {material.ageGroup}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1"><Package size={14} /> {material.availableQuantity}/{material.quantity}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {material.location}</span>
          </div>
          {isLowStock && (
            <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
              <AlertCircle size={12} /> Low stock alert
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(material)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">Edit</button>
          <button onClick={() => onDelete(material)} className="text-red-600 hover:bg-red-50 p-1 rounded">Delete</button>
        </div>
      </div>
    </Card>
  );
};

export default MaterialCard;