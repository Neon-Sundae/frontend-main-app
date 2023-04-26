import clsx from 'clsx';
import { FC } from 'react';
import styles from './index.module.scss';

interface IconButtonFC {
  icon?: JSX.Element;
  text?: string;
  handleClick: () => void;
  // option prop
  style?: any;
  active?: boolean;
  showBorder?: boolean;
}

const IconButton: FC<IconButtonFC> = ({
  icon,
  text,
  handleClick,
  style,
  active,
  showBorder,
}) => {
  return (
    <button
      type="button"
      className={clsx(
        styles.IconButton,
        active && styles['IconButton-active'],
        showBorder && styles[`show-border`]
      )}
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
  active: false,
  showBorder: true,
  text: '',
  icon: <></>,
};

export default IconButton;
