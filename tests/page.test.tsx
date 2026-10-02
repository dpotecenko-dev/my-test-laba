import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home page', () => {
  it('shows the marketplace heading', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', {
        name: 'Репетиторы по программированию для детей',
      }),
    ).toBeInTheDocument();
  });
});
