import { Background, LoginContainer } from 'components/Login';
import { ArcanaAuthLayout } from 'containers/ArcanaAuthLayout';

const Login = () => {
  return (
    <ArcanaAuthLayout>
      <Background />
      <LoginContainer />
    </ArcanaAuthLayout>
  );
};

export default Login;
