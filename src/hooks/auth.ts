import { useAuth } from '@arcana/auth-react';
import { updateArcanaAuthAddress } from 'actions/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useArcanaSignup = () => {
  const auth = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const isLoggedIn = await auth.isLoggedIn;

      if (isLoggedIn && auth.user?.address) {
        dispatch(updateArcanaAuthAddress(auth.user.address));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const arcanaEmailSignupInit = async (email: string) => {
    await auth.loginWithLink(email);
  };

  return { arcanaEmailSignupInit };
};

export { useArcanaSignup };
