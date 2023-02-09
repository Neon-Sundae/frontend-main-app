import Loading from 'components/Loading';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootPage from 'containers/root';
import PrivateRoute from 'components/PrivateRoute';
import useSetAppMetadata from 'hooks/useSetAppMetadata';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { useProfile } from 'components/Profile/Landing/hooks';
import ErrorPage from 'containers/error';

const Login = lazy(() => import('containers/login'));
const Dashboard = lazy(() => import('containers/dashboard'));
const Profile = lazy(() => import('containers/profile'));
const Organisation = lazy(() => import('containers/organisation'));
const Project = lazy(() => import('containers/project'));
const Tasks = lazy(() => import('containers/tasks'));
const Logout = lazy(() => import('containers/logout'));
const TaskCancel = lazy(() => import('containers/taskCancel'));
const Jobs = lazy(() => import('containers/jobs'));
const AllJobsContainer = lazy(() => import('containers/allJobs'));
const MemberInvitation = lazy(
  () => import('containers/organisation/MemberInvitation')
);

const App = () => {
  // Set application metadata - web3 providers, chain, etc.
  useSetAppMetadata();

  const { fetchOnChainProfileData } = useProfile();

  const profile = useSelector((state: RootState) => state.profile.profile);

  useEffect(() => {
    if (profile) {
      if (
        profile.profileSmartContractId &&
        profile.profileSmartContractId !==
          '0x0000000000000000000000000000000000000000'
      ) {
        fetchOnChainProfileData(profile.profileSmartContractId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

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
            path="/profile/:profileId"
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
          <Route
            path="/tasks/all"
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />
          <Route path="/task/cancel/:identifier" element={<TaskCancel />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/organisation/:orgId/jobs/all"
            element={
              <PrivateRoute>
                <Jobs />
              </PrivateRoute>
            }
          />
          <Route
            path="/organisation/member_invitation"
            element={<MemberInvitation />}
          />
          <Route path="/jobs/all" element={<AllJobsContainer />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
