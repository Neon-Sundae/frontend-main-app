import { combineReducers } from 'redux';
import authReducer from './auth';
import userReducer from './user';
import appReducer from './app';
import profileReducer from './profile';
import orgReducer from './organisation';
import flProjectReducer from './flProject';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  app: appReducer,
  profile: profileReducer,
  org: orgReducer,
  flProject: flProjectReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
