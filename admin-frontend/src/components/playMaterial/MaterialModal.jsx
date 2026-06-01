import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const MaterialModal = ({ isOpen, onClose, onSave, material }) => {
  const [formData, setFormData] = useState({
    name: '', category: '', ageGroup: '', quantity: '', availableQuantity: '',
    location: '', condition: '', supplier: '', cost: '', description: ''
  });

  useEffect(() => {
    if (material) {
      setFormData(material);
    } else {
      setFormData({
        name: '', category: 'Educational', ageGroup: '', quantity: '', availableQuantity: '',
        location: '', condition: 'Good', supplier: '', cost: '', description: ''
      });
    }
  }, [material, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={material ? 'Edit Material' : 'Add New Material'} size="lg">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Material Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input-field"><option>Educational</option><option>Play Area</option><option>Creative</option><option>Outdoor</option><option>Music</option><option>Books</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label><input type="text" value={formData.ageGroup} onChange={(e) => setFormData({...formData, ageGroup: e.target.value})} className="input-field" placeholder="3-4 years" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label><input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Available Quantity</label><input type="number" value={formData.availableQuantity} onChange={(e) => setFormData({...formData, availableQuantity: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Condition</label><select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="input-field"><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs Repair</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label><input type="text" value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Cost</label><input type="text" value={formData.cost} onChange={(e) => setFormData({...formData, cost: e.target.value})} className="input-field" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" className="input-field"></textarea></div>
        </div>
        <div className="flex gap-3 mt-6"><Button type="submit">Save Material</Button><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button></div>
      </form>
    </Modal>
  );
};

export default MaterialModal;