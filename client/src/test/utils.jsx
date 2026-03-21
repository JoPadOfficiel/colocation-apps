import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { vi } from 'vitest';

/**
 * Custom render function that includes common providers
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Custom options including initial state for providers
 */
const customRender = (ui, { 
  authValue = { user: null, login: vi.fn(), logout: vi.fn(), loading: false },
  route = '/',
  ...renderOptions 
} = {}) => {
  window.history.pushState({}, 'Test page', route);

  const AllTheProviders = ({ children }) => {
    return (
      <AuthContext.Provider value={authValue}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
