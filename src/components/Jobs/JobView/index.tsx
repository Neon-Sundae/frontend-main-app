import config from 'config';
import { FC, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import getRandomString from 'utils/getRandomString';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
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
  const [editJobListing, setEditJobListing] = useState(false);
  const [showJobApplicants, setShowJobApplicants] = useState(false);

  const sanitizeHtml = () => {
    if (description) return JSON.parse(description)?.split('\\')?.join('');
    return null;
  };

  const editJobEntry = () => {
    setEditJobListing(true);
  };

  const generateShareLink = () => {
    navigator.clipboard.writeText(
      `${config.AppDomain}/organisation/${orgId}/jobs/all?${jobUuid}`
    );
    toast.success('Share link copied to clipboard!');
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
            />
            {!showJobApplicants && (
              <div className={styles['job-view-description']}>
                {ReactHtmlParser(sanitizeHtml())}
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
}

const JobApplicants: FC<IJobApplicants> = ({
  setShowJobApplicants,
  showJobApplicants,
}) => {
  const showJobApplicantsFunc = () => {
    setShowJobApplicants(true);
  };

  return (
    <>
      <div
        className={styles['job-list-people-wrap']}
        onClick={showJobApplicantsFunc}
      >
        <div className={styles['job-list-people']} key={getRandomString(5)}>
          {!showJobApplicants && (
            <>
              {/* TODO: map these job people */}
              <div className={styles['job-people']} key={getRandomString(5)}>
                <img src={getDefaultAvatarSrc('A')} alt="" />
              </div>
              <div className={styles['job-people']} key={getRandomString(5)}>
                <img src={getDefaultAvatarSrc('A')} alt="" />
              </div>
              <div className={styles['job-people']} key={getRandomString(5)}>
                <img src={getDefaultAvatarSrc('A')} alt="" />
              </div>
              {/* TODO: write a func to get people count */}
              <div>
                <p>+{1000}</p>
              </div>
            </>
          )}
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
          <div className={styles['job-applicants-view']}>
            <img src={getDefaultAvatarSrc('A')} alt="" />
            <p>Person name</p>
            <p>Person Title</p>
            <p>person@email.com</p>
          </div>
          <hr />
          <div className={styles['job-applicants-view']}>
            <img src={getDefaultAvatarSrc('A')} alt="" />
            <p>Person name</p>
            <p>Person Title</p>
            <p>person@email.com</p>
          </div>
          <hr />
          <div className={styles['job-applicants-view']}>
            <img src={getDefaultAvatarSrc('A')} alt="" />
            <p>Person name</p>
            <p>Person Title</p>
            <p>person@email.com</p>
          </div>
          <hr />
          <div className={styles['job-applicants-view']}>
            <img src={getDefaultAvatarSrc('A')} alt="" />
            <p>Person name</p>
            <p>Person Title</p>
            <p>person@email.com</p>
          </div>
          <hr />
        </div>
      )}
    </>
  );
};

export default JobView;
