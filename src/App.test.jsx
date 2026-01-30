import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

jest.mock('./services/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: [] }),
  },
}));

describe('App', () => {
  it('renderiza el contenedor principal', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(document.querySelector('.container')).toBeInTheDocument();
  });

  it('renderiza la vista de productos', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText(/productos/i)).toBeInTheDocument();
  });
});
