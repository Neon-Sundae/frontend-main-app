import useFetchAllOrgJobs from 'hooks/useFetchAllOrgJobs';
import { useNavigate, useParams } from 'react-router-dom';
import JobCards from 'components/Jobs/JobCards';
import styles from './index.module.scss';

const JobsTab = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useFetchAllOrgJobs(orgId as unknown as number);

  return (
    <div className={styles['jobs-tab']}>
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
          handleCardClick={() => navigate(`/jobs/all?job=${job.jobId_uuid}`)}
        />
      ))}
    </div>
  );
};

export default JobsTab;
