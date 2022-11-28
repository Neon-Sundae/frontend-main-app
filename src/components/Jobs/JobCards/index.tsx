/* eslint-disable camelcase */
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import { FC } from 'react';
import styles from './index.module.scss';

interface IJobCards {
  orgName: string;
  jobId_uuid: string;
  handleJobCardSelect: (jobId_uuid: string) => void;
}

const JobCards: FC<IJobCards> = ({
  orgName,
  jobId_uuid,
  handleJobCardSelect,
}) => {
  const handleClick = () => {
    handleJobCardSelect(jobId_uuid);
  };

  return (
    <div className={styles['job-card-wrap']} onClick={handleClick}>
      <BrandImage
        width="72px"
        height="72px"
        style={{
          borderRadius: '50%',
        }}
      />
      <div className={styles['job-card-left']}>
        <p>Job Title</p>
        <p>{orgName}</p>
        <p>💰 Salary Range</p>
      </div>
      <div className={styles['job-card-right']}>
        <i className={clsx('material-icons', styles['arrow-right'])}>
          arrow_right_alt
        </i>
      </div>
    </div>
  );
};
export default JobCards;
