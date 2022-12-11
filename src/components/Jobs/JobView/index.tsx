/* eslint-disable jsx-a11y/anchor-is-valid */
import config from 'config';
import { FC, useState } from 'react';
import getRandomString from 'utils/getRandomString';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import convertHtmlToReact from '@hedgedoc/html-to-react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { useNavigate } from 'react-router-dom';
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
  JobApplicantsData: any;
  orgOwnerUserId: any;
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
  JobApplicantsData,
  jobStatus,
  orgId,
  orgOwnerUserId,
}) => {
  const userId = useSelector((state: RootState) => state.user.user?.userId);
  const navigate = useNavigate();
  const userIsOrgOwner = () => {
    return orgOwnerUserId === userId;
  };

  const [editJobListing, setEditJobListing] = useState(false);
  const [showJobApplicants, setShowJobApplicants] = useState(false);

  const editJobEntry = () => {
    setEditJobListing(true);
  };

  const generateShareLink = () => {
    navigator.clipboard.writeText(`${config.AppDomain}/jobs/all?${jobUuid}`);
    toast.success('Copied to clipboard!');
  };

  const onClick = () => {
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
            </div>

            <a onClick={() => navigate(`/organisation/${orgId}`)}>{orgName}</a>
            <span className={styles['inline-job-details']}>
              <p>💻 {role}</p>
              <p>📍 {location ?? 'Remote'}</p>
              <p>
                💰 {salaryMin}-{salaryMax} {currency}
              </p>
              <p>🌏 {isRemote ? 'Remote Allowed' : 'Not Remote'}</p>
            </span>
            {userIsOrgOwner() && (
              <JobApplicants
                setShowJobApplicants={setShowJobApplicants}
                showJobApplicants={showJobApplicants}
                onClick={onClick}
                JobApplicantsData={JobApplicantsData}
                orgOwnerUserId={orgOwnerUserId}
                setEditJobListing={setEditJobListing}
                jobUuid={jobUuid}
              />
            )}
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
  orgOwnerUserId: any;
  setEditJobListing: any;
  jobUuid: any;
}

const JobApplicants: FC<IJobApplicants> = ({
  setShowJobApplicants,
  showJobApplicants,
  onClick,
  JobApplicantsData,
  orgOwnerUserId,
  setEditJobListing,
  jobUuid,
}) => {
  const userId = useSelector((state: RootState) => state.user.user?.userId);

  const userIsOrgOwner = () => {
    return orgOwnerUserId === userId;
  };

  const editJobEntry = () => {
    setEditJobListing(true);
  };

  const generateShareLink = () => {
    navigator.clipboard.writeText(`${config.AppDomain}/jobs/all?${jobUuid}`);
    toast.success('Copied to clipboard!');
  };

  return (
    <>
      <div className={styles['job-list-people-wrap']}>
        <div className={styles['job-list-people']} key={getRandomString(5)}>
          <span>
            {JobApplicantsData && JobApplicantsData.length === 0 && (
              <button
                className={styles['view-applicants-btn']}
                disabled={JobApplicantsData.length === 0}
                onClick={onClick}
              >
                View Applicants
              </button>
            )}
            {JobApplicantsData && JobApplicantsData.length !== 0 && (
              <button
                className={styles['view-applicants-btn']}
                disabled={JobApplicantsData.length === 0}
                onClick={onClick}
              >
                View Applicants
              </button>
            )}
          </span>
          <span>
            {userIsOrgOwner() && (
              <button
                className={styles['edit-job-btn']}
                onClick={() => editJobEntry()}
              >
                Edit
                <i className={clsx('material-icons', styles['pencil-icon'])}>
                  edit
                </i>
              </button>
            )}
            <button
              className={styles['edit-job-btn']}
              onClick={() => generateShareLink()}
            >
              Share
              <i className={clsx('material-icons', styles['share-icon'])}>
                share
              </i>
            </button>
          </span>
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
          {JobApplicantsData &&
            JobApplicantsData.map((item: any) => (
              <>
                <div
                  className={styles['job-applicants-view']}
                  key={getRandomString(5)}
                >
                  <img
                    src={
                      item.Profile.picture ||
                      getDefaultAvatarSrc(
                        item?.Profile?.user?.name?.charAt(0).toUpperCase()
                      )
                    }
                    alt="Job Applicant"
                  />
                  <p>{item.Profile.user.name}</p>
                  <p>{item.Profile.title}</p>
                  <p>{item.Profile.user.email}</p>
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
