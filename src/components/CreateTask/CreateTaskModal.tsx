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
      width="clamp(20rem, 50vw, 50rem)"
      height="min(80%, 50rem)"
      overflowY="auto"
    >
      <h1 className={styles['create-task-title']}>Create a Task</h1>
      <div className={styles['create-task-content']}>
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
            backgroundColor="transparent"
          />
        </div>
        <textarea
          placeholder="Task Description"
          className={styles['task-description-field']}
        />
        <div className={styles['select-difficulty-field']}>
          <label className={styles['task-difficulty-label']}>Difficulty</label>
          <Select
            options={categories}
            placeholder="Select Difficulty"
            value={selectedSkill}
            name="TaskDifficulty"
            onSelectChange={handleSelectChange}
            borderColor="white"
            borderRadius={10}
            backgroundColor="transparent"
          />
        </div>
        <div className={styles['price-field-container']}>
          <label htmlFor="task-price" className={styles['task-price-label']}>
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
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
        <h1 style={{ color: 'white' }}>Test overflow</h1>
      </div>
      <GradientBtn label="Save" onClick={handleClose} />
    </Modal>
  );
};

export default CreateTaskModal;
