import { FC } from 'react';
import { useParams } from 'react-router-dom';

const Landing: FC = () => {
  const { orgId } = useParams();

  return <div>{orgId}</div>;
};

export default Landing;
