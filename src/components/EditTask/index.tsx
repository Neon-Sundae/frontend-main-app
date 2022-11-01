/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import clsx from 'clsx';
import { SingleValue } from 'react-select';
import Select, { Option } from 'components/Select';
import normalizeCategories from 'utils/normalizeCategories';
import TaskFileUpload, { IFile } from 'components/CreateTask/TaskFileUpload';
import TaskChecklist, {
  IChecklistItem,
} from 'components/CreateTask/TaskChecklist';
import FileSkillsCard from 'components/AcceptTask/FileSkillsCard';
import TaskSkills from 'components/CreateTask/TaskSkills';
import { normalizeSkills } from 'utils/normalizeSkills';
import useUpdateTask from './hooks';
import styles from './index.module.scss';

interface IEditTask {
  setTaskEdit: (arg0: boolean) => void;
  selectedTask: any;
  flProjectCategory: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectFounder: string;
}

const EditTask: FC<IEditTask> = ({
  setTaskEdit,
  selectedTask,
  flProjectCategory,
  setOpen,
  projectFounder,
}) => {
  const normTaskSkills = normalizeSkills(selectedTask.taskSkills);
  const normCategories = normalizeCategories(flProjectCategory);
  const [taskName, setTaskName] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Option | null>(
    null
  );
  const [taskStartDate, setTaskStartDate] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState<string>('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPrice, setTaskPrice] = useState('');
  const difficultyData = [
    { label: <DifficultyRating level={1} title="Beginner" />, value: 1 },
    { label: <DifficultyRating level={2} title="Moderate" />, value: 2 },
    { label: <DifficultyRating level={3} title="Significant" />, value: 3 },
    { label: <DifficultyRating level={4} title="Advanced" />, value: 4 },
    { label: <DifficultyRating level={5} title="Intermediate" />, value: 5 },
  ];
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [filesArray, setFilesArray] = useState<IFile[] | null>(null);
  const checklistItemArray: any[] = [];
  const [checklistItems, setChecklistItems] =
    useState<IChecklistItem[]>(checklistItemArray);
  const [previouslySelectedSkills, setPreviouslySelectedSkills] =
    useState<any>(normTaskSkills);
  const [selectedSkill, setSelectedSkill] = useState<any>(normTaskSkills);
  const [taskSkills, setTaskSkills] = useState<any[]>(normTaskSkills);

  const findPreSelectedOption: any = difficultyData?.filter(function (el) {
    if (el.value === selectedTask.estimatedDifficulty) return el;
    return null;
  });

  const findCurrentCategory: any = normCategories?.filter(function (el) {
    if (el.value === selectedTask?.flProjectCategory?.flProjectCategoryId)
      return el;
    return null;
  });

  const updateTask = useUpdateTask(selectedTask.taskId, setOpen);

  const handleSave = () => {
    let newSkillsAdded = false;
    const formData = new FormData();
    formData.append('name', taskName || selectedTask.name);
    formData.set('description', taskDescription || selectedTask.description);
    formData.append('price', taskPrice || selectedTask.price);
    formData.append('startDate', taskStartDate || selectedTask.startDate);
    formData.append('dueDate', taskDueDate || selectedTask.dueDate);
    formData.append(
      'estimatedDifficulty',
      selectedDifficulty?.value.toString() || selectedTask.estimatedDifficulty
    );
    checklistItems.forEach(item =>
      formData.append('checklist[]', JSON.stringify(item))
    );
    taskSkills.forEach((el: any) => {
      if (el.length) {
        newSkillsAdded = true;
      }
    });
    if (newSkillsAdded) {
      taskSkills[taskSkills.length - 1]?.forEach((skill: any) =>
        formData.append(
          'skills[]',
          JSON.stringify({ skillsId: skill.value, name: skill.label })
        )
      );
    } else {
      taskSkills?.forEach((skill: any) =>
        formData.append(
          'skills[]',
          JSON.stringify({ skillsId: skill.value, name: skill.label })
        )
      );
    }
    filesArray?.forEach(fileItem => formData.append('files[]', fileItem.file));
    updateTask.mutate(formData, selectedTask.taskId);
    setTaskEdit(false);
  };

  const handleCategoryChange = (newValue: SingleValue<Option>) => {
    if (newValue) {
      setSelectedCategory(newValue);
    }
  };

  const handleDifficultyChange = (newValue: SingleValue<Option>) => {
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

  const checkListData = () => {
    selectedTask.taskChecklist.forEach((element: any) => {
      checklistItemArray.push({
        id: element.taskChecklistId,
        value: element.title,
      });
    });
  };
  checkListData();
  return (
    <div className={styles['edit-modal-wrap']}>
      <h2 className={styles.editModalHead}>Edit Task</h2>
      {/* FIXME: br no good! */}
      <br />
      <br />
      <div className={styles.showInColumn}>
        <span>
          <label htmlFor="taskName" className={styles.label}>
            Name
          </label>
          <input
            id="taskName"
            defaultValue={selectedTask.name}
            className={styles.inputField}
            onChange={handleInputChange(setTaskName)}
          />
        </span>
        <span>
          <label htmlFor="projectCategory" className={styles.label}>
            Category
          </label>
          <Select
            value={selectedCategory || findCurrentCategory}
            options={normCategories}
            placeholder="Select Category"
            name="TaskCategory"
            onSelectChange={handleCategoryChange}
            width="283.16px"
            isMulti={false}
          />
        </span>
      </div>

      <label htmlFor="taskDescription" className={styles.label}>
        Description
      </label>
      <textarea
        id="taskDescription"
        defaultValue={selectedTask.description}
        className={clsx('inputField', styles.taskEditDescription)}
        onChange={handleInputChange(setTaskDescription)}
      />
      <div className={styles.showInColumn}>
        <span>
          <label htmlFor="taskName" className={styles.label}>
            Start Date
          </label>
          <input
            type="date"
            placeholder="Task Start Date"
            className={styles['task-name-field']}
            defaultValue={selectedTask.startDate}
            onChange={handleInputChange(setTaskStartDate)}
          />
        </span>
        <span>
          <label htmlFor="projectBudget" className={styles.label}>
            Due Date
          </label>
          <input
            type="date"
            placeholder="Task Due Date"
            className={styles['task-name-field']}
            defaultValue={selectedTask.dueDate}
            onChange={handleInputChange(setTaskDueDate)}
          />
        </span>
      </div>

      <div className={styles.showInColumn}>
        <span>
          <label htmlFor="estimatedDifficulty" className={styles.label}>
            Difficulty
          </label>
          <Select
            value={selectedDifficulty || findPreSelectedOption[0]}
            placeholder="Select Difficulty"
            options={difficultyData}
            name="TaskDifficulty"
            onSelectChange={handleDifficultyChange}
            width="283.16px"
            isMulti={false}
          />
        </span>
        <span>
          <label htmlFor="taskPrice" className={styles.label}>
            Price
          </label>
          <input
            id="taskPrice"
            defaultValue={`${selectedTask.price} USDC`}
            className={styles.inputField}
            onChange={handleInputChange(setTaskPrice)}
          />
        </span>
      </div>
      <div className={styles['skills-wrapper']}>
        <TaskSkills
          previouslySelectedSkills={previouslySelectedSkills}
          setPreviouslySelectedSkills={setPreviouslySelectedSkills}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          taskSkills={taskSkills}
          setTaskSkills={setTaskSkills}
          isMulti
          showModal={false}
        />
      </div>
      <div className={styles.showInColumn}>
        <span>
          <label htmlFor="taskChecklist" className={styles.label} />
          <TaskChecklist
            checklistItems={checklistItems}
            setChecklistItems={setChecklistItems}
          />
        </span>
        <span>
          <label htmlFor="taskChecklist" className={styles.label} />
          <TaskFileUpload
            filesArray={filesArray}
            setFilesArray={setFilesArray}
          />
          {selectedTask?.taskAttachment?.length === 0 && (
            <div className={styles.attachments} />
          )}
          {selectedTask?.taskAttachment?.map((attachments: any) => {
            return (
              <div className={styles.attachments}>
                <FileSkillsCard
                  label={attachments.url
                    .substr(attachments.url.lastIndexOf('/') + 1)
                    .replace(/%20/g, ' ')}
                />
              </div>
            );
          })}
        </span>
      </div>
      <div className={styles.textEditBtnCenter}>
        <button onClick={handleSave} className={styles.saveBtn}>
          Save
        </button>
      </div>
    </div>
  );
};

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

export default EditTask;
