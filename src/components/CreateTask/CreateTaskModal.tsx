/* eslint-disable jsx-a11y/label-has-associated-control */
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { ActionMeta, SingleValue } from 'react-select';
import Modal from 'components/Modal';
import Select, { Option } from 'components/Select';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import clsx from 'clsx';
import GradientBtn from 'components/GradientBtn';
import styles from './index.module.scss';
import TaskSkills from './TaskSkills';
import TaskChecklist from './TaskChecklist';
import TaskFileUpload from './TaskFileUpload';

interface IProfileSkills {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const categories = [
  { label: 'Designer', value: 'Designer' },
  { label: 'Developer', value: 'Developer' },
];

const CreateTaskModal: FC<IProfileSkills> = ({ setOpen }) => {
  const [selectedSkill, setSelectedSkill] = useState<Option | null>(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectChange = (
    newValue: SingleValue<Option>,
    action: ActionMeta<Option>
  ) => {
    if (newValue) {
      setSelectedSkill(newValue);
    }
  };

  return (
    <Modal
      onClose={handleClose}
      width="clamp(20rem, 55vw, 55rem)"
      height="min(90%, 50rem)"
      overflowY="auto"
    >
      <h1 className={styles['create-task-title']}>Create a Task</h1>
      <div className={styles['create-task-content']}>
        <div className={styles['create-task-form-row']}>
          <input
            type="text"
            placeholder="Task Name"
            className={styles['task-name-field']}
          />
          <div className={styles['select-category-field']}>
            <Select
              options={categories}
              placeholder="Select Category"
              value={selectedSkill}
              name="TaskCategory"
              onSelectChange={handleSelectChange}
              borderColor="white"
              borderRadius={10}
            />
          </div>
        </div>
        <textarea
          placeholder="Task Description"
          className={styles['task-description-field']}
        />
        <div className={styles['create-task-form-row']}>
          <div className={styles['difficulty-price-container']}>
            <label className={styles['difficulty-price-label']}>
              Difficulty
            </label>
            <Select
              options={categories}
              placeholder="Select Difficulty"
              value={selectedSkill}
              name="TaskDifficulty"
              onSelectChange={handleSelectChange}
              borderColor="white"
              borderRadius={10}
            />
          </div>
          <div className={styles['difficulty-price-container']}>
            <label
              htmlFor="task-price"
              className={styles['difficulty-price-label']}
            >
              Price
            </label>
            <input
              id="task-price"
              type="text"
              placeholder="Price in USDC"
              className={clsx(
                styles['task-name-field'],
                styles['task-price-field']
              )}
            />
          </div>
        </div>
        <TaskSkills />
        <div className={styles['create-task-form-row']}>
          <TaskChecklist />
          <TaskFileUpload />
        </div>
      </div>
      <GradientBtn label="Save" onClick={handleClose} />
    </Modal>
  );
};

export default CreateTaskModal;
