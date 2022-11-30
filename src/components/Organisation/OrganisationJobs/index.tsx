import { FC } from 'react';
import JobCards from 'components/Jobs/JobCards';
import styles from './index.module.scss';

const OrganisationJobs: FC = () => {
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
        selectedJobUuid={undefined}
        handleCardClick={() => {}}
      />
      <JobCards
        orgName="org name"
        title="full stack"
        salaryMin={10000}
        salaryMax={100000}
        currency="USD"
        jobUuid=""
        selectedJobUuid={undefined}
        handleCardClick={() => {}}
      />
    </div>
  );
};

export default OrganisationJobs;
