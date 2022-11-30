import NavBar from 'components/NavBar';
import bg from 'assets/illustrations/gradients/bg.png';
import { useParams } from 'react-router-dom';
import config from 'config';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import getRandomString from 'utils/getRandomString';
import { useState } from 'react';
import styles from './index.module.scss';
import JobCards from '../JobCards';
import JobDetails from '../JobDetails';
import useFetchOrganisation from '../../Organisation/Landing/hooks';
import JobView from '../JobView';

const JobsLanding = () => {
  const [jobData, setJobData] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedJobUuid, setSelectedJobUuid] = useState('');
  const [showView, setShowView] = useState(false);
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
  const { orgId } = useParams();
  const { organisation, isLoading } = useFetchOrganisation();
  if (isLoading) return null;
  const { name: orgName, profileImage } = organisation;
  console.log('showCreate', showCreate);
  console.log('showView', showView);
  const handleCreate = () => {
    setShowCreate(true);
    setShowView(false);
  };
  if (isFetching) return null;
  if (loading) return null;

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'space',
        backgroundAttachment: 'fixed',
      }}
    >
      <NavBar />
      <div className={styles['job-cards-all-wrap']}>
        <div className={styles['jobs-cards-wrap']}>
          {data.map((d: any) => {
            return (
              <JobCards
                title={d.title}
                orgName={orgName}
                salaryMin={d.salaryMin}
                salaryMax={d.salaryMax}
                currency={d.currency}
                key={getRandomString(5)}
                jobUuid={d.jobId_uuid}
                setJobData={setJobData}
                setShowView={setShowView}
                setShowCreate={setShowCreate}
                setSelectedJobUuid={setSelectedJobUuid}
              />
            );
          })}
        </div>
        <div className={styles['jobs-card-details-wrap']}>
          {showCreate && !showView && (
            <JobDetails
              orgName={orgName}
              refetch={refetch}
              setShowCreate={setShowCreate}
            />
          )}
          {!showCreate &&
            showView &&
            data.map((d: any) => {
              console.log(d);
              return (
                <JobView
                  title={d.title}
                  orgName={orgName}
                  salaryMin={d.salaryMin}
                  salaryMax={d.salaryMax}
                  currency={d.currency}
                  key={getRandomString(5)}
                  jobUuid={d.jobId_uuid}
                  location={d.location}
                  role={d.role}
                  isRemote={d.isRemote}
                  description={d.description}
                  refetch={refetch}
                  setShowCreate={setShowCreate}
                  setShowView={setShowView}
                  selectedJobUuid={selectedJobUuid}
                />
              );
            })}
          {/* {!showCreate && showView && (
            <JobView
              title={jobData && jobData.title}
              orgName={orgName}
              salaryMin={jobData && jobData.salaryMin}
              salaryMax={jobData && jobData.salaryMax}
              currency={jobData && jobData.currency}
              key={getRandomString(5)}
              jobUuid={jobData && jobData.jobId_uuid}
              location={jobData && jobData.location}
              role={jobData && jobData.role}
              isRemote={jobData && jobData.isRemote}
              description={jobData && jobData.description}
              refetch={refetch}
              setShowCreate={setShowCreate}
              setShowView={setShowView}
            />
          )} */}
          {!showCreate && !showView && (
            <span>
              <p> Select a job listing or create one here</p>
              <button
                onClick={() => {
                  handleCreate();
                }}
              >
                create
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsLanding;
