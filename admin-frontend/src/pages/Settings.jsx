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