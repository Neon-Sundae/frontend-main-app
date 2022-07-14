import { FC, ReactElement } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

interface ComponentProps {
  children: JSX.Element[] | JSX.Element | ReactElement;
  className?: string;
  showTransparentBg?: boolean;
  width?: string;
  height?: string;
}

const Card: FC<ComponentProps> = ({
  children,
  className,
  showTransparentBg,
  width,
  height,
}) => {
  if (showTransparentBg) {
    return (
      <div
        className={clsx(styles.glass, styles.card, className)}
        style={{ width: width, height: height }}
      >
        {children}
      </div>
    );
  } else {
    return <div className={clsx(styles.card, className)}>{children}</div>;
  }
};

Card.defaultProps = {
  className: '',
};

export default Card;
