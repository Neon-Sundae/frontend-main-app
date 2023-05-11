import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchProfileSkills } from 'queries/profile';
import styles from './index.module.scss';

const ProfileSkills: FC = () => {
  const params = useParams();
  const { data: profileSkills } = useFetchProfileSkills({
    profileId: params.profileId,
  });

  return (
    <div className={styles['profile-skills-container']}>
      {profileSkills?.map(skill => (
        <ProfileSkillTag key={skill.value} name={skill.label} />
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
