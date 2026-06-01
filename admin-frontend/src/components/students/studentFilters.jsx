import { Search } from 'lucide-react';

const StudentFilters = ({ selectedClass, onClassChange, searchQuery, onSearchChange }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <select
        value={selectedClass}
        onChange={(e) => onClassChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
      >
        <option>All Classes</option>
        <option>Pre-KG</option>
        <option>LKG</option>
        <option>UKG</option>
      </select>
      
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, admission number, or parent name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentFilters;