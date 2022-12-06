import { FC } from 'react';
import JobDetails from '../JobDetails';

interface IEditJobEntry {
  orgName: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  jobUuid: string;
  location: string;
  role: string;
  isRemote: boolean;
  description: string;
  refetch: any;
  setShowCreate: any;
  setShowView: any;
  selectedJobUuid: any;
  jobStatus: string;
  setSelectedJobUuid: any;
}

const EditJobEntry: FC<IEditJobEntry> = ({
  orgName,
  title,
  salaryMin,
  salaryMax,
  currency,
  jobUuid,
  location,
  role,
  isRemote,
  description,
  refetch,
  setShowCreate,
  setShowView,
  selectedJobUuid,
  jobStatus,
  setSelectedJobUuid,
}) => {
  const jobEntryData = {
    orgName,
    title,
    salaryMin,
    salaryMax,
    currency,
    jobUuid,
    location,
    role,
    isRemote,
    description,
    refetch,
    setShowCreate,
    setShowView,
    selectedJobUuid,
    jobStatus,
    setSelectedJobUuid,
  };

  return (
    <div>
      <JobDetails
        orgName={orgName}
        setShowCreate={setShowCreate}
        jobEntryData={jobEntryData}
        setShowView={setShowView}
        selectedJobUuid={selectedJobUuid}
        setSelectedJobUuid={setSelectedJobUuid}
      />
    </div>
  );
};

export default EditJobEntry;
