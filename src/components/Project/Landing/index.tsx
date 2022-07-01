import { FC } from 'react';
import styles from './index.module.scss';
import { useParams } from 'react-router-dom';
import ProjectCreateForm from '../ProjectForm';
import InfoSidebar from '../InfoSidebar';

const Landing: FC = () => {
  const { create } = useParams();
  if (create) {
    return (
      <div className={styles.container}>
        <InfoSidebar />
        <ProjectCreateForm />
      </div>
    );
  }
  return <p>Project Landing</p>;
};

export default Landing;
