// import { motion } from 'framer-motion';
// import { Users, GraduationCap, DollarSign, Calendar, TrendingUp, Award, Activity, Clock } from 'lucide-react';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// const Dashboard = () => {
//   const stats = [
//     { title: 'Total Students', value: '156', icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%', period: 'this month' },
//     { title: 'Total Staff', value: '24', icon: GraduationCap, color: 'from-green-500 to-green-600', change: '+2', period: 'new this month' },
//     { title: 'Revenue', value: '₹2.4L', icon: DollarSign, color: 'from-yellow-500 to-yellow-600', change: '+18%', period: 'vs last month' },
//     { title: 'Attendance', value: '94%', icon: Calendar, color: 'from-purple-500 to-purple-600', change: '+5%', period: 'improvement' },
//   ];

//   const attendanceData = [
//     { month: 'Jan', attendance: 92 },
//     { month: 'Feb', attendance: 94 },
//     { month: 'Mar', attendance: 96 },
//     { month: 'Apr', attendance: 93 },
//     { month: 'May', attendance: 95 },
//     { month: 'Jun', attendance: 94 },
//   ];

//   const classDistribution = [
//     { name: 'Pre-KG', value: 45, color: '#3b82f6' },
//     { name: 'LKG', value: 52, color: '#10b981' },
//     { name: 'UKG', value: 59, color: '#f59e0b' },
//   ];

//   const recentActivities = [
//     { id: 1, action: 'New student enrolled', student: 'Aarav Sharma', class: 'Pre-KG', time: '2 hours ago', icon: Users },
//     { id: 2, action: 'Fee payment received', student: 'Sanya Verma', class: 'LKG', amount: '₹15,000', time: '5 hours ago', icon: DollarSign },
//     { id: 3, action: 'Staff meeting scheduled', student: 'All Staff', time: 'Yesterday', icon: Calendar },
//     { id: 4, action: 'Birthday celebration', student: 'Iyer Krishnan', class: 'Pre-KG', time: 'Yesterday', icon: Award },
//   ];

//   return (
//     <div className="space-y-6">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-gradient-to-r from-blue-600 to-yellow-600 rounded-2xl p-8 text-white"
//       >
//         <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
//         <p className="text-blue-100">Here's what's happening with your school today.</p>
//       </motion.div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, idx) => (
//           <motion.div
//             key={idx}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: idx * 0.1 }}
//             className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-gray-500 text-sm">{stat.title}</p>
//                 <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
//                 <p className="text-green-600 text-sm mt-2">
//                   {stat.change} {stat.period}
//                 </p>
//               </div>
//               <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
//                 <stat.icon size={24} className="text-white" />
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-2xl p-6 shadow-lg">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trends</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={attendanceData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-lg">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Distribution</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={classDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
//                 {classDistribution.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl p-6 shadow-lg">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
//         <div className="space-y-4">
//           {recentActivities.map((activity) => (
//             <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
//               <div className="p-2 bg-blue-100 rounded-full">
//                 <activity.icon size={18} className="text-blue-600" />
//               </div>
//               <div className="flex-1">
//                 <p className="font-medium text-gray-800">{activity.action}</p>
//                 <p className="text-sm text-gray-500">
//                   {activity.student} {activity.class && `- ${activity.class}`} {activity.amount && `- ${activity.amount}`}
//                 </p>
//               </div>
//               <p className="text-sm text-gray-400">{activity.time}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, GraduationCap, DollarSign, Calendar, TrendingUp, Award, Activity, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    revenue: 0,
    attendance: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Load dynamic stats
    const preKG = JSON.parse(localStorage.getItem('students_preKG') || '[]');
    const lkg = JSON.parse(localStorage.getItem('students_lkg') || '[]');
    const ukg = JSON.parse(localStorage.getItem('students_ukg') || '[]');
    const staff = JSON.parse(localStorage.getItem('staff') || '[]');
    
    const totalStudents = preKG.length + lkg.length + ukg.length;
    const totalStaff = staff.length;
    
    // Calculate revenue (assuming 25000 per student)
    const revenue = totalStudents * 25000;
    
    // Calculate attendance (mock for demo)
    const attendance = 94;
    
    setStats({
      totalStudents,
      totalStaff,
      revenue,
      attendance
    });
    
    // Load recent activities
    const activities = [];
    
    // Add recent student additions
    const allStudents = [...preKG, ...lkg, ...ukg];
    const recentStudents = allStudents.slice(-3);
    recentStudents.forEach(student => {
      activities.push({
        id: `student_${student.id}`,
        action: 'New student enrolled',
        details: `${student.studentName} - ${student.className}`,
        time: student.dateOfAdmission || 'Recently',
        icon: Users,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        path: '/students'
      });
    });
    
    // Add recent staff additions
    const recentStaff = staff.slice(-2);
    recentStaff.forEach(member => {
      activities.push({
        id: `staff_${member.id}`,
        action: 'New staff joined',
        details: `${member.name} - ${member.role}`,
        time: member.joinDate || 'Recently',
        icon: GraduationCap,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        path: '/staff'
      });
    });
    
    setRecentActivities(activities.slice(0, 5));
  }, []);

  const attendanceData = [
    { month: 'Jan', attendance: 92 },
    { month: 'Feb', attendance: 94 },
    { month: 'Mar', attendance: 96 },
    { month: 'Apr', attendance: 93 },
    { month: 'May', attendance: 95 },
    { month: 'Jun', attendance: stats.attendance },
  ];

  const classDistribution = [
    { name: 'Pre-KG', value: JSON.parse(localStorage.getItem('students_preKG') || '[]').length, color: '#3b82f6' },
    { name: 'LKG', value: JSON.parse(localStorage.getItem('students_lkg') || '[]').length, color: '#10b981' },
    { name: 'UKG', value: JSON.parse(localStorage.getItem('students_ukg') || '[]').length, color: '#f59e0b' },
  ];

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%', period: 'this month', path: '/students' },
    { title: 'Total Staff', value: stats.totalStaff, icon: GraduationCap, color: 'from-green-500 to-green-600', change: '+2', period: 'new this month', path: '/staff' },
    { title: 'Revenue', value: `₹${(stats.revenue / 1000).toFixed(1)}L`, icon: DollarSign, color: 'from-yellow-500 to-yellow-600', change: '+18%', period: 'vs last month', path: '/fees' },
    { title: 'Attendance', value: `${stats.attendance}%`, icon: Calendar, color: 'from-purple-500 to-purple-600', change: '+5%', period: 'improvement', path: '/attendance' },
  ];

  const handleCardClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-yellow-600 rounded-2xl p-8 text-white cursor-pointer"
        onClick={() => navigate('/students')}
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="text-blue-100">Here's what's happening with your school today.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={() => handleCardClick(stat.path)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <p className="text-green-600 text-sm mt-2">
                  {stat.change} {stat.period}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={classDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {classDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              onClick={() => activity.path && navigate(activity.path)}
            >
              <div className={`p-2 rounded-full ${activity.iconBg}`}>
                <activity.icon size={18} className={activity.iconColor} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.details}</p>
              </div>
              <p className="text-sm text-gray-400">{activity.time}</p>
            </div>
          ))}
          {recentActivities.length === 0 && (
            <p className="text-center text-gray-500 py-4">No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;