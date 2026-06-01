import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const StudentModal = ({ isOpen, onClose, onSave, student }) => {
  const [formData, setFormData] = useState({
    studentName: '', age: '', gender: '', className: 'Pre-KG',
    parentName: '', parentContact: '', alternateContact: '', email: '',
    address: '', dateOfBirth: '', dateOfAdmission: ''
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        studentName: '', age: '', gender: '', className: 'Pre-KG',
        parentName: '', parentContact: '', alternateContact: '', email: '',
        address: '', dateOfBirth: '', dateOfAdmission: new Date().toISOString().split('T')[0]
      });
    }
  }, [student, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={student ? 'Edit Student' : 'Add New Student'} size="lg">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
            <input type="text" value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="input-field">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select value={formData.className} onChange={(e) => setFormData({...formData, className: e.target.value})} className="input-field">
              <option>Pre-KG</option>
              <option>LKG</option>
              <option>UKG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name *</label>
            <input type="text" value={formData.parentName} onChange={(e) => setFormData({...formData, parentName: e.target.value})} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact *</label>
            <input type="text" value={formData.parentContact} onChange={(e) => setFormData({...formData, parentContact: e.target.value})} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Contact</label>
            <input type="text" value={formData.alternateContact} onChange={(e) => setFormData({...formData, alternateContact: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="2" className="input-field"></textarea>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button type="submit">Save Student</Button>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentModal;