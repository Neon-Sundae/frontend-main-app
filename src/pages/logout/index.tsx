import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeAccessToken } from 'utils/authFn';

const Logout: FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAccessToken();
    navigate('/');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
