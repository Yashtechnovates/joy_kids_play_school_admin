// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { School, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
// // import { useAuth } from '../contexts/AuthContext';

// // const Login = () => {
// //   const navigate = useNavigate();
// //   const { login } = useAuth();
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [formData, setFormData] = useState({ email: '', password: '' });
// //   const [errors, setErrors] = useState({});
// //   const [loginError, setLoginError] = useState('');

// //   const validateForm = () => {
// //     const newErrors = {};
// //     if (!formData.email) {
// //       newErrors.email = 'Email is required';
// //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
// //       newErrors.email = 'Please enter a valid email address';
// //     }
    
// //     if (!formData.password) {
// //       newErrors.password = 'Password is required';
// //     } else if (formData.password.length < 8) {
// //       newErrors.password = 'Password must be at least 8 characters';
// //     }
    
// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     setLoginError('');
    
// //     if (validateForm()) {
// //       const success = login(formData.email, formData.password);
// //       if (success) {
// //         navigate('/dashboard');
// //       } else {
// //         setLoginError('Invalid email or password. Please try again.');
// //       }
// //     }
// //   };

// //   const handleClear = () => {
// //     setFormData({ email: '', password: '' });
// //     setErrors({});
// //     setLoginError('');
// //   };

// //   return (
// //     <div className="min-h-screen relative overflow-hidden">
// //       <div className="absolute inset-0 z-0">
// //         <img 
// //           src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop" 
// //           alt="School Background"
// //           className="w-full h-full object-cover"
// //         />
// //         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-yellow-900/70 backdrop-blur-sm"></div>
// //       </div>

// //       <div className="relative z-10 min-h-screen flex items-center justify-end">
// //         <div className="w-full max-w-md mr-8 lg:mr-16">
// //           <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-slide-up">
// //             <div className="text-center mb-8">
// //               <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-yellow-500 rounded-2xl mb-4">
// //                 <School size={48} className="text-white" />
// //               </div>
// //               <h1 className="text-3xl font-bold text-gray-800">Joy Play School</h1>
// //               <p className="text-gray-500 mt-2">Admin Login Portal</p>
// //             </div>

// //             {loginError && (
// //               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
// //                 <AlertCircle size={18} />
// //                 <span className="text-sm">{loginError}</span>
// //               </div>
// //             )}

// //             <form onSubmit={handleSubmit} className="space-y-5">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
// //                   <input
// //                     type="email"
// //                     value={formData.email}
// //                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //                     className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all
// //                       ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
// //                     placeholder="admin@joyschool.com"
// //                   />
// //                 </div>
// //                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
// //                   <input
// //                     type={showPassword ? 'text' : 'password'}
// //                     value={formData.password}
// //                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// //                     className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all
// //                       ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
// //                     placeholder="••••••••"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //                   >
// //                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// //                   </button>
// //                 </div>
// //                 {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
// //               </div>

// //               <div className="bg-blue-50 rounded-lg p-3 text-sm">
// //                 <p className="text-blue-800 font-medium">Demo Credentials:</p>
// //                 <p className="text-blue-600 text-xs mt-1">Email: admin@joyschool.com</p>
// //                 <p className="text-blue-600 text-xs">Password: admin123</p>
// //               </div>

// //               <div className="flex gap-3 pt-2">
// //                 <button type="submit" className="flex-1 btn-primary">Login</button>
// //                 <button type="button" onClick={handleClear} className="flex-1 btn-secondary">Cancel</button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { School, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login, isAuthenticated } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [loginError, setLoginError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Redirect if already authenticated
//   if (isAuthenticated) {
//     navigate('/dashboard');
//   }

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoginError('');
//     setIsLoading(true);
    
//     if (validateForm()) {
//       const success = login(formData.email, formData.password);
//       if (success) {
//         // Small delay to ensure state updates
//         setTimeout(() => {
//           navigate('/dashboard');
//         }, 100);
//       } else {
//         setLoginError('Invalid email or password. Please try again.');
//       }
//     }
//     setIsLoading(false);
//   };

//   const handleClear = () => {
//     setFormData({ email: '', password: '' });
//     setErrors({});
//     setLoginError('');
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       <div className="absolute inset-0 z-0">
//         <img 
//           src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop" 
//           alt="School Background"
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-yellow-900/70 backdrop-blur-sm"></div>
//       </div>

//       <div className="relative z-10 min-h-screen flex items-center justify-end">
//         <div className="w-full max-w-md mr-8 lg:mr-16">
//           <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-slide-up">
//             <div className="text-center mb-8">
//               <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-yellow-500 rounded-2xl mb-4">
//                 <School size={48} className="text-white" />
//               </div>
//               <h1 className="text-3xl font-bold text-gray-800">Joy Play School</h1>
//               <p className="text-gray-500 mt-2">Admin Login Portal</p>
//             </div>

//             {loginError && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
//                 <AlertCircle size={18} />
//                 <span className="text-sm">{loginError}</span>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all
//                       ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
//                     placeholder="admin@joyschool.com"
//                   />
//                 </div>
//                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value={formData.password}
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all
//                       ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 </div>
//                 {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button 
//                   type="submit" 
//                   disabled={isLoading}
//                   className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
//                 >
//                   {isLoading ? 'Logging in...' : 'Login'}
//                 </button>
//                 <button 
//                   type="button" 
//                   onClick={handleClear}
//                   className="flex-1 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated - moved to useEffect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    if (validateForm()) {
      const success = login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    setFormData({ email: '', password: '' });
    setErrors({});
    setLoginError('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop" 
          alt="School Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-yellow-900/70 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-end">
        <div className="w-full max-w-md mr-8 lg:mr-16">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-slide-up">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-yellow-500 rounded-2xl mb-4">
                <School size={48} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Joy Play School</h1>
              <p className="text-gray-500 mt-2">Admin Login Portal</p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle size={18} />
                <span className="text-sm">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all
                      ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    placeholder="admin@joyschool.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all
                      ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <button 
                  type="button" 
                  onClick={handleClear}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;