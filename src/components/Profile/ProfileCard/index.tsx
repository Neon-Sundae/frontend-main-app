import { FC } from 'react';
import BasicDetails from './BasicDetails';
import ProfileCardContainer from './ProfileCardContainer';
import ProfileSkills from './ProfileSkills';
import ProfileSocials from './ProfileSocials';
import Timezone from './Timezone';

const ProfileCard: FC = () => {
  return (
    <ProfileCardContainer>
      <BasicDetails />
      <ProfileSkills />
      <ProfileSocials />
      <Timezone />
    </ProfileCardContainer>
  );
};

export default ProfileCard;