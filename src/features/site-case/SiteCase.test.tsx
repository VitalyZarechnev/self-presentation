import { PropsWithChildren } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ThemeProvider from '@application/theme/ThemeProvider';

import SiteCase from './SiteCase';

const wrapper = ({ children }: PropsWithChildren) => <ThemeProvider>{children}</ThemeProvider>;

describe('SiteCase', () => {
  test('starts with every aspect folded', () => {
    render(<SiteCase />, { wrapper });

    const toggles = screen.getAllByRole('button', { expanded: false });
    expect(toggles).toHaveLength(3);
    expect(screen.queryByRole('region', { name: 'Песочница цветов' })).not.toBeInTheDocument();
  });

  test('opening the themes aspect reveals the colour sandbox', () => {
    render(<SiteCase />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /Две темы/ }));

    expect(screen.getByRole('button', { name: /Две темы/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Песочница цветов' })).toBeInTheDocument();
  });
});
