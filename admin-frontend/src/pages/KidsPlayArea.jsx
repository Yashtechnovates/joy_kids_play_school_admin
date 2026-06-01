import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Trash2, Download, Eye, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { materialService } from '../services/materialService';

const KidsPlayArea = () => {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Indoor',
    imageData: null,
    imageUrl: '',
    description: '',
    keywords: []
  });

  // ==================== VALIDATION FUNCTIONS ====================
  
  const validateAndFormatName = (value) => {
    return value.replace(/[^A-Za-z\s]/g, '');
  };

  const compressImage = (base64String, maxWidth = 300, maxHeight = 300, quality = 0.7) => {
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

  const validateFormBeforeSave = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Material name is required';
    } else {
      const formattedName = validateAndFormatName(formData.name);
      if (formattedName !== formData.name) {
        errors.name = 'Material name should contain only letters and spaces (no numbers or special characters)';
      }
    }
    
    if (!formData.imageData && !formData.imageUrl) {
      errors.image = 'Please upload an image';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (formData.keywords.length === 0) {
      errors.keywords = 'At least one keyword is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const compressedImage = await compressImage(event.target.result, 300, 300, 0.6);
          setFormData({ ...formData, imageData: compressedImage, imageUrl: '' });
          setPreviewImage(compressedImage);
          if (formErrors.image) setFormErrors({ ...formErrors, image: null });
          toast.success('Image uploaded successfully');
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  }, [formData]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const compressedImage = await compressImage(event.target.result, 300, 300, 0.6);
        setFormData({ ...formData, imageData: compressedImage, imageUrl: '' });
        setPreviewImage(compressedImage);
        if (formErrors.image) setFormErrors({ ...formErrors, image: null });
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast.error('Please upload an image file');
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imageData: null, imageUrl: '' });
    setPreviewImage(null);
  };

  // ==================== KEYWORD CHIP HANDLERS ====================
  
  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({ ...formData, keywords: [...formData.keywords, keywordInput.trim()] });
      setKeywordInput('');
      if (formErrors.keywords) setFormErrors({ ...formErrors, keywords: null });
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setFormData({ ...formData, keywords: formData.keywords.filter(k => k !== keywordToRemove) });
  };

  const handleKeywordKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  // ==================== HANDLE INPUT CHANGES ====================
  
  const handleNameChange = (value) => {
    const formattedValue = validateAndFormatName(value);
    setFormData({ ...formData, name: formattedValue });
    if (formErrors.name) setFormErrors({ ...formErrors, name: null });
  };

  // ==================== LOAD DATA FROM BACKEND API ====================
  
  const loadMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await materialService.getAll();
      console.log('API Response:', response);
      
      let materialsData = [];
      if (response && response.success === true && Array.isArray(response.data)) {
        materialsData = response.data;
      } else if (Array.isArray(response)) {
        materialsData = response;
      } else if (response && Array.isArray(response.data)) {
        materialsData = response.data;
      }
      
      // Transform backend data to match frontend format
      const formattedMaterials = materialsData.map(material => ({
        id: material._id || material.id,
        name: material.name,
        category: material.category || 'Indoor',
        imageUrl: material.image || '',
        description: material.desc || material.description,
        keywords: material.benefits || []
      }));
      
      setMaterials(formattedMaterials);
    } catch (err) {
      console.error('Error loading materials:', err);
      toast.error('Failed to load materials from server');
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const resetForm = () => {
    setEditingMaterial(null);
    setFormErrors({});
    setPreviewImage(null);
    setKeywordInput('');
    setFormData({
      name: '', category: 'Indoor', imageData: null, imageUrl: '', description: '', keywords: []
    });
  };

  const saveMaterial = async () => {
    if (!validateFormBeforeSave()) {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError);
      return;
    }

    setSaving(true);

    // Map to backend schema
    const materialData = {
      name: formData.name,
      category: formData.category,
      image: formData.imageData || formData.imageUrl || '',
      desc: formData.description,
      benefits: formData.keywords,
      color: formData.category === 'Indoor' ? '#3b82f6' : '#10b981',
      icon: formData.category === 'Indoor' ? '🎨' : '🌳'
    };

    console.log('Sending data to backend:', materialData);

    try {
      if (editingMaterial) {
        await materialService.update(editingMaterial.id, materialData);
        toast.success('Material updated successfully');
      } else {
        await materialService.create(materialData);
        toast.success('Material added successfully');
      }
      
      await loadMaterials();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving material:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to save material');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      category: material.category,
      imageData: null,
      imageUrl: material.imageUrl,
      description: material.description,
      keywords: material.keywords || []
    });
    setPreviewImage(material.imageUrl);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const deleteMaterial = async (material) => {
    if (window.confirm(`Are you sure you want to delete "${material.name}"?`)) {
      try {
        await materialService.delete(material.id);
        toast.success('Material deleted successfully');
        await loadMaterials();
      } catch (err) {
        console.error('Error deleting material:', err);
        toast.error('Failed to delete material');
      }
    }
  };

  const exportToCSV = () => {
    const data = filteredMaterials;
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }
    const csv = [['Name', 'Category', 'Description', 'Keywords']];
    data.forEach(m => {
      csv.push([m.name, m.category, m.description, m.keywords?.join(', ') || '']);
    });
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `play_materials_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const categories = ['All', 'Indoor', 'Outdoor'];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
          <h1 className="text-3xl font-bold text-gray-800">Kid's Play Area Management</h1>
          <p className="text-gray-500 mt-1">Manage Indoor and Outdoor play materials (These will appear in User Panel)</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToCSV} variant="outline" icon={Download}>Export</Button>
          <Button onClick={openAddModal} icon={Plus}>Add Material</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search materials by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keywords</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No materials found. Click "Add Material" to create one.
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">
                      <img 
                        src={material.imageUrl} 
                        alt={material.name} 
                        className="w-12 h-12 object-cover rounded-lg" 
                        onError={(e) => e.target.src = 'https://via.placeholder.com/50'} 
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{material.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${material.category === 'Indoor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {material.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate">{material.description}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {material.keywords?.slice(0, 2).map((keyword, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {keyword}
                          </span>
                        ))}
                        {material.keywords?.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{material.keywords.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedMaterial(material); setIsViewModalOpen(true); }} 
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openEditModal(material)} 
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteMaterial(material)} 
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

      {/* Add/Edit Material Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingMaterial ? 'Edit Material' : 'Add New Material'} size="lg">
        <div className="space-y-4 p-6">
          {/* Material Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material Name *</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => handleNameChange(e.target.value)} 
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="e.g., Building Blocks Set"
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            <p className="text-xs text-gray-400 mt-1">Letters and spaces only (no numbers or special characters)</p>
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option>Indoor</option>
              <option>Outdoor</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">Select Indoor or Outdoor category</p>
          </div>
          
          {/* Drag & Drop Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material Image *</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                ${formErrors.image ? 'border-red-500' : ''}`}
              onClick={() => document.getElementById('imageInput').click()}
            >
              {previewImage ? (
                <div className="relative inline-block">
                  <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
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
                  <p className="text-gray-600">Drag & drop an image here, or click to select</p>
                  <p className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, GIF, WEBP</p>
                </>
              )}
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              rows="3" 
              className={`w-full px-4 py-2 border rounded-lg ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe the material and its benefits..."
            />
            {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
            <p className="text-xs text-gray-400 mt-1">Minimum 10 characters</p>
          </div>
          
          {/* Keywords Chip Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
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
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={handleKeywordKeyPress}
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${formErrors.keywords ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Type a keyword and press Enter"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            {formErrors.keywords && <p className="text-red-500 text-xs mt-1">{formErrors.keywords}</p>}
            <p className="text-xs text-gray-400 mt-1">Add keywords that describe the material (will appear as chips in user panel)</p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              onClick={saveMaterial} 
              disabled={saving}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : (editingMaterial ? 'Update Material' : 'Save Material')}
            </button>
            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* View Material Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={selectedMaterial?.name} size="lg">
        {selectedMaterial && (
          <div className="space-y-4 p-6">
            <img 
              src={selectedMaterial.imageUrl} 
              alt={selectedMaterial.name} 
              className="w-full h-64 object-cover rounded-lg" 
              onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'} 
            />
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Category</p><p className="font-medium">{selectedMaterial.category}</p></div>
            </div>
            <div><p className="text-sm text-gray-500">Description</p><p className="text-gray-700">{selectedMaterial.description}</p></div>
            <div>
              <p className="text-sm text-gray-500">Keywords</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedMaterial.keywords?.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
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

export default KidsPlayArea;