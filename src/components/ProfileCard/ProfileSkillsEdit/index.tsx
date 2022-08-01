import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';
import ProfileSkillsModal from './ProfileSkillsModal';

const ProfileSkillsEdit: FC = () => {
  const [open, setOpen] = useState(false);
  const profileSkills = useSelector(
    (state: RootState) => state.profile.profileSkills
  );

  const handleOpenModal = () => setOpen(true);

  return (
    <>
      <div
        className={styles['profile-skills-container']}
        onClick={handleOpenModal}
      >
        {profileSkills.length > 0 ? (
          profileSkills.map(skill => (
            <ProfileSkillTag key={skill.skillsId} name={skill.name} />
          ))
        ) : (
          <div className={styles.white}>Add Skills</div>
        )}
      </div>
      {open && <ProfileSkillsModal setOpen={setOpen} />}
    </>
  );
};

interface IProfileSkillTag {
  name: string;
}

const ProfileSkillTag: FC<IProfileSkillTag> = ({ name }) => {
  return <span className={styles['profile-skill-tag']}>{name}</span>;
};

export default ProfileSkillsEdit;
