/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@tanstack/react-query';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import config from 'config';
import { FC, useEffect, useRef, useState } from 'react';
import { getAccessToken } from 'utils/authFn';

import styles from './index.module.scss';

interface IJobCards {
  orgName: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  jobUuid: string;
  setJobData: any;
  setShowView: any;
  setShowCreate: any;
  setSelectedJobUuid: any;
}

const JobCards: FC<IJobCards> = ({
  orgName,
  title,
  salaryMin,
  salaryMax,
  currency,
  jobUuid,
  setJobData,
  setShowView,
  setShowCreate,
  setSelectedJobUuid,
}) => {
  const { data: individualJobData, refetch } = useQuery(
    ['individualJob'],
    () =>
      fetch(`${config.ApiBaseUrl}/job/${jobUuid}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }).then(response => response.json()),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  useEffect(() => {
    setJobData(individualJobData);
  }, [individualJobData]);
  const cardRef = useRef(null);
  const handleCardClick = () => {
    if (cardRef && cardRef.current) {
      // refetch();
      setShowCreate(false);
      setShowView(true);
      setSelectedJobUuid(jobUuid);
    }
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

{
  /* jobId_uuid,
  handleJobCardSelect,
}) => {
  const handleClick = () => {
    handleJobCardSelect(jobId_uuid);
  };

  return (
    <div className={styles['job-card-wrap']} onClick={handleClick}> */
}
