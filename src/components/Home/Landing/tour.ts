import Shepherd from 'shepherd.js';
import { useNavigate } from 'react-router-dom';
import { useFetchUserDetailsWrapper } from 'queries/user';
import { useFetchProfileDetailsByUserWrapper } from 'queries/profile';

const TourHomePage = () => {
  const navigate = useNavigate();
  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsByUserWrapper({
    userId: userData?.user.userId,
  });

  const handleStepOne = () => {
    tour.cancel();
    navigate(`/profile/${profileData?.profileId}`);
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

  const tourStart = () => {
    return tour.start();
  };

  return { tourStart };
};

export default TourHomePage;
