import { useMutation } from '@tanstack/react-query';
import config from 'config';
import { FC, useRef, useState } from 'react';
import { getAccessToken } from 'utils/authFn';
import ReactHtmlParser from 'react-html-parser';
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
}) => {
  const cardRef = useRef(null);
  const sanitizeHtml = () => {
    if (description) return JSON.parse(description)?.split('\\')?.join('');
    return null;
  };
  const [editJobListing, setEditJobListing] = useState(false);
  const { mutate: deleteJobEntry } = useMutation(
    async () => {
      return fetch(`${config.ApiBaseUrl}/job/${jobUuid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });
    },
    {
      onSuccess: (res: any) => {
        console.log('success', res);
        setShowCreate(false);
        setShowView(false);
        refetch();
      },
      onError: (err: any) => {
        console.log('err', err);
      },
    }
  );
  const editJobEntry = () => {
    setEditJobListing(true);
  };
  if (selectedJobUuid === jobUuid) {
    return (
      <div className={styles['job-view-wrap']} ref={cardRef}>
        {editJobListing && <EditJobEntry />}
        {!editJobListing && (
          <>
            <h1>{title}</h1>
            <h2>{orgName}</h2>
            <span className={styles['inline-job-details']}>
              <p>💻 {role}</p>
              <p>📍 {location}</p>
              <p>
                💰 {salaryMin}-{salaryMax} {currency}
              </p>
              <p>🌏 {isRemote ? 'Remote Allowed' : 'Not Remote'}</p>
            </span>
            <div className={styles['job-view-description']}>
              {ReactHtmlParser(sanitizeHtml())}
            </div>
            <button onClick={() => editJobEntry()}>Edit</button>
            <button onClick={() => deleteJobEntry()}>Delete</button>
          </>
        )}
      </div>
    );
  }
  return null;
};
export default JobView;
