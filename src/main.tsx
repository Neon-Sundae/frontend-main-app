import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import reducer from 'reducers';
import App from './App';
import 'styles/main.scss';
import { MoralisProvider } from "react-moralis";

const store = createStore(reducer);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <MoralisProvider serverUrl="https://gdosrk5keuuz.usemoralis.com:2053/server" appId="lJJWcluaU4bw2Pe0EA1z8maNh3NSxFUX0uYTFwz9">
        <App />
      </MoralisProvider>
    </Provider>
  </QueryClientProvider>
);
