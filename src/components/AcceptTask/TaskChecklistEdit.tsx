/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/extensions */
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import _debounce from 'lodash/debounce';
import { ReactComponent as LinkIcon } from 'assets/illustrations/icons/link.svg';
import styles from './index.module.scss';
import { useUpdateTaskChecklist } from './hooks';

interface ITaskChecklistEdit {
  selectedTask: any;
}

const TaskChecklistEdit: FC<ITaskChecklistEdit> = ({ selectedTask }) => {
  const queryClient = useQueryClient();
  const [openInput, setOpenInput] = useState(false);

  const handleInputOpen = () => {
    if (openInput) {
      setOpenInput(false);
      queryClient.invalidateQueries(['task_detail']);
    } else {
      setOpenInput(true);
    }
  };

  const openItemUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className={styles['project-check-list']}>
      <p>Checklist: </p>
      {selectedTask?.taskChecklist.map((item: any, index: number) => (
        <div
          key={item.taskChecklistId}
          className={styles['task-check-list-container']}
        >
          <div className={styles['task-check-list-content']}>
            <span
              className={clsx(
                styles['task-checklist-box'],
                item.isCompleted && styles['task-checklist-box--completed']
              )}
            >
              {item.isCompleted ? (
                <i
                  className={clsx('material-icons', styles['task-check-icon'])}
                >
                  check
                </i>
              ) : null}
            </span>
            <span
              onClick={() => openItemUrl(item.url)}
              className={styles['task-checklist-title']}
            >
              {item.title}
            </span>
            <LinkIcon width={18} height={18} onClick={handleInputOpen} />
          </div>
          {openInput && (
            <ChecklistUrl
              taskChecklistId={item.taskChecklistId}
              url={item.url}
            />
          )}
        </div>
      ))}
    </div>
  );
};

interface IChecklistUrl {
  taskChecklistId: number;
  url: string;
}

const ChecklistUrl: FC<IChecklistUrl> = ({ taskChecklistId, url }) => {
  const [inputValue, setInputValue] = useState(url);

  const updateTaskChecklist = useUpdateTaskChecklist(taskChecklistId);

  const handleDebounceFn = (value: string) => {
    console.log(value);
    let isCompleted = true;

    if (value === '') isCompleted = false;

    updateTaskChecklist.mutate({
      url: value,
      isCompleted,
    });
  };

  const debounceFn: any = useCallback(_debounce(handleDebounceFn, 1000), []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    debounceFn(value);
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      className={styles['checklist-url']}
    />
  );
};

export default TaskChecklistEdit;
