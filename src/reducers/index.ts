import { combineReducers } from 'redux';
import authReducer from './auth';
import userReducer from './user';
import appReducer from './app';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  app: appReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
