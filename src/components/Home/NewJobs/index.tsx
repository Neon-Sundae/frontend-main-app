import JobCards from 'components/Jobs/JobCards';
import styles from './index.module.scss';

const NewJobs = () => {
  return (
    <div className={styles['new-jobs-wrap']}>
      <span className={styles['new-jobs-head']}>
        <h2>New Jobs</h2>
        {/* TODO: add link here */}
        <h3 onClick={() => alert('Show me all jobs')}>View All</h3>
      </span>

      <div className={styles['job-card-wrap']}>
        <JobCards
          orgName="org name"
          title="full stack"
          salaryMin={10000}
          salaryMax={100000}
          currency="USD"
          jobUuid=""
          setShowView={undefined}
          setShowCreate={undefined}
          setSelectedJobUuid={undefined}
          selectedJobUuid={undefined}
        />
        <JobCards
          orgName="org name"
          title="full stack"
          salaryMin={10000}
          salaryMax={100000}
          currency="USD"
          jobUuid=""
          setShowView={undefined}
          setShowCreate={undefined}
          setSelectedJobUuid={undefined}
          selectedJobUuid={undefined}
        />
        <JobCards
          orgName="org name"
          title="full stack"
          salaryMin={10000}
          salaryMax={100000}
          currency="USD"
          jobUuid=""
          setShowView={undefined}
          setShowCreate={undefined}
          setSelectedJobUuid={undefined}
          selectedJobUuid={undefined}
        />
      </div>
    </div>
  );
};

export default NewJobs;
