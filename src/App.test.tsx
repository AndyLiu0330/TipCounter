import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

describe('App', () => {
  it('renders the header', () => {
    render(<App />);
    expect(screen.getByText('TipCalc Pro')).toBeInTheDocument();
  });

  it('auto-focuses the subtotal field', () => {
    render(<App />);
    expect(screen.getByLabelText('Subtotal')).toHaveFocus();
  });

  it('calculates tip and total in real-time', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Subtotal'), '50');
    await user.type(screen.getByLabelText('Tax'), '4.50');

    // Default preset is 18%: tip = 50 * 0.18 = 9
    expect(screen.getByText('$9.00')).toBeInTheDocument();
    // Total = 50 + 4.50 + 9 = 63.50
    expect(screen.getByText('$63.50')).toBeInTheDocument();
  });

  it('switches tip presets', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Subtotal'), '100');
    await user.click(screen.getByText('20%'));

    // Tip = 100 * 0.20 = 20
    expect(screen.getByText('$20.00')).toBeInTheDocument();
  });

  it('splits between guests', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Subtotal'), '100');
    await user.type(screen.getByLabelText('Tax'), '0');
    await user.click(screen.getByText('20%'));
    await user.click(screen.getByLabelText('Increase guests'));
    await user.click(screen.getByLabelText('Increase guests'));

    // Total = 120, 3 guests = $40 each
    expect(screen.getByText('Per person (3)')).toBeInTheDocument();
    expect(screen.getByText('$40.00')).toBeInTheDocument();
  });

  it('saves and shows history', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Subtotal'), '50');
    await user.click(screen.getByText('Save to History'));

    // Switch to history
    await user.click(screen.getByLabelText('Show history'));
    expect(screen.getByText('Untitled')).toBeInTheDocument();
  });
});
