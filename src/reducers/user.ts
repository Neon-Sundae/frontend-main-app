import { IUser } from 'actions/user';
import { UPDATE_USER } from 'actions/user/types';

interface State {
  user: Partial<IUser> | undefined;
}

type Action = {
  type: typeof UPDATE_USER;
  user: Partial<IUser>;
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
    default:
      return { ...state };
  }
};

export default user;
