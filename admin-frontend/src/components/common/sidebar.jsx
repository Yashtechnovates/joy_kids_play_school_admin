// import { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   LayoutDashboard, 
//   Users, 
//   UserCircle, 
//   Building2, 
//   Calendar, 
//   Baby, 
//   BookOpen,
//   CreditCard,
//   Settings,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   School
// } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const menuItems = [
//     { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
//     { path: '/students', icon: Users, label: 'Student Database' },
//     { path: '/staff', icon: UserCircle, label: 'Staff Details' },
//     { path: '/infrastructure', icon: Building2, label: 'Infrastructure' },
//     { path: '/cultural-events', icon: Calendar, label: 'Cultural Events' },
//     { path: '/play-area', icon: Baby, label: "Kid's Play Area" },
//     { path: '/academic', icon: BookOpen, label: 'Academic Activities' },
//     { path: '/fees', icon: CreditCard, label: 'Fees' },
//     { path: '/settings', icon: Settings, label: 'Settings' },
//   ];

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <motion.div 
//       initial={{ width: 280 }}
//       animate={{ width: isCollapsed ? 80 : 280 }}
//       transition={{ duration: 0.3, ease: "easeInOut" }}
//       className="fixed left-0 top-0 h-full bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl z-50 flex flex-col"
//     >
//       <div className="flex items-center justify-between px-4 py-6 border-b border-blue-700">
//         <AnimatePresence mode="wait">
//           {!isCollapsed && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex items-center gap-2"
//             >
//               <School className="text-yellow-400" size={32} />
//               <div>
//                 <span className="text-white font-bold text-lg">Joy Play</span>
//                 <p className="text-blue-200 text-xs">School Admin</p>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//         <button
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="p-2 rounded-lg hover:bg-blue-700 transition-colors text-blue-200"
//         >
//           {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//         </button>
//       </div>

//       <nav className="flex-1 py-6 overflow-y-auto">
//         <ul className="space-y-1 px-2">
//           {menuItems.map((item) => (
//             <li key={item.path}>
//               <NavLink to={item.path}>
//                 {({ isActive }) => (
//                   <motion.div
//                     whileHover={{ x: 5 }}
//                     className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer group
//                       ${isActive 
//                         ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
//                         : 'text-blue-100 hover:bg-blue-700'
//                       }`}
//                   >
//                     <item.icon size={22} className="flex-shrink-0" />
//                     <AnimatePresence mode="wait">
//                       {!isCollapsed && (
//                         <motion.span
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           exit={{ opacity: 0 }}
//                           className="font-medium"
//                         >
//                           {item.label}
//                         </motion.span>
//                       )}
//                     </AnimatePresence>
//                     {isCollapsed && (
//                       <div className="absolute left-16 bg-blue-800 px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
//                         {item.label}
//                       </div>
//                     )}
//                   </motion.div>
//                 )}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       <div className="border-t border-blue-700 pt-4 pb-6 px-2">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-blue-100 hover:bg-red-600 hover:text-white transition-all duration-200 group"
//         >
//           <LogOut size={22} className="flex-shrink-0" />
//           <AnimatePresence mode="wait">
//             {!isCollapsed && (
//               <motion.span
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="font-medium"
//               >
//                 Logout
//               </motion.span>
//             )}
//           </AnimatePresence>
//           {isCollapsed && (
//             <div className="absolute left-16 bg-red-600 px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
//               Logout
//             </div>
//           )}
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default Sidebar;
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Building2, 
  Calendar, 
  Baby, 
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  School
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/students', icon: Users, label: 'Student Database' },
    { path: '/staff', icon: UserCircle, label: 'Staff Details' },
    { path: '/infrastructure', icon: Building2, label: 'Infrastructure' },
    { path: '/cultural-events', icon: Calendar, label: 'Cultural Events' },
    { path: '/play-area', icon: Baby, label: "Kid's Play Area" },
    { path: '/academic', icon: BookOpen, label: 'Academic Activities' },
    { path: '/fees', icon: CreditCard, label: 'Fees' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/syllabus', icon: BookOpen, label: 'Syllabus' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div 
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl z-50 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-6 border-b border-blue-700">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <School className="text-yellow-400" size={32} />
              <div>
                <span className="text-white font-bold text-lg">Joy Play</span>
                <p className="text-blue-200 text-xs">School Admin</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-blue-700 transition-colors text-blue-200"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path}>
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer group
                      ${isActive 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                        : 'text-blue-100 hover:bg-blue-700'
                      }`}
                  >
                    <item.icon size={22} className="flex-shrink-0" />
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isCollapsed && (
                      <div className="absolute left-16 bg-blue-800 px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                      </div>
                    )}
                  </motion.div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-blue-700 pt-4 pb-6 px-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-blue-100 hover:bg-red-600 hover:text-white transition-all duration-200 group"
        >
          <LogOut size={22} className="flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
          {isCollapsed && (
            <div className="absolute left-16 bg-red-600 px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Logout
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;