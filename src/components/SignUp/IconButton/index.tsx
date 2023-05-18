import clsx from 'clsx';
import { FC } from 'react';
import styles from './index.module.scss';

interface IconButtonFC {
  icon?: JSX.Element;
  text?: string;
  handleClick: () => void;
  // option prop
  style?: any;
  showBorder?: boolean;
}

const IconButton: FC<IconButtonFC> = ({
  icon,
  text,
  handleClick,
  style,
  showBorder,
}) => {
  return (
    <button
      type="button"
      className={clsx(styles.IconButton, showBorder && styles[`show-border`])}
      onClick={handleClick}
      // add font from step 1 here
      style={style}
    >
      <div>{icon}</div>

      <p>{text}</p>
    </button>
  );
};

// default prop for font
IconButton.defaultProps = {
  style: undefined,
  showBorder: true,
  text: '',
  icon: <></>,
};

export default IconButton;
