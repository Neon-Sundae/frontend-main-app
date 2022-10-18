/* eslint-disable camelcase */
import { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { RootState } from 'reducers';
import { ReactComponent as ProjectIcon } from 'assets/illustrations/icons/project.svg';
import { ReactComponent as CategoryIcon } from 'assets/illustrations/icons/category.svg';
import { ReactComponent as CoinIcon } from 'assets/illustrations/icons/coin.svg';
import { ReactComponent as CheckmarkIcon } from 'assets/illustrations/icons/carbon_checkmark-filled-warning.svg';
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { ReactComponent as StartDate } from 'assets/illustrations/icons/start-date.svg';
import { ReactComponent as EndDate } from 'assets/illustrations/icons/end-date.svg';
import calculateTaskXP from 'utils/calculateTaskXp';
import { SET_TASK_XP } from 'actions/flProject/types';
import useBuilderTaskApply from 'hooks/useBuilderTaskApply';
import { ReactComponent as XPIcon } from 'assets/illustrations/icons/xp.svg';
import userImage from 'assets/images/profile/user-image.png';
import TaskChecklistEdit from './TaskChecklistEdit';
import FileSkillsCard from './FileSkillsCard';
import styles from './index.module.scss';
import { useCancelTask, useDeleteTask } from './hooks';

interface ITaskDetail {
  setViewTalentList: Dispatch<SetStateAction<boolean>>;
  project_name: string;
  handleCommit: any;
  project_founder: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const TaskDetail: FC<ITaskDetail> = ({
  setViewTalentList,
  project_name,
  project_founder,
  handleCommit,
  setOpen,
}) => {
  const dispatch = useDispatch();
  const builderTaskApply = useBuilderTaskApply();
  const { deleteTask } = useDeleteTask(setOpen);
  const [isCancel, setIsCancel] = useState(false);
  const [taskEdit, setTaskEdit] = useState(false);
  const { selectedTask, taskXP } = useSelector(
    (state: RootState) => state.flProject
  );
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  useEffect(() => {
    const getXP = async () => {
      const xp = await calculateTaskXP(
        walletId,
        selectedTask?.estimatedDifficulty
      );
      dispatch({
        type: SET_TASK_XP,
        payload: Number(xp),
      });
    };
    if (selectedTask !== null) {
      getXP();
    }
  }, [selectedTask]);

  const applyToTask = () => {
    builderTaskApply.mutate({
      taskId: selectedTask.taskId,
    });

    setOpen(false);
  };

  const founderTaskAction = () => {
    if (
      selectedTask?.status === 'in progress' ||
      selectedTask?.status === 'in review'
    ) {
      return (
        <span onClick={() => setIsCancel(true)}>
          <i className="material-icons">delete</i>
          <span>Cancel Task</span>
        </span>
      );
    }
    if (selectedTask?.status === 'open') {
      return (
        <span onClick={() => deleteTask.mutate(selectedTask?.taskId)}>
          <i className="material-icons">delete</i>
          <span>Delete Task</span>
        </span>
      );
    }

    return null;
  };

  const reformatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  return (
    <div>
      <div className={styles['avatar-container']}>
        <span className={styles['task-status-btn']}>
          {selectedTask?.status}
        </span>

        {selectedTask?.profileTask?.length > 0 && (
          <div
            className={styles.expanded}
            onClick={() => setViewTalentList(true)}
          >
            {selectedTask?.status !== 'open' &&
            selectedTask?.profileTask.filter(
              (profile: any) => profile.applicationStatus === 'accepted'
            ).length > 0 ? (
              selectedTask?.profileTask
                .filter(
                  (profile: any) => profile.applicationStatus === 'accepted'
                )
                .map((item: any, index: number) =>
                  item.Profile.picture !== null ? (
                    <img
                      src={item.Profile.picture || userImage}
                      className={styles['builder-avatar']}
                      alt=""
                      key={index}
                    />
                  ) : (
                    <div className={styles['builder-avatar']} key={index} />
                  )
                )
            ) : (
              <>
                {selectedTask?.profileTask
                  .slice(0, 5)
                  .map((item: any, index: number) =>
                    item.Profile.picture !== null ? (
                      <img
                        src={item.Profile.picture}
                        className={styles['builder-avatar']}
                        alt=""
                        key={index}
                      />
                    ) : (
                      <img
                        src={userImage}
                        className={styles['builder-avatar']}
                        alt=""
                        key={index}
                      />
                    )
                  )}
              </>
            )}
          </div>
        )}
      </div>
      <div className={styles['project-description']}>
        <p> Skills:</p>
        {selectedTask?.taskSkills?.length > 0 && (
          <div className={styles['project-attachments']}>
            {selectedTask?.taskSkills?.map((taskSkills: any, index: number) => (

              <FileSkillsCard
                key={index}
                label="Wireframes v1.0"
                skills={taskSkills.name}
              />

            ))}
          </div>
        )}
      </div>
      <div className={styles['project-details']}>
        <div>
          <div className={styles['project-detail-item']}>
            <ProjectIcon width={24} height={24} />
            <div>Project: {project_name}</div>
          </div>
          <div className={styles['project-detail-item']}>
            <i className="material-icons">star</i>
            <div>
              <span>Difficulty:</span>&nbsp;
              {[0, 1, 2, 3, 4]
                .slice(0, selectedTask?.estimatedDifficulty)
                .map((item: number, index: number) => (
                  <i
                    className={clsx('material-icons', styles['rating-star'])}
                    key={index}
                  >
                    star
                  </i>
                ))}
              {[0, 1, 2, 3, 4]
                .slice(0, 5 - selectedTask?.estimatedDifficulty)
                .map((item: number, index: number) => (
                  <i className="material-icons" key={index}>
                    star
                  </i>
                ))}
            </div>
          </div>
        </div>
        <div>
          <div className={styles['project-detail-item']}>
            <CategoryIcon width={24} height={24} />
            <div>Category: {selectedTask?.flProjectCategory?.categoryName}</div>
          </div>
          <div className={styles['project-detail-item']}>
            <i className="material-icons">attach_money</i>
            <div>Value: {selectedTask?.price} USDC</div>
          </div>
        </div>
        <div>
          <div className={styles['project-detail-item']}>
            <span>&nbsp;XP</span>
            <div>
              Point: {taskXP}&nbsp;
              <XPIcon width="20.64px" height="19px" />
            </div>
          </div>
          <div className={styles['project-detail-item']}>
            <i className="material-icons">local_fire_department</i>
            <div>
              Burned: {selectedTask?.fndrToken} &emsp;
              <CoinIcon width={20} height={20} />
            </div>
          </div>
        </div>
        <div>
          <div className={styles['project-detail-item']}>
            <StartDate width={24} height={24} />
            <div>Start Date:&nbsp; {reformatDate(selectedTask?.startDate)}</div>
          </div>
          <div className={styles['project-detail-item']}>
            <EndDate width={24} height={24} />

            <div>End Date:&nbsp; {reformatDate(selectedTask?.dueDate)}</div>
          </div>
        </div>
      </div>

      {isCancel ? (
        <FounderCancelTaskContainer handleGoBack={() => setIsCancel(false)} />
      ) : (
        <>
          <div className={styles['project-description']}>
            <p>{selectedTask?.description}</p>
            {selectedTask?.taskAttachment?.length > 0 && (
              <div className={styles['project-attachments']}>
                {selectedTask?.taskAttachment.map(
                  (file: any, index: number) => (
                    <FileSkillsCard key={index} label="Wireframes v1.0" />
                  )
                )}
              </div>
            )}
          </div>
          <TaskChecklistEdit selectedTask={selectedTask} />
          <div className={styles['project-action-delete']}>
            {project_founder.toLowerCase() === walletId?.toLowerCase() ? (
              founderTaskAction()
            ) : (
              <>
                {selectedTask?.status === 'open' &&
                selectedTask?.profileTask.filter(
                  (item: any) => item?.Profile?.user?.walletId === walletId
                ).length === 0 ? (
                  <button onClick={applyToTask}>Apply for task</button>
                ) : selectedTask?.status === 'open' &&
                  selectedTask?.profileTask.filter(
                    (item: any) =>
                      item?.Profile?.user?.walletId.toLowerCase() ===
                        walletId?.toLowerCase() &&
                      item?.applicationStatus === 'accepted'
                  ).length > 0 ? (
                  <button onClick={handleCommit}>Commit to task</button>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

interface IFounderCancelTaskContainer {
  handleGoBack: Dispatch<SetStateAction<boolean>>;
}
const FounderCancelTaskContainer: FC<IFounderCancelTaskContainer> = ({
  handleGoBack,
}) => {
  const { cancelTask, success, setSuccess } = useCancelTask();

  return (
    <div className={styles['cancel-task-container']}>
      {success ? (
        <>
          <CheckIcon width={100} height={100} />
          <p>Email sent to builder</p>
          <div>
            <p>
              Once Builder Accepts task cancellation you can proceed to delete
              it.
            </p>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.proceed}
              onClick={() => setSuccess(false)}
            >
              Okay, Go Back
            </button>
          </div>
        </>
      ) : (
        <>
          <CheckmarkIcon width={100} height={100} />
          <p>Looks like you want to cancel the task? </p>
          <div>
            <p>
              We will need Builder to accept cancellation of this task before
              you proceed to cancel it. When you will cancel we will send an
              email to Builder.
            </p>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.go_back}
              onClick={() => handleGoBack(true)}
            >
              Go Back
            </button>
            <button className={styles.proceed} onClick={cancelTask}>
              Yes, Proceed
            </button>
          </div>
        </>
      )}
    </div>
  );
};

interface IBuilderCancelTaskContainer {
  handleGoBack: Dispatch<SetStateAction<boolean>>;
}
const BuilderCancelTaskContainer: FC<IBuilderCancelTaskContainer> = ({
  handleGoBack,
}) => {
  const [success, setSuccess] = useState(false);

  return (
    <div className={styles['cancel-task-container']}>
      {success ? (
        <>
          <CheckIcon width={100} height={100} />
          <p>Email sent to Founder</p>
          <div>
            <p>This task has been succesfully cancelled.</p>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.proceed}
              onClick={() => setSuccess(false)}
            >
              Okay, Go Back
            </button>
          </div>
        </>
      ) : (
        <>
          <CheckmarkIcon width={100} height={100} />
          <p>Do you accept the cancellation of task? </p>
          <div>
            <p>
              Founder has requested to cancel this task, You can Accept to canel
              it immediately or Reject to start a DAO disscussion{' '}
            </p>
          </div>
          <div className={styles.actions}>
            <button className={styles.proceed} onClick={() => setSuccess(true)}>
              Accept
            </button>
            <button className={styles.go_back}>Reject</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskDetail;
