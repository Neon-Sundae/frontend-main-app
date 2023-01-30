/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import JobCards from 'components/Jobs/JobCards';
import useFetchJobsByLimit from 'hooks/useFetchJobsByLimit';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

const NewJobs = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useFetchJobsByLimit(3);

  const handleViewAll = () => {
    navigate('/jobs/all');
  };

  const handleCardClick = (jobId_uuid: string) => {
    navigate(`/jobs/all?job=${jobId_uuid}`);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles['new-jobs-wrap']}>
      <span className={styles['new-jobs-head']}>
        <h2>New Jobs</h2>
        {/* TODO - h3 should not have onClick */}
        <h3 onClick={handleViewAll}>View All</h3>
      </span>

      <div className={styles['job-card-wrap']}>
        {data?.map((job: any) => (
          <JobCards
            isOnDashboard
            key={job.jobId_uuid}
            orgName={job.organisation.name}
            orgImage={job.organisation.profileImage}
            title={job.title}
            salaryMin={job.salaryMin}
            salaryMax={job.salaryMax}
            currency={job.currency}
            jobUuid={job.jobId_uuid}
            selectedJobUuid={undefined}
            handleCardClick={() => handleCardClick(job.jobId_uuid)}
          />
        ))}
      </div>
    </div>
  );
};

export default NewJobs;
