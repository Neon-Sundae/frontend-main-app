/* eslint-disable camelcase */
import { FC } from 'react';
import JobCards from 'components/Jobs/JobCards';
import { useNavigate } from 'react-router-dom';
import useFetchOrgJobsByLimit from 'hooks/useFetchOrgJobsByLimit';
import styles from './index.module.scss';

interface IOrganisationJobs {
  organisationId: number;
}

const OrganisationJobs: FC<IOrganisationJobs> = ({ organisationId }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useFetchOrgJobsByLimit(organisationId, 2);

  const handleCardClick = (jobId_uuid: string) => {
    navigate(`/jobs/all?organisation=${organisationId}&job=${jobId_uuid}`);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles['organisation-jobs-wrap']}>
      <h3>Jobs Listed</h3>
      {data?.map((job: any) => (
        <JobCards
          key={job.jobId_uuid}
          orgName={job.organisation.name}
          orgImage={job.organisation.profileImage}
          title={job.title}
          salaryMin={job.salaryMin}
          salaryMax={job.salaryMax}
          currency={job.currency}
          jobUuid={job.jobId_uuid}
          selectedJobUuid={job.jobId_uuid}
          handleCardClick={() => handleCardClick(job.jobId_uuid)}
        />
      ))}
    </div>
  );
};

export default OrganisationJobs;
