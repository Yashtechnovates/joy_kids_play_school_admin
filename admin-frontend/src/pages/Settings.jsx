// import { useState, useEffect } from 'react';
// import { User, Bell, Shield, Palette, Database, Download, Upload, Trash2, Save } from 'lucide-react';
// import toast from 'react-hot-toast';

// const Settings = () => {
//   const [activeTab, setActiveTab] = useState('profile');
//   const [profile, setProfile] = useState({
//     name: 'Admin User',
//     email: 'admin@joyschool.com',
//     role: 'Administrator',
//     phone: '+91 98765 43210',
//     timezone: 'IST (UTC+5:30)'
//   });

//   const [notifications, setNotifications] = useState({
//     emailNotifications: true,
//     pushNotifications: true,
//     attendanceAlerts: true,
//     feeReminders: true,
//     eventUpdates: true
//   });

//   const [theme, setTheme] = useState({
//     primaryColor: 'blue',
//     sidebarCollapsed: false,
//     animations: true
//   });

//   const [backupInfo, setBackupInfo] = useState({
//     lastBackup: '2024-03-01 10:30 AM',
//     backupSize: '2.4 MB'
//   });

//   const handleProfileUpdate = () => {
//     localStorage.setItem('adminProfile', JSON.stringify(profile));
//     toast.success('Profile updated successfully');
//   };

//   const handleExportData = () => {
//     const data = {
//       students: localStorage.getItem('students'),
//       staff: localStorage.getItem('staff'),
//       events: localStorage.getItem('events'),
//       materials: localStorage.getItem('materials'),
//       activities: localStorage.getItem('activities'),
//       attendance: localStorage.getItem('attendance'),
//       exportDate: new Date().toISOString()
//     };
    
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `school_backup_${new Date().toISOString().split('T')[0]}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//     toast.success('Data exported successfully');
//   };

//   const handleImportData = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const data = JSON.parse(e.target.result);
//           if (data.students) localStorage.setItem('students', data.students);
//           if (data.staff) localStorage.setItem('staff', data.staff);
//           if (data.events) localStorage.setItem('events', data.events);
//           toast.success('Data imported successfully');
//         } catch (error) {
//           toast.error('Invalid backup file');
//         }
//       };
//       reader.readAsText(file);
//     }
//   };

//   const handleClearData = () => {
//     if (window.confirm('Are you sure you want to clear all data? This action cannot be undone!')) {
//       localStorage.clear();
//       toast.success('All data cleared successfully');
//       setTimeout(() => window.location.reload(), 1500);
//     }
//   };

//   const tabs = [
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'notifications', label: 'Notifications', icon: Bell },
//     { id: 'security', label: 'Security', icon: Shield },
//     { id: 'appearance', label: 'Appearance', icon: Palette },
//     { id: 'backup', label: 'Backup & Restore', icon: Database }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
//         <p className="text-gray-500 mt-1">Manage your account and application preferences</p>
//       </div>

//       <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//         <div className="flex border-b border-gray-200">
//           {tabs.map((tab) => (
//             <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
//               <tab.icon size={18} /> {tab.label}
//             </button>
//           ))}
//         </div>

//         <div className="p-6">
//           {/* Profile Settings */}
//           {activeTab === 'profile' && (
//             <div className="space-y-6">
//               <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="input-field" /></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="input-field" /></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="input-field" /></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label><select value={profile.timezone} onChange={(e) => setProfile({...profile, timezone: e.target.value})} className="input-field"><option>IST (UTC+5:30)</option><option>EST (UTC-5:00)</option><option>GMT (UTC+0:00)</option></select></div>
//               </div>
//               <div className="flex gap-3"><button onClick={handleProfileUpdate} className="btn-primary flex items-center gap-2"><Save size={18} /> Save Changes</button></div>
//             </div>
//           )}

//           {/* Notification Settings */}
//           {activeTab === 'notifications' && (
//             <div className="space-y-6">
//               <h3 className="text-lg font-semibold text-gray-800">Notification Preferences</h3>
//               <div className="space-y-4">
//                 {Object.entries(notifications).map(([key, value]) => (
//                   <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div><p className="font-medium text-gray-800">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p><p className="text-sm text-gray-500">Receive notifications for {key.toLowerCase()}</p></div>
//                     <button onClick={() => setNotifications({...notifications, [key]: !value})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-primary-500' : 'bg-gray-300'}`}>
//                       <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Security Settings */}
//           {activeTab === 'security' && (
//             <div className="space-y-6">
//               <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
//               <div className="space-y-4">
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label><input type="password" className="input-field" /></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">New Password</label><input type="password" className="input-field" /></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label><input type="password" className="input-field" /></div>
//                 <button className="btn-primary">Update Password</button>
//               </div>
//               <div className="mt-6 p-4 bg-yellow-50 rounded-lg"><p className="text-sm text-yellow-800">⚠️ For security reasons, enable two-factor authentication to protect your account.</p></div>
//             </div>
//           )}

//           {/* Appearance Settings */}
//           {activeTab === 'appearance' && (
//             <div className="space-y-6">
//               <h3 className="text-lg font-semibold text-gray-800">Appearance Preferences</h3>
//               <div className="space-y-4">
//                 <div><label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label><div className="flex gap-3"><button onClick={() => setTheme({...theme, primaryColor: 'blue'})} className={`w-10 h-10 rounded-full bg-blue-500 ${theme.primaryColor === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} /><button onClick={() => setTheme({...theme, primaryColor: 'green'})} className={`w-10 h-10 rounded-full bg-green-500 ${theme.primaryColor === 'green' ? 'ring-2 ring-offset-2 ring-green-500' : ''}`} /><button onClick={() => setTheme({...theme, primaryColor: 'purple'})} className={`w-10 h-10 rounded-full bg-purple-500 ${theme.primaryColor === 'purple' ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`} /><button onClick={() => setTheme({...theme, primaryColor: 'orange'})} className={`w-10 h-10 rounded-full bg-orange-500 ${theme.primaryColor === 'orange' ? 'ring-2 ring-offset-2 ring-orange-500' : ''}`} /></div></div>
//                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div><p className="font-medium text-gray-800">Sidebar Animation</p><p className="text-sm text-gray-500">Enable smooth sidebar transitions</p></div><button onClick={() => setTheme({...theme, animations: !theme.animations})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme.animations ? 'bg-primary-500' : 'bg-gray-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme.animations ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
//               </div>
//             </div>
//           )}

//           {/* Backup & Restore */}
//           {activeTab === 'backup' && (
//             <div className="space-y-6">
//               <h3 className="text-lg font-semibold text-gray-800">Backup & Restore</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="p-4 bg-green-50 rounded-lg"><p className="text-sm text-gray-600">Last Backup</p><p className="text-lg font-semibold text-green-700">{backupInfo.lastBackup}</p><p className="text-xs text-gray-500">Size: {backupInfo.backupSize}</p></div>
//                 <div className="p-4 bg-blue-50 rounded-lg"><p className="text-sm text-gray-600">Auto Backup</p><p className="text-lg font-semibold text-blue-700">Daily at 2:00 AM</p><p className="text-xs text-gray-500">Next backup in 8 hours</p></div>
//               </div>
//               <div className="flex gap-3">
//                 <button onClick={handleExportData} className="btn-primary flex items-center gap-2"><Download size={18} /> Export Data</button>
//                 <label className="btn-secondary flex items-center gap-2 cursor-pointer"><Upload size={18} /> Import Data<input type="file" accept=".json" onChange={handleImportData} className="hidden" /></label>
//                 <button onClick={handleClearData} className="btn-danger flex items-center gap-2"><Trash2 size={18} /> Clear All Data</button>
//               </div>
//               <div className="p-4 bg-red-50 rounded-lg"><p className="text-sm text-red-800">⚠️ Warning: Clearing all data will permanently delete all students, staff, and other records. This action cannot be undone.</p></div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;


import { useState } from 'react';
import { User, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@joyschool.com',
    role: 'Administrator',
    phone: '+91 98765 43210'
  });

  const handleProfileUpdate = () => {
    // Validate phone number (10 digits)
    const phoneNumber = profile.phone.replace(/\D/g, '');
    if (phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Validate name (only letters and spaces)
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(profile.name)) {
      toast.error('Name should contain only letters and spaces');
      return;
    }
    
    localStorage.setItem('adminProfile', JSON.stringify(profile));
    toast.success('Profile updated successfully');
  };

  const handlePhoneChange = (value) => {
    // Only allow numbers, max 10 digits
    const numbersOnly = value.replace(/[^0-9]/g, '').slice(0, 10);
    let formattedPhone = numbersOnly;
    if (numbersOnly.length === 10) {
      formattedPhone = numbersOnly.replace(/(\d{5})(\d{5})/, '+91 $1 $2');
    } else if (numbersOnly.length > 5) {
      formattedPhone = numbersOnly.replace(/(\d{5})(\d{1,5})/, '+91 $1 $2');
    } else if (numbersOnly.length > 0) {
      formattedPhone = `+91 ${numbersOnly}`;
    }
    setProfile({ ...profile, phone: formattedPhone });
  };

  const handleNameChange = (value) => {
    // Only allow letters and spaces
    const formattedValue = value.replace(/[^A-Za-z\s]/g, '');
    setProfile({ ...profile, name: formattedValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account profile</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <div className="flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 border-primary-500 text-primary-600">
              <User size={18} /> Profile Settings
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Profile Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => handleNameChange(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none" 
                  placeholder="Enter your full name"
                />
                <p className="text-xs text-gray-400 mt-1">Letters and spaces only</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none" 
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={profile.phone} 
                  onChange={(e) => handlePhoneChange(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none" 
                  placeholder="+91 XXXXX XXXXX"
                  maxLength="15"
                />
                <p className="text-xs text-gray-400 mt-1">Exactly 10 digits (auto-formats with +91)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input 
                  type="text" 
                  value={profile.role} 
                  disabled 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" 
                />
                <p className="text-xs text-gray-400 mt-1">Role cannot be changed</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleProfileUpdate} className="bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;