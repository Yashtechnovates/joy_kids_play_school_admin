import { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Search, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { studentService } from '../services/studentService';

const StudentDatabase = () => {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    class: 'Pre-KG',
    email: '',
    phoneNumber: '',
    fatherName: '',
    motherName: '',
    motherEmail: '',
    motherPhone: '',
    address: ''
  });

  // ==================== LOAD DATA FROM BACKEND ====================
  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await studentService.getAll();
      let studentsData = [];
      if (response.success && Array.isArray(response.data)) {
        studentsData = response.data;
      } else if (Array.isArray(response)) {
        studentsData = response;
      }
      
      // Transform backend data to match your format
      const transformedData = studentsData.map((item) => ({
        id: item._id || item.id,
        firstName: item.name?.split(' ')[0] || '',
        lastName: item.name?.split(' ')[1] || '',
        dateOfBirth: item.dateOfBirth || '',
        gender: item.gender || '',
        class: item.class === 'PKG' ? 'Pre-KG' : item.class,
        email: item.email || '',
        phoneNumber: item.contact || item.parentPhone || '',
        fatherName: item.fatherName || '',
        motherName: item.motherName || '',
        motherEmail: item.parentEmail || '',
        motherPhone: item.motherPhone || '',
        address: item.address || '',
        rollNumber: item.rollNumber
      }));
      
      setStudents(transformedData);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh function - manually reload students
  const refreshStudents = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
    toast.success('Student list refreshed');
  };

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // ==================== VALIDATION FUNCTIONS ====================
  
  const validateAndFormatName = (value) => {
    return value.replace(/[^A-Za-z\s]/g, '');
  };

  const validateAndFormatPhone = (value) => {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    return numbersOnly.slice(0, 10);
  };

  const validateEmailFormat = (email) => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDateOfBirth = (dob) => {
    if (!dob) return { isValid: false, error: 'Date of birth is required' };
    
    const birthDate = new Date(dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (birthDate >= today) {
      return { isValid: false, error: 'Date of birth cannot be today or a future date' };
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 2) {
      return { isValid: false, error: 'Student must be at least 2 years old' };
    }
    if (age > 6) {
      return { isValid: false, error: 'Student cannot be older than 6 years for Pre-KG to UKG' };
    }
    
    return { isValid: true, error: null };
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split('T')[0];
  };

  // ==================== HANDLE INPUT CHANGES ====================
  
  const handleFirstNameChange = (value) => {
    const formattedValue = validateAndFormatName(value);
    setFormData({ ...formData, firstName: formattedValue });
    if (formErrors.firstName) setFormErrors({ ...formErrors, firstName: null });
  };

  const handleLastNameChange = (value) => {
    const formattedValue = validateAndFormatName(value);
    setFormData({ ...formData, lastName: formattedValue });
    if (formErrors.lastName) setFormErrors({ ...formErrors, lastName: null });
  };

  const handleFatherNameChange = (value) => {
    const formattedValue = validateAndFormatName(value);
    setFormData({ ...formData, fatherName: formattedValue });
    if (formErrors.fatherName) setFormErrors({ ...formErrors, fatherName: null });
  };

  const handleMotherNameChange = (value) => {
    const formattedValue = validateAndFormatName(value);
    setFormData({ ...formData, motherName: formattedValue });
    if (formErrors.motherName) setFormErrors({ ...formErrors, motherName: null });
  };

  const handlePhoneNumberChange = (value) => {
    const formattedValue = validateAndFormatPhone(value);
    setFormData({ ...formData, phoneNumber: formattedValue });
    if (formErrors.phoneNumber) setFormErrors({ ...formErrors, phoneNumber: null });
  };

  const handleMotherPhoneChange = (value) => {
    const formattedValue = validateAndFormatPhone(value);
    setFormData({ ...formData, motherPhone: formattedValue });
    if (formErrors.motherPhone) setFormErrors({ ...formErrors, motherPhone: null });
  };

  const handleEmailChange = (value) => {
    setFormData({ ...formData, email: value });
    if (formErrors.email) setFormErrors({ ...formErrors, email: null });
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmailFormat(formData.email)) {
      setFormErrors({ ...formErrors, email: 'Please enter a valid email address' });
    } else {
      setFormErrors({ ...formErrors, email: null });
    }
  };

  const handleMotherEmailChange = (value) => {
    setFormData({ ...formData, motherEmail: value });
    if (formErrors.motherEmail) setFormErrors({ ...formErrors, motherEmail: null });
  };

  const handleMotherEmailBlur = () => {
    if (formData.motherEmail && !validateEmailFormat(formData.motherEmail)) {
      setFormErrors({ ...formErrors, motherEmail: 'Please enter a valid email address' });
    } else {
      setFormErrors({ ...formErrors, motherEmail: null });
    }
  };

  const handleAddressChange = (value) => {
    setFormData({ ...formData, address: value });
    if (formErrors.address) setFormErrors({ ...formErrors, address: null });
  };

  const handleDateOfBirthChange = (value) => {
    setFormData({ ...formData, dateOfBirth: value });
    if (formErrors.dateOfBirth) setFormErrors({ ...formErrors, dateOfBirth: null });
  };

  // ==================== FORM VALIDATION BEFORE SAVE ====================
  
  const validateFormBeforeSave = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    const dobValidation = validateDateOfBirth(formData.dateOfBirth);
    if (!dobValidation.isValid) {
      errors.dateOfBirth = dobValidation.error;
    }
    
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    
    if (!formData.class) {
      errors.class = 'Class is required';
    }
    
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (formData.phoneNumber.length !== 10) {
      errors.phoneNumber = 'Phone number must be exactly 10 digits';
    }
    
    if (!formData.fatherName.trim()) {
      errors.fatherName = 'Father\'s name is required';
    } else if (formData.fatherName.length < 2) {
      errors.fatherName = 'Father\'s name must be at least 2 characters';
    }
    
    if (!formData.motherName.trim()) {
      errors.motherName = 'Mother\'s name is required';
    } else if (formData.motherName.length < 2) {
      errors.motherName = 'Mother\'s name must be at least 2 characters';
    }
    
    if (formData.motherPhone && formData.motherPhone.length !== 10) {
      errors.motherPhone = 'Mother\'s phone must be exactly 10 digits';
    }
    
    if (formData.email && !validateEmailFormat(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.motherEmail && !validateEmailFormat(formData.motherEmail)) {
      errors.motherEmail = 'Please enter a valid mother\'s email address';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.length < 5) {
      errors.address = 'Address must be at least 5 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== CRUD OPERATIONS WITH BACKEND ====================
  
  const resetForm = () => {
    setEditingStudent(null);
    setFormErrors({});
    setFormData({
      firstName: '', lastName: '', dateOfBirth: '', gender: '', class: 'Pre-KG',
      email: '', phoneNumber: '', fatherName: '', motherName: '',
      motherEmail: '', motherPhone: '', address: ''
    });
  };

  const saveStudent = async () => {
    if (!validateFormBeforeSave()) {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError);
      return;
    }

    const classMapping = {
      'Pre-KG': 'PKG',
      'LKG': 'LKG',
      'UKG': 'UKG'
    };

    const studentData = {
      name: `${formData.firstName} ${formData.lastName}`,
      rollNumber: editingStudent?.rollNumber || `STU${Date.now()}`,
      class: classMapping[formData.class] || formData.class,
      contact: formData.phoneNumber,
      email: formData.email,
      parentEmail: formData.motherEmail,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      parentPhone: formData.phoneNumber,
      attendance: 0,
      gender: formData.gender,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth
    };

    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, studentData);
        toast.success('Student updated successfully');
      } else {
        await studentService.create(studentData);
        toast.success('Student added successfully');
      }
      await loadStudents();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(error.message || 'Failed to save student');
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || '',
      class: student.class || 'Pre-KG',
      email: student.email || '',
      phoneNumber: student.phoneNumber || '',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      motherEmail: student.motherEmail || '',
      motherPhone: student.motherPhone || '',
      address: student.address || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const deleteStudent = async (student) => {
    const fullName = `${student.firstName} ${student.lastName}`;
    if (window.confirm(`Are you sure you want to delete ${fullName}?`)) {
      try {
        await studentService.delete(student.id);
        toast.success('Student deleted successfully');
        await loadStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error(error.message || 'Failed to delete student');
      }
    }
  };

  const getDisplayStudents = () => {
    let filteredStudents = [...students];
    
    if (selectedClass !== 'All Classes') {
      filteredStudents = filteredStudents.filter(s => s.class === selectedClass);
    }
    
    if (searchQuery) {
      filteredStudents = filteredStudents.filter(s => 
        s.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.fatherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.motherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phoneNumber?.includes(searchQuery)
      );
    }
    
    return filteredStudents;
  };

  const exportToCSV = () => {
    const data = getDisplayStudents();
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    const csv = [['First Name', 'Last Name', 'Date of Birth', 'Gender', 'Class', 'Email', 'Phone', 'Father Name', 'Mother Name', 'Mother Email', 'Mother Phone', 'Address']];
    data.forEach(s => {
      csv.push([
        s.firstName, s.lastName, s.dateOfBirth, s.gender, s.class, s.email || '', 
        s.phoneNumber, s.fatherName, s.motherName, s.motherEmail || '', 
        s.motherPhone || '', s.address
      ]);
    });
    
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  if (loading && students.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-800">Student Information</h1>
          <p className="text-gray-500 mt-1">Manage all student records</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={refreshStudents} variant="outline" icon={RefreshCw} disabled={refreshing}>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={exportToCSV} variant="outline" icon={Download}>Export</Button>
          <Button onClick={openAddModal} icon={Plus}>Add Student</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option>All Classes</option>
            <option>Pre-KG</option>
            <option>LKG</option>
            <option>UKG</option>
          </select>
          
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, father name, mother name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">First Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOB</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Father Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mother Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getDisplayStudents().map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{student.firstName}</td>
                  <td className="px-4 py-3 text-sm font-medium">{student.lastName}</td>
                  <td className="px-4 py-3 text-sm">{student.dateOfBirth}</td>
                  <td className="px-4 py-3 text-sm">{student.gender}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {student.class}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{student.fatherName}</td>
                  <td className="px-4 py-3 text-sm">{student.motherName}</td>
                  <td className="px-4 py-3 text-sm">{student.phoneNumber}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedStudent(student); setIsViewModalOpen(true); }} className="p-1 text-gray-600 hover:bg-gray-100 rounded"><Eye size={18} /></button>
                      <button onClick={() => openEditModal(student)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                      <button onClick={() => deleteStudent(student)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {getDisplayStudents().length === 0 && (
            <div className="text-center py-8 text-gray-500">No students found</div>
          )}
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingStudent ? 'Edit Student' : 'Add New Student'} size="lg">
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input 
                type="text" 
                value={formData.firstName} 
                onChange={(e) => handleFirstNameChange(e.target.value)} 
                placeholder="Only letters A-Z allowed"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
              <p className="text-xs text-gray-400 mt-1">Letters and spaces only</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input 
                type="text" 
                value={formData.lastName} 
                onChange={(e) => handleLastNameChange(e.target.value)} 
                placeholder="Only letters A-Z allowed"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
              <p className="text-xs text-gray-400 mt-1">Letters and spaces only</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input 
                type="date" 
                value={formData.dateOfBirth} 
                onChange={(e) => handleDateOfBirthChange(e.target.value)} 
                max={getMaxDate()}
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{formErrors.dateOfBirth}</p>}
              <p className="text-xs text-gray-400 mt-1">Must be a past date. Age must be between 2-6 years.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className={`w-full px-4 py-2 border rounded-lg ${formErrors.gender ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select</option>
                <option>Boy</option>
                <option>Girl</option>
              </select>
              {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
              <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} className={`w-full px-4 py-2 border rounded-lg ${formErrors.class ? 'border-red-500' : 'border-gray-300'}`}>
                <option>Pre-KG</option>
                <option>LKG</option>
                <option>UKG</option>
              </select>
              {formErrors.class && <p className="text-red-500 text-xs mt-1">{formErrors.class}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
              <input 
                type="text" 
                value={formData.fatherName} 
                onChange={(e) => handleFatherNameChange(e.target.value)} 
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.fatherName ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.fatherName && <p className="text-red-500 text-xs mt-1">{formErrors.fatherName}</p>}
              <p className="text-xs text-gray-400 mt-1">Letters and spaces only</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name *</label>
              <input 
                type="text" 
                value={formData.motherName} 
                onChange={(e) => handleMotherNameChange(e.target.value)} 
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.motherName ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.motherName && <p className="text-red-500 text-xs mt-1">{formErrors.motherName}</p>}
              <p className="text-xs text-gray-400 mt-1">Letters and spaces only</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input 
                type="text" 
                value={formData.phoneNumber} 
                onChange={(e) => handlePhoneNumberChange(e.target.value)} 
                placeholder="10-digit mobile number"
                maxLength="10"
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>}
              <p className="text-xs text-gray-400 mt-1">Exactly 10 digits (numbers only)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Phone</label>
              <input 
                type="text" 
                value={formData.motherPhone} 
                onChange={(e) => handleMotherPhoneChange(e.target.value)} 
                placeholder="10-digit mobile number"
                maxLength="10"
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.motherPhone ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.motherPhone && <p className="text-red-500 text-xs mt-1">{formErrors.motherPhone}</p>}
              <p className="text-xs text-gray-400 mt-1">Optional - Exactly 10 digits if provided</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleEmailChange(e.target.value)} 
                onBlur={handleEmailBlur}
                placeholder="name@example.com"
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Email</label>
              <input 
                type="email" 
                value={formData.motherEmail} 
                onChange={(e) => handleMotherEmailChange(e.target.value)} 
                onBlur={handleMotherEmailBlur}
                placeholder="mother@example.com"
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.motherEmail ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.motherEmail && <p className="text-red-500 text-xs mt-1">{formErrors.motherEmail}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea 
                value={formData.address} 
                onChange={(e) => handleAddressChange(e.target.value)} 
                rows="2" 
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button onClick={saveStudent} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">Save Student</button>
            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* View Student Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Student Details" size="lg">
        {selectedStudent && (
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">First Name</p><p className="font-medium">{selectedStudent.firstName}</p></div>
              <div><p className="text-sm text-gray-500">Last Name</p><p className="font-medium">{selectedStudent.lastName}</p></div>
              <div><p className="text-sm text-gray-500">Date of Birth</p><p className="font-medium">{selectedStudent.dateOfBirth}</p></div>
              <div><p className="text-sm text-gray-500">Gender</p><p className="font-medium">{selectedStudent.gender}</p></div>
              <div><p className="text-sm text-gray-500">Class</p><p className="font-medium">{selectedStudent.class}</p></div>
              <div><p className="text-sm text-gray-500">Father's Name</p><p className="font-medium">{selectedStudent.fatherName}</p></div>
              <div><p className="text-sm text-gray-500">Mother's Name</p><p className="font-medium">{selectedStudent.motherName}</p></div>
              <div><p className="text-sm text-gray-500">Phone Number</p><p className="font-medium">{selectedStudent.phoneNumber}</p></div>
              <div><p className="text-sm text-gray-500">Mother's Phone</p><p className="font-medium">{selectedStudent.motherPhone || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{selectedStudent.email || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Mother's Email</p><p className="font-medium">{selectedStudent.motherEmail || 'N/A'}</p></div>
              <div className="col-span-2"><p className="text-sm text-gray-500">Address</p><p className="font-medium">{selectedStudent.address}</p></div>
            </div>
            <button onClick={() => setIsViewModalOpen(false)} className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentDatabase;