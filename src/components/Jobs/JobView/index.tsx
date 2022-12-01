import config from 'config';
import { FC, useState } from 'react';
import getRandomString from 'utils/getRandomString';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import convertHtmlToReact from '@hedgedoc/html-to-react';
import { useMutation } from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import styles from './index.module.scss';
import EditJobEntry from '../EditJobEntry';

interface IJobView {
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
  orgId: number;
  setSelectedJobUuid: any;
}

const JobView: FC<IJobView> = ({
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
  setSelectedJobUuid,
  jobStatus,
  orgId,
}) => {
  const payload = { jobId_uuid: selectedJobUuid };
  const [editJobListing, setEditJobListing] = useState(false);
  const [showJobApplicants, setShowJobApplicants] = useState(false);
  const [JobApplicantsData, setJobApplicantsData] = useState([]);

  const { mutate: fetchJobApplicants } = useMutation(
    async () => {
      return fetch(`${config.ApiBaseUrl}/job/applicants`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setJobApplicantsData(data);
        });
    },
    {
      onSuccess: () => {
        // Do nothing
      },
      onError: (err: any) => {
        console.log('err', err);
      },
    }
  );

  const editJobEntry = () => {
    setEditJobListing(true);
  };

  const generateShareLink = () => {
    navigator.clipboard.writeText(`${config.AppDomain}/jobs/all?${jobUuid}`);
    toast.success('Copied to clipboard!');
  };
  const onClick = () => {
    console.log('click');
    fetchJobApplicants();
    setShowJobApplicants(true);
  };
  if (selectedJobUuid === jobUuid) {
    return (
      <div className={styles['job-view-wrap']}>
        {editJobListing && (
          <EditJobEntry
            setShowCreate={setShowCreate}
            setShowView={setShowView}
            title={title}
            orgName={orgName}
            salaryMin={salaryMin}
            salaryMax={salaryMax}
            currency={currency}
            key={getRandomString(5)}
            jobUuid={selectedJobUuid}
            location={location}
            role={role}
            isRemote={isRemote}
            description={description}
            refetch={refetch}
            selectedJobUuid={selectedJobUuid}
            jobStatus={jobStatus}
            setSelectedJobUuid={setSelectedJobUuid}
          />
        )}
        {!editJobListing && (
          <>
            <div className={styles['inline-job-buttons']}>
              <h1>{title}</h1>
              <span>
                <button
                  className={styles['edit-job-btn']}
                  onClick={() => editJobEntry()}
                >
                  Edit{' '}
                  <i className={clsx('material-icons', styles['pencil-icon'])}>
                    edit
                  </i>
                </button>
                <button
                  className={styles['edit-job-btn']}
                  onClick={() => generateShareLink()}
                >
                  Share{' '}
                  <i className={clsx('material-icons', styles['share-icon'])}>
                    share
                  </i>
                </button>
              </span>
            </div>

            <h2>{orgName}</h2>
            <span className={styles['inline-job-details']}>
              <p>💻 {role}</p>
              <p>📍 {location}</p>
              <p>
                💰 {salaryMin}-{salaryMax} {currency}
              </p>
              <p>🌏 {isRemote ? 'Remote Allowed' : 'Not Remote'}</p>
            </span>

            <JobApplicants
              setShowJobApplicants={setShowJobApplicants}
              showJobApplicants={showJobApplicants}
              onClick={onClick}
              JobApplicantsData={JobApplicantsData}
            />
            {!showJobApplicants && (
              <div className={styles['job-view-description']}>
                {description ? convertHtmlToReact(description) : 'N/A'}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
  return null;
};

interface IJobApplicants {
  setShowJobApplicants: any;
  showJobApplicants: any;
  onClick: any;
  JobApplicantsData: any;
}

const JobApplicants: FC<IJobApplicants> = ({
  setShowJobApplicants,
  showJobApplicants,
  onClick,
  JobApplicantsData,
}) => {
  return (
    <>
      <div className={styles['job-list-people-wrap']} onClick={onClick}>
        <div className={styles['job-list-people']} key={getRandomString(5)}>
          {!showJobApplicants &&
            JobApplicantsData.map((item: any) => (
              <>
                {' '}
                <div className={styles['job-people']} key={getRandomString(5)}>
                  <img
                    src={getDefaultAvatarSrc(item.Profile.user.name)}
                    alt=""
                  />
                </div>
                <div>
                  <p>+{JobApplicantsData.length}</p>
                </div>
              </>
            ))}
        </div>
      </div>

      {showJobApplicants && (
        <div className={styles['show-job-applicants-wrap']}>
          <span
            className={styles['job-applicants-head-wrap']}
            onClick={() => setShowJobApplicants(false)}
          >
            <i className={clsx('material-icons', styles['arrow-back-icon'])}>
              arrow_back
            </i>
            <p>Applicants</p>
          </span>
          {/* TODO: map job applicants */}
          {JobApplicantsData.map((item: any) => (
            <>
              <div className={styles['job-applicants-view']}>
                <img src={getDefaultAvatarSrc('A')} alt="" />
                <p>{item.Profile.user.name}</p>
                <p>Person Title</p>
                <p>person@email.com</p>
              </div>
              <hr />
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default JobView;
