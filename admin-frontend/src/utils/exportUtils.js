import * as XLSX from 'xlsx';

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportStudentsToCSV = (students, className) => {
  const exportData = students.map(student => ({
    'Admission No': student.admissionNo,
    'Student Name': student.studentName,
    'Age': student.age,
    'Gender': student.gender,
    'Class': student.className,
    'Parent Name': student.parentName,
    'Parent Contact': student.parentContact,
    'Email': student.email,
    'Address': student.address,
    'Date of Admission': student.dateOfAdmission
  }));
  exportToCSV(exportData, `students_${className}`);
};

export const exportStaffToCSV = (staff) => {
  const exportData = staff.map(member => ({
    'Staff ID': member.staffId,
    'Name': member.name,
    'Role': member.role,
    'Department': member.department,
    'Qualification': member.qualification,
    'Experience': member.experience,
    'Email': member.email,
    'Phone': member.phone,
    'Join Date': member.joinDate,
    'Status': member.status
  }));
  exportToCSV(exportData, 'staff_records');
};

export const exportAttendanceToCSV = (attendanceData, className, date) => {
  const exportData = attendanceData.map(record => ({
    'Student Name': record.student,
    'Status': record.status === 'present' ? 'Present' : 'Absent',
    'Date': date,
    'Class': className,
    'Time': record.time
  }));
  exportToCSV(exportData, `attendance_${className}_${date}`);
};