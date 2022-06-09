import { FC, ReactElement } from 'react';
import styles from './index.module.scss';

interface ComponentProps {
  children: ReactElement;
}

const Card: FC<ComponentProps> = ({ children }) => {
  return <div className={styles.glass}>{children}</div>;
};

export default Card;
