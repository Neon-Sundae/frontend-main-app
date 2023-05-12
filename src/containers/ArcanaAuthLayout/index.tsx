import { FC, ReactNode } from 'react';

interface IArcanaAuthLayout {
  children: ReactNode;
}

const ArcanaAuthLayout: FC<IArcanaAuthLayout> = ({ children }) => {
  // const auth = useAuth();
  // console.log('render auth layout');
  // const onLogin = () => {
  //   console.log('first login');
  //   console.log(auth);
  // };

  return (
    <>
      {children}
      {/* {auth.isLoggedIn && ( */}
      {/* <Auth externalWallet={false} theme="dark" /> */}
      {/* )} */}
    </>
  );
};

export { ArcanaAuthLayout };
