import NavBar from 'components/NavBar';
import bg from 'assets/illustrations/gradients/bg.png';
import { useParams } from 'react-router-dom';
import config from 'config';
import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import getRandomString from 'utils/getRandomString';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Toaster } from 'react-hot-toast';
import styles from './index.module.scss';
import JobCards from '../JobCards';
import JobDetails from '../JobDetails';
import useFetchOrganisation from '../../Organisation/Landing/hooks';
import JobView from '../JobView';

const JobsLanding = () => {
  const [selectedJobUuid, setSelectedJobUuid] = useState('');

  useEffect(() => {
    setShowView(true);
  }, [selectedJobUuid]);

  const [showCreate, setShowCreate] = useState(false);
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
      <Toaster />
      <div className={styles['job-cards-all-wrap']}>
        <div className={styles['jobs-cards-wrap']}>
          <div className={styles['job-create-btn-wrap']}>
            <button
              onClick={() => {
                handleCreate();
              }}
              className={styles['create-job-btn']}
            >
              Add new
              <i className={clsx('material-icons', styles['add-icon'])}>add</i>
            </button>
          </div>

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
                setShowView={setShowView}
                setShowCreate={setShowCreate}
                setSelectedJobUuid={setSelectedJobUuid}
                selectedJobUuid={selectedJobUuid}
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
                  jobStatus={d.status}
                  orgId={Number(orgId)}
                  setSelectedJobUuid={setSelectedJobUuid}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default JobsLanding;
