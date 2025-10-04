import { Search, Filter, X, ChevronDown, Check } from 'lucide-react';
import { InventoryFilters } from '../../types';
import { useState, useRef, useEffect } from 'react';

interface FilterBarProps {
  filters: InventoryFilters;
  onFilterChange: (filters: InventoryFilters) => void;
  jwlParts: string[];
  customerParts: string[];
}

interface CustomDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

function CustomDropdown({ label, value, options, onChange, placeholder = "All Parts" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent bg-white text-left flex items-center justify-between hover:border-gray-400 transition-colors"
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder}
          </span>
          <div className="flex items-center gap-2">
            {value && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1976D2] focus:border-transparent text-sm"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-900">{option}</span>
                    {value === option && (
                      <Check className="w-4 h-4 text-[#1976D2]" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent hover:border-gray-400 transition-colors"
            />
          </div>
        </div>

        <CustomDropdown
          label="JWL Part"
          value={filters.jwl_part || ''}
          options={jwlParts}
          onChange={(value) => onFilterChange({ ...filters, jwl_part: value })}
          placeholder="All JWL Parts"
        />

        <CustomDropdown
          label="Customer Part"
          value={filters.customer_part || ''}
          options={customerParts}
          onChange={(value) => onFilterChange({ ...filters, customer_part: value })}
          placeholder="All Customer Parts"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MFG Start Date
          </label>
          <input
            type="date"
            value={filters.mfg_start || ''}
            onChange={(e) => onFilterChange({ ...filters, mfg_start: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent hover:border-gray-400 transition-colors"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent hover:border-gray-400 transition-colors"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent hover:border-gray-400 transition-colors"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent hover:border-gray-400 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
