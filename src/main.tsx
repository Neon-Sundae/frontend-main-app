import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import reducer from 'reducers';
import 'styles/main.scss';
import { ProvideAuth } from '@arcana/auth-react';
import App from './App';
import { provider } from './config';
import { initAmplitude } from './config/amplitude';

const store = createStore(reducer);
const queryClient = new QueryClient();

initAmplitude();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ProvideAuth provider={provider}>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </HelmetProvider>
    </QueryClientProvider>
  </ProvideAuth>
);
