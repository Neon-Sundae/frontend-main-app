/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import { ActionMeta, SingleValue } from 'react-select';
import Modal from 'components/Modal';
import Select, { Option } from 'components/Select';
import clsx from 'clsx';
import GradientBtn from 'components/GradientBtn';
import getRandomString from 'utils/getRandomString';
import styles from './index.module.scss';
import TaskSkills from './TaskSkills';
import TaskChecklist, { IChecklistItem } from './TaskChecklist';
import TaskFileUpload, { IFile } from './TaskFileUpload';
import { useCreateTask, useFetchProjectCategories } from './hooks';

interface IProfileSkills {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const initialData = [
  { id: getRandomString(5), value: 'Information Architecture' },
  { id: getRandomString(5), value: 'Wireframes' },
];

const difficultyData = [
  { label: 'Difficulty 1', value: 1 },
  { label: 'Difficulty 2', value: 2 },
  { label: 'Difficulty 3', value: 3 },
  { label: 'Difficulty 4', value: 4 },
  { label: 'Difficulty 5', value: 5 },
];

const CreateTaskModal: FC<IProfileSkills> = ({ setOpen }) => {
  const createTask = useCreateTask();
  const { categories } = useFetchProjectCategories();

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPrice, setTaskPrice] = useState('');
  const [checklistItems, setChecklistItems] =
    useState<IChecklistItem[]>(initialData);
  const [filesArray, setFilesArray] = useState<IFile[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Option | null>(
    null
  );
  const [selectedSkill, setSelectedSkill] = useState<Option | null>(null);
  const [taskSkills, setTaskSkills] = useState<Option[]>([]);

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    const formData = new FormData();

    formData.append('name', taskName);
    formData.set('description', taskDescription);
    formData.append('price', taskPrice);
    formData.append('categoryId', selectedCategory?.value.toString() ?? '');
    formData.append(
      'estimatedDifficulty',
      selectedDifficulty?.value.toString() ?? ''
    );

    checklistItems.forEach(item =>
      formData.append('checklist[]', JSON.stringify(item))
    );
    filesArray?.forEach(fileItem => formData.append('files[]', fileItem.file));
    taskSkills.forEach(skill =>
      formData.append(
        'skills[]',
        JSON.stringify({ skillsId: skill.value, name: skill.label })
      )
    );

    console.log(formData.getAll('files[]'));
    createTask.mutate(formData);
  };

  const handleCategoryChange = (
    newValue: SingleValue<Option>,
    action: ActionMeta<Option>
  ) => {
    if (newValue) {
      setSelectedCategory(newValue);
    }
  };

  const handleDifficultyChange = (
    newValue: SingleValue<Option>,
    action: ActionMeta<Option>
  ) => {
    if (newValue) {
      setSelectedDifficulty(newValue);
    }
  };

  const handleInputChange =
    (setState: Dispatch<SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setState(value);
    };

  return (
    <Modal
      onClose={handleClose}
      width="clamp(20rem, 45vw, 45rem)"
      height="min(90%, 45rem)"
      overflowY="auto"
    >
      <h1 className={styles['create-task-title']}>Create a Task</h1>
      <div className={styles['create-task-content']}>
        <div className={styles['create-task-form-row']}>
          <input
            type="text"
            placeholder="Task Name"
            className={styles['task-name-field']}
            value={taskName}
            onChange={handleInputChange(setTaskName)}
          />
          <div className={styles['select-category-field']}>
            <Select
              options={categories ?? []}
              placeholder="Select Category"
              value={selectedCategory}
              name="TaskCategory"
              onSelectChange={handleCategoryChange}
              borderColor="white"
              borderRadius={10}
              height={50}
            />
          </div>
        </div>
        <textarea
          placeholder="Task Description"
          className={styles['task-description-field']}
          value={taskDescription}
          onChange={handleInputChange(setTaskDescription)}
        />
        <div className={styles['create-task-form-row']}>
          <div className={styles['difficulty-price-container']}>
            <label className={styles['difficulty-price-label']}>
              Difficulty
            </label>
            <Select
              options={difficultyData}
              placeholder="Select Difficulty"
              value={selectedDifficulty}
              name="TaskDifficulty"
              onSelectChange={handleDifficultyChange}
              borderColor="white"
              borderRadius={10}
              height={50}
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
              value={taskPrice}
              onChange={handleInputChange(setTaskPrice)}
            />
          </div>
        </div>
        <TaskSkills
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          taskSkills={taskSkills}
          setTaskSkills={setTaskSkills}
        />
        <div className={styles['create-task-form-row']}>
          <TaskChecklist
            checklistItems={checklistItems}
            setChecklistItems={setChecklistItems}
          />
          <TaskFileUpload
            filesArray={filesArray}
            setFilesArray={setFilesArray}
          />
        </div>
      </div>
      <GradientBtn label="Save" onClick={handleSave} />
    </Modal>
  );
};

export default CreateTaskModal;
