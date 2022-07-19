import { FC } from 'react';
import Landing from 'components/Project/Landing';
import AllProjects from 'components/Projects/Landing';
import { useParams } from 'react-router-dom';

const Project: FC = () => {
  const { create } = useParams();
  if (create === 'all') {
    return <AllProjects />;
  }
  return <Landing />;
};
export default Project;
