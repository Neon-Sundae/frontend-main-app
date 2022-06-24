import { FC, useState } from 'react';
import NavBar from 'components/NavBar';
import Tasks from '../Tasks';
import styles from './index.module.scss';
import Banner from '../Banner';
import Projects from '../Projects';

const Landing: FC = () => {
  return (
    <div className={styles.background}>
      <NavBar />
      <Banner />
      <section className={styles.content}>
        <Projects />
        <Tasks />
      </section>
    </div>
  );
};

export default Landing;
