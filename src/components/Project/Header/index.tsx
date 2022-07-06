import { FC } from 'react';
import styles from './index.module.scss';

const Header: FC = () => {
  return (
    <div className={styles.container}>
      <h1>Project Name</h1>
      <h3>Founder Name</h3>
      <button>Publish a Project</button>
    </div>
  );
};

export default Header;
