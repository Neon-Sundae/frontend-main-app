import {
  SET_WALLETCONNECT_PROVIDER,
  TOGGLE_WALLET_DRAWER,
} from 'actions/app/types';

interface State {
  walletConnectProvider: any | undefined;
  toggle: boolean;
}

type Action =
  | {
      type: typeof SET_WALLETCONNECT_PROVIDER;
      provider: any;
    }
  | {
      type: typeof TOGGLE_WALLET_DRAWER;
      toggle: boolean;
    };

const initialState: State = {
  walletConnectProvider: undefined,
  toggle: false,
};

const app = (state = initialState, action: Action): State => {
  switch (action.type) {
    case SET_WALLETCONNECT_PROVIDER:
      return {
        ...state,
        walletConnectProvider: action.provider,
      };
    case TOGGLE_WALLET_DRAWER:
      return {
        ...state,
        toggle: action.toggle,
      };
    default:
      return { ...state };
  }
};

export default app;
