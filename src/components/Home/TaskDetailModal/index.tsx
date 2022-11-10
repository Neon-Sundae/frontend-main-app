import AcceptTask from 'components/AcceptTask';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import styles from './index.module.scss';

interface IMyTaskDetailModal {
  selectedTaskId: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const MyTaskDetailModal: FC<IMyTaskDetailModal> = ({
  selectedTaskId,
  setOpen,
}) => {
  const [openTask, setOpenTask] = useState(false);
  const handleApprove = (item: any) => {
    setOpenTask(false);
  };

  const handleOpenComplete = (val: any) => {
    setOpenTask(false);
  };
  return (
    <div className={styles['task-detail-modal-container']}>
      <AcceptTask
        setViewComplete={handleOpenComplete}
        taskId={selectedTaskId}
        handleApprove={handleApprove}
        setOpen={setOpen}
        location="my tasks"
      />
    </div>
  );
};

export default MyTaskDetailModal;
