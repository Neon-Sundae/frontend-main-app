import { FC } from 'react';
import ProfileCardContainer from 'components/ProfileCardContainer';
import BasicDetails from './BasicDetails';
import ProfileSkills from './ProfileSkills';
import ProfileSocials from './ProfileSocials';
import Timezone from './Timezone';

const ProfileCardEdit: FC = () => {
  return (
    <ProfileCardContainer>
      <BasicDetails />
      <ProfileSkills />
      <ProfileSocials />
      <Timezone />
    </ProfileCardContainer>
  );
};

export default ProfileCardEdit;
