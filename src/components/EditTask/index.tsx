/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState } from 'react';
import Modal from 'components/Modal';
import clsx from 'clsx';
import Select from 'react-select';
import useUpdateTask from './hooks';
import styles from './index.module.scss';
import { customStyles } from './selectStyles';

type Option =
  | {
      value: number;
      label: string;
    }
  | {
      value: string;
      label: string;
    }
  | {
      value: number;
      label: JSX.Element;
    };
interface IEditTask {
  setTaskEdit: (arg0: boolean) => void;
  selectedTask: any;
}
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

const EditTask: FC<IEditTask> = ({ setTaskEdit, selectedTask }) => {
  const [taskEditData, setTaskEditData] = useState(selectedTask);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Option | null>(
    null
  );
  const difficultyData = [
    { label: <DifficultyRating level={1} title="Beginner" />, value: 1 },
    { label: <DifficultyRating level={2} title="Moderate" />, value: 2 },
    { label: <DifficultyRating level={3} title="Significant" />, value: 3 },
    { label: <DifficultyRating level={4} title="Advanced" />, value: 4 },
    { label: <DifficultyRating level={5} title="Moderate" />, value: 5 },
  ];
  const findPreSelectedOption: any = difficultyData.filter(function (el) {
    if (el.value === taskEditData.estimatedDifficulty) return el;
    return null;
  });
  const [error, setError] = useState({
    nameError: false,
    categoryError: false,
    difficultyError: false,
    priceError: false,
    dueDateError: false,
  });
  const updateTask = useUpdateTask(taskEditData.taskId);
  const handleClose = () => {
    setTaskEdit(false);
  };
  const handleSave = () => {
    // updateTask.mutate(temp);
  };
  const handleNameChange = (e: any) => {
    const { value } = e.target;
    setTaskEditData((prevState: any) => ({
      ...prevState,
      name: value,
    }));
  };
  const handleDescriptionChange = (e: any) => {
    const { value } = e.target;
    setTaskEditData((prevState: any) => ({
      ...prevState,
      description: value,
    }));
  };
  const handlePriceChange = (e: any) => {
    const { value } = e.target;
    setTaskEditData((prevState: any) => ({
      ...prevState,
      price: value,
    }));
  };
  const handleChecklistItemChange = (e: any) => {
    setTaskEditData((prevState: any) => ({
      ...prevState,
      taskChecklist: [
        ...prevState.taskChecklist,
        <div className={styles.attachments}>
          <input
            type="text"
            
            defaultValue="edit me!"
            style={{
              width: '200px',
            }}
          />
          <button className={styles.delBtn}>
            <i className={clsx('material-icons', styles['delete-icon'])}>
              delete
            </i>
          </button>
        </div>,
      ],
    }));
  };
  const handleDeleteChecklistItem = (e: any) => {

  };
  const handleStartDateChange = (e: any) => {
    const { value } = e.target;
    setTaskEditData((prevState: any) => ({
      ...prevState,
      startDate: value,
    }));
  };
  const handleEndDateChange = (e: any) => {
    const { value } = e.target;
    setTaskEditData((prevState: any) => ({
      ...prevState,
      dueDate: value,
    }));
  };

  console.log('taskEditData', taskEditData);
  console.log('selectedDifficulty', selectedDifficulty);

  return (
    <>
      <h2 className={styles.editModalHead}>Edit Task</h2>
      <div className={styles.showInColumn}>
        <span>
          <label htmlFor="taskName" className={styles.label}>
            Name
          </label>
          <input
            id="taskName"
            defaultValue={taskEditData.name}
            className={styles.inputField}
            onChange={handleNameChange}
          />
        </span>
        <span>
          {/* <label htmlFor="projectBudget" className={styles.label}>
            Project Budget
          </label>
          <input
            id="projectBudget"
            defaultValue="do NOT have this data!!"
            className={styles.inputField}
          /> */}
        </span>
      </div>

      <label htmlFor="taskDescription" className={styles.label}>
        Description
      </label>
      <textarea
        id="taskDescription"
        defaultValue={taskEditData.description}
        className={clsx('inputField', styles.taskEditDescription)}
        onChange={handleDescriptionChange}
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
            defaultValue={taskEditData.startDate}
            onChange={handleStartDateChange}
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
            defaultValue={taskEditData.dueDate}
            onChange={handleEndDateChange}
          />
        </span>
      </div>

      <div className={styles.showInColumn}>
        <span>
          <label htmlFor="estimatedDifficulty" className={styles.label}>
            Difficulty
          </label>
          <Select
            defaultValue={findPreSelectedOption[0] || selectedDifficulty}
            placeholder="Select Difficulty"
            options={difficultyData}
            styles={customStyles}
            name="TaskDifficulty"
            onChange={options => setSelectedDifficulty(options)}
          />
        </span>
        <span>
          <label htmlFor="taskPrice" className={styles.label}>
            Price
          </label>
          <input
            id="taskPrice"
            defaultValue={`${taskEditData.price} USDC`}
            className={styles.inputField}
            onChange={handlePriceChange}
          />
        </span>
      </div>
      <div className={styles.showInColumn}>
        <span>
          <label htmlFor="taskChecklist" className={styles.label}>
            Checklist
          </label>
          {taskEditData.taskChecklist.map((checklistItem: any) => (
            <div className={styles.attachments}>
              <input
                type="checkbox"
                id="checkListItem"
                name={checklistItem.title}
                value={checklistItem.title}
                checked={checklistItem.isCompleted}
                className={styles.checkbox}
              />
              <label htmlFor="checkListItem">{checklistItem.title}</label>
              &nbsp;
              <button
                className={styles.delBtn}
                onClick={handleDeleteChecklistItem}
              >
                <i className={clsx('material-icons', styles['delete-icon'])}>
                  delete
                </i>
              </button>
            </div>
          ))}
          <button
            className={styles.addMoreBtn}
            onClick={handleChecklistItemChange}
          >
            Add More items +
          </button>
        </span>
        <span>
          <label htmlFor="taskChecklist" className={styles.label}>
            Attachments
          </label>
          {taskEditData?.taskAttachment?.length === 0 && (
            <div className={styles.attachments}>
              <span className={styles.emptySpan} />
            </div>
          )}
          {taskEditData?.taskAttachment?.map((attachments: any) => {
            return (
              <div className={styles.attachments}>
                <label htmlFor="attachments">
                  {`${attachments.url.substring(0, 33)}... `}
                </label>
                <button className={styles.delBtn}>
                  <i className={clsx('material-icons', styles['delete-icon'])}>
                    delete
                  </i>
                </button>
              </div>
            );
          })}
          <button className={styles.addMoreBtn}>Add More items +</button>
        </span>
      </div>
      <div className={styles.textEditBtnCenter}>
        <button onClick={handleSave} className={styles.saveBtn}>
          Save
        </button>
      </div>
    </>
  );
};

export default EditTask;
