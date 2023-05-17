import { Dispatch, FC, SetStateAction, useState } from 'react';
import { ActionMeta, SingleValue } from 'react-select';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import Select, { Option } from 'components/Select';
import clsx from 'clsx';
import GradientBtn from 'components/GradientBtn';
import { useFetchAppSkills } from 'queries/skills';
import { useParams } from 'react-router-dom';
import {
  useAddProfileSkill,
  useFetchProfileSkills,
  useRemoveProfileSkill,
} from 'queries/profile';

import styles from './index.module.scss';

interface IProfileSkills {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileSkillsModal: FC<IProfileSkills> = ({ setOpen }) => {
  const params = useParams();
  const { data: profileSkills } = useFetchProfileSkills({
    profileId: params.profileId,
  });
  const { data: appSkills } = useFetchAppSkills();
  const addProfileSkill = useAddProfileSkill({ profileId: params.profileId });
  const removeProfileSkill = useRemoveProfileSkill({
    profileId: params.profileId,
  });

  const [selectedSkill, setSelectedSkill] = useState<Option | null>(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectChange = (
    newValue: SingleValue<Option>,
    action: ActionMeta<Option>
  ) => {
    if (newValue) {
      const found = profileSkills?.some(el => el.label === newValue.label);
      if (!found && profileSkills && profileSkills?.length < 5) {
        setSelectedSkill(newValue);
        addProfileSkill.mutate({ selectedValue: newValue });
      }
      if (profileSkills?.length === 5) {
        toast.error('Cannot add more skills');
      }
    }
  };

  const handleSkillRemove = (skillsId: number) => {
    removeProfileSkill.mutate({ skillsId });
  };

  return (
    <Modal onClose={handleClose} height="min(75%, 45rem)" overflowY="auto">
      <h1 className={styles['skill-title']}>Skills</h1>
      <p className={styles['skill-description']}>
        To add more skills, write it in field below and click ENTER to add a
        skill. You can add maximum 5 skills.
      </p>
      <div className={styles['skills-select-container']}>
        <Select
          options={appSkills || []}
          placeholder="Select Skills"
          value={selectedSkill}
          name="ProfileSkills"
          onSelectChange={handleSelectChange}
          isMulti={false}
        />
      </div>
      <div className={styles['profile-skill-modal-tag-container']}>
        {profileSkills?.map(profileSkill => (
          <SkillTag
            key={profileSkill.value}
            name={profileSkill.label}
            skillsId={profileSkill.value}
            handleRemove={handleSkillRemove}
          />
        ))}
      </div>
      <GradientBtn
        label="Save"
        onClick={handleClose}
        style={{ zIndex: 'unset' }}
      />
    </Modal>
  );
};

interface ISkillTag {
  skillsId: number;
  name: string;
  handleRemove: (skillsId: number) => void;
}

const SkillTag: FC<ISkillTag> = ({ skillsId, name, handleRemove }) => {
  const handleSkillRemove = () => {
    handleRemove(skillsId);
  };

  return (
    <div className={styles['profile-skill-modal-tag']}>
      <span>{name}</span>
      <i className={clsx('material-icons-200')} onClick={handleSkillRemove}>
        close
      </i>
    </div>
  );
};

export default ProfileSkillsModal;
