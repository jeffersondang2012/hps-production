import { render, screen } from '@testing-library/react';
import { Card } from '@/components/atoms/Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    );
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    render(
      <Card className="custom-class">
        <div>Card Content</div>
      </Card>
    );
    const card = screen.getByText('Card Content').parentElement;
    expect(card).toHaveClass('custom-class');
  });

  it('applies default styles', () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    );
    const card = screen.getByText('Card Content').parentElement;
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-4');
  });
}); 