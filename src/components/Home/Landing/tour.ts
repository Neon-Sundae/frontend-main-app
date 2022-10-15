import Shepherd from 'shepherd.js';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';

const TourHomePage = () => {
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.profile.profile);
  const handleStepOne = () => {
    tour.cancel();
    navigate(`/profile/${profile?.profileId}`);
    navigate(0);
  };
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'shadow-md bg-purple-dark',
      scrollTo: true,
    },
  });
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
        text: '1/3',
        classes: 'information-button',
      },
      {
        action() {
          return handleStepOne();
        },
        text: 'Click to continue',
      },
      {
        text: '<span class="material-icons">keyboard_double_arrow_right</span>',
        classes: 'information-button',
        action() {
          handleStepOne();
        },
      },
    ],
  });
  const tourActive = () => {
    return tour.isActive();
  };
  const tourStart = () => {
    return tour.start();
  };
  return { tourActive, tourStart };
};

export default TourHomePage;
