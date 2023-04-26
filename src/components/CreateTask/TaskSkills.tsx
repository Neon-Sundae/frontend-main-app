import clsx from 'clsx';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { ActionMeta, SingleValue } from 'react-select';
import Select, { Option } from 'components/Select';
import { useFetchAppSkills } from 'components/ProfileCard/ProfileSkillsEdit/hooks';
import styles from './index.module.scss';

interface ITaskSkills {
  selectedSkill: Option | null;
  setSelectedSkill: Dispatch<SetStateAction<Option | null>>;
  taskSkills: Option[];
  setTaskSkills: Dispatch<SetStateAction<Option[]>>;
  previouslySelectedSkills?: any;
  setPreviouslySelectedSkills?: any;
  showModal: boolean;
  isMulti: boolean;
}

const TaskSkills: FC<ITaskSkills> = ({
  selectedSkill,
  setSelectedSkill,
  taskSkills,
  setTaskSkills,
  previouslySelectedSkills,
  setPreviouslySelectedSkills,
  showModal,
  isMulti,
}) => {
  const { appSkills } = useFetchAppSkills();
  const handleSelectChange = (
    newValue: SingleValue<Option>,
    action: ActionMeta<Option>
  ) => {
    if (previouslySelectedSkills?.length !== 0)
      setPreviouslySelectedSkills(null);
    if (newValue) {
      setSelectedSkill(newValue);
      setTaskSkills([...taskSkills, newValue]);
    }
  };

  const handleSkillRemove = (skillsId: string | number) => {
    const newSkills = taskSkills.filter(x => x.value !== skillsId);
    setTaskSkills(newSkills);
  };

  return (
    <div className={styles['task-skills-container']}>
      <h4 className={styles['difficulty-price-label']}>Skills Needed</h4>
      <Select
        options={appSkills ?? []}
        placeholder="Select Skills"
        value={selectedSkill}
        name="ProfileSkills"
        onSelectChange={handleSelectChange}
        borderColor="white"
        borderRadius={10}
        height={50}
        isMulti={isMulti}
      />

      {showModal && (
        <div className={styles['profile-skill-modal-tag-container']}>
          {taskSkills.map(taskSkill => (
            <SkillTag
              key={taskSkill.value}
              name={taskSkill.label}
              skillsId={taskSkill.value}
              handleRemove={handleSkillRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ISkillTag {
  skillsId: string | number;
  name: string | JSX.Element;
  handleRemove: (skillsId: string | number) => void;
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
TaskSkills.defaultProps = {
  previouslySelectedSkills: '',
  setPreviouslySelectedSkills: '',
};

export default TaskSkills;
