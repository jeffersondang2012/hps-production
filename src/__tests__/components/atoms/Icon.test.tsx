import { render, screen } from '@testing-library/react';
import { Icon } from '@/components/atoms/Icon';
import * as HeroIcons from '@heroicons/react/24/outline';

// Mock HeroIcons
jest.mock('@heroicons/react/24/outline', () => ({
  UserIcon: () => <div data-testid="mock-icon">UserIcon</div>,
  HomeIcon: () => <div data-testid="mock-icon">HomeIcon</div>
}));

describe('Icon Component', () => {
  it('renders icon correctly', () => {
    render(<Icon name="UserIcon" />);
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('UserIcon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Icon name="UserIcon" className="custom-class" />);
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toHaveAttribute('class', 'w-6 h-6 custom-class');
  });

  it('renders different icons based on name prop', () => {
    const { rerender } = render(<Icon name="UserIcon" />);
    expect(screen.getByText('UserIcon')).toBeInTheDocument();

    rerender(<Icon name="HomeIcon" />);
    expect(screen.getByText('HomeIcon')).toBeInTheDocument();
  });

  it('sets aria-hidden attribute', () => {
    render(<Icon name="UserIcon" />);
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Icon name="UserIcon" size="sm" />);
    expect(screen.getByTestId('mock-icon')).toHaveAttribute('class', 'w-4 h-4');

    rerender(<Icon name="UserIcon" size="md" />);
    expect(screen.getByTestId('mock-icon')).toHaveAttribute('class', 'w-6 h-6');

    rerender(<Icon name="UserIcon" size="lg" />);
    expect(screen.getByTestId('mock-icon')).toHaveAttribute('class', 'w-8 h-8');
  });

  it('uses medium size by default', () => {
    render(<Icon name="UserIcon" />);
    expect(screen.getByTestId('mock-icon')).toHaveAttribute('class', 'w-6 h-6');
  });

  it('combines size and custom classes correctly', () => {
    render(<Icon name="UserIcon" size="sm" className="text-blue-500" />);
    expect(screen.getByTestId('mock-icon')).toHaveAttribute('class', 'w-4 h-4 text-blue-500');
  });
}); 