/* eslint-disable camelcase */
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import convertHtmlToReact from '@hedgedoc/html-to-react';
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

  return (
    <div className={styles['job-detail-view']}>
      <Helmet>
        <title>{data.title ?? 'Neon Sundae - Job'}</title>
        <link rel="canonical" href={window.location.href} />

        <meta name="twitter:creator" content="@neonsundae" />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={data.title ?? 'Neon Sundae - Job'}
        />
        <meta
          name="twitter:description"
          content="Making Building in Web3 as Smooth as Sundae🍦"
        />
        <meta name="twitter:site" content="@neonsundae" />
        <meta
          name="twitter:image"
          content="https://nsassets.s3.ap-southeast-1.amazonaws.com/NeonSundae.png"
        />

        <meta
          name="description"
          content="Making Building in Web3 as Smooth as Sundae🍦"
        />
        <meta property="og:type" content={window.location.href} />
        <meta
          name="title"
          property="og:title"
          content={data.title ?? 'Neon Sundae - Job'}
        />
        <meta
          name="description"
          property="og:description"
          content="Making Building in Web3 as Smooth as Sundae🍦"
        />
        <meta
          name="image"
          property="og:image"
          content="https://nsassets.s3.ap-southeast-1.amazonaws.com/NeonSundae.png"
        />
        <meta property="og:url" content={window.location.href} />
      </Helmet>
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
