import { FC, useState } from 'react';
import CreateTaskModal from './CreateTaskModal';

const CreateTask: FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => setOpen(true);

  return (
    <div>
      <button onClick={handleOpenModal}>Create Task</button>
      {open && <CreateTaskModal setOpen={setOpen} />}
    </div>
  );
};

export default CreateTask;
