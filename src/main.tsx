import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import reducer from 'reducers';
import 'styles/main.scss';
import { AuthProvider, CHAIN } from '@arcana/auth';
import { ProvideAuth } from '@arcana/auth-react';
import App from './App';

const provider = new AuthProvider(
  `${import.meta.env.VITE_ARCANA_AUTH_CLIENT_KEY}`,
  {
    chainConfig: {
      chainId: CHAIN.POLYGON_MUMBAI_TESTNET,
      rpcUrl: 'https://rpc.ankr.com/polygon_mumbai',
    },
    alwaysVisible: true,
  }
);

const store = createStore(reducer);
const queryClient = new QueryClient();

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
