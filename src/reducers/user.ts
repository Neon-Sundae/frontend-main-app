import { IUser } from 'interfaces/user';
import {
  UPDATE_USER,
  UPDATE_USER_NAME,
  GET_WALLET_ADDRESS,
  GET_WALLET_USDC_BALANCE,
  UPDATE_USER_EMAIL,
} from 'actions/user/types';

interface State {
  user: Partial<IUser> | undefined;
  wallet_address: string;
  wallet_usdc_balance: number;
}

type Action =
  | {
      type: typeof UPDATE_USER;
      user: Partial<IUser>;
    }
  | {
      type: typeof UPDATE_USER_NAME;
      name: string;
    }
  | {
      type: typeof GET_WALLET_ADDRESS;
      payload: string;
    }
  | {
      type: typeof GET_WALLET_USDC_BALANCE;
      payload: string;
    }
  | {
      type: typeof UPDATE_USER_EMAIL;
      email: string;
    };

const initialState: State = {
  user: undefined,
  wallet_address: '',
  wallet_usdc_balance: 0,
};

const user = (state = initialState, action: Action): State => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.user,
      };
    case UPDATE_USER_NAME:
      return {
        ...state,
        user: {
          ...state.user,
          name: action.name,
        },
      };
    case GET_WALLET_ADDRESS:
      return {
        ...state,
        wallet_address: action.payload,
      };
    case GET_WALLET_USDC_BALANCE:
      return {
        ...state,
        wallet_usdc_balance: Number(action.payload),
      };
    case UPDATE_USER_EMAIL:
      if (state.user) {
        return {
          ...state,
          user: {
            ...state.user,
            email: action.email,
          },
        };
      }
      return { ...state };
    default:
      return { ...state };
  }
};

export default user;
