import { FC, useState } from 'react';
import { useFetchProfileDetailsWrapper } from 'queries/profile';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import ProfileSkillsModal from './ProfileSkillsModal';

const ProfileSkillsEdit: FC = () => {
  const params = useParams();
  const profileData = useFetchProfileDetailsWrapper(params.profileId);
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);

  return (
    <>
      <div
        className={styles['profile-skills-container']}
        onClick={handleOpenModal}
      >
        {profileData?.profileSkills ? (
          profileData?.profileSkills.map(skill => (
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
