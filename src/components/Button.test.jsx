import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renderiza el texto pasado como children', () => {
    render(<Button>Pagar</Button>);
    expect(screen.getByRole('button', { name: /pagar/i })).toBeInTheDocument();
  });

  it('aplica la clase btn-primary por defecto', () => {
    render(<Button>Texto</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('btn', 'btn-primary');
  });

  it('aplica la variante secondary cuando se pasa variant="secondary"', () => {
    render(<Button variant="secondary">Cancelar</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('btn-secondary');
  });

  it('llama onClick cuando se hace clic', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no llama onClick cuando está disabled', async () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('permite pasar props adicionales al botón', () => {
    render(<Button data-testid="custom-btn" aria-label="Custom">OK</Button>);
    const btn = screen.getByTestId('custom-btn');
    expect(btn).toHaveAttribute('aria-label', 'Custom');
  });
});
