/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import { ActionMeta, SingleValue } from 'react-select';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import Select, { Option } from 'components/Select';
import clsx from 'clsx';
import GradientBtn from 'components/GradientBtn';
import getRandomString from 'utils/getRandomString';
import { validateCreateTask } from 'validations/task';
import styles from './index.module.scss';
import TaskSkills from './TaskSkills';
import TaskChecklist, { IChecklistItem } from './TaskChecklist';
import TaskFileUpload, { IFile } from './TaskFileUpload';
import { useCreateTask, useFetchProjectCategories } from './hooks';

interface IDifficultyRating {
  title: string;
  level: number;
}

const DifficultyRating: FC<IDifficultyRating> = ({ level, title }) => {
  return (
    <div className={styles['difficulty-rating-container']}>
      <span>{title}</span>
      {[...Array(level).keys()].map(i => (
        <i key={i} className={clsx('material-icons', styles['rating-star'])}>
          star
        </i>
      ))}
    </div>
  );
};

const initialData = [
  { id: getRandomString(5), value: 'Information Architecture' },
  { id: getRandomString(5), value: 'Wireframes' },
];

const difficultyData = [
  { label: <DifficultyRating level={1} title="Beginner" />, value: 1 },
  { label: <DifficultyRating level={2} title="Moderate" />, value: 2 },
  { label: <DifficultyRating level={3} title="Significant" />, value: 3 },
  { label: <DifficultyRating level={4} title="Advanced" />, value: 4 },
  { label: <DifficultyRating level={5} title="Moderate" />, value: 5 },
];

interface IProfileSkills {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateTaskModal: FC<IProfileSkills> = ({ setOpen }) => {
  const createTask = useCreateTask(setOpen);
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
  const [taskStartDate, setTaskStartDate] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [error, setError] = useState({
    nameError: false,
    categoryError: false,
    difficultyError: false,
    priceError: false,
    dueDateError: false,
  });

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (
      validateCreateTask(
        taskName,
        selectedCategory,
        selectedDifficulty,
        taskPrice,
        taskDueDate,
        setError
      )
    ) {
      const formData = new FormData();
      formData.append('name', taskName);
      formData.set('description', taskDescription);
      formData.append('price', taskPrice);
      formData.append('startDate', taskStartDate);
      formData.append('dueDate', taskDueDate);
      formData.append('categoryId', selectedCategory?.value.toString() ?? '');
      formData.append(
        'estimatedDifficulty',
        selectedDifficulty?.value.toString() ?? ''
      );
      checklistItems.forEach(item =>
        formData.append('checklist[]', JSON.stringify(item))
      );
      filesArray?.forEach(fileItem =>
        formData.append('files[]', fileItem.file)
      );
      taskSkills.forEach(skill =>
        formData.append(
          'skills[]',
          JSON.stringify({ skillsId: skill.value, name: skill.label })
        )
      );
      createTask.mutate(formData);
    } else {
      toast.error('Please fill the required fields');
    }
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
      width="700px"
      height="800px"
      overflowY="auto"
      padding="33px 50px"
    >
      <h1 className={styles['create-task-title']}>Create a Task</h1>
      <div className={styles['create-task-content']}>
        <div className={styles['create-task-form-row']}>
          <div className={styles['difficulty-price-container']}>
            <label className={styles['difficulty-price-label']}>Name</label>
            <input
              type="text"
              placeholder="Task Name"
              className={clsx(
                styles['task-name-field'],
                error.nameError && styles['task-name-field--error']
              )}
              value={taskName}
              onChange={handleInputChange(setTaskName)}
            />
          </div>
          <div className={styles['difficulty-price-container']}>
            <label className={styles['difficulty-price-label']}>Category</label>
            <Select
              options={categories ?? []}
              placeholder="Select Category"
              value={selectedCategory}
              name="TaskCategory"
              onSelectChange={handleCategoryChange}
              borderColor={error.categoryError ? '#c0392b' : 'white'}
              borderRadius={10}
              height={50}
            />
          </div>
        </div>
        <label className={styles['difficulty-price-label']}>Description</label>
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
              borderColor={error.difficultyError ? '#c0392b' : 'white'}
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
              type="number"
              placeholder="Price in USDC"
              className={clsx(
                styles['task-name-field'],
                styles['task-price-field'],
                error.priceError && styles['task-name-field--error']
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
          <div
            className={styles['difficulty-price-container']}
            style={{ zIndex: 'unset' }}
          >
            <label className={styles['difficulty-price-label']}>
              Start Date
            </label>
            <input
              type="date"
              placeholder="Task Start Date"
              className={styles['task-name-field']}
              value={taskStartDate}
              onChange={handleInputChange(setTaskStartDate)}
            />
          </div>
          <div
            className={styles['difficulty-price-container']}
            style={{ zIndex: 'unset' }}
          >
            <label className={styles['difficulty-price-label']}>End Date</label>
            <input
              type="date"
              placeholder="Task Due Date"
              className={clsx(
                styles['task-name-field'],
                error.dueDateError && styles['task-name-field--error']
              )}
              value={taskDueDate}
              onChange={handleInputChange(setTaskDueDate)}
            />
          </div>
        </div>
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
