import { getItem } from 'utils/sessionStorageFunc';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useConditionalRender = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getItem('access_token');

    if (accessToken) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);
};

export default useConditionalRender;
