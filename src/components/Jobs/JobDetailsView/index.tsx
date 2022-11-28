/* eslint-disable camelcase */
import { FC } from 'react';
import { useFetchJobDetail } from '../AllJobs/hook';

interface IJobDetailsView {
  jobId_uuid: string | null;
}

const JobDetailsView: FC<IJobDetailsView> = ({ jobId_uuid }) => {
  const { data, isLoading } = useFetchJobDetail(jobId_uuid);

  if (jobId_uuid === null) {
    return (
      <div>
        <h1 style={{ color: 'white' }}>Nothing selected</h1>
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <h1 style={{ color: 'white' }}>{data.title}</h1>
    </div>
  );
};

export default JobDetailsView;
