import { IUser } from 'interfaces/user';
import {
  UPDATE_USER,
  UPDATE_USER_NAME,
  GET_WALLET_ADDRESS,
  GET_WALLET_USDC_BALANCE,
  UPDATE_USER_DISCORD,
  UPDATE_USER_EMAIL,
  SIGN_UP_STEP,
  UPDATE_USER_ID,
} from 'actions/user/types';

interface State {
  user: Partial<IUser> | undefined;
  userId: number | undefined;
  wallet_address: string;
  wallet_usdc_balance: number;
  discordId: string;
  step: number;
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
      type: typeof UPDATE_USER_DISCORD;
      discordId: string;
    }
  | {
      type: typeof UPDATE_USER_EMAIL;
      email: string;
    }
  | {
      type: typeof SIGN_UP_STEP;
      step: number;
    }
  | {
      type: typeof UPDATE_USER_ID;
      userId: number;
    };

const initialState: State = {
  user: undefined,
  userId: undefined,
  wallet_address: '',
  wallet_usdc_balance: 0,
  discordId: '',
  step: 13,
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
    case UPDATE_USER_DISCORD:
      return {
        ...state,
        user: {
          ...state.user,
          discordId: action.discordId,
        },
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
    case SIGN_UP_STEP:
      return {
        ...state,
        step: action.step,
      };
    case UPDATE_USER_ID:
      return {
        ...state,
        userId: action.userId,
      };
    default:
      return { ...state };
  }
};

export default user;
