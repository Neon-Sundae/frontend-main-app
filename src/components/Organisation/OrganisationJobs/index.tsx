import JobCards from 'components/Jobs/JobCards';
import styles from './index.module.scss';

const OrganisationJobs = () => {
  return (
    <div className={styles['organisation-jobs-wrap']}>
      <h3>Jobs Listed</h3>
      {/* TODO: map through lists */}
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
  );
};

export default OrganisationJobs;
