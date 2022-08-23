import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import ProfileCardContainer from 'components/ProfileCardContainer';
import BasicDetails from './BasicDetails';
import ProfileSkills from './ProfileSkills';
import ProfileSocials from './ProfileSocials';
import Timezone from './Timezone';
import BasicDetailsEdit from './BasicDetailsEdit';
import ProfileSkillsEdit from './ProfileSkillsEdit';
import ProfileSocialsEdit from './ProfileSocialsEdit';
import TimezoneEdit from './TimezoneEdit';

const ProfileCard = () => {
  const isEditable = useSelector(
    (state: RootState) => state.profile.isEditable
  );

  return (
    <>
      <ProfileCardContainer>
        {isEditable ? <BasicDetailsEdit /> : <BasicDetails />}
        {isEditable ? <ProfileSkillsEdit /> : <ProfileSkills />}
        {isEditable ? <ProfileSocialsEdit /> : <ProfileSocials />}
        {isEditable ? <TimezoneEdit /> : <Timezone />}
      </ProfileCardContainer>
      <Toaster />
    </>
  );
};

export default ProfileCard;
