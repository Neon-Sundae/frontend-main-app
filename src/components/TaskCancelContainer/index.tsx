import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useCancelTaskByBuilder from './hooks';

const TaskCancelContainer: FC = () => {
  const { identifier } = useParams();
  const [responseState, setResponseState] = useState('');
  const cancelTaskByBuilder = useCancelTaskByBuilder(setResponseState);

  useEffect(() => {
    if (identifier) {
      cancelTaskByBuilder.mutate({
        identifier,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier]);

  const getMessageByResponse = () => {
    switch (responseState) {
      case 'success':
        return <h1>Successfully given permission to cancel the task</h1>;
      case 'failed':
        return (
          <div>
            <h1>Failed to cancel the task</h1>
            <p>Please close this tab and open the link again from your email</p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{getMessageByResponse()}</div>;
};

export default TaskCancelContainer;
