import Loading from 'components/Loading';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootPage from 'containers/root';
import PrivateRoute from 'components/PrivateRoute';
import useSetAppMetadata from 'hooks/useSetAppMetadata';

const Login = lazy(() => import('containers/login'));
const Dashboard = lazy(() => import('containers/dashboard'));
const Profile = lazy(() => import('containers/profile'));
const Home = lazy(() => import('containers/home'));
const Organisation = lazy(() => import('containers/organisation'));

const App = () => {
  // Set application metadata - web3 providers, chain, etc.
  useSetAppMetadata();

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/organisation/:orgId"
            element={
              <PrivateRoute>
                <Organisation />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
