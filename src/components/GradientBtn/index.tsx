import { FC } from 'react';
import gradientBtn from 'assets/illustrations/button/button-gradient.svg';
import styles from './index.module.scss';

interface IGradientBtn {
  label: string;
  onClick: () => void;
}

const GradientBtn: FC<IGradientBtn> = ({ label, onClick }) => {
  return (
    <div className={styles['gradient-save-btn']} onClick={onClick}>
      <div
        className={styles['gradient-blur']}
        style={{ backgroundImage: `url(${gradientBtn})` }}
      />
      <p>{label}</p>
    </div>
  );
};

export default GradientBtn;
