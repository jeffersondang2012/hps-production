import { FC, useState, useEffect, useCallback } from 'react';
import { Icon } from '../atoms/Icon';
import { Input } from '../atoms/Input';

interface SearchInputProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export const SearchInput: FC<SearchInputProps> = ({
  value,
  onSearch,
  placeholder = 'Tìm kiếm...'
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  // Sync with external value
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== value) {
        onSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch, value]);

  return (
    <div className="relative">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
      <Icon
        name="MagnifyingGlassIcon"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
      />
    </div>
  );
}; 