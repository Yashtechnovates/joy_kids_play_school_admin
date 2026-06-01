import { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Plus, Search, Edit, Trash2, Eye, Upload, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { eventService } from '../services/eventService';

const CulturalEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eventType, setEventType] = useState('upcoming');
  const [formData, setFormData] = useState({
    title: '', date: '', time: '', venue: '', description: '', imageData: null, imageUrl: ''
  });

  // ==================== VALIDATION FUNCTIONS ====================
  const validateAndFormatName = (value) => {
    return value.replace(/[^A-Za-z\s]/g, '');
  };

  const compressImage = (base64String, maxWidth = 800, maxHeight = 500, quality = 0.7) => {
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
    
    if (!formData.title.trim()) {
      errors.title = 'Event title is required';
    } else {
      const formattedTitle = validateAndFormatName(formData.title);
      if (formattedTitle !== formData.title) {
        errors.title = 'Event title should contain only letters and spaces';
      }
    }
    
    if (!formData.venue.trim()) {
      errors.venue = 'Venue is required';
    }
    
    if (!formData.date) {
      errors.date = 'Event date is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }
    
    if (!formData.imageData && !formData.imageUrl) {
      errors.image = 'Event image is required';
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
          const compressedImage = await compressImage(event.target.result, 800, 500, 0.7);
          setFormData({ ...formData, imageData: compressedImage, imageUrl: '' });
          setPreviewImage(compressedImage);
          if (formErrors.image) setFormErrors({ ...formErrors, image: null });
        };
        reader.readAsDataURL(file);
        toast.success('Image uploaded successfully');
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
        const compressedImage = await compressImage(event.target.result, 800, 500, 0.7);
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
  const handleTitleChange = (value) => {
    const formattedValue = validateAndFormatName(value);
    setFormData({ ...formData, title: formattedValue });
    if (formErrors.title) setFormErrors({ ...formErrors, title: null });
  };

  // ==================== LOAD DATA FROM BACKEND API ====================
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await eventService.getAll();
      console.log('Raw API Response:', response);
      
      let eventsData = response?.data || response || [];
      console.log('Total events:', eventsData.length);
      
      // Filter by eventType
      const upcoming = eventsData.filter(e => e.eventType === 'upcoming');
      const past = eventsData.filter(e => e.eventType === 'past');
      
      console.log('Upcoming events:', upcoming.length);
      console.log('Past events:', past.length);
      
      const transformEvent = (event) => ({
        id: event._id || event.id,
        title: event.title,
        date: event.date,
        time: event.time || '',
        venue: event.venue || '',
        description: event.description,
        imageUrl: event.image || '',
      });
      
      setUpcomingEvents(upcoming.map(transformEvent));
      setPastEvents(past.map(transformEvent));
    } catch (err) {
      console.error('Error loading events:', err);
      toast.error('Failed to load events from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const resetForm = () => {
    setEditingEvent(null);
    setFormErrors({});
    setPreviewImage(null);
    setFormData({
      title: '', date: '', time: '', venue: '', description: '', imageData: null, imageUrl: ''
    });
  };

  const saveEvent = async () => {
    if (!validateFormBeforeSave()) {
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError);
      return;
    }

    setSaving(true);

    const eventData = {
      title: formData.title,
      date: formData.date,
      time: formData.time || '',
      venue: formData.venue,
      badge: formData.title.substring(0, 20),
      tag: eventType === 'upcoming' ? 'Upcoming Event' : 'Past Event',
      description: formData.description,
      image: formData.imageData || formData.imageUrl || '',
      icon: eventType === 'upcoming' ? '📅' : '🎭',
      imagePosition: 'left',
      eventType: eventType
    };

    console.log('Saving event with type:', eventType, eventData);

    try {
      if (editingEvent) {
        await eventService.update(editingEvent.id, eventData);
        toast.success('Event updated successfully');
      } else {
        await eventService.create(eventData);
        toast.success(`${eventType === 'upcoming' ? 'Upcoming' : 'Past'} event added successfully`);
      }
      
      await loadEvents();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving event:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = (type) => {
    setEventType(type);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (event, type) => {
    setEventType(type);
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time || '',
      venue: event.venue || '',
      description: event.description || '',
      imageData: null,
      imageUrl: event.imageUrl
    });
    setPreviewImage(event.imageUrl);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const deleteEvent = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await eventService.delete(event.id);
        toast.success('Event deleted successfully');
        await loadEvents();
      } catch (err) {
        console.error('Error deleting event:', err);
        toast.error('Failed to delete event');
      }
    }
  };

  const exportToCSV = () => {
    const events = activeTab === 'upcoming' ? upcomingEvents : pastEvents;
    if (events.length === 0) {
      toast.error('No data to export');
      return;
    }
    const csv = [['Title', 'Date', 'Time', 'Venue', 'Description']];
    events.forEach(e => {
      csv.push([e.title, e.date, e.time || '', e.venue, e.description || '']);
    });
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_events_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const filterEvents = (events) => {
    if (!searchQuery) return events;
    return events.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredUpcoming = filterEvents(upcomingEvents);
  const filteredPast = filterEvents(pastEvents);
  const displayEvents = activeTab === 'upcoming' ? filteredUpcoming : filteredPast;

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
          <h1 className="text-3xl font-bold text-gray-800">Cultural Events Management</h1>
          <p className="text-gray-500 mt-1">Manage upcoming and past events separately</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToCSV} variant="outline" icon={Calendar}>Export</Button>
          <Button onClick={() => openAddModal('upcoming')} variant="outline" icon={Plus}>Add Upcoming Event</Button>
          <Button onClick={() => openAddModal('past')} icon={Plus}>Add Past Event</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === 'past' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayEvents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No {activeTab} events found. Click "Add {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Event" to create one.
                  </td>
                </tr>
              ) : (
                displayEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">
                      <img 
  src={event.imageUrl} 
  alt={event.title} 
  className="w-12 h-12 object-cover rounded-lg" 
  onError={(e) => {
    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(event.title) + '&background=3b82f6&color=fff&bold=true';
  }} 
/>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{event.title}</td>
                    <td className="px-4 py-3 text-sm">{event.date} {event.time ? `| ${event.time}` : ''}</td>
                    <td className="px-4 py-3 text-sm">{event.venue || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedEvent(event); setIsViewModalOpen(true); }} className="p-1 text-gray-600 hover:bg-gray-100 rounded"><Eye size={18} /></button>
                        <button onClick={() => openEditModal(event, activeTab)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                        <button onClick={() => deleteEvent(event)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingEvent ? 'Edit Event' : `Add ${eventType === 'upcoming' ? 'Upcoming' : 'Past'} Event`} size="lg">
        <div className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => handleTitleChange(e.target.value)} 
              className={`w-full px-4 py-2 border rounded-lg ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="e.g., Annual Day Celebration"
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})} 
                className={`w-full px-4 py-2 border rounded-lg ${formErrors.date ? 'border-red-500' : 'border-gray-300'}`} 
              />
              {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input 
                type="text" 
                value={formData.time} 
                onChange={(e) => setFormData({...formData, time: e.target.value})} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                placeholder="10:00 AM" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
            <input 
              type="text" 
              value={formData.venue} 
              onChange={(e) => setFormData({...formData, venue: e.target.value})} 
              className={`w-full px-4 py-2 border rounded-lg ${formErrors.venue ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="School Auditorium, Main Ground, etc."
            />
            {formErrors.venue && <p className="text-red-500 text-xs mt-1">{formErrors.venue}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Image *</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                ${formErrors.image ? 'border-red-500' : ''}`}
              onClick={() => document.getElementById('eventImageInput').click()}
            >
              {previewImage ? (
                <div className="relative inline-block">
                  <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                  <button onClick={(e) => { e.stopPropagation(); removeImage(); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Drag & drop an event image here, or click to select</p>
                  <p className="text-xs text-gray-400 mt-1">Required for all events</p>
                </>
              )}
              <input id="eventImageInput" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
            {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              rows="8" 
              className={`w-full px-4 py-2 border rounded-lg ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Write a detailed description of the event..."
            />
            {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
            <p className="text-xs text-gray-400 mt-1">Minimum 20 characters</p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button onClick={saveEvent} disabled={saving} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50">
              {saving ? 'Saving...' : (editingEvent ? 'Update Event' : 'Save Event')}
            </button>
            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* View Event Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={selectedEvent?.title} size="lg">
        {selectedEvent && (
          <div className="space-y-4 p-6">
            {selectedEvent.imageUrl && (
              <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-64 object-cover rounded-lg" />
            )}
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Date & Time</p><p className="font-medium">{selectedEvent.date} {selectedEvent.time ? `| ${selectedEvent.time}` : ''}</p></div>
              <div><p className="text-sm text-gray-500">Venue</p><p className="font-medium">{selectedEvent.venue}</p></div>
            </div>
            <div><p className="text-sm text-gray-500">Description</p><p className="text-gray-700 mt-1">{selectedEvent.description}</p></div>
            <button onClick={() => setIsViewModalOpen(false)} className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CulturalEvents;