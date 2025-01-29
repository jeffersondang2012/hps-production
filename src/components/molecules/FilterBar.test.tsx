import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar, type FilterOption } from './FilterBar';
import { describe, it, expect, vi } from 'vitest';

describe('FilterBar', () => {
  const mockFilters: FilterOption[] = [
    {
      field: 'type',
      label: 'Loại',
      type: 'select',
      options: [
        { value: 'A', label: 'Type A' },
        { value: 'B', label: 'Type B' }
      ]
    },
    {
      field: 'date',
      label: 'Ngày',
      type: 'date'
    },
    {
      field: 'search',
      label: 'Tìm kiếm',
      type: 'search'
    }
  ];

  const today = new Date();
  const mockValue = {
    type: 'A',
    date: [today, today] as [Date, Date],
    search: 'test'
  };

  const mockOnChange = vi.fn();
  const mockOnReset = vi.fn();

  it('renders all filter types correctly', () => {
    render(
      <FilterBar
        filters={mockFilters}
        value={mockValue}
        onChange={mockOnChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText('Bộ lọc')).toBeInTheDocument();
    expect(screen.getByText('3 bộ lọc đang áp dụng')).toBeInTheDocument();
    expect(screen.getByText('Loại')).toBeInTheDocument();
    expect(screen.getByText('Ngày')).toBeInTheDocument();
    expect(screen.getByText('Tìm kiếm')).toBeInTheDocument();
    expect(screen.getByText('Xóa bộ lọc')).toBeInTheDocument();
  });

  it('calls onChange when select filter changes', () => {
    render(
      <FilterBar
        filters={mockFilters}
        value={mockValue}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'B' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValue,
      type: 'B'
    });
  });

  it('calls onReset when reset button is clicked', () => {
    render(
      <FilterBar
        filters={mockFilters}
        value={mockValue}
        onChange={mockOnChange}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByText('Xóa bộ lọc');
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it('displays active filters with badges', () => {
    render(
      <FilterBar
        filters={mockFilters}
        value={mockValue}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Loại: Type A')).toBeInTheDocument();
    expect(screen.getByText('Tìm kiếm: test')).toBeInTheDocument();
  });

  it('removes filter when clicking X button on badge', () => {
    render(
      <FilterBar
        filters={mockFilters}
        value={mockValue}
        onChange={mockOnChange}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /xmark/i });
    fireEvent.click(removeButtons[1]);

    expect(mockOnChange).toHaveBeenCalled();
  });
}); 