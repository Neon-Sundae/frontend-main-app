/* eslint-disable camelcase */
import { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { RootState } from 'reducers';
import { ReactComponent as ProjectIcon } from 'assets/illustrations/icons/project.svg';
import { ReactComponent as CategoryIcon } from 'assets/illustrations/icons/category.svg';
import { ReactComponent as CoinIcon } from 'assets/illustrations/icons/coin.svg';
import calculateTaskXP from 'utils/calculateTaskXp';
import { SET_TASK_XP } from 'actions/flProject/types';
import useBuilderTaskApply from 'hooks/useBuilderTaskApply';
import TaskChecklistEdit from './TaskChecklistEdit';
import FileAttachmentCard from './FileAttachmetCard';
import styles from './index.module.scss';

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

  const [expanded, setExpanded] = useState(false);

  const { selectedTask, taskXP } = useSelector(
    (state: RootState) => state.flProject
  );
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  useEffect(() => {
    const getXP = async () => {
      const _xp = await calculateTaskXP(
        walletId,
        selectedTask?.estimatedDifficulty
      );
      dispatch({
        type: SET_TASK_XP,
        payload: Number(_xp),
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

  return (
    <div>
      <div className={styles['avatar-container']}>
        {expanded ? (
          <button
            className={styles['task-status']}
            onClick={() => setExpanded(!expanded)}
          >
            <div>
              <span>{selectedTask?.status}</span>
              <i className="material-icons">expand_less</i>
            </div>
            <div>
              <p>Open</p>
              <p>Interviewing</p>
              <p>In-Progress</p>
              <p>In-Review</p>
              <p>Completed</p>
            </div>
          </button>
        ) : (
          <button
            className={styles['task-status--expanded']}
            onClick={() => setExpanded(!expanded)}
          >
            <span>{selectedTask?.status}</span>
            <i className="material-icons">expand_more</i>
          </button>
        )}

        {selectedTask?.profileTask.length > 0 && (
          <div
            className={expanded ? styles['expanded'] : ''}
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
                      src={item.Profile.picture}
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
                      <div className={styles['builder-avatar']} key={index} />
                    )
                  )}
              </>
            )}
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
            <div>Point: {taskXP}XP</div>
          </div>
          <div className={styles['project-detail-item']}>
            <i className="material-icons">local_fire_department</i>
            <div>
              Burned: {selectedTask?.fndrToken} &emsp;
              <CoinIcon width={20} height={20} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles['project-description']}>
        <p>{selectedTask?.description}</p>
        {selectedTask?.taskAttachment.length > 0 && (
          <div className={styles['project-attachments']}>
            {selectedTask?.taskAttachment.map((file: any, index: number) => (
              <FileAttachmentCard key={index} label="Wireframes v1.0" />
            ))}
          </div>
        )}
      </div>
      <TaskChecklistEdit selectedTask={selectedTask} />
      <div className={styles['project-action-delete']}>
        {project_founder.toLowerCase() === walletId?.toLowerCase() ? (
          <>
            {selectedTask?.status !== 'completed' && (
              <span>
                <i className="material-icons">delete</i>
                <span>Delete Task</span>
              </span>
            )}
          </>
        ) : (
          <>
            {selectedTask?.status === 'open' ? (
              <button onClick={applyToTask}>Apply for task</button>
            ) : selectedTask?.status === 'interviewing' &&
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
    </div>
  );
};

export default TaskDetail;
