import { FC } from 'react';
import { Landing } from 'components/Home';
import { ArcanaAuthLayout } from 'containers/ArcanaAuthLayout';

const Dashboard: FC = () => {
  return (
    <ArcanaAuthLayout>
      <Landing />
    </ArcanaAuthLayout>
  );
};

export default Dashboard;
