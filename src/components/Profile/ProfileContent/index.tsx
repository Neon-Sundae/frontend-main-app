import { FC } from 'react';
import ProfileContentContainer from '../ProfileContentContainer';
import ProfileTabs from '../ProfileTabs';

const ProfileContent: FC = () => {
  return (
    <ProfileContentContainer>
      <ProfileTabs />
    </ProfileContentContainer>
  );
};

export default ProfileContent;
