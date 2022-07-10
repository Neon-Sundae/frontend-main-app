import Loading from 'components/Loading';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootPage from 'containers/root';
import PrivateRoute from 'components/PrivateRoute';
import useSetAppMetadata from 'hooks/useSetAppMetadata';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import useProfile from 'components/Profile/Landing/hooks';

const Login = lazy(() => import('containers/login'));
const Dashboard = lazy(() => import('containers/dashboard'));
const Profile = lazy(() => import('containers/profile'));
const Organisation = lazy(() => import('containers/organisation'));
const Project = lazy(() => import('containers/project'));
const Tasks = lazy(() => import('containers/tasks'));
const Logout = lazy(() => import('containers/logout'));

const App = () => {
  // Set application metadata - web3 providers, chain, etc.
  useSetAppMetadata();

  const { getProfileContractAddress, fetchOnChainProfileData } = useProfile();

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const profileContractAddress = useSelector((state: RootState) => state.profile.profileContractAddress);

  useEffect(() => {
    if (walletId !== undefined) {
      getProfileContractAddress(walletId);
    }
  }, [walletId]);

  useEffect(() => {
    if (profileContractAddress !== "0x0000000000000000000000000000000000000000" && profileContractAddress !== "") {
      fetchOnChainProfileData(profileContractAddress);
    }
  }, [profileContractAddress]);

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
            path="/organisation/:orgId"
            element={
              <PrivateRoute>
                <Organisation />
              </PrivateRoute>
            }
          />
          <Route
            path="/project"
            element={
              <PrivateRoute>
                <Project />
              </PrivateRoute>
            }
          />
          <Route
            path="/project/:create"
            element={
              <PrivateRoute>
                <Project />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              // <PrivateRoute>
              <Tasks />
              // </PrivateRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
