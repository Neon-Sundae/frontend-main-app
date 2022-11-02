import { FC, Dispatch, SetStateAction, useState, useEffect } from 'react';
import clsx from 'clsx';
import EditTask from 'components/EditTask';
import { useDispatch, useSelector } from 'react-redux';
import { GET_SELECTED_TASK } from 'actions/flProject/types';
import { RootState } from 'reducers';
import { ReactComponent as VerifiedIcon } from 'assets/illustrations/icons/verified.svg';
import Modal from 'components/Modal';
import { useFetchTaskData } from './hooks';
import TaskDetail from './TaskDetail';
import TalentList from './TalentList';
import styles from './index.module.scss';

interface IAcceptTask {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setViewComplete: Dispatch<SetStateAction<boolean>>;
  taskId: number;
  handleApprove: any;
  selected: boolean;
  selectedBuilder: any;
  project_founder: string;
  project_name: string;
  handleCommit: any;
  flProjectCategory: any;
}

const AcceptTask: FC<IAcceptTask> = ({
  setOpen,
  setViewComplete,
  taskId,
  handleApprove,
  project_name,
  project_founder,
  handleCommit,
  flProjectCategory,
}) => {
  const [taskEdit, setTaskEdit] = useState(false);
  const dispatch = useDispatch();

  const { taskData } = useFetchTaskData(taskId);
  const [viewTalentList, setViewTalentList] = useState(false);

  const { selectedTask } = useSelector((state: RootState) => state.flProject);

  useEffect(() => {
    if (taskData) {
      console.log('>>>>>>>>>>>', taskData);
      dispatch({
        type: GET_SELECTED_TASK,
        payload: taskData,
      });
    }
  }, [taskData]);
  const showEditTaskModal = () => setTaskEdit(true);
  const handleClose = () => setOpen(false);
  return (
    <Modal
      onClose={handleClose}
      width="clamp(20rem, 45vw, 45rem)"
      maxHeight="min(90%, 45rem)"
      overflowY="auto"
      padding="42px"
    >
      {taskEdit && (
        <EditTask
          setTaskEdit={setTaskEdit}
          selectedTask={selectedTask}
          flProjectCategory={flProjectCategory}
          setOpen={setOpen}
        />
      )}
      {!taskEdit && (
        <div className={styles['assign-task-container']}>
          <h2 className={styles['project-name']}>
            {selectedTask?.name}&emsp;
            {selectedTask?.taskSmartContractId && (
              <VerifiedIcon
                className={styles['project-verified']}
                width={20}
                height={20}
              />
            )}
          </h2>
          <h5 className={styles['founder-name']}>
            {selectedTask?.organisation?.name}
          </h5>
          <button className={styles['edit-btn']} onClick={showEditTaskModal}>
            edit task
            <i className={clsx('material-icons', styles['pencil-icon'])}>
              edit
            </i>
          </button>
          {selectedTask?.taskSmartContractId && (
            <h5 className={styles['token-id']}>
              SmartContractId: #{selectedTask?.taskSmartContractId}
            </h5>
          )}
          {viewTalentList ? (
            <TalentList
              setViewTalentList={setViewTalentList}
              handleApprove={handleApprove}
            />
          ) : (
            <TaskDetail
              setViewTalentList={setViewTalentList}
              project_name={project_name}
              handleCommit={handleCommit}
              project_founder={project_founder}
              setOpen={setOpen}
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default AcceptTask;
