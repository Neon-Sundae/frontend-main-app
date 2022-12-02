/* eslint-disable camelcase */
import { FC } from 'react';
import convertHtmlToReact from '@hedgedoc/html-to-react';
import config from 'config';
import toast from 'react-hot-toast';
import clsx from 'clsx';
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
        <h2 className={styles['job-detail-view--no-selection']}>
          Nothing selected
        </h2>
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  const handleApply = () => {
    applyToJob.mutate({ jobId_uuid: data.jobId_uuid });
  };

  const generateShareLink = () => {
    navigator.clipboard.writeText(
      `${config.AppDomain}/jobs/all?job=${jobId_uuid}`
    );
    toast.success('Copied to clipboard!');
  };

  return (
    <div className={styles['job-detail-view']}>
      <span>
        <h1>{data.title}</h1>
        <button
          className={styles['share-job-btn']}
          onClick={() => generateShareLink()}
        >
          {' '}
          Share
          <i className={clsx('material-icons', styles['share-icon'])}>share</i>
        </button>
      </span>
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
        {data.description ? convertHtmlToReact(data.description) : 'N/A'}
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
