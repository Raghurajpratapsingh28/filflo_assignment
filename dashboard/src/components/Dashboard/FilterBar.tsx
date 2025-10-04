import { Search, Filter, X } from 'lucide-react';
import { InventoryFilters } from '../../types';

interface FilterBarProps {
  filters: InventoryFilters;
  onFilterChange: (filters: InventoryFilters) => void;
  jwlParts: string[];
  customerParts: string[];
}

export default function FilterBar({
  filters,
  onFilterChange,
  jwlParts,
  customerParts,
}: FilterBarProps) {
  const handleReset = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="ml-auto text-sm text-[#1976D2] hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Reset All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search description or batch..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            JWL Part
          </label>
          <select
            value={filters.jwl_part || ''}
            onChange={(e) => onFilterChange({ ...filters, jwl_part: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
          >
            <option value="">All Parts</option>
            {jwlParts.map((part) => (
              <option key={part} value={part}>{part}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Part
          </label>
          <select
            value={filters.customer_part || ''}
            onChange={(e) => onFilterChange({ ...filters, customer_part: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
          >
            <option value="">All Parts</option>
            {customerParts.map((part) => (
              <option key={part} value={part}>{part}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MFG Start Date
          </label>
          <input
            type="date"
            value={filters.mfg_start || ''}
            onChange={(e) => onFilterChange({ ...filters, mfg_start: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MFG End Date
          </label>
          <input
            type="date"
            value={filters.mfg_end || ''}
            onChange={(e) => onFilterChange({ ...filters, mfg_end: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            EXP Start Date
          </label>
          <input
            type="date"
            value={filters.exp_start || ''}
            onChange={(e) => onFilterChange({ ...filters, exp_start: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            EXP End Date
          </label>
          <input
            type="date"
            value={filters.exp_end || ''}
            onChange={(e) => onFilterChange({ ...filters, exp_end: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
