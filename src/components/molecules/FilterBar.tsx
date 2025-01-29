import { FC } from 'react';
import { Select } from '../atoms/Select';
import { DateRangePicker } from './DateRangePicker';
import { SearchInput } from './SearchInput';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';

export type FilterValue = string | [Date, Date] | undefined;

export interface FilterOption {
  field: string;
  label: string;
  type: 'select' | 'date' | 'search';
  options?: Array<{
    value: string;
    label: string;
  }>;
}

export interface FilterBarProps {
  filters: FilterOption[];
  value: Record<string, FilterValue>;
  onChange: (values: Record<string, FilterValue>) => void;
  onReset?: () => void;
  className?: string;
}

export const FilterBar: FC<FilterBarProps> = ({
  filters,
  value,
  onChange,
  onReset,
  className
}) => {
  const handleFilterChange = (field: string, newValue: FilterValue) => {
    onChange({
      ...value,
      [field]: newValue
    });
  };

  const activeFiltersCount = Object.keys(value).filter(key => {
    const filterValue = value[key];
    return Array.isArray(filterValue) 
      ? filterValue.length > 0 
      : filterValue !== undefined && filterValue !== '';
  }).length;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Bộ lọc</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="info">
              {activeFiltersCount} bộ lọc đang áp dụng
            </Badge>
          )}
        </div>
        {onReset && activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center"
          >
            <Icon name="XMarkIcon" className="w-4 h-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filters.map((filter) => (
          <div key={filter.field}>
            {filter.type === 'select' && filter.options && (
              <Select
                label={filter.label}
                options={filter.options}
                value={value[filter.field] as string || ''}
                onChange={(e) => handleFilterChange(filter.field, e.target.value)}
              />
            )}

            {filter.type === 'date' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                <DateRangePicker
                  value={value[filter.field] as [Date, Date] || [new Date(), new Date()]}
                  onChange={(range) => handleFilterChange(filter.field, range)}
                />
              </div>
            )}

            {filter.type === 'search' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                <SearchInput
                  value={value[filter.field] as string || ''}
                  onSearch={(searchValue) => handleFilterChange(filter.field, searchValue)}
                  placeholder={`Tìm theo ${filter.label.toLowerCase()}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {activeFiltersCount > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const filterValue = value[filter.field];
            if (!filterValue) return null;

            let displayValue = '';
            if (filter.type === 'select') {
              const option = filter.options?.find(opt => opt.value === filterValue);
              displayValue = option?.label || filterValue as string;
            } else if (filter.type === 'date' && Array.isArray(filterValue)) {
              const [start, end] = filterValue;
              displayValue = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
            } else {
              displayValue = filterValue as string;
            }

            return (
              <Badge
                key={filter.field}
                className="flex items-center space-x-1"
              >
                <span>{filter.label}: {displayValue}</span>
                <button
                  type="button"
                  onClick={() => handleFilterChange(filter.field, undefined)}
                  className="ml-1 hover:text-gray-700"
                >
                  <Icon name="XMarkIcon" className="w-4 h-4" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}; 