import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { syllabusService } from '../services/syllabusService';

const SyllabusManagement = () => {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [subjectInput, setSubjectInput] = useState('');
  const [formData, setFormData] = useState({
    grade: '',
    subjects: [],
    description: ''
  });

  const grades = ['Pre-KG', 'LKG', 'UKG'];

  // Load syllabus data
  const loadSyllabus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await syllabusService.getAll();
      let syllabusData = [];
      if (response && response.success === true && Array.isArray(response.data)) {
        syllabusData = response.data;
      } else if (Array.isArray(response)) {
        syllabusData = response;
      }
      setSyllabus(syllabusData);
    } catch (err) {
      console.error('Error loading syllabus:', err);
      toast.error('Failed to load syllabus data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSyllabus();
  }, [loadSyllabus]);

  const resetForm = () => {
    setEditingItem(null);
    setFormErrors({});
    setSubjectInput('');
    setFormData({
      grade: '',
      subjects: [],
      description: ''
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.grade) {
      errors.grade = 'Grade is required';
    }
    if (formData.subjects.length === 0) {
      errors.subjects = 'At least one subject is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addSubject = () => {
    if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subjectInput.trim()]
      });
      setSubjectInput('');
      if (formErrors.subjects) setFormErrors({ ...formErrors, subjects: null });
    }
  };

  const removeSubject = (subjectToRemove) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter(s => s !== subjectToRemove)
    });
  };

  const handleSubjectKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubject();
    }
  };

  const saveSyllabus = async () => {
    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError);
      return;
    }

    setSaving(true);

    const syllabusData = {
      grade: formData.grade,
      subjects: formData.subjects,
      description: formData.description
    };

    try {
      if (editingItem) {
        await syllabusService.update(editingItem._id, syllabusData);
        toast.success('Syllabus updated successfully');
      } else {
        await syllabusService.create(syllabusData);
        toast.success('Syllabus added successfully');
      }
      await loadSyllabus();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving syllabus:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to save syllabus');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      grade: item.grade,
      subjects: item.subjects || [],
      description: item.description || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const deleteSyllabus = async (item) => {
    if (window.confirm(`Are you sure you want to delete syllabus for ${item.grade}?`)) {
      try {
        await syllabusService.delete(item._id);
        toast.success('Syllabus deleted successfully');
        await loadSyllabus();
      } catch (err) {
        console.error('Error deleting syllabus:', err);
        toast.error('Failed to delete syllabus');
      }
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-800">Syllabus Management</h1>
          <p className="text-gray-500 mt-1">Manage curriculum syllabus for each grade</p>
        </div>
        <Button onClick={openAddModal} icon={Plus}>Add Syllabus</Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {syllabus.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No syllabus found. Click "Add Syllabus" to create one.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <th className="px-6 py-3 text-left text-sm font-semibold">Grade</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Subjects</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {syllabus.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.grade}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-2">
                      {item.subjects?.map((subject, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.description ? (
                      <p className="line-clamp-2">{item.description}</p>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => { setSelectedItem(item); setIsViewModalOpen(true); }}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteSyllabus(item)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Syllabus Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingItem ? 'Edit Syllabus' : 'Add New Syllabus'} size="lg">
        <div className="space-y-4 p-6">
          {/* Grade Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg ${formErrors.grade ? 'border-red-500' : 'border-gray-300'}`}
              disabled={editingItem}
            >
              <option value="">Select Grade</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            {formErrors.grade && <p className="text-red-500 text-xs mt-1">{formErrors.grade}</p>}
            {editingItem && <p className="text-xs text-gray-400 mt-1">Grade cannot be changed after creation</p>}
          </div>

          {/* Subjects - Chip Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjects *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => removeSubject(subject)}
                    className="hover:text-blue-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyPress={handleSubjectKeyPress}
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${formErrors.subjects ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Type a subject and press Enter"
              />
              <button
                type="button"
                onClick={addSubject}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            {formErrors.subjects && <p className="text-red-500 text-xs mt-1">{formErrors.subjects}</p>}
            <p className="text-xs text-gray-400 mt-1">Add subjects that will be taught in this grade</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Additional information about the curriculum..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={saveSyllabus}
              disabled={saving}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : (editingItem ? 'Update Syllabus' : 'Save Syllabus')}
            </button>
            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* View Syllabus Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={selectedItem?.grade} size="md">
        {selectedItem && (
          <div className="space-y-4 p-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Subjects</h4>
              <div className="flex flex-wrap gap-2">
                {selectedItem.subjects?.map((subject, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            {selectedItem.description && (
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h4>
                <p className="text-gray-600">{selectedItem.description}</p>
              </div>
            )}
            <button onClick={() => setIsViewModalOpen(false)} className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SyllabusManagement;