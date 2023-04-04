import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchProfileDetailsWrapper } from 'queries/profile';
import styles from './index.module.scss';

const ProfileSkills: FC = () => {
  const params = useParams();
  const profileData = useFetchProfileDetailsWrapper(params.profileId);

  return (
    <div className={styles['profile-skills-container']}>
      {profileData?.profileSkills?.map(skill => (
        <ProfileSkillTag key={skill.skillsId} name={skill.name} />
      ))}
    </div>
  );
};

interface IProfileSkillTag {
  name: string;
}

const ProfileSkillTag: FC<IProfileSkillTag> = ({ name }) => {
  return <span className={styles['profile-skill-tag']}>{name}</span>;
};

export default ProfileSkills;
