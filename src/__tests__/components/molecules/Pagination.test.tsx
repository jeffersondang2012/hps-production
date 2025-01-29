import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '@/components/molecules/Pagination';

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    pageSize: 10,
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn(),
  };

  beforeEach(() => {
    defaultProps.onPageChange.mockClear();
    defaultProps.onPageSizeChange.mockClear();
  });

  it('renders current page and total pages', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('1 / 5')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} />);
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('enables previous button when not on first page', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).not.toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('enables next button when not on last page', () => {
    render(<Pagination {...defaultProps} currentPage={4} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange when clicking previous button', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when clicking next button', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders page size select with default options', () => {
    render(<Pagination {...defaultProps} />);
    const select = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveValue('10');
    expect(options[1]).toHaveValue('20');
    expect(options[2]).toHaveValue('50');
    expect(options[3]).toHaveValue('100');
  });

  it('renders page size select with custom options', () => {
    const customPageSizeOptions = [5, 15, 25];
    render(<Pagination {...defaultProps} pageSizeOptions={customPageSizeOptions} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('5');
    expect(options[1]).toHaveValue('15');
    expect(options[2]).toHaveValue('25');
  });

  it('calls onPageSizeChange when selecting a new page size', () => {
    render(<Pagination {...defaultProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '20' } });
    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(20);
  });
}); 