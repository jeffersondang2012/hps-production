import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/atoms/Input';

describe('Input Component', () => {
  describe('Input mode', () => {
    it('renders input correctly', () => {
      render(<Input label="Username" placeholder="Enter username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('handles value changes', () => {
      const handleChange = jest.fn();
      render(<Input label="Username" onChange={handleChange} />);
      
      const input = screen.getByLabelText('Username');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('shows error message', () => {
      render(<Input label="Username" error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toHaveClass('border-red-500');
    });

    it('disables input correctly', () => {
      render(<Input label="Username" disabled />);
      expect(screen.getByLabelText('Username')).toBeDisabled();
    });

    it('applies custom className', () => {
      render(<Input label="Username" className="custom-class" />);
      expect(screen.getByLabelText('Username')).toHaveClass('custom-class');
    });
  });

  describe('Textarea mode', () => {
    it('renders textarea correctly', () => {
      render(<Input as="textarea" label="Description" placeholder="Enter description" />);
      const textarea = screen.getByLabelText('Description');
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('placeholder', 'Enter description');
    });

    it('handles textarea value changes', () => {
      const handleChange = jest.fn();
      render(<Input as="textarea" label="Description" onChange={handleChange} />);
      
      const textarea = screen.getByLabelText('Description');
      fireEvent.change(textarea, { target: { value: 'test description' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('shows error message in textarea', () => {
      render(<Input as="textarea" label="Description" error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toHaveClass('border-red-500');
    });

    it('uses default rows when not specified', () => {
      render(<Input as="textarea" label="Description" />);
      expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '3');
    });

    it('uses custom rows when specified', () => {
      render(<Input as="textarea" label="Description" rows={5} />);
      expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '5');
    });

    it('applies custom className to textarea', () => {
      render(<Input as="textarea" label="Description" className="custom-class" />);
      expect(screen.getByLabelText('Description')).toHaveClass('custom-class');
    });

    it('disables textarea correctly', () => {
      render(<Input as="textarea" label="Description" disabled />);
      expect(screen.getByLabelText('Description')).toBeDisabled();
    });
  });
}); 