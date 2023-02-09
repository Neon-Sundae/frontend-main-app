import jwt_decode from 'jwt-decode';
import { removeAccessToken } from './authFn';

const decodeToken = (token: string) => {
  try {
    const decoded: any = jwt_decode(token);
    return decoded;
  } catch {
    removeAccessToken();
    return undefined;
  }
};

export default decodeToken;
