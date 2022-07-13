import { FC, ReactElement } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

interface ComponentProps {
  children: JSX.Element[] | JSX.Element | ReactElement;
  className?: string;
}

const Card: FC<ComponentProps> = ({ children, className }) => {
  return (
    <div className={clsx(styles.glass, styles.card, className)}>{children}</div>
  );
};

Card.defaultProps = {
  className: '',
};

export default Card;
