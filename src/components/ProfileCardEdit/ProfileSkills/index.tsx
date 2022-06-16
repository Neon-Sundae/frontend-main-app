import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';

const ProfileSkills: FC = () => {
  const profileSkills = useSelector(
    (state: RootState) => state.profile.profileSkills
  );

  return (
    <div className={styles['profile-skills-container']}>
      {profileSkills.map(skill => (
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
