/* eslint-disable camelcase */
import { Toaster } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from 'components/NavBar';
import bg from 'assets/illustrations/gradients/bg.png';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import JobCards from '../JobCards';
import JobDetailsView from '../JobDetailsView';
import { useFetchJobs } from './hooks';

const AllJobsLanding = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [showCard, setShowCard] = useState(false);
  const data = useFetchJobs(searchParams.get('organisation'));

  useEffect(() => {
    if (!searchParams.get('job')) setShowCard(true);
    if (window.innerWidth > 600) setShowCard(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJobCardSelect = (jobId_uuid: string) => {
    if (window.innerWidth <= 600) {
      setShowCard(false);
      navigate(`/jobs/all?job=${jobId_uuid}`);
    }
    searchParams.set('job', jobId_uuid);
    setSearchParams(searchParams);
  };

  if (searchParams.get('job')) {
    window.onpopstate = function () {
      navigate('/jobs/all');
      setShowCard(true);
    };
  }

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: '#242529',
      }}
    >
      <NavBar />
      <Toaster />
      <div className={styles['job-cards-all-wrap']}>
        {showCard && (
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
        )}

        <div className={styles['jobs-card-details-wrap']}>
          <JobDetailsView jobId_uuid={searchParams.get('job')} />
        </div>
      </div>
    </div>
  );
};

export default AllJobsLanding;
