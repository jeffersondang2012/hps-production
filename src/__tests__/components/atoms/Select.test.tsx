import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '@/components/atoms/Select';

describe('Select Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ];

  it('renders select with options correctly', () => {
    render(
      <Select label="Select Option">
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
    
    expect(screen.getByLabelText('Select Option')).toBeInTheDocument();
    options.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(
      <Select label="Select Option" onChange={handleChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
    
    fireEvent.change(screen.getByLabelText('Select Option'), {
      target: { value: 'option2' }
    });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(
      <Select label="Select Option" error="Please select an option">
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
    
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('disables select correctly', () => {
    render(
      <Select label="Select Option" disabled>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
    
    expect(screen.getByLabelText('Select Option')).toBeDisabled();
  });
}); 