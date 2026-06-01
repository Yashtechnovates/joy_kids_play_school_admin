import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const StaffModal = ({ isOpen, onClose, onSave, staff }) => {
  const [formData, setFormData] = useState({
    name: '', role: '', department: '', qualification: '', experience: '',
    email: '', phone: '', joinDate: '', address: '', status: 'Active', salary: ''
  });

  useEffect(() => {
    if (staff) {
      setFormData(staff);
    } else {
      setFormData({
        name: '', role: '', department: '', qualification: '', experience: '',
        email: '', phone: '', joinDate: new Date().toISOString().split('T')[0], 
        address: '', status: 'Active', salary: ''
      });
    }
  }, [staff, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={staff ? 'Edit Staff' : 'Add New Staff'} size="lg">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Role *</label><input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="input-field" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label><input type="text" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience</label><input type="text" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input-field" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label><input type="date" value={formData.joinDate} onChange={(e) => setFormData({...formData, joinDate: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Salary</label><input type="text" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="input-field"><option>Active</option><option>Inactive</option></select></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="2" className="input-field"></textarea></div>
        </div>
        <div className="flex gap-3 mt-6"><Button type="submit">Save Staff</Button><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button></div>
      </form>
    </Modal>
  );
};

export default StaffModal;