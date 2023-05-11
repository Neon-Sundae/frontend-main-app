import { Landing } from 'components/Profile';
import { ArcanaAuthLayout } from 'containers/ArcanaAuthLayout';
import { FC } from 'react';

const Profile: FC = () => {
  return (
    <ArcanaAuthLayout>
      <Landing />
    </ArcanaAuthLayout>
  );
};

export default Profile;
