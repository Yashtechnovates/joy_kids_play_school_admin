import { Edit, Trash2, Eye } from 'lucide-react';

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="table-header">Admission No</th>
            <th className="table-header">Student Name</th>
            <th className="table-header">Age</th>
            <th className="table-header">Gender</th>
            <th className="table-header">Class</th>
            <th className="table-header">Parent Name</th>
            <th className="table-header">Parent Contact</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
              <td className="table-cell">{student.admissionNo}</td>
              <td className="table-cell font-medium">{student.studentName}</td>
              <td className="table-cell">{student.age}</td>
              <td className="table-cell">{student.gender}</td>
              <td className="table-cell">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {student.className}
                </span>
              </td>
              <td className="table-cell">{student.parentName}</td>
              <td className="table-cell">{student.parentContact}</td>
              <td className="table-cell">
                <div className="flex gap-2">
                  <button onClick={() => onView(student)} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => onEdit(student)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(student)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && (
        <div className="text-center py-8 text-gray-500">No students found</div>
      )}
    </div>
  );
};

export default StudentTable;