import NavBar from 'components/NavBar';
import { useParams } from 'react-router-dom';
import config from 'config';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import isOrganisationMember from 'utils/accessFns/isOrganisationMember';
import useFetchOrganisationOwnerManager from 'hooks/useFetchOrganisationOwnerManager';
import styles from './index.module.scss';
import JobCards from '../JobCards';
import JobDetails from '../JobDetails';
import { useFetchOrganisation } from '../../Organisation/Landing/hooks';
import JobView from '../JobView';

interface JobsLandingProps {
  hideNavbar?: boolean;
}

const JobsLanding: FC<JobsLandingProps> = ({ hideNavbar }) => {
  const { orgId } = useParams();

  const [selectedJobUuid, setSelectedJobUuid] = useState('');
  const [JobApplicantsData, setJobApplicantsData] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState(false);

  const user = useSelector((state: RootState) => state.user.user);

  const { organisation, isLoading } = useFetchOrganisation(orgId);
  const { members } = useFetchOrganisationOwnerManager(orgId);

  const {
    data,
    refetch,
    isFetching,
    isLoading: loading,
  } = useQuery(
    ['orgJobs'],
    () =>
      fetch(`${config.ApiBaseUrl}/job/organisation/${orgId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }).then(response => response.json()),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { name: orgName, profileImage, OrganisationUser } = organisation;

  useEffect(() => {
    setShowView(true);
  }, [selectedJobUuid]);

  const handleCreate = () => {
    setShowCreate(true);
    setShowView(false);
  };

  const jobCardClicked = (jobUuid: string) => {
    if (selectedJobUuid) setShowView(true);
    setShowCreate(false);
    setSelectedJobUuid(jobUuid);
  };

  if (isLoading) return null;
  if (isFetching) return null;
  if (loading) return null;

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: `${window.innerWidth <= 600} ? 'none' : '#242529'`,
      }}
    >
      {!hideNavbar && <NavBar />}

      <Toaster />
      <div className={styles['job-cards-all-wrap']}>
        <div className={styles['jobs-cards-wrap']}>
          {isOrganisationMember(user, members) && (
            <div className={styles['job-create-btn-wrap']}>
              <button
                onClick={() => {
                  handleCreate();
                }}
                className={styles['create-job-btn']}
              >
                Add new
                <i className={clsx('material-icons', styles['add-icon'])}>
                  add
                </i>
              </button>
            </div>
          )}

          {data.map((d: any) => {
            return (
              <JobCards
                title={d.title}
                orgName={orgName}
                orgImage={profileImage}
                salaryMin={d.salaryMin}
                salaryMax={d.salaryMax}
                currency={d.currency}
                key={d.jobId_uuid}
                jobUuid={d.jobId_uuid}
                selectedJobUuid={selectedJobUuid}
                handleCardClick={jobCardClicked}
                setJobApplicantsData={setJobApplicantsData}
              />
            );
          })}
        </div>
        <div className={styles['jobs-card-details-wrap']}>
          {showCreate && !showView && (
            <JobDetails
              orgName={orgName}
              setShowCreate={setShowCreate}
              setShowView={setShowView}
              selectedJobUuid={selectedJobUuid}
              setSelectedJobUuid={setSelectedJobUuid}
            />
          )}
          {!showCreate &&
            showView &&
            data.map((d: any) => {
              return (
                <JobView
                  title={d.title}
                  orgName={orgName}
                  salaryMin={d.salaryMin}
                  salaryMax={d.salaryMax}
                  currency={d.currency}
                  key={d.jobId_uuid}
                  jobUuid={d.jobId_uuid}
                  location={d.location}
                  role={d.role}
                  isRemote={d.isRemote}
                  description={d.description}
                  refetch={refetch}
                  setShowCreate={setShowCreate}
                  setShowView={setShowView}
                  selectedJobUuid={selectedJobUuid}
                  jobStatus={d.status}
                  orgId={orgId}
                  setSelectedJobUuid={setSelectedJobUuid}
                  JobApplicantsData={JobApplicantsData}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

JobsLanding.defaultProps = {
  hideNavbar: false,
};

export default JobsLanding;
