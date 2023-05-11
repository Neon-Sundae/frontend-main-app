import { FC, ReactNode } from 'react';
import { Auth, useAuth } from '@arcana/auth-react';

interface IArcanaAuthLayout {
  children: ReactNode;
}

const ArcanaAuthLayout: FC<IArcanaAuthLayout> = ({ children }) => {
  const auth = useAuth();
  return (
    <>
      {children}
      {auth.isLoggedIn && <Auth externalWallet theme="dark" />}
    </>
  );
};

export { ArcanaAuthLayout };
