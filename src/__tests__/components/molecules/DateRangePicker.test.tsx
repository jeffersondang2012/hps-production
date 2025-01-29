import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { startOfToday, subDays, startOfDay, endOfDay } from 'date-fns';

describe('DateRangePicker', () => {
  const mockOnChange = jest.fn();
  const today = startOfToday();
  const defaultValue: [Date, Date] = [today, today];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders date range picker correctly', () => {
    render(
      <DateRangePicker
        value={defaultValue}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('handles date selection', () => {
    render(
      <DateRangePicker
        value={defaultValue}
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    // Giả lập việc chọn ngày
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 0, 7);
    
    fireEvent.change(input, {
      target: { value: { selection: { startDate, endDate } } }
    });

    expect(mockOnChange).toHaveBeenCalledWith([startDate, endDate]);
  });

  it('handles Today button click', () => {
    render(
      <DateRangePicker
        value={defaultValue}
        onChange={mockOnChange}
      />
    );

    const todayButton = screen.getByText('Hôm nay');
    fireEvent.click(todayButton);

    const expectedStart = startOfDay(today);
    const expectedEnd = endOfDay(today);
    
    expect(mockOnChange).toHaveBeenCalledWith([expectedStart, expectedEnd]);
  });

  it('handles Last 7 Days button click', () => {
    render(
      <DateRangePicker
        value={defaultValue}
        onChange={mockOnChange}
      />
    );

    const last7DaysButton = screen.getByText('7 ngày qua');
    fireEvent.click(last7DaysButton);

    const expectedStart = startOfDay(subDays(today, 6));
    const expectedEnd = endOfDay(today);
    
    expect(mockOnChange).toHaveBeenCalledWith([expectedStart, expectedEnd]);
  });

  it('handles Last 30 Days button click', () => {
    render(
      <DateRangePicker
        value={defaultValue}
        onChange={mockOnChange}
      />
    );

    const last30DaysButton = screen.getByText('30 ngày qua');
    fireEvent.click(last30DaysButton);

    const expectedStart = startOfDay(subDays(today, 29));
    const expectedEnd = endOfDay(today);
    
    expect(mockOnChange).toHaveBeenCalledWith([expectedStart, expectedEnd]);
  });

  it('applies custom className', () => {
    render(
      <DateRangePicker
        value={defaultValue}
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    const wrapper = screen.getByRole('textbox').parentElement;
    expect(wrapper).toHaveClass('custom-class');
  });
}); 