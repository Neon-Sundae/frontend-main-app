import TaskCancelContainer from 'components/TaskCancelContainer';
import { ArcanaAuthLayout } from 'containers/ArcanaAuthLayout';
import { FC } from 'react';

const TaskCancel: FC = () => {
  return (
    <ArcanaAuthLayout>
      <TaskCancelContainer />
    </ArcanaAuthLayout>
  );
};

export default TaskCancel;
