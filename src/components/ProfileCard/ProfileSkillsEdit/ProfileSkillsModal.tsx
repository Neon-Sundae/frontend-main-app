import { Dispatch, FC, SetStateAction, useState } from 'react';
import { ActionMeta, SingleValue } from 'react-select';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import Select, { Option } from 'components/Select';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import clsx from 'clsx';
import GradientBtn from 'components/GradientBtn';
import {
  useAddProfileSkill,
  useFetchAppSkills,
  useRemoveProfileSkill,
} from './hooks';
import styles from './index.module.scss';

interface IProfileSkills {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileSkillsModal: FC<IProfileSkills> = ({ setOpen }) => {
  const { appSkills } = useFetchAppSkills();
  const addProfileSkill = useAddProfileSkill();
  const removeProfileSkill = useRemoveProfileSkill();

  const [selectedSkill, setSelectedSkill] = useState<Option | null>(null);

  // const appSkills = useSelector((state: RootState) => state.skills.appSkills);
  const profileSkills = useSelector(
    (state: RootState) => state.skills.profileSkills
  );

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectChange = (
    newValue: SingleValue<Option>,
    action: ActionMeta<Option>
  ) => {
    if (newValue) {
      const found = profileSkills?.some(el => el.label === newValue.label);
      console.log(profileSkills);
      if (!found && profileSkills.length < 5) {
        setSelectedSkill(newValue);
        addProfileSkill(newValue);
      }
      if (profileSkills.length === 5) {
        const a = toast.error('Cannot add more skills');
        console.log(a);
      }
    }
  };

  const handleSkillRemove = (skillsId: number) => {
    removeProfileSkill(skillsId, profileSkills);
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
          options={appSkills ?? []}
          placeholder="Select Skills"
          value={selectedSkill}
          name="ProfileSkills"
          onSelectChange={handleSelectChange}
          isMulti
        />
      </div>
      <div className={styles['profile-skill-modal-tag-container']}>
        {profileSkills.map(profileSkill => (
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
