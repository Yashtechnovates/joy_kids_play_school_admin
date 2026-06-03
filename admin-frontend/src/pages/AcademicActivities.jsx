import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Download, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { reportService } from '../services/dailyReportAPI';

const AcademicActivities = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentClass: '',
    date: '',
    todayActivity: '',
    participation: 'Present',
    healthStatus: 'Good',
    behavior: 'Good',
    teacherNote: '',
    studentImage: null,
    studentImageUrl: ''
  });

  // Validation functions
  const validateAndFormatName = (value) => {
    return value.replace(/[^A-Za-z\s]/g, '');
  };

  const validateDate = (dateString) => {
    if (!dateString) return { isValid: false, error: 'Date is required' };
    const selectedDateObj = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDateObj > today) {
      return { isValid: false, error: 'Cannot add report for future dates' };
    }
    return { isValid: true, error: null };
  };

  const validateFormBeforeSave = () => {
    const errors = {};
    if (!formData.studentName.trim()) errors.studentName = 'Student name is required';
    if (!formData.studentId.trim()) errors.studentId = 'Student ID is required';
    if (!formData.studentClass) errors.studentClass = 'Class is required';
    
    const dateValidation = validateDate(formData.date);
    if (!dateValidation.isValid) errors.date = dateValidation.error;
    
    if (!formData.todayActivity.trim()) errors.todayActivity = 'Activity is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getMaxDate = () => new Date().toISOString().split('T')[0];

  // Class mapping for display
  const mapClassForDisplay = (classValue) => {
    const mapping = {
      'PKG': 'Pre-KG',
      'LKG': 'LKG',
      'UKG': 'UKG'
    };
    return mapping[classValue] || classValue || 'Pre-KG';
  };

  // Class mapping for database storage
  const mapClassForDatabase = (classValue) => {
    const mapping = {
      'Pre-KG': 'PKG',
      'LKG': 'LKG',
      'UKG': 'UKG'
    };
    return mapping[classValue] || classValue;
  };

  // Drag & Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, studentImage: event.target.result, studentImageUrl: '' });
        setPreviewImage(event.target.result);
        if (formErrors.studentImage) setFormErrors({ ...formErrors, studentImage: null });
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully');
    } else if (file) {
      toast.error('Please upload an image file');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, studentImage: event.target.result, studentImageUrl: '' });
        setPreviewImage(event.target.result);
        if (formErrors.studentImage) setFormErrors({ ...formErrors, studentImage: null });
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully');
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, studentImage: null, studentImageUrl: '' });
    setPreviewImage(null);
  };

  // Load data from backend
  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await reportService.getAll();
      console.log('Admin API Response:', response);
      
      let reportsData = [];
      if (response && response.success === true && Array.isArray(response.data)) {
        reportsData = response.data;
      } else if (Array.isArray(response)) {
        reportsData = response;
      } else if (response && Array.isArray(response.data)) {
        reportsData = response.data;
      }
      
      console.log('Reports loaded:', reportsData.length);
      
      const formattedReports = reportsData.map(report => ({
        id: report._id || report.id,
        studentId: report.id,
        studentName: report.name,
        studentClass: mapClassForDisplay(report.class),
        date: report.date ? new Date(report.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        todayActivity: report.todayActivity,
        participation: report.participation === true ? 'Present' : 'Absent',
        healthStatus: report.health === 'good' ? 'Good' : report.health === 'sick' ? 'Poor' : 'Good',
        behavior: report.behavior === 'excellent' ? 'Excellent' : report.behavior === 'good' ? 'Good' : 'Fair',
        teacherNote: report.teacherNote || '',
        studentImageUrl: report.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.name)}&background=3b82f6&color=fff`
      }));
      
      setReports(formattedReports);
    } catch (err) {
      console.error('Error loading reports:', err);
      toast.error('Failed to load reports from server');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const resetForm = () => {
    setEditingReport(null);
    setFormErrors({});
    setPreviewImage(null);
    setFormData({
      studentId: '',
      studentName: '',
      studentClass: '',
      date: new Date().toISOString().split('T')[0],
      todayActivity: '',
      participation: 'Present',
      healthStatus: 'Good',
      behavior: 'Good',
      teacherNote: '',
      studentImage: null,
      studentImageUrl: ''
    });
  };

  const saveReport = async () => {
    if (!validateFormBeforeSave()) {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError);
      return;
    }

    setSaving(true);

    const reportData = {
      id: formData.studentId,
      name: formData.studentName,
      class: mapClassForDatabase(formData.studentClass),
      profileImg: formData.studentImage || formData.studentImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.studentName)}&background=3b82f6&color=fff`,
      todayActivity: formData.todayActivity,
      participation: formData.participation === 'Present',
      health: formData.healthStatus === 'Good' ? 'good' : formData.healthStatus === 'Poor' ? 'sick' : 'average',
      behavior: formData.behavior === 'Excellent' ? 'excellent' : formData.behavior === 'Good' ? 'good' : 'average',
      teacherNote: formData.teacherNote || '',
      date: formData.date ? new Date(formData.date) : new Date()
    };

    console.log('📤 Saving report with class:', reportData.class);

    try {
      let response;
      if (editingReport) {
        response = await reportService.update(editingReport.id, reportData);
        toast.success('Report updated successfully');
      } else {
        response = await reportService.create(reportData);
        toast.success('Report added successfully');
      }
      
      await loadReports();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving report:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (report) => {
    setEditingReport(report);
    setFormData({
      studentId: report.studentId,
      studentName: report.studentName,
      studentClass: report.studentClass,
      date: report.date,
      todayActivity: report.todayActivity,
      participation: report.participation,
      healthStatus: report.healthStatus,
      behavior: report.behavior,
      teacherNote: report.teacherNote || '',
      studentImage: null,
      studentImageUrl: report.studentImageUrl || ''
    });
    setPreviewImage(report.studentImageUrl);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const deleteReport = async (report) => {
    if (window.confirm(`Are you sure you want to delete the report for ${report.studentName}?`)) {
      try {
        await reportService.delete(report.id);
        toast.success('Report deleted successfully');
        await loadReports();
      } catch (err) {
        console.error('Error deleting report:', err);
        toast.error('Failed to delete report');
      }
    }
  };

  const exportToCSV = () => {
    const data = filteredReports;
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }
    const csv = [['Student ID', 'Student Name', 'Class', 'Date', 'Activity', 'Participation', 'Health', 'Behavior']];
    data.forEach(r => {
      csv.push([r.studentId, r.studentName, r.studentClass, r.date, r.todayActivity, r.participation, r.healthStatus, r.behavior]);
    });
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily_reports_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const filteredReports = reports.filter(report => {
    let matchesClass = true;
    let matchesDate = true;
    let matchesSearch = true;
    
    if (selectedClass !== 'All Classes') {
      matchesClass = report.studentClass === selectedClass;
    }
    if (selectedDate) {
      matchesDate = report.date === selectedDate;
    }
    if (searchQuery) {
      matchesSearch = report.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      report.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return matchesClass && matchesDate && matchesSearch;
  });

  const uniqueClasses = ['All Classes', ...new Set(reports.map(r => r.studentClass))];

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
          <h1 className="text-3xl font-bold text-gray-800">Daily Student Reports</h1>
          <p className="text-gray-500 mt-1">Track daily activities, participation, health, and behavior</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToCSV} variant="outline" icon={Download}>Export</Button>
          <Button onClick={openAddModal} icon={Plus}>Add Report</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by student name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            {uniqueClasses.map(cls => <option key={cls}>{cls}</option>)}
          </select>
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={getMaxDate()}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          {selectedDate && (
            <button 
              onClick={() => setSelectedDate('')}
              className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Clear Date
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Behavior</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500">
                    No reports found. Click "Add Report" to create one.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img 
                        src={report.studentImageUrl} 
                        alt={report.studentName} 
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(report.studentName)}&background=3b82f6&color=fff`}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">{report.studentId}</td>
                    <td className="px-4 py-3 text-sm font-medium">{report.studentName}</td>
                    <td className="px-4 py-3 text-sm">{report.studentClass}</td>
                    <td className="px-4 py-3 text-sm">{report.date}</td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate">{report.todayActivity}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.participation === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {report.participation}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {report.healthStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                        {report.behavior}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedReport(report); setIsViewModalOpen(true); }} 
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openEditModal(report)} 
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Report"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteReport(report)} 
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Report"
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

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingReport ? 'Edit Report' : 'Add New Report'} size="lg">
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo</label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                  ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                  ${formErrors.studentImage ? 'border-red-500' : ''}`}
                onClick={() => document.getElementById('imageInput').click()}
              >
                {previewImage ? (
                  <div className="relative inline-block">
                    <img src={previewImage} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto" />
                    <button onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Drag & drop or click to upload</p>
                  </>
                )}
                <input id="imageInput" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
              <input 
                type="text" 
                value={formData.studentId} 
                onChange={(e) => setFormData({...formData, studentId: e.target.value})} 
                className="w-full px-4 py-2 border rounded-lg" 
              />
              {formErrors.studentId && <p className="text-red-500 text-xs">{formErrors.studentId}</p>}
            </div>
            
            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
              <input 
                type="text" 
                value={formData.studentName} 
                onChange={(e) => setFormData({...formData, studentName: validateAndFormatName(e.target.value)})} 
                className="w-full px-4 py-2 border rounded-lg" 
              />
              {formErrors.studentName && <p className="text-red-500 text-xs">{formErrors.studentName}</p>}
            </div>
            
            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
              <select 
                value={formData.studentClass} 
                onChange={(e) => setFormData({...formData, studentClass: e.target.value})} 
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select</option>
                <option>Pre-KG</option>
                <option>LKG</option>
                <option>UKG</option>
              </select>
              {formErrors.studentClass && <p className="text-red-500 text-xs">{formErrors.studentClass}</p>}
            </div>
            
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                max={getMaxDate()} 
                className="w-full px-4 py-2 border rounded-lg" 
              />
              {formErrors.date && <p className="text-red-500 text-xs">{formErrors.date}</p>}
            </div>
            
            {/* Today's Activity */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Today's Activity *</label>
              <textarea 
                value={formData.todayActivity} 
                onChange={(e) => setFormData({...formData, todayActivity: e.target.value})} 
                rows="2" 
                className="w-full px-4 py-2 border rounded-lg" 
                placeholder="Describe the activity..."
              />
              {formErrors.todayActivity && <p className="text-red-500 text-xs">{formErrors.todayActivity}</p>}
            </div>
            
            {/* Participation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Participation</label>
              <select 
                value={formData.participation} 
                onChange={(e) => setFormData({...formData, participation: e.target.value})} 
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option>Present</option>
                <option>Absent</option>
              </select>
            </div>
            
            {/* Health Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Health Status</label>
              <select 
                value={formData.healthStatus} 
                onChange={(e) => setFormData({...formData, healthStatus: e.target.value})} 
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
            
            {/* Behavior */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Behavior</label>
              <select 
                value={formData.behavior} 
                onChange={(e) => setFormData({...formData, behavior: e.target.value})} 
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
              </select>
            </div>
            
            {/* Teacher Note */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher's Note</label>
              <textarea 
                value={formData.teacherNote} 
                onChange={(e) => setFormData({...formData, teacherNote: e.target.value})} 
                rows="2" 
                className="w-full px-4 py-2 border rounded-lg" 
                placeholder="Any additional notes..."
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              onClick={saveReport} 
              disabled={saving}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : (editingReport ? 'Update Report' : 'Save Report')}
            </button>
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* View Report Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Report Details" size="lg">
        {selectedReport && (
          <div className="space-y-4 p-6">
            <div className="flex justify-center">
              <img 
                src={selectedReport.studentImageUrl} 
                alt={selectedReport.studentName} 
                className="w-24 h-24 rounded-full object-cover" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-gray-500">Student ID</p><p className="font-medium">{selectedReport.studentId}</p></div>
              <div><p className="text-gray-500">Student Name</p><p className="font-medium">{selectedReport.studentName}</p></div>
              <div><p className="text-gray-500">Class</p><p className="font-medium">{selectedReport.studentClass}</p></div>
              <div><p className="text-gray-500">Date</p><p className="font-medium">{selectedReport.date}</p></div>
              <div><p className="text-gray-500">Participation</p><p className="font-medium">{selectedReport.participation}</p></div>
              <div><p className="text-gray-500">Health</p><p className="font-medium">{selectedReport.healthStatus}</p></div>
              <div><p className="text-gray-500">Behavior</p><p className="font-medium">{selectedReport.behavior}</p></div>
            </div>
            <div>
              <p className="text-gray-500">Activity</p>
              <p className="text-gray-700 mt-1">{selectedReport.todayActivity}</p>
            </div>
            {selectedReport.teacherNote && (
              <div>
                <p className="text-gray-500">Teacher's Note</p>
                <p className="text-gray-700 mt-1">{selectedReport.teacherNote}</p>
              </div>
            )}
            <button onClick={() => setIsViewModalOpen(false)} className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg">
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AcademicActivities;