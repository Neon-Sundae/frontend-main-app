import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import getRandomString from 'utils/getRandomString';
import styles from './index.module.scss';

export interface IChecklistItem {
  id: string;
  value: string;
}

interface ITaskChecklist {
  checklistItems: IChecklistItem[];
  setChecklistItems: Dispatch<SetStateAction<IChecklistItem[]>>;
}

const TaskChecklist: FC<ITaskChecklist> = ({
  checklistItems,
  setChecklistItems,
}) => {
  const addMore = () => {
    setChecklistItems([
      ...checklistItems,
      { id: getRandomString(5), value: 'Checklist Item' },
    ]);
  };

  const removeItem = (id: string) => {
    const newData = checklistItems.filter(x => x.id !== id);
    setChecklistItems(newData);
  };

  const handleNewChecklist = (id: string, value: string) => {
    const newChecklistData = checklistItems.map(x =>
      x.id === id ? { id: x.id, value } : x
    );
    setChecklistItems(newChecklistData);
  };

  return (
    <div className={styles['task-checklist-container']}>
      <h4 className={styles['difficulty-price-label']}>Checklist</h4>
      {checklistItems.map(item => (
        <ChecklistItemInput
          key={item.id}
          id={item.id}
          value={item.value}
          removeItem={removeItem}
          handleDebounceFn={handleNewChecklist}
        />
      ))}
      <span className={styles['add-more-btn']} onClick={addMore}>
        Add more
        <i className="material-icons">add</i>
      </span>
    </div>
  );
};

interface IChecklistItemInput {
  id: string;
  value: string;
  removeItem: (id: string) => void;
  handleDebounceFn: (id: string, value: string) => void;
}

const ChecklistItemInput: FC<IChecklistItemInput> = ({
  id,
  value,
  removeItem,
  handleDebounceFn,
}) => {
  const [textValue, setTextValue] = useState(value ?? '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
    handleDebounceFn(id, e.target.value);
  };

  return (
    <div className={styles['checklist-item-input-container']}>
      <span />
      <input type="text" value={textValue} onChange={handleChange} />
      <i className="material-icons" onClick={() => removeItem(id)}>
        close
      </i>
    </div>
  );
};

export default TaskChecklist;
