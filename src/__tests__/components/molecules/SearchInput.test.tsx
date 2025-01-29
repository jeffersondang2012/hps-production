import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchInput } from '@/components/molecules/SearchInput';

describe('SearchInput', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with placeholder', () => {
    render(<SearchInput onSearch={mockOnSearch} placeholder="Search..." />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders with default placeholder', () => {
    render(<SearchInput onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText('Tìm kiếm...')).toBeInTheDocument();
  });

  it('calls onSearch with debounced value when input changes', async () => {
    render(<SearchInput onSearch={mockOnSearch} delay={300} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockOnSearch).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  it('renders with custom className', () => {
    render(<SearchInput onSearch={mockOnSearch} className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('renders search icon', () => {
    render(<SearchInput onSearch={mockOnSearch} />);
    const searchIcon = screen.getByRole('img', { hidden: true });
    expect(searchIcon).toHaveAttribute('data-testid', 'MagnifyingGlassIcon');
  });

  it('shows clear button when input has value', () => {
    render(<SearchInput onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    render(<SearchInput onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
  });
}); 