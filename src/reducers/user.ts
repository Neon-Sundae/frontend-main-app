import { IUser } from 'actions/user';
import { UPDATE_USER, UPDATE_USER_NAME } from 'actions/user/types';

interface State {
  user: Partial<IUser> | undefined;
}

type Action =
  | {
      type: typeof UPDATE_USER;
      user: Partial<IUser>;
    }
  | {
      type: typeof UPDATE_USER_NAME;
      name: string;
    };

const initialState: State = {
  user: undefined,
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
    default:
      return { ...state };
  }
};

export default user;
