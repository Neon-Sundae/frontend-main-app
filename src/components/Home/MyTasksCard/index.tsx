/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx';
import { FC, useMemo } from 'react';
import userImage from 'assets/images/profile/user-image.png';
import { ReactComponent as USDCIcon } from 'assets/illustrations/icons/usdc.svg';
import Card from 'components/Card';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import styles from './index.module.scss';

interface ICard {
  data: any;
  setOpenTaskDetail: any;
  setSelectedTaskId: any;
}

const MyTasksCard: FC<ICard> = ({
  data,
  setOpenTaskDetail,
  setSelectedTaskId,
}) => {
  const title = useMemo(() => `${data.name}`, []);

  const difficultyArray = useMemo(
    () => [...Array(data.estimatedDifficulty).keys()],
    []
  );

  const getTextOrAvatar = () => {
    return (
      <div className={styles['avatar-image-wrapper']}>
        <Avatars appliedBuilders={data.profileTask} />
      </div>
    );
  };

  const handleClick = () => {
    setSelectedTaskId(data.taskId);
    setOpenTaskDetail(true);
  };
  return (
    <Card
      showTransparentBg
      height="145px"
      borderType="0.7px solid #e0b9ff"
      marginRight="39px"
      onClick={handleClick}
    >
      <div className={styles['category-action-container']}>
        <span className={styles['task-category']}>
          {data.flProjectCategory.categoryName}
        </span>
        {getTextOrAvatar()}
      </div>
      <h4 className={styles['task-name']}>{title}</h4>
      <p className={styles['task-organisation-name']}>
        {data.flProjectCategory.flProject.organisation.name}
      </p>
      <div className={styles['rating-price-container']}>
        <span className={styles['rating-container']}>
          {difficultyArray.map(n => (
            <i
              key={n}
              className={clsx('material-icons', styles['rating-star'])}
            >
              star
            </i>
          ))}
        </span>
        <div className={styles['price-container']}>
          <USDCIcon />
          <span>{data.price} USDC</span>
        </div>
      </div>
    </Card>
  );
};

interface IAvatars {
  appliedBuilders: any;
}

const Avatars: FC<IAvatars> = ({ appliedBuilders }) => (
  <div className={styles['avatar-container']}>
    {appliedBuilders.map((elem: any) => (
      <img
        src={
          elem.Profile.picture ||
          getDefaultAvatarSrc(
            elem?.Profile?.user?.name?.charAt(0).toUpperCase()
          )
        }
        alt="User Avatar"
        className={styles['builder-avatar']}
      />
    ))}
  </div>
);
export default MyTasksCard;
