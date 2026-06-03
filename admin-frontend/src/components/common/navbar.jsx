// import { useState } from 'react';
// import { Search, Bell, User, ChevronDown, X } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';

// const Navbar = () => {
//   const { user } = useAuth();
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const notifications = [
//     { id: 1, title: 'New Student Added', message: '5 new students enrolled this week', time: '5 min ago', read: false },
//     { id: 2, title: 'Fee Collection', message: 'Fee deadline approaching for LKG', time: '1 hour ago', read: false },
//     { id: 3, title: 'Staff Meeting', message: 'Staff meeting scheduled for tomorrow', time: '2 hours ago', read: true },
//   ];

//   return (
//     <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
//       <div className="flex items-center justify-between px-8 py-4">
//         <div>
//           <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-yellow-600 bg-clip-text text-transparent">
//             Admin Panel
//           </h1>
//           <p className="text-xs text-gray-500">Manage your school efficiently</p>
//         </div>

//         <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
//           <div className="relative w-full">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search students, staff, events..."
//               className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50"
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <button 
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
//             >
//               <Bell size={20} className="text-gray-600" />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>
            
//             {showNotifications && (
//               <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
//                 <div className="p-4 border-b border-gray-100 flex justify-between items-center">
//                   <h3 className="font-semibold text-gray-800">Notifications</h3>
//                   <button onClick={() => setShowNotifications(false)}>
//                     <X size={16} className="text-gray-400" />
//                   </button>
//                 </div>
//                 <div className="max-h-96 overflow-y-auto">
//                   {notifications.map(notif => (
//                     <div key={notif.id} className={`p-3 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}>
//                       <p className="font-medium text-sm text-gray-800">{notif.title}</p>
//                       <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
//                       <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="relative">
//             <button 
//               onClick={() => setShowProfile(!showProfile)}
//               className="flex items-center gap-3 pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
//             >
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-yellow-500 flex items-center justify-center text-white font-semibold">
//                 {user?.name?.charAt(0) || 'A'}
//               </div>
//               <div className="hidden sm:block text-left">
//                 <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin User'}</p>
//                 <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
//               </div>
//               <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
//             </button>
            
//             {showProfile && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
//                 <div className="p-3 border-b border-gray-100">
//                   <p className="font-medium text-gray-800">{user?.name || 'Admin User'}</p>
//                   <p className="text-xs text-gray-500">{user?.email || 'admin@joyschool.com'}</p>
//                 </div>
//                 <div className="p-2">
//                   <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
//                     Profile Settings
//                   </button>
//                   <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;


import { useState, useEffect } from 'react';
import { Search, ChevronDown, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingRequests, setPendingRequests] = useState(0);

  const fetchPendingCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/enrollment/count');
      const data = await response.json();
      if (data.success) {
        setPendingRequests(data.pendingCount);
      }
    } catch (error) {
      console.error('Error fetching enrollment count:', error);
    }
  };

  useEffect(() => {
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      window.location.href = `/students?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4">
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
          <button
            onClick={() => navigateTo('/enrollment-requests')}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Enrollment requests"
          >
            <ClipboardList size={20} className="text-gray-600" />
            {pendingRequests > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white w-5 h-5">
                {pendingRequests > 9 ? '9+' : pendingRequests}
              </span>
            )}
            <span className="sr-only">Enrollment requests</span>
          </button>

          <button
            onClick={() => navigateTo('/settings')}
            className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
            title="Go to settings"
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;