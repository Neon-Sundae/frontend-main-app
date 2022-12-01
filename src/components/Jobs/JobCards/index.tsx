import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import { FC } from 'react';
import styles from './index.module.scss';

interface IJobCards {
  orgName: string;
  orgImage: string | null | undefined;
  title: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  jobUuid: string;
  selectedJobUuid?: any;
  handleCardClick: any;
}

const JobCards: FC<IJobCards> = ({
  orgName,
  orgImage,
  title,
  salaryMin,
  salaryMax,
  currency,
  jobUuid,
  selectedJobUuid,
  handleCardClick,
}) => {
  const handleClick = () => {
    handleCardClick(jobUuid);
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        styles['job-card-wrap'],
        selectedJobUuid === jobUuid && styles['job-card-left-active']
      )}
      style={{ color: selectedJobUuid === jobUuid ? '#fff' : '#A9A9A9' }}
    >
      {orgImage ? (
        <div className={styles['job-card-org-image-wrapper']}>
          <img src={orgImage} alt="organisation-logo" />
        </div>
      ) : (
        <BrandImage
          width="72px"
          height="72px"
          style={{
            borderRadius: '50%',
          }}
        />
      )}
      <div className={styles['job-card-left']}>
        <h3>{title}</h3>
        <p>{orgName}</p>
        <p>
          💰 {salaryMin} to {salaryMax} {currency}
        </p>
      </div>
      <div className={styles['job-card-right']}>
        <i className={clsx('material-icons', styles['arrow-right'])}>
          arrow_right_alt
        </i>
      </div>
    </div>
  );
};

JobCards.defaultProps = {
  selectedJobUuid: undefined,
};

export default JobCards;
