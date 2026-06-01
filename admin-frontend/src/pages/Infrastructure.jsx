import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Download, Eye, Upload, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { infrastructureService } from '../services/infrastructureService';

const Infrastructure = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [facilityItems, setFacilityItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [modalType, setModalType] = useState('gallery'); // 'gallery' or 'facility'
  
  // Form data for gallery (with image)
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    imageData: null,
    imagePreview: null
  });
  
  // Form data for facility (without image)
  const [facilityForm, setFacilityForm] = useState({
    title: '',
    description: ''
  });

  // Load data from backend
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await infrastructureService.getAll();
      let facilitiesData = [];
      if (response.success && Array.isArray(response.data)) {
        facilitiesData = response.data;
      } else if (Array.isArray(response)) {
        facilitiesData = response;
      }
      
      // Separate items with images (gallery) and without (facilities)
      const gallery = facilitiesData.filter(item => item.image && item.image !== '').map((item, idx) => ({
        id: item._id || item.id || idx,
        title: item.title,
        description: item.desc,
        imageUrl: item.image
      }));
      
      const facilities = facilitiesData.filter(item => !item.image || item.image === '').map((item, idx) => ({
        id: item._id || item.id || idx,
        title: item.title,
        description: item.desc
      }));
      
      setGalleryItems(gallery);
      setFacilityItems(facilities);
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // ==================== DRAG & DROP FOR GALLERY ====================
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
        setGalleryForm({
          ...galleryForm,
          imageData: event.target.result,
          imagePreview: event.target.result
        });
        setPreviewImage(event.target.result);
        if (formErrors.image) setFormErrors({ ...formErrors, image: null });
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
        setGalleryForm({
          ...galleryForm,
          imageData: event.target.result,
          imagePreview: event.target.result
        });
        setPreviewImage(event.target.result);
        if (formErrors.image) setFormErrors({ ...formErrors, image: null });
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully');
    }
  };

  const removeImage = () => {
    setGalleryForm({ ...galleryForm, imageData: null, imagePreview: null });
    setPreviewImage(null);
  };

  // ==================== VALIDATION ====================
  const validateGalleryForm = () => {
    const errors = {};
    if (!galleryForm.title.trim()) errors.title = 'Title is required';
    if (!galleryForm.description.trim()) errors.description = 'Description is required';
    if (!galleryForm.imageData && !galleryForm.imagePreview) errors.image = 'Image is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateFacilityForm = () => {
    const errors = {};
    if (!facilityForm.title.trim()) errors.title = 'Title is required';
    if (!facilityForm.description.trim()) errors.description = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==================== CRUD OPERATIONS ====================
  const resetGalleryForm = () => {
    setEditingItem(null);
    setFormErrors({});
    setPreviewImage(null);
    setGalleryForm({
      title: '',
      description: '',
      imageData: null,
      imagePreview: null
    });
  };

  const resetFacilityForm = () => {
    setEditingItem(null);
    setFormErrors({});
    setFacilityForm({
      title: '',
      description: ''
    });
  };

  // Save gallery item (with image - goes to carousel)
  const saveGalleryItem = async () => {
    if (!validateGalleryForm()) {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError);
      return;
    }

    const imageToSave = galleryForm.imageData || galleryForm.imagePreview;
    
    const facilityData = {
      icon: '🏫',
      title: galleryForm.title.trim(),
      desc: galleryForm.description.trim(),
      color: '#3b82f6',
      image: imageToSave
    };

    try {
      if (editingItem) {
        await infrastructureService.update(editingItem.id, facilityData);
        toast.success('Gallery item updated successfully');
      } else {
        await infrastructureService.create(facilityData);
        toast.success('Gallery image added successfully');
      }
      await loadItems();
      setIsModalOpen(false);
      resetGalleryForm();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error(error.message || 'Failed to save');
    }
  };

  // Save facility item (without image - goes to facilities cards)
  const saveFacilityItem = async () => {
    if (!validateFacilityForm()) {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError);
      return;
    }

    const facilityData = {
      icon: '🏫',
      title: facilityForm.title.trim(),
      desc: facilityForm.description.trim(),
      color: '#3b82f6',
      image: ''
    };

    try {
      if (editingItem) {
        await infrastructureService.update(editingItem.id, facilityData);
        toast.success('Facility updated successfully');
      } else {
        await infrastructureService.create(facilityData);
        toast.success('Facility added successfully');
      }
      await loadItems();
      setIsModalOpen(false);
      resetFacilityForm();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error(error.message || 'Failed to save');
    }
  };

  const openAddGalleryModal = () => {
    resetGalleryForm();
    setModalType('gallery');
    setIsModalOpen(true);
  };

  const openAddFacilityModal = () => {
    resetFacilityForm();
    setModalType('facility');
    setIsModalOpen(true);
  };

  const openEditModal = (item, type) => {
    setModalType(type);
    if (type === 'gallery') {
      setEditingItem(item);
      setGalleryForm({
        title: item.title || '',
        description: item.description || '',
        imageData: null,
        imagePreview: item.imageUrl || null
      });
      setPreviewImage(item.imageUrl || null);
    } else {
      setEditingItem(item);
      setFacilityForm({
        title: item.title || '',
        description: item.description || ''
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const deleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        await infrastructureService.delete(item.id);
        toast.success('Item deleted successfully');
        await loadItems();
      } catch (error) {
        console.error('Error deleting:', error);
        toast.error(error.message || 'Failed to delete');
      }
    }
  };

  const exportToCSV = () => {
    const allItems = [...galleryItems, ...facilityItems];
    if (allItems.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    const csv = [['Type', 'Title', 'Description']];
    allItems.forEach(item => {
      const type = item.imageUrl ? 'Gallery' : 'Facility';
      csv.push([type, item.title, item.description]);
    });
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infrastructure_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const filteredGallery = galleryItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFacilities = facilityItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && galleryItems.length === 0 && facilityItems.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-800">Infrastructure Management</h1>
          <p className="text-gray-500 mt-1">Manage facilities (cards) and gallery images (carousel)</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToCSV} variant="outline" icon={Download}>Export</Button>
          <Button onClick={openAddFacilityModal} variant="outline" icon={Plus}>Add Facility (Card)</Button>
          <Button onClick={openAddGalleryModal} icon={Plus}>Add Gallery Image</Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Gallery Images Table (Carousel) */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Gallery Images (Carousel)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGallery.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">No gallery images. Click "Add Gallery Image" to add.</td>
                  </tr>
                ) : (
                  filteredGallery.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover rounded" />
                      </td>
                      <td className="px-4 py-3 font-medium">{item.title}</td>
                      <td className="px-4 py-3 max-w-md truncate">{item.description}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedItem(item); setIsViewModalOpen(true); }} className="p-1 text-gray-600 hover:bg-gray-100 rounded"><Eye size={18} /></button>
                          <button onClick={() => openEditModal(item, 'gallery')} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                          <button onClick={() => deleteItem(item)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Facilities Table (Cards) */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Facilities (Cards Section)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFacilities.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-500">No facilities. Click "Add Facility (Card)" to add.</td>
                  </tr>
                ) : (
                  filteredFacilities.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{item.title}</td>
                      <td className="px-4 py-3 max-w-md truncate">{item.description}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedItem(item); setIsViewModalOpen(true); }} className="p-1 text-gray-600 hover:bg-gray-100 rounded"><Eye size={18} /></button>
                          <button onClick={() => openEditModal(item, 'facility')} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                          <button onClick={() => deleteItem(item)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal - Gallery (with Drag & Drop) */}
      <Modal isOpen={isModalOpen && modalType === 'gallery'} onClose={() => { setIsModalOpen(false); resetGalleryForm(); }} title={editingItem ? 'Edit Gallery Image' : 'Add Gallery Image'} size="lg">
        <div className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input 
              type="text" 
              value={galleryForm.title} 
              onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})} 
              className={`w-full px-4 py-2 border rounded-lg ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Smart Classroom"
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea 
              value={galleryForm.description} 
              onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})} 
              rows="2"
              className={`w-full px-4 py-2 border rounded-lg ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Brief description"
            />
            {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image *</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
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
                  <p className="text-gray-600">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-400">JPG, PNG, GIF, WEBP</p>
                </>
              )}
              <input id="imageInput" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
            {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button onClick={saveGalleryItem} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              {editingItem ? 'Update' : 'Save'} Gallery Image
            </button>
            <button onClick={() => { setIsModalOpen(false); resetGalleryForm(); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Add/Edit Modal - Facility (without image) */}
      <Modal isOpen={isModalOpen && modalType === 'facility'} onClose={() => { setIsModalOpen(false); resetFacilityForm(); }} title={editingItem ? 'Edit Facility' : 'Add Facility'} size="md">
        <div className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input 
              type="text" 
              value={facilityForm.title} 
              onChange={(e) => setFacilityForm({...facilityForm, title: e.target.value})} 
              className={`w-full px-4 py-2 border rounded-lg ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Smart Classroom"
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea 
              value={facilityForm.description} 
              onChange={(e) => setFacilityForm({...facilityForm, description: e.target.value})} 
              rows="2"
              className={`w-full px-4 py-2 border rounded-lg ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Brief description"
            />
            {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button onClick={saveFacilityItem} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              {editingItem ? 'Update' : 'Save'} Facility
            </button>
            <button onClick={() => { setIsModalOpen(false); resetFacilityForm(); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={selectedItem?.title} size="lg">
        {selectedItem && (
          <div className="space-y-4 p-6">
            {selectedItem.imageUrl ? (
              <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-64 object-cover rounded-lg" />
            ) : (
              <div className="text-center text-6xl p-8 bg-gray-100 rounded-lg">🏫</div>
            )}
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700 mt-1">{selectedItem.description}</p>
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

export default Infrastructure;