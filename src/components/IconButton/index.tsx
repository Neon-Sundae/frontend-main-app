import { FC } from 'react';
import styles from './index.module.scss';

interface IconButtonFC {
  icon: JSX.Element;
  text: string;
  handleClick: () => void;
}

const IconButton: FC<IconButtonFC> = ({ icon, text, handleClick }) => {
  return (
    <button type="button" className={styles.IconButton} onClick={handleClick}>
      {icon}
      {text}
    </button>
  );
};

export default IconButton;
