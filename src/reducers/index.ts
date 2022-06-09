import { combineReducers } from 'redux';
import authReducer from './auth';
import userReducer from './user';
import appReducer from './app';
import skillsReducer from './skills';
import profileReducer from './profile';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  app: appReducer,
  skills: skillsReducer,
  profile: profileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
