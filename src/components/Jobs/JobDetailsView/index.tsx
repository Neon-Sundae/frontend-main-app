/* eslint-disable camelcase */
import { FC } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { useFetchJobDetail } from '../AllJobs/hooks';
import useApplyToJob from './hooks';
import styles from './index.module.scss';

interface IJobDetailsView {
  jobId_uuid: string | null;
}

const JobDetailsView: FC<IJobDetailsView> = ({ jobId_uuid }) => {
  const { data, isLoading } = useFetchJobDetail(jobId_uuid);
  const applyToJob = useApplyToJob();

  if (jobId_uuid === null) {
    return (
      <div className={styles['job-detail-view']}>
        <h1 className={styles['job-detail-view--no-selection']}>
          Nothing selected
        </h1>
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  const handleApply = () => {
    applyToJob.mutate({ jobId_uuid: data.jobId_uuid });
  };
  console.log(data.description);
  return (
    <div className={styles['job-detail-view']}>
      <h1>{data.title}</h1>
      <h2>{data.organisation.name}</h2>
      <span className={styles['inline-job-details']}>
        <p>💻 {data.role}</p>
        <p>📍 {data.location}</p>
        <p>
          💰 {data.salaryMin}-{data.salaryMax} {data.currency}
        </p>
        <p>🌏 {data.isRemote ? 'Remote Allowed' : 'Not Remote'}</p>
      </span>

      <div className={styles['job-view-description']}>
        {data.description ? ReactHtmlParser(data.description) : 'N/A'}
      </div>

      <div className={styles['job-detail-apply-group']}>
        <button
          className={styles['job-detail-apply-button']}
          onClick={handleApply}
        >
          Apply
        </button>
        <p className={styles['job-detail-note']}>
          * When you apply you agree to use your email for interview purposes
        </p>
      </div>
    </div>
  );
};

export default JobDetailsView;
