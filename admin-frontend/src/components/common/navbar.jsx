import { useState, useEffect } from 'react';
import { Search, Bell, User, ChevronDown, X, UserPlus, CheckCircle, AlertCircle, Users, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  // Fetch pending enrollment requests count from backend
  const fetchPendingCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/enrollment/count');
      const data = await response.json();
      if (data.success) {
        setPendingRequests(data.pendingCount);
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  };

  // Load initial notifications from localStorage and fetch pending count
  useEffect(() => {
    const stored = localStorage.getItem('adminNotifications');
    if (stored) {
      const parsed = JSON.parse(stored);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    } else {
      // Default notifications
      const defaultNotifs = [
        { id: 1, title: 'Welcome to Admin Panel', message: 'You can now manage students, staff, and events', time: new Date().toISOString(), read: false, type: 'success' },
      ];
      setNotifications(defaultNotifs);
      localStorage.setItem('adminNotifications', JSON.stringify(defaultNotifs));
      setUnreadCount(1);
    }
    
    // Fetch pending enrollment requests count
    fetchPendingCount();
    
    // Poll for new requests every 10 seconds
    const interval = setInterval(fetchPendingCount, 10000);
    return () => clearInterval(interval);
  }, []);

  // Listen for new enrollment events from backend
  useEffect(() => {
    const handleNewEnrollment = (event) => {
      const { detail } = event;
      const newNotification = {
        id: Date.now(),
        type: 'enrollment',
        title: 'New Enrollment Request',
        message: detail.message || `${detail.student?.name || 'A new student'} has requested enrollment!`,
        student: detail.student,
        time: new Date().toISOString(),
        read: false
      };
      
      const updated = [newNotification, ...notifications];
      setNotifications(updated);
      localStorage.setItem('adminNotifications', JSON.stringify(updated));
      setUnreadCount(prev => prev + 1);
      setPendingRequests(prev => prev + 1);
    };
    
    window.addEventListener('new-enrollment', handleNewEnrollment);
    return () => window.removeEventListener('new-enrollment', handleNewEnrollment);
  }, [notifications]);

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));
    setUnreadCount(0);
  };

  const clearNotification = (id, e) => {
    e.stopPropagation();
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'enrollment':
        return <UserPlus size={16} className="text-green-500" />;
      case 'success':
        return <CheckCircle size={16} className="text-blue-500" />;
      default:
        return <AlertCircle size={16} className="text-yellow-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.href = `/dashboard?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Navigate to page
  const navigateTo = (path) => {
    window.location.href = path;
    setShowProfile(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4">
        <div onClick={() => navigateTo('/dashboard')} className="cursor-pointer">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-yellow-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">Manage your school efficiently</p>
        </div>

        <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              placeholder="Search students, staff, events..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Enrollment Requests Button - NEW */}
          <button 
            onClick={() => navigateTo('/enrollment-requests')}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Enrollment Requests"
          >
            <ClipboardList size={20} className="text-gray-600" />
            {pendingRequests > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequests > 9 ? '9+' : pendingRequests}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-500 hover:text-blue-700"
                        >
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setShowNotifications(false)}>
                        <X size={16} className="text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <Bell size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50' : ''}`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="flex gap-3">
                            <div className="shrink-0 mt-0.5">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-800">{notif.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{formatTime(notif.time)}</p>
                            </div>
                            <button
                              onClick={(e) => clearNotification(notif.id, e)}
                              className="shrink-0 text-gray-400 hover:text-gray-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-yellow-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
            </button>
            
            {showProfile && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium text-gray-800 text-sm">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@joyschool.com'}</p>
                  </div>
                  
                  {/* Navigation Links */}
                  <div className="p-2 border-b border-gray-100">
                    <button 
                      onClick={() => navigateTo('/dashboard')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      📊 Dashboard
                    </button>
                    <button 
                      onClick={() => navigateTo('/student-database')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      👨‍🎓 Student Database
                    </button>
                    <button 
                      onClick={() => navigateTo('/staff-details')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      👩‍🏫 Staff Details
                    </button>
                    <button 
                      onClick={() => navigateTo('/cultural-events')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      🎉 Cultural Events
                    </button>
                    <button 
                      onClick={() => navigateTo('/kids-play-area')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      🧸 Kids Play Area
                    </button>
                    <button 
                      onClick={() => navigateTo('/infrastructure')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      🏫 Infrastructure
                    </button>
                    <button 
                      onClick={() => navigateTo('/academic-activities')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      📚 Academic Activities
                    </button>
                    <button 
                      onClick={() => navigateTo('/enrollment-requests')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                    >
                      <span>📋 Enrollment Requests</span>
                      {pendingRequests > 0 && (
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {pendingRequests}
                        </span>
                      )}
                    </button>
                  </div>
                  
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      ⚙️ Profile Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;