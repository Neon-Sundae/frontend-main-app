import { SET_WALLETCONNECT_PROVIDER } from 'actions/app/types';

interface State {
  walletConnectProvider: any | undefined;
}

type Action = {
  type: typeof SET_WALLETCONNECT_PROVIDER;
  provider: any;
};

const initialState: State = {
  walletConnectProvider: undefined,
};

const app = (state = initialState, action: Action): State => {
  switch (action.type) {
    case SET_WALLETCONNECT_PROVIDER:
      return {
        ...state,
        walletConnectProvider: action.provider,
      };
    default:
      return { ...state };
  }
};

export default app;
