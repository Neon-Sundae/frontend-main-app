/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable camelcase */
import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import convertHtmlToReact from '@hedgedoc/html-to-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useFetchJobDetail } from '../AllJobs/hooks';
import useApplyToJob from './hooks';
import styles from './index.module.scss';

interface IJobDetailsView {
  jobId_uuid: string | null;
}

const JobDetailsView: FC<IJobDetailsView> = ({ jobId_uuid }) => {
  const { data, isLoading } = useFetchJobDetail(jobId_uuid);
  const applyToJob = useApplyToJob();
  const navigate = useNavigate();

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
    navigator.clipboard.writeText(window.location.href);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className={styles['job-detail-view']}>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{data.title ?? 'Neon Sundae - Job'}</title>
        <meta name="title" content={data.title ?? 'Neon Sundae - Job'} />
        <meta
          name="description"
          content="Making Building in Web3 as Smooth as Sundae🍦"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={data.title ?? 'Neon Sundae - Job'} />
        <meta
          property="og:description"
          content="Making Building in Web3 as Smooth as Sundae🍦"
        />
        <meta
          property="og:image"
          content="https://nsassets.s3.ap-southeast-1.amazonaws.com/NeonSundae.png"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta
          property="twitter:title"
          content={data.title ?? 'Neon Sundae - Job'}
        />
        <meta
          property="twitter:description"
          content="Making Building in Web3 as Smooth as Sundae🍦"
        />
        <meta
          property="twitter:image"
          content="https://nsassets.s3.ap-southeast-1.amazonaws.com/NeonSundae.png"
        />
      </Helmet>
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
      <a onClick={() => navigate(`/organisation/${data.organisationId}`)}>
        {data.organisation.name}
      </a>
      <span className={styles['inline-job-details']}>
        <p>💻 {data.role}</p>
        <p>📍 {data.location ?? 'Remote'}</p>
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
          * You&rsquo;ll need to mint your profile & agree to use your email for
          interview purposes
        </p>
      </div>
    </div>
  );
};

export default JobDetailsView;
