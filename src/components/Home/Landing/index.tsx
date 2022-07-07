import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import NavBar from 'components/NavBar';
import Tasks from '../Tasks';
import styles from './index.module.scss';
import Banner from '../Banner';
import Projects from '../Projects';
import { RootState } from 'reducers';

const Landing: FC = () => {

  const { usdcBalance } = useSelector((state: RootState) => state.profile);

  return (
    <div className={styles.background}>
      <NavBar usdcBalance={usdcBalance} />
      <Banner />
      <section className={styles.content}>
        <Projects />
        <Tasks />
      </section>
    </div>
  );
};

export default Landing;
