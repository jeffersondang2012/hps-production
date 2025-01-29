import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();
  const mockOnPageSizeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders current page and total pages', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        pageSize={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    expect(screen.getByText('2 / 5')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        pageSize={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        pageSize={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when clicking navigation buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        pageSize={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('renders page size select with default options', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        pageSize={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('10');
  });

  it('calls onPageSizeChange when selecting a new page size', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        pageSize={10}
        onPageChange={mockOnPageChange}
        onPageSizeChange={mockOnPageSizeChange}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '20' } });

    expect(mockOnPageSizeChange).toHaveBeenCalledWith(20);
  });
}); 