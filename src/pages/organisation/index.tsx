import { Landing } from 'components/Organisation';
import { ArcanaAuthLayout } from 'containers/ArcanaAuthLayout';
import { FC } from 'react';

const Organisation: FC = () => {
  return (
    <ArcanaAuthLayout>
      <Landing />
    </ArcanaAuthLayout>
  );
};

export default Organisation;
