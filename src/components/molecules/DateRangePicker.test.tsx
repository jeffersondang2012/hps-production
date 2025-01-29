import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker } from './DateRangePicker';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

describe('DateRangePicker', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: [new Date(2024, 0, 1), new Date(2024, 0, 31)],
    onChange: mockOnChange
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders correctly', () => {
    render(<DateRangePicker {...defaultProps} />);
    expect(screen.getByText('01/01/2024 - 31/01/2024')).toBeInTheDocument();
  });

  it('opens calendar on button click', () => {
    render(<DateRangePicker {...defaultProps} />);
    fireEvent.click(screen.getByText('01/01/2024 - 31/01/2024'));
    expect(screen.getByRole('application')).toBeInTheDocument();
  });

  it('renders with start and end dates', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent(
      `${format(new Date(2024, 0, 1), 'dd/MM/yyyy', { locale: vi })} - ${format(new Date(2024, 0, 31), 'dd/MM/yyyy', { locale: vi })}`
    );
  });

  it('opens calendar when clicked', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Hôm nay')).toBeInTheDocument();
    expect(screen.getByText('7 ngày')).toBeInTheDocument();
    expect(screen.getByText('30 ngày')).toBeInTheDocument();
  });

  it('calls onChange with today when clicking "Hôm nay"', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const todayButton = screen.getByText('Hôm nay');
    fireEvent.click(todayButton);
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const [[startDate, endDate]] = mockOnChange.mock.calls[0];
    expect(startDate.toDateString()).toBe(new Date().toDateString());
    expect(endDate.toDateString()).toBe(new Date().toDateString());
  });

  it('calls onChange with last 7 days when clicking "7 ngày"', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const weekButton = screen.getByText('7 ngày');
    fireEvent.click(weekButton);
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const [[startDate, endDate]] = mockOnChange.mock.calls[0];
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    expect(startDate.toDateString()).toBe(weekAgo.toDateString());
    expect(endDate.toDateString()).toBe(today.toDateString());
  });

  it('calls onChange with last 30 days when clicking "30 ngày"', () => {
    render(<DateRangePicker {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const monthButton = screen.getByText('30 ngày');
    fireEvent.click(monthButton);
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    const [[startDate, endDate]] = mockOnChange.mock.calls[0];
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);
    expect(startDate.toDateString()).toBe(monthAgo.toDateString());
    expect(endDate.toDateString()).toBe(today.toDateString());
  });

  it('applies custom className', () => {
    const className = 'custom-class';
    render(<DateRangePicker {...defaultProps} className={className} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(className);
  });
}); 