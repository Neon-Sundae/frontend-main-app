import { ChangeEvent, FC, useState } from 'react';
import getRandomString from 'utils/getRandomString';
import styles from './index.module.scss';

interface IChecklistItem {
  id: string;
  value: string;
}

const initialData = [
  { id: getRandomString(5), value: 'Information Architecture' },
  { id: getRandomString(5), value: 'Wireframes' },
];

const TaskChecklist: FC = () => {
  const [checklistItems, setChecklistItems] =
    useState<IChecklistItem[]>(initialData);

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

  return (
    <div className={styles['task-checklist-container']}>
      <h4 className={styles['difficulty-price-label']}>Checklist</h4>
      {checklistItems.map(item => (
        <ChecklistItemInput
          key={item.id}
          id={item.id}
          value={item.value}
          removeItem={removeItem}
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
}

const ChecklistItemInput: FC<IChecklistItemInput> = ({
  id,
  value,
  removeItem,
}) => {
  const [textValue, setTextValue] = useState(value ?? '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
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
