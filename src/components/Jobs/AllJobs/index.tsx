/* eslint-disable camelcase */
import { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import NavBar from 'components/NavBar';
import bg from 'assets/illustrations/gradients/bg.png';
import { FC } from 'react';
import styles from './index.module.scss';
import JobCards from '../JobCards';
import JobDetailsView from '../JobDetailsView';
import { useFetchJobs } from './hooks';

interface AllJobsLandingProps {
  hideNavbar?: boolean;
}

const AllJobsLanding: FC<AllJobsLandingProps> = ({ hideNavbar }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useFetchJobs(searchParams.get('organisation'));

  const handleJobCardSelect = (jobId_uuid: string) => {
    searchParams.set('job', jobId_uuid);
    setSearchParams(searchParams);
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'space',
        backgroundAttachment: 'fixed',
      }}
    >
      {!hideNavbar && <NavBar />}

      <Toaster />
      <div className={styles['job-cards-all-wrap']}>
        <div className={styles['jobs-cards-wrap']}>
          {data?.map((job: any) => (
            <JobCards
              key={job.jobId_uuid}
              jobUuid={job.jobId_uuid}
              currency={job.currency}
              orgName={job.organisation.name}
              orgImage={job.organisation.profileImage}
              salaryMin={job.salaryMin}
              salaryMax={job.salaryMax}
              title={job.title}
              handleCardClick={handleJobCardSelect}
              selectedJobUuid={searchParams.get('job')}
            />
          ))}
        </div>
        <div className={styles['jobs-card-details-wrap']}>
          <JobDetailsView jobId_uuid={searchParams.get('job')} />
        </div>
      </div>
    </div>
  );
};

AllJobsLanding.defaultProps = {
  hideNavbar: false,
};

export default AllJobsLanding;
