import { FC, MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'reducers';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
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
  const navigate = useNavigate();
  const { saveRejectedBuilder } = useSelectBuilder();
  const { founder } = useSelector((state: RootState) => state.flProject);
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  const handleApproveFn = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    handleApprove(data);
  };

  const handleRejectFn = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    saveRejectedBuilder(data, taskId);
  };

  const handleNavigation = () => {
    navigate(`/profile/${data.profileId}`);
    // navigate(0);
  };
  return (
    <div
      className={styles['talent-list-item-container']}
      onClick={handleNavigation}
    >
      <div className={styles.builder}>
        <div className={styles['builder-avatar']}>
          <img
            src={
              data.Profile.picture ||
              getDefaultAvatarSrc(
                data?.Profile?.user?.name?.charAt(0).toUpperCase()
              )
            }
            alt=""
          />
        </div>
        <div className={styles['builder-name']}>{data?.Profile.user.name}</div>
      </div>
      <div className={styles['builder-position']}>{data?.Profile.title}</div>
      <div className={styles.action}>
        {task_status === 'open' &&
          data?.applicationStatus === 'applied' &&
          walletId?.toLowerCase() === founder.toLowerCase() && (
            <>
              <span className={styles['btn-approve']} onClick={handleApproveFn}>
                Approve
              </span>
              <span className={styles['btn-reject']} onClick={handleRejectFn}>
                Reject
              </span>
            </>
          )}
        {data?.applicationStatus === 'accepted' && task_status === 'open' && (
          <span className={styles['selected-builder']}>Yet to Commit</span>
        )}
        {data?.applicationStatus === 'accepted' && task_status !== 'open' && (
          <span className={styles['selected-builder']}>Selected</span>
        )}
        {data?.applicationStatus === 'rejected' && (
          <span className={styles['selected-builder']}>Not Selected</span>
        )}
      </div>
    </div>
  );
};

export default TalentListItem;
