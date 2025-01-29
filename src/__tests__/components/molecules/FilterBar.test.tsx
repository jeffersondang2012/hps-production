import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '@/components/molecules/FilterBar';
import { FilterOption } from '@/components/molecules/FilterBar';

describe('FilterBar', () => {
  const mockOnChange = jest.fn();
  const mockOnReset = jest.fn();

  const defaultFilters: FilterOption[] = [
    {
      field: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'active', label: 'Đang hoạt động' },
        { value: 'inactive', label: 'Tạm dừng' }
      ]
    },
    {
      field: 'dateRange',
      label: 'Thời gian',
      type: 'date'
    },
    {
      field: 'search',
      label: 'Tìm kiếm',
      type: 'search'
    }
  ];

  const defaultValue = {
    status: 'active',
    dateRange: undefined,
    search: ''
  };

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnReset.mockClear();
  });

  it('renders all filter types correctly', () => {
    render(
      <FilterBar
        filters={defaultFilters}
        value={defaultValue}
        onChange={mockOnChange}
      />
    );

    // Select filter
    expect(screen.getByLabelText('Trạng thái')).toBeInTheDocument();
    expect(screen.getByText('Đang hoạt động')).toBeInTheDocument();
    expect(screen.getByText('Tạm dừng')).toBeInTheDocument();

    // Date range filter
    expect(screen.getByLabelText('Thời gian')).toBeInTheDocument();

    // Search filter
    expect(screen.getByPlaceholderText('Tìm kiếm...')).toBeInTheDocument();
  });

  it('handles select filter change', () => {
    render(
      <FilterBar
        filters={defaultFilters}
        value={defaultValue}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByLabelText('Trạng thái');
    fireEvent.change(select, { target: { value: 'inactive' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultValue,
      status: 'inactive'
    });
  });

  it('handles date range filter change', () => {
    render(
      <FilterBar
        filters={defaultFilters}
        value={defaultValue}
        onChange={mockOnChange}
      />
    );

    const dateRange = screen.getByLabelText('Thời gian');
    const newDateRange: [Date, Date] = [new Date(), new Date()];
    
    fireEvent.change(dateRange, {
      target: { value: newDateRange }
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultValue,
      dateRange: newDateRange
    });
  });

  it('handles search filter change', () => {
    render(
      <FilterBar
        filters={defaultFilters}
        value={defaultValue}
        onChange={mockOnChange}
      />
    );

    const search = screen.getByPlaceholderText('Tìm kiếm...');
    fireEvent.change(search, { target: { value: 'test' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultValue,
      search: 'test'
    });
  });

  it('handles reset button click', () => {
    render(
      <FilterBar
        filters={defaultFilters}
        value={defaultValue}
        onChange={mockOnChange}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByText('Đặt lại');
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <FilterBar
        filters={defaultFilters}
        value={defaultValue}
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    const filterBar = screen.getByRole('form');
    expect(filterBar).toHaveClass('custom-class');
  });

  it('renders without reset button when onReset is not provided', () => {
    render(
      <FilterBar
        filters={defaultFilters}
        value={defaultValue}
        onChange={mockOnChange}
      />
    );

    expect(screen.queryByText('Đặt lại')).not.toBeInTheDocument();
  });
}); 