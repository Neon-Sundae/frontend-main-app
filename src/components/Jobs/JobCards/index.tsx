import { useMutation } from '@tanstack/react-query';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import clsx from 'clsx';
import config from 'config';
import { FC } from 'react';
import { getAccessToken } from 'utils/authFn';
import styles from './index.module.scss';

interface IJobCards {
  orgName: string;
  orgImage: string | null | undefined;
  title: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  jobUuid: string;
  selectedJobUuid?: any;
  handleCardClick: any;
  setJobApplicantsData?: any;
}

const JobCards: FC<IJobCards> = ({
  orgName,
  orgImage,
  title,
  salaryMin,
  salaryMax,
  currency,
  jobUuid,
  selectedJobUuid,
  handleCardClick,
  setJobApplicantsData,
}) => {
  const payload = { jobId_uuid: jobUuid };
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

  const handleClick = () => {
    handleCardClick(jobUuid);
    fetchJobApplicants();
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        styles['job-card-wrap'],
        selectedJobUuid === jobUuid && styles['job-card-left-active']
      )}
      style={{ color: selectedJobUuid === jobUuid ? '#fff' : '#A9A9A9' }}
    >
      {orgImage ? (
        <div className={styles['job-card-org-image-wrapper']}>
          <img src={orgImage} alt="organisation-logo" />
        </div>
      ) : (
        <BrandImage
          width="72px"
          height="72px"
          style={{
            borderRadius: '50%',
          }}
        />
      )}
      <div className={styles['job-card-left']}>
        <h3>{title}</h3>
        <p>{orgName}</p>
        <p>
          💰 {salaryMin} to {salaryMax} {currency}
        </p>
      </div>
      <div className={styles['job-card-right']}>
        <i className={clsx('material-icons', styles['arrow-right'])}>
          arrow_right_alt
        </i>
      </div>
    </div>
  );
};

JobCards.defaultProps = {
  selectedJobUuid: undefined,
  setJobApplicantsData: undefined,
};

export default JobCards;
