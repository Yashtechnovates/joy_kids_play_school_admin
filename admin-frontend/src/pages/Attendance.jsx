import { useState } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('Pre-KG');
  const [attendance, setAttendance] = useState({});

  // Sample student data for attendance
  const studentsByClass = {
    'Pre-KG': ['Aarav Sharma', 'Iyer Krishnan', 'Virat Mehta', 'Ananya Reddy', 'Dhruv Khanna'],
    'LKG': ['Sanya Verma', 'Advait Singh', 'Kavya Nair', 'Rudra Patel', 'Myra Joseph'],
    'UKG': ['Reyansh Patel', 'Aadhya Kulkarni', 'Pranav Iyer', 'Sara Khan', 'Arjun Nair']
  };

  const currentStudents = studentsByClass[selectedClass] || [];

  const handleAttendanceChange = (student, status) => {
    setAttendance(prev => ({
      ...prev,
      [`${selectedDate}_${student}`]: status
    }));
  };

  const getStudentStatus = (student) => {
    return attendance[`${selectedDate}_${student}`] || 'present';
  };

  const saveAttendance = () => {
    const attendanceData = {
      date: selectedDate,
      class: selectedClass,
      records: currentStudents.map(student => ({
        student,
        status: getStudentStatus(student),
        time: new Date().toLocaleTimeString()
      }))
    };
    
    // Save to localStorage
    const savedAttendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const existingIndex = savedAttendance.findIndex(a => a.date === selectedDate && a.class === selectedClass);
    if (existingIndex >= 0) {
      savedAttendance[existingIndex] = attendanceData;
    } else {
      savedAttendance.push(attendanceData);
    }
    localStorage.setItem('attendance', JSON.stringify(savedAttendance));
    toast.success('Attendance saved successfully');
  };

  const exportAttendance = () => {
    const data = currentStudents.map(student => ({
      Student: student,
      Status: getStudentStatus(student) === 'present' ? 'Present' : 'Absent',
      Date: selectedDate,
      Class: selectedClass
    }));
    
    const csv = [['Student Name', 'Status', 'Date', 'Class']];
    data.forEach(row => csv.push([row.Student, row.Status, row.Date, row.Class]));
    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedClass}_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Attendance exported successfully');
  };

  const stats = {
    present: currentStudents.filter(s => getStudentStatus(s) === 'present').length,
    absent: currentStudents.filter(s => getStudentStatus(s) === 'absent').length,
    percentage: (currentStudents.filter(s => getStudentStatus(s) === 'present').length / currentStudents.length * 100) || 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
        <p className="text-gray-500 mt-1">Track daily student attendance</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>Pre-KG</option>
              <option>LKG</option>
              <option>UKG</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={saveAttendance} className="btn-primary">Save Attendance</button>
            <button onClick={exportAttendance} className="btn-outline flex items-center gap-2"><Download size={18} /> Export</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-green-600 text-sm">Present</p><p className="text-2xl font-bold text-green-700">{stats.present}</p></div>
              <CheckCircle size={32} className="text-green-500" />
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-red-600 text-sm">Absent</p><p className="text-2xl font-bold text-red-700">{stats.absent}</p></div>
              <XCircle size={32} className="text-red-500" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-blue-600 text-sm">Attendance %</p><p className="text-2xl font-bold text-blue-700">{stats.percentage.toFixed(1)}%</p></div>
              <Clock size={32} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Student Name</th>
                <th className="table-header">Status</th>
                <th className="table-header">Mark Attendance</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentStudents.map((student) => (
                <tr key={student}>
                  <td className="table-cell font-medium">{student}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStudentStatus(student) === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {getStudentStatus(student) === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button onClick={() => handleAttendanceChange(student, 'present')} className={`px-3 py-1 rounded-lg text-sm ${getStudentStatus(student) === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Present</button>
                      <button onClick={() => handleAttendanceChange(student, 'absent')} className={`px-3 py-1 rounded-lg text-sm ${getStudentStatus(student) === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Absent</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;