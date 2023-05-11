import { FC } from 'react';
import Landing from 'components/Project/Landing';
import { default as AllProjects } from 'components/Projects/Landing';
import { useParams } from 'react-router-dom';
import { ArcanaAuthLayout } from 'containers/ArcanaAuthLayout';

const Project: FC = () => {
  const { create } = useParams();
  if (create === 'all') {
    return (
      <ArcanaAuthLayout>
        <AllProjects />
      </ArcanaAuthLayout>
    );
  }
  return (
    <ArcanaAuthLayout>
      <Landing />
    </ArcanaAuthLayout>
  );
};
export default Project;
