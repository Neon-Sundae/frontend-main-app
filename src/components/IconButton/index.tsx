import clsx from 'clsx';
import { FC } from 'react';
import styles from './index.module.scss';

interface IconButtonFC {
  icon: JSX.Element;
  text: string;
  handleClick: () => void;
  // option prop
  style?: any;
  active?: boolean;
}

const IconButton: FC<IconButtonFC> = ({
  icon,
  text,
  handleClick,
  style,
  active,
}) => {
  return (
    <button
      type="button"
      className={clsx(styles.IconButton, active && styles['IconButton-active'])}
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
  active: false,
};

export default IconButton;
