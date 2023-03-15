/* eslint-disable react/jsx-props-no-spreading */
import { FC } from 'react';
import CreateOrganisationForm from '../CreateOrganisationForm';
import styles from './index.module.scss';

const Step2: FC = () => {
  return (
    <div className={styles['step2-container']}>
      <h2>Let’s create your organisation</h2>
      <h3>You can always change these later</h3>

      <CreateOrganisationForm />
    </div>
  );
};

export default Step2;
