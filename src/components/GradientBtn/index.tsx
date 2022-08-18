import { FC } from 'react';
import styles from './index.module.scss';

interface IGradientBtn {
  label: string;
  onClick: () => void;
}

const GradientBtn: FC<IGradientBtn> = ({ label, onClick }) => {
  return (
    <button className={styles['gradient-save-btn']} onClick={onClick}>
      {label}
    </button>
  );
};

export default GradientBtn;
