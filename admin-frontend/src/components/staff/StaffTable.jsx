import { Edit, Trash2 } from 'lucide-react';

const StaffTable = ({ staff, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="table-header">Staff ID</th>
            <th className="table-header">Name</th>
            <th className="table-header">Role</th>
            <th className="table-header">Department</th>
            <th className="table-header">Phone</th>
            <th className="table-header">Status</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {staff.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
              <td className="table-cell">{member.staffId}</td>
              <td className="table-cell font-medium">{member.name}</td>
              <td className="table-cell">{member.role}</td>
              <td className="table-cell">{member.department}</td>
              <td className="table-cell">{member.phone}</td>
              <td className="table-cell">
                <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {member.status}
                </span>
              </td>
              <td className="table-cell">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(member)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(member)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;