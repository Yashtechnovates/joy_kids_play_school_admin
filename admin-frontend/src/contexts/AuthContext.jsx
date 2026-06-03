// // import { createContext, useState, useContext, useEffect } from 'react';
// // import toast from 'react-hot-toast';

// // const AuthContext = createContext();

// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const token = localStorage.getItem('adminToken');
// //     const savedUser = localStorage.getItem('adminUser');
// //     if (token && savedUser) {
// //       setIsAuthenticated(true);
// //       setUser(JSON.parse(savedUser));
// //     }
// //     setLoading(false);
// //   }, []);

// //   const login = (email, password) => {
// //     if (email === 'admin@joyschool.com' && password === 'admin123') {
// //       const userData = { 
// //         email, 
// //         name: 'Admin User', 
// //         role: 'Administrator',
// //         avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff'
// //       };
// //       localStorage.setItem('adminToken', 'demo-token-12345');
// //       localStorage.setItem('adminUser', JSON.stringify(userData));
// //       setIsAuthenticated(true);
// //       setUser(userData);
// //       toast.success('Login successful! Welcome back.');
// //       return true;
// //     }
// //     toast.error('Invalid email or password');
// //     return false;
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('adminToken');
// //     localStorage.removeItem('adminUser');
// //     setIsAuthenticated(false);
// //     setUser(null);
// //     toast.success('Logged out successfully');
// //   };

// //   return (
// //     <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// import { createContext, useState, useContext, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { authService } from '../services/authService';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const storedToken = localStorage.getItem('adminToken');
//     const storedUser = localStorage.getItem('adminUser');
    
//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setIsAuthenticated(true);
//       setUser(JSON.parse(storedUser));
//     }
//     setLoading(false);
//   }, []);

//   // const login = async (email, password) => {
//   //   try {
//   //     const response = await authService.login(email, password);
      
//   //     if (response.success) {
//   //       localStorage.setItem('adminToken', response.data.token);
//   //       localStorage.setItem('adminUser', JSON.stringify(response.data.user));
//   //       setToken(response.data.token);
//   //       setIsAuthenticated(true);
//   //       setUser(response.data.user);
//   //       toast.success(response.message || 'Login successful!');
//   //       return true;
//   //     } else {
//   //       toast.error(response.message || 'Invalid credentials');
//   //       return false;
//   //     }
//   //   } catch (error) {
//   //     console.error('Login error:', error);
//   //     toast.error('Login failed. Please try again.');
//   //     return false;
//   //   }
//   // };
// const login = async (email, password) => {
//   try {
//   //  const response = await fetch('http://localhost:5001/login', {
//   const response = await fetch('http://localhost:5000/api/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password })
//     });
    
//     const data = await response.json();
    
//     if (data.success) {
//       localStorage.setItem('adminToken', data.token);
//       localStorage.setItem('adminUser', JSON.stringify(data.user));
//       setIsAuthenticated(true);
//       setUser(data.user);
//       toast.success('Login successful!');
//       return true;
//     } else {
//       toast.error(data.message || 'Invalid credentials');
//       return false;
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//     toast.error('Login failed. Please try again.');
//     return false;
//   }
// };
//   const logout = () => {
//     localStorage.removeItem('adminToken');
//     localStorage.removeItem('adminUser');
//     setToken(null);
//     setIsAuthenticated(false);
//     setUser(null);
//     toast.success('Logged out successfully');
//   };

//   const forgotPassword = async (email) => {
//     try {
//       const response = await authService.forgotPassword(email);
//       if (response.success) {
//         toast.success(response.message);
//         return { success: true, resetToken: response.resetToken };
//       } else {
//         toast.error(response.message);
//         return { success: false };
//       }
//     } catch (error) {
//       console.error('Forgot password error:', error);
//       toast.error('Failed to send reset email');
//       return { success: false };
//     }
//   };

//   const resetPassword = async (token, password) => {
//     try {
//       const response = await authService.resetPassword(token, password);
//       if (response.success) {
//         toast.success(response.message);
//         return true;
//       } else {
//         toast.error(response.message);
//         return false;
//       }
//     } catch (error) {
//       console.error('Reset password error:', error);
//       toast.error('Failed to reset password');
//       return false;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       isAuthenticated, 
//       user, 
//       loading, 
//       token,
//       login, 
//       logout,
//       forgotPassword,
//       resetPassword
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    
    // FIX: Only try to parse if savedUser exists and is not null/undefined
    if (token && savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        const parsedUser = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.user));
        setIsAuthenticated(true);
        setUser(data.data.user);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(data.message || 'Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};