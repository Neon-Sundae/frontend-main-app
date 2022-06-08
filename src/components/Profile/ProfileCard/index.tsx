import { FC } from 'react';
import BasicDetails from './BasicDetails';
import ProfileCardContainer from './ProfileCardContainer';

const ProfileCard: FC = () => {
  return (
    <ProfileCardContainer>
      <BasicDetails />
    </ProfileCardContainer>
  );
};

export default ProfileCard;
