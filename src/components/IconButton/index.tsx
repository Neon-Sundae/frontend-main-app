import { FC } from 'react';
import styles from './index.module.scss';

interface IconButtonFC {
  icon: JSX.Element;
  text: string;
  handleClick: () => void;
  // option prop
  style?: any;
}

const IconButton: FC<IconButtonFC> = ({ icon, text, handleClick, style }) => {
  return (
    <button
      type="button"
      className={styles.IconButton}
      onClick={handleClick}
      // add font from step 1 here
      style={style}
    >
      {icon}
      {text}
    </button>
  );
};

// default prop for font
IconButton.defaultProps = {
  style: undefined,
};

export default IconButton;
