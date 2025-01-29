import { FC } from 'react';
import { Button } from '../atoms/Button';
import { Select } from '../atoms/Select';
import { Icon } from '../atoms/Icon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100]
}) => {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Hiển thị</span>
        <Select
          value={pageSize.toString()}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="w-20"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
        <span className="text-sm text-gray-700">dòng mỗi trang</span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          aria-label="Previous"
        >
          <Icon name="ChevronLeftIcon" className="w-5 h-5" />
        </Button>

        <span className="text-sm text-gray-700">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="ghost"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Next"
        >
          <Icon name="ChevronRightIcon" className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}; 