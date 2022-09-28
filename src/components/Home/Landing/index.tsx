import { FC, useState } from 'react';
import NavBar from 'components/NavBar';
import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import BlurBlobs from 'components/BlurBlobs';
import useFetchOffChainProfile from 'hooks/useFetchOffChainProfile';
import Shepherd from 'shepherd.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Tasks from '../Tasks';
import Banner from '../Banner';
import Projects from '../Projects';
import styles from './index.module.scss';

const Landing: FC = () => {
  // const { offChainProfile } = useFetchOffChainProfile();
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.profile.profile);
  const [checkOnboardStatus, setCheckOnboardStatus] = useState(
    localStorage.getItem('onboardStatus')
  );
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'shadow-md bg-purple-dark',
      scrollTo: true,
    },
  });
  const handleStepOne = () => {
    tour.cancel();
    navigate(`/profile/${profile?.profileId}`);
    navigate(0);
  };
  tour.addStep({
    id: 'step0',
    arrow: true,
    text: "Hello 👋,<br /> Let's get you first started by <br />minting your profile",
    attachTo: {
      element: '#navbar-wallet-information',
      on: 'bottom',
    },
    classes: 'shepherd-theme-custom',
    buttons: [
      {
        text: '1/5',
        classes: 'information-button',
      },
      {
        action() {
          return handleStepOne();
        },
        text: 'Click to continue',
      },
      {
        text: '⏩',
        classes: 'information-button',
      },
    ],
  });
  const { data } = useQuery(
    ['newTasks'],
    () =>
      fetch(`${config.ApiBaseUrl}/task/new`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }).then(response => response.json()),
    {
      refetchOnWindowFocus: false,
    }
  );
  if (checkOnboardStatus && checkOnboardStatus === 'started') {
    if (!tour.isActive()) {
      setTimeout(() => {
        tour.start();
      }, 500);
    }
  }
  if (data) {
    return (
      <div className={styles.background}>
        <NavBar />
        <BlurBlobs />
        <Banner />
        <section className={styles.content}>
          <Projects />
          <Tasks data={data} />
        </section>
      </div>
    );
  }

  return null;
};

export default Landing;
