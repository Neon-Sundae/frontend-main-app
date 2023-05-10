/* eslint-disable no-case-declarations */
import clsx from 'clsx';
import { setSignUpStep } from 'actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { FC } from 'react';
import { getSessionStorageItem } from 'utils/sessionStorageFunc';
import { trackAmplitudeEvent } from 'config/amplitude';
import styles from './index.module.scss';

interface IPromptFooter {
  active: boolean;
}

const PromptFooter: FC<IPromptFooter> = ({ active }) => {
  const step = useSelector((state: RootState) => state.user.step);
  const dispatch = useDispatch();

  const amplitudeStepEvents = () => {
    switch (step) {
      case 1:
        const flow = getSessionStorageItem('flow');
        if (flow === 'founder')
          return trackAmplitudeEvent('onb_usagepref_click', {
            usagepreference: 'team',
          });
        return trackAmplitudeEvent('onb_usagepref_click', {
          usagepreference: 'individual',
        });
      case 2:
        const work = getSessionStorageItem('work');
        return trackAmplitudeEvent('onb_userwork_click', {
          worktype: work,
        });
      case 3:
        return trackAmplitudeEvent('onb_userchoices_click');
      case 4:
        return trackAmplitudeEvent('onb_email_enter');
      // case 5:
      //   return 'onb_founder_flow';
      // case 6:
      //   return 'onb_builder_flow';
      case 7:
        return trackAmplitudeEvent('onb_orgname_enter');
      // case 8:
      //   return 'onb_builder_flow';
      // case 9:
      //   return 'onb_founder_flow';
      // case 10:
      //   return 'onb_builder_flow';
      // case 11:
      //   return 'onb_founder_flow';
      // case 12:
      //   return 'onb_builder_flow';
      // case 13:
      //   return 'onb_founder_flow';
      // case 14:
      //   return 'onb_builder_flow';
      default:
        return null;
    }
  };

  const handleBackFunc = () => {
    console.log('step', step);
    if (step === 0 || step === 6) dispatch(setSignUpStep(1));
    else dispatch(setSignUpStep(step - 1));
  };

  const handleContinueFunc = () => {
    console.log('step', step);
    amplitudeStepEvents();
    const isFlow = getSessionStorageItem('flow');
    if (isFlow === 'founder') {
      if (step < 6) dispatch(setSignUpStep(6));
      if (step >= 6) dispatch(setSignUpStep(step + 1));
    }
    if (isFlow === 'builder') dispatch(setSignUpStep(step + 1));
  };

  return (
    <div className={styles['prompt-footer-container']}>
      <button
        className={styles['prompt-footer-container--back-button']}
        aria-label="back"
        onClick={handleBackFunc}
      >
        <i className={clsx('material-icons', styles['arrow_back-icon'])}>
          arrow_back
        </i>
      </button>
      <button
        className={styles['prompt-footer-container--continue-button']}
        aria-label="continue"
        onClick={handleContinueFunc}
        disabled={active}
      >
        Continue
      </button>
    </div>
  );
};

export default PromptFooter;
