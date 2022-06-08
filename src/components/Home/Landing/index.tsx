import { FC } from 'react';
import NavBar from 'components/NavBar';
import styles from './index.module.scss';

const Landing: FC = () => {
  return (
    <div className={styles.background}>
      <NavBar />
    </div>
  );
};

export default Landing;
