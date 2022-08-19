import { CSSProperties, FC } from 'react';
import styles from './index.module.scss';

interface IGradientBtn {
  label: string;
  onClick: () => void;
  style?: CSSProperties;
}

const GradientBtn: FC<IGradientBtn> = ({ label, onClick, style }) => {
  return (
    <button
      className={styles['gradient-save-btn']}
      style={style}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

GradientBtn.defaultProps = {
  style: {},
};

export default GradientBtn;
