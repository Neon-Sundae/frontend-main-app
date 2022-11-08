import { FC, ReactElement } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

interface ComponentProps {
  children: JSX.Element[] | JSX.Element | ReactElement;
  className?: string;
  showTransparentBg?: boolean;
  width?: string;
  height?: string;
  marginRight?: string;
  borderType?: string;
  onClick?: () => void;
  onfocus?: () => void;
  location?: string;
}

const Card: FC<ComponentProps> = ({
  children,
  className,
  showTransparentBg,
  width,
  height,
  marginRight,
  borderType,
  onClick,
  onfocus,
  location,
}) => {
  if (showTransparentBg && location === 'my-projects') {
    return (
      <div
        className={clsx(
          styles.glass,
          styles.card,
          styles['glass-grid'],
          className
        )}
      >
        {children}
      </div>
    );
  }
  if (showTransparentBg) {
    return (
      <div
        className={clsx(styles.glass, styles.card, className)}
        style={{
          minWidth: width,
          height,
          marginRight,
          border: borderType,
        }}
        onClick={onClick}
        onFocus={onfocus}
      >
        {children}
      </div>
    );
  }
  return <div className={clsx(styles.card, className)}>{children}</div>;
};

Card.defaultProps = {
  className: '',
  showTransparentBg: false,
  width: '',
  height: '',
  marginRight: '',
  borderType: '',
  onClick: () => null,
  onfocus: () => null,
  location: '',
};

export default Card;
