import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ProvideAuth } from '@arcana/auth-react';
import { arcanaProvider } from 'config/arcana';
import reducer from 'reducers';
import 'styles/main.scss';
import App from './App';

const store = createStore(reducer);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ProvideAuth provider={arcanaProvider}>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    </QueryClientProvider>
  </ProvideAuth>
);
