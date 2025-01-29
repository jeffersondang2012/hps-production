import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/atoms/Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('shows loading state correctly', () => {
    render(<Button isLoading>Loading Button</Button>);
    expect(screen.getByText('Loading Button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with icons correctly', () => {
    render(
      <Button leftIcon="UserIcon" rightIcon="ArrowRightIcon">
        Icon Button
      </Button>
    );
    expect(screen.getByText('Icon Button')).toBeInTheDocument();
  });
}); 