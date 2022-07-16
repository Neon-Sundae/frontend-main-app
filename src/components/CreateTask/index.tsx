import TaskManagement from 'components/TaskManagement';
import { FC, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import CreateTaskModal from './CreateTaskModal';
import styles from './index.module.scss';

const CreateTask: FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);

  return (
    <div className={styles['page-container']}>
      <button onClick={handleOpenModal}>Create Task</button>
      <h1 style={{ margin: '80px 0' }}>Project content</h1>
      <h1 style={{ margin: '80px 0' }}>Project content</h1>
      <h1 style={{ margin: '80px 0' }}>Project content</h1>
      {open && <CreateTaskModal setOpen={setOpen} />}
      <Toaster />
      <TaskManagement project_budget={0} project_name="" />
    </div>
  );
};

export default CreateTask;
