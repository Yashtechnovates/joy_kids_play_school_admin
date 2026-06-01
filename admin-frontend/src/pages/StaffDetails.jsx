import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Download, Eye, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { staffService } from '../services/staffService';

const StaffDetails = () => {
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience: '',
    subject: '',
    category: 'teachers',
    contact: '',
    imageData: null,
    imageUrl: ''
  });

  // ==================== VALIDATION FUNCTIONS ====================
  
  const validateAndFormatName = (value) => {
    return value.replace(/[^A-Za-z\s]/g, '');
  };

  const validateAndFormatPhone = (value) => {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    return numbersOnly.slice(0, 10);
  };

  const compressImage = (base64String, maxWidth = 200, maxHeight = 200, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => {
        resolve(base64String);
      };
    });
  };

  // ==================== DRAG & DROP IMAGE HANDLERS ====================
  
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const compressedImage = await compressImage(event.target.result, 200, 200, 0.7);
        setFormData({ ...formData, imageData: compressedImage, imageUrl: '' });
        setPreviewImage(compressedImage);
        if (formErrors.image) setFormErrors({ ...formErrors, image: null });
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully');
    } else if (file) {
      toast.error('Please upload an image file');
    }
  }, [formData]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const compressedImage = await compressImage(event.target.result, 200, 200, 0.7);
        setFormData({ ...formData, imageData: compressedImage, imageUrl: '' });
        setPreviewImage(compressedImage);
        if (formErrors.image) setFormErrors({ ...formErrors, image: null });
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully');
    } else if (file) {
      toast.error('Please upload an image file');
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imageData: null, imageUrl: '' });
    setPreviewImage(null);
  };

  // ==================== HANDLE INPUT CHANGES ====================
  
  const handleNameChange = (value) => {
    const formattedValue = validateAndFormatName(value);
    setFormData({ ...formData, name: formattedValue });
    if (formErrors.name) setFormErrors({ ...formErrors, name: null });
  };

  const handleRoleChange = (value) => {
    const formattedValue = validateAndFormatName(value);
    setFormData({ ...formData, role: formattedValue });
    if (formErrors.role) setFormErrors({ ...formErrors, role: null });
  };

  const handleSubjectChange = (value) => {
    const formattedValue = validateAndFormatName(value);
    setFormData({ ...formData, subject: formattedValue });
    if (formErrors.subject) setFormErrors({ ...formErrors, subject: null });
  };

  const handleContactChange = (value) => {
    const formattedValue = validateAndFormatPhone(value);
    setFormData({ ...formData, contact: formattedValue });
    if (formErrors.contact) setFormErrors({ ...formErrors, contact: null });
  };

  // ==================== FORM VALIDATION BEFORE SAVE ====================
  
  const validateFormBeforeSave = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Staff name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Staff name must be at least 2 characters';
    }
    
    if (!formData.role.trim()) {
      errors.role = 'Role is required';
    } else if (formData.role.length < 2) {
      errors.role = 'Role must be at least 2 characters';
    }
    
    if (!formData.experience) {
      errors.experience = 'Experience is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.contact) {
      errors.contact = 'Contact number is required';
    } else if (formData.contact.length !== 10) {
      errors.contact = 'Contact number must be exactly 10 digits';
    }
    
    if (!formData.imageData && !formData.imageUrl) {
      errors.image = 'Profile image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== LOAD DATA FROM BACKEND API ====================
  
  const loadStaff = useCallback(async () => {
    try {
      setLoading(true);
      const response = await staffService.getAll();
      console.log('API Response:', response);
      
      let staffData = [];
      
      // Handle different response structures
      if (response && response.teachers && response.support) {
        // Response is { teachers: [...], support: [...] }
        staffData = [...(response.teachers || []), ...(response.support || [])];
      } else if (response && response.success === true && Array.isArray(response.data)) {
        staffData = response.data;
      } else if (Array.isArray(response)) {
        staffData = response;
      } else if (response && Array.isArray(response.data)) {
        staffData = response.data;
      }
      
      console.log('Staff data from DB:', staffData);
      
      // Transform backend data to match frontend format
      const formattedStaff = staffData.map(member => ({
        id: member._id || member.id,
        name: member.name,
        role: member.role,
        experience: member.experience,
        subject: member.subject || '',
        category: member.category || 'teachers',
        contact: member.contact || '',
        imageUrl: member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3b82f6&color=fff&size=128`
      }));
      
      setStaff(formattedStaff);
    } catch (err) {
      console.error('Error loading staff:', err);
      toast.error('Failed to load staff from server');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const resetForm = () => {
    setEditingStaff(null);
    setFormErrors({});
    setPreviewImage(null);
    setFormData({
      name: '', role: '', experience: '', subject: '', category: 'teachers', contact: '', imageData: null, imageUrl: ''
    });
  };

  const saveStaff = async () => {
    if (!validateFormBeforeSave()) {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError);
      return;
    }

    setSaving(true);

    const staffData = {
      name: formData.name,
      role: formData.role,
      experience: formData.experience,
      subject: formData.subject,
      category: formData.category,
      contact: formData.contact,
      image: formData.imageData || formData.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=3b82f6&color=fff&size=128`
    };

    console.log('Sending data to backend:', staffData);

    try {
      if (editingStaff) {
        await staffService.update(editingStaff.id, staffData);
        toast.success('Staff updated successfully');
      } else {
        await staffService.create(staffData);
        toast.success('Staff added successfully');
      }
      
      await loadStaff();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving staff:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to save staff');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name || '',
      role: staffMember.role || '',
      experience: staffMember.experience || '',
      subject: staffMember.subject || '',
      category: staffMember.category || 'teachers',
      contact: staffMember.contact || '',
      imageData: null,
      imageUrl: staffMember.imageUrl || ''
    });
    setPreviewImage(staffMember.imageUrl);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const deleteStaff = async (staffMember) => {
    if (window.confirm(`Are you sure you want to delete ${staffMember.name}?`)) {
      try {
        await staffService.delete(staffMember.id);
        toast.success('Staff deleted successfully');
        await loadStaff();
      } catch (err) {
        console.error('Error deleting staff:', err);
        toast.error('Failed to delete staff');
      }
    }
  };

  const exportToCSV = () => {
    const data = filteredStaff;
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    const csv = [['Name', 'Role', 'Experience', 'Subject', 'Category', 'Contact']];
    data.forEach(s => {
      csv.push([s.name, s.role, s.experience, s.subject || '', s.category === 'teachers' ? 'Teaching Staff' : 'Support Staff', s.contact]);
    });
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff_records_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const roles = ['All', 'Principal', 'Senior Coordinator', 'Lead Teacher', 'Activity Trainer', 'Support Staff'];

  const filteredStaff = staff.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.role || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || s.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage all teaching and non-teaching staff</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToCSV} variant="outline" icon={Download}>Export</Button>
          <Button onClick={openAddModal} icon={Plus}>Add Staff</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, role, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            {roles.map(role => <option key={role}>{role}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    No staff found. Click "Add Staff" to create one.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">
                      <img 
                        src={member.imageUrl} 
                        alt={member.name} 
                        className="w-10 h-10 rounded-full object-cover" 
                        onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3b82f6&color=fff&size=128`} 
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{member.name}</td>
                    <td className="px-4 py-3 text-sm">{member.role}</td>
                    <td className="px-4 py-3 text-sm">{member.experience}</td>
                    <td className="px-4 py-3 text-sm">{member.subject || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.category === 'teachers' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {member.category === 'teachers' ? 'Teaching Staff' : 'Support Staff'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{member.contact}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedStaff(member); setIsViewModalOpen(true); }} 
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openEditModal(member)} 
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteStaff(member)} 
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingStaff ? 'Edit Staff' : 'Add New Staff'} size="lg">
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => handleNameChange(e.target.value)} 
                placeholder="Only letters A-Z allowed"
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <input 
                type="text" 
                value={formData.role} 
                onChange={(e) => handleRoleChange(e.target.value)} 
                placeholder="e.g., Lead Teacher, Activity Trainer"
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.role ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience *</label>
              <input 
                type="text" 
                value={formData.experience} 
                onChange={(e) => setFormData({...formData, experience: e.target.value})} 
                placeholder="e.g., 8 years"
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.experience ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.experience && <p className="text-red-500 text-xs mt-1">{formErrors.experience}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject (for teachers)</label>
              <input 
                type="text" 
                value={formData.subject} 
                onChange={(e) => handleSubjectChange(e.target.value)} 
                placeholder="e.g., Mathematics, English"
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.subject ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.subject && <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="teachers">Teaching Staff</option>
                <option value="support">Support Staff</option>
              </select>
              {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
              <input 
                type="text" 
                value={formData.contact} 
                onChange={(e) => handleContactChange(e.target.value)} 
                placeholder="10-digit mobile number"
                maxLength="10"
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.contact ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.contact && <p className="text-red-500 text-xs mt-1">{formErrors.contact}</p>}
            </div>
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image *</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                ${formErrors.image ? 'border-red-500' : ''}`}
              onClick={() => document.getElementById('staffImageInput').click()}
            >
              {previewImage ? (
                <div className="relative inline-block">
                  <img src={previewImage} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Drag & drop a profile image here, or click to select</p>
                </>
              )}
              <input
                id="staffImageInput"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              onClick={saveStaff} 
              disabled={saving}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : (editingStaff ? 'Update Staff' : 'Save Staff')}
            </button>
            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* View Staff Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Staff Details" size="lg">
        {selectedStaff && (
          <div className="space-y-4 p-6">
            <div className="flex justify-center">
              <img 
                src={selectedStaff.imageUrl} 
                alt={selectedStaff.name} 
                className="w-32 h-32 rounded-full object-cover" 
                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff.name)}&background=3b82f6&color=fff&size=128`} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{selectedStaff.name}</p></div>
              <div><p className="text-sm text-gray-500">Role</p><p className="font-medium">{selectedStaff.role}</p></div>
              <div><p className="text-sm text-gray-500">Experience</p><p className="font-medium">{selectedStaff.experience}</p></div>
              <div><p className="text-sm text-gray-500">Subject</p><p className="font-medium">{selectedStaff.subject || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Category</p><p className="font-medium">{selectedStaff.category === 'teachers' ? 'Teaching Staff' : 'Support Staff'}</p></div>
              <div><p className="text-sm text-gray-500">Contact</p><p className="font-medium">{selectedStaff.contact}</p></div>
            </div>
            <button onClick={() => setIsViewModalOpen(false)} className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffDetails;