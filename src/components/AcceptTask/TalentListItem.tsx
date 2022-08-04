import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { useSelectBuilder } from './hooks';
import styles from './index.module.scss';

interface ITalentListItem {
  handleApprove: any;
  task_status: string;
  taskId: number;
  data: any;
}

const TalentListItem: FC<ITalentListItem> = ({
  handleApprove,
  task_status,
  taskId,
  data,
}) => {
  const { saveRejectedBuilder } = useSelectBuilder();
  const { founder } = useSelector((state: RootState) => state.flProject);
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  return (
    <div className={styles['talent-list-item-container']}>
      <div className={styles['builder']}>
        <div className={styles['builder-avatar']}></div>
        <div className={styles['builder-name']}>{data?.Profile.user.name}</div>
      </div>
      <div className={styles['builder-position']}>{data?.Profile.title}</div>
      <div className={styles['action']}>
        {task_status === 'open' &&
          data?.applicationStatus === 'applied' &&
          walletId?.toLowerCase() === founder.toLowerCase() && (
            <>
              <span
                className={styles['btn-approve']}
                onClick={() => handleApprove(data)}
              >
                Approve
              </span>
              <span
                className={styles['btn-reject']}
                onClick={() => saveRejectedBuilder(data, taskId)}
              >
                Reject
              </span>
            </>
          )}
        {data?.applicationStatus === 'accepted' && (
            <span className={styles['selected-builder']}>selected</span>
          )}
      </div>
    </div>
  );
};

export default TalentListItem;
