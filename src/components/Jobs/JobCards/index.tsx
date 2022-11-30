/* eslint-disable react-hooks/exhaustive-deps */
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import { FC, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './index.module.scss';

interface IJobCards {
  orgName: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  jobUuid: string;
  setShowView: any;
  setShowCreate: any;
  setSelectedJobUuid: any;
  selectedJobUuid: any;
}

const JobCards: FC<IJobCards> = ({
  orgName,
  title,
  salaryMin,
  salaryMax,
  currency,
  jobUuid,
  setShowView,
  setShowCreate,
  setSelectedJobUuid,
  selectedJobUuid,
}) => {
  const [jobIdParam, setJobIdParam] = useSearchParams();
  const cardRef = useRef(null);

  // TODO: highlight job card on selecting!
  const handleCardClick = () => {
    setJobIdParam(selectedJobUuid);
    if (selectedJobUuid) setShowView(true);
    const jobCard: any = cardRef.current;
    jobCard.style.color = '#fff';
    setShowCreate(false);
    setShowView(true);
    setSelectedJobUuid(jobUuid);
  };

  return (
    <div
      className={styles['job-card-wrap']}
      onClick={() => handleCardClick()}
      ref={cardRef}
    >
      {/* TODO: use org image here! */}
      <BrandImage
        width="72px"
        height="72px"
        style={{
          borderRadius: '50%',
        }}
      />
      <div className={styles['job-card-left']}>
        <p>{title}</p>
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

export default JobCards;
