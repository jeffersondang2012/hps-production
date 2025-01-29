import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/atoms/Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('bg-green-100 text-green-800');

    rerender(<Badge variant="error">Error</Badge>);
    expect(screen.getByText('Error')).toHaveClass('bg-red-100 text-red-800');

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toHaveClass('bg-yellow-100 text-yellow-800');

    rerender(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info')).toHaveClass('bg-blue-100 text-blue-800');
  });

  it('applies custom className correctly', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    expect(screen.getByText('Custom Badge')).toHaveClass('custom-class');
  });
}); 