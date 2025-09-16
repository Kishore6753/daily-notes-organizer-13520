import { render, screen } from '@testing-library/react';
import App from './App';

test('renders sidebar logo', () => {
  render(<App />);
  const logo = screen.getByText(/Daily Notes/i);
  expect(logo).toBeInTheDocument();
});
