import Loading from 'components/Loading';
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootPage from 'pages/root';
import PrivateRoute from 'components/PrivateRoute';
import useSetAppMetadata from 'hooks/useSetAppMetadata';
import { useProfile } from 'components/Profile/Landing/hooks';
import ErrorPage from 'pages/error';
import { useFetchProfileDetailsByUserWrapper } from 'queries/profile';
import { useFetchUserDetailsWrapper } from 'queries/user';

const Login = lazy(() => import('pages/login'));
const SignUp = lazy(() => import('pages/signUp'));
const Dashboard = lazy(() => import('pages/dashboard'));
const Profile = lazy(() => import('pages/profile'));
const Organisation = lazy(() => import('pages/organisation'));
const Project = lazy(() => import('pages/project'));
const Tasks = lazy(() => import('pages/tasks'));
const Logout = lazy(() => import('pages/logout'));
const TaskCancel = lazy(() => import('pages/taskCancel'));
const Jobs = lazy(() => import('pages/jobs'));
const AllJobsContainer = lazy(() => import('pages/allJobs'));
const MemberInvitation = lazy(
  () => import('pages/organisation/MemberInvitation')
);

const App = () => {
  // Set application metadata - web3 providers, chain, etc.
  useSetAppMetadata();

  const { fetchOnChainProfileData } = useProfile();

  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsByUserWrapper({
    userId: userData?.user?.userId,
  });

  useEffect(() => {
    if (profileData) {
      if (
        profileData.profileSmartContractId &&
        profileData.profileSmartContractId !==
          '0x0000000000000000000000000000000000000000'
      ) {
        fetchOnChainProfileData(profileData.profileSmartContractId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
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
