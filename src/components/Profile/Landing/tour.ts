// import { useDispatch } from 'react-redux';
import Shepherd from 'shepherd.js';
// import { editProfile } from 'actions/profile';
import { removeItem } from 'utils/localStorageFn';

const TourProfilePage = () => {
  // const dispatch = useDispatch();
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'shadow-md bg-purple-dark',
      scrollTo: true,
    },
  });
  tour.addStep({
    id: 'step1',
    arrow: true,
    text: 'This is where you edit and set up<br />your profile. At Founders Lab we want you to flaunt 😏 your NFT<br />collections, so all profile pictures are NFTs!🧪',
    attachTo: {
      element: '#edit-icon',
      on: 'right',
    },
    classes: 'shepherd-theme-custom',
    buttons: [
      {
        text: '2/3',
        classes: 'information-button',
      },
      {
        action() {
          tour.next();
        },
        text: 'Next',
      },
      {
        text: '<span class="material-icons">close</span>',
        classes: 'information-button',
        action() {
          removeItem('onboardStatus');
          tour.complete();
        },
      },
    ],
  });

  tour.addStep({
    id: 'step2',
    arrow: true,
    text: `✨ Mint your profile to <br /> apply for tasks and earn XP points.<br /><br />You will need $MATIC tokens to mint<br /> your profile.`,
    attachTo: {
      element: '#profile-address-chain',
      on: 'right',
    },
    classes: 'shepherd-theme-custom',
    buttons: [
      {
        text: '3/3',
        classes: 'information-button',
      },
      {
        action() {
          removeItem('onboardStatus');
          tour.complete();
        },
        text: 'Got it!',
      },
      {
        text: '<span class="material-icons">close</span>',
        classes: 'information-button',
        action() {
          removeItem('onboardStatus');
          tour.complete();
        },
      },
    ],
  });
  //TODO - If we remove "title" in profile creation then we can uncomment these things
  // tour.addStep({
  //   id: 'step3',
  //   arrow: true,
  //   text: 'Click mint now to trigger Metamask and<br /> accept the transaction.<br/>🚀',
  //   attachTo: {
  //     element: '#profile-address-container',
  //     on: 'bottom',
  //   },
  //   classes: 'shepherd-theme-custom',
  //   buttons: [
  //     {
  //       text: '4/5',
  //       classes: 'information-button',
  //     },
  //     {
  //       action() {
  //         // dispatch(editProfile(true));
  //         document.getElementById('profile-address-container')?.click();
  //         // setTimeout(() => {
  //         //   tour.show('step4');
  //         // }, 1000);
  //         tour.next();
  //       },
  //       text: 'Mint Now',
  //     },
  //     {
  //       text: '<span class="material-icons">close</span>',
  //       classes: 'information-button',
  //       action() {
  //         removeItem('onboardStatus');
  //         tour.complete();
  //       },
  //     },
  //   ],
  // });
  // tour.addStep({
  //   id: 'step4',
  //   arrow: true,
  //   text: '⏳ wait for 1-2 min for transaction to complete. You will receive a blockchain address. Click finish to exit the tour',
  //   attachTo: {
  //     element: '#profile-address-container',
  //     on: 'bottom',
  //   },
  //   classes: 'shepherd-theme-custom',
  //   buttons: [
  //     {
  //       text: '5/5',
  //       classes: 'information-button',
  //     },
  //     {
  //       classes: 'information-button',
  //     },
  //     {
  //       action() {
  //         removeItem('onboardStatus');
  //         tour.complete();
  //       },
  //       text: 'Finish',
  //     },
  //     {
  //       classes: 'information-button',
  //     },
  //   ],
  // });
  const tourStep = (stepId: string) => {
    return tour.show(stepId);
  };
  const tourStart = () => {
    return tour.start();
  };
  return { tourStart, tourStep };
};

export default TourProfilePage;
