import { FC, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import config from 'config';
import { useParams } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Select, { Option } from 'components/Select';
import { SingleValue } from 'react-select';
import clsx from 'clsx';
import styles from './index.module.scss';
import JobDescriptionEdit from '../JobDescriptionEdit/index';

interface IJobDetails {
  orgName: string;
}
const options = [
  { value: 'full time', label: 'Full Time' },
  { value: 'part time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
];
const currencyOptions = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const JobDetails: FC<IJobDetails> = ({ orgName }) => {
  const walletId = useSelector((state: RootState) => state);
  console.log('walletId', walletId);
  const { orgId } = useParams();
  const [editorVal, setEditorVal] = useState([
    {
      children: [
        {
          text: ' ',
        },
      ],
    },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Option | null>(null);
  const handleCategoryChange = (newValue: SingleValue<Option>) => {
    if (newValue) {
      setSelectedCategory(newValue);
    }
  };

  const handleCurrencyChange = (e: any) => {
    if (e) {
      console.log(e);
      // setSelectedCurrency(e.value);
    }
  };

  const { mutate: updateJobEntry } = useMutation(
    async () => {
      return fetch(`${config.ApiBaseUrl}/job`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Job 1',
          description: 'This is job 1',
          salaryMin: '45,000',
          salaryMax: '60,000',
          salaryType: 'annual',
          currency: 'SGD',
          role: 'Full time',
          location: 'Singapore',
          isRemote: true,
          status: 'open',
          organisationId: 1,
        }),
      });
    },
    {
      onSuccess: (res: any) => {
        console.log('success', res);
      },
      onError: (err: any) => {
        console.log('err', err);
      },
    }
  );
  console.log('editorVal', editorVal);
  return (
    <>
      <span className={styles['inline-job-title']}>
        <input
          placeholder="Job Title here"
          className={styles[`job-title-it`]}
        />
        <span className={styles['inline-job-status-label']}>
          <p>Active</p>
          <input
            type="checkbox"
            id="toggle"
            className={clsx(styles.checkbox, styles['job-active-checkbox'])}
          />
          <label htmlFor="toggle" className={styles.switch}>
            {' '}
          </label>
        </span>
      </span>

      <h3 className={styles[`job-org-name`]}>{orgName}</h3>
      <span className={styles[`job-details-data-wrap`]}>
        <Select
          options={options}
          placeholder="Job type"
          value={selectedCategory}
          name="TaskCategory"
          onSelectChange={handleCategoryChange}
          borderRadius={10}
          height={50}
          isMulti={false}
        />
        <Select
          options={currencyOptions}
          placeholder="Location"
          value={selectedCurrency}
          name="TaskCategory"
          onSelectChange={handleCurrencyChange}
          borderRadius={10}
          height={50}
          isMulti={false}
        />
        <span className={styles[`remote-check-job`]}>
          <p>Remote</p>
          <input type="checkbox" id="toggle" className={styles.checkbox} />
          <label htmlFor="toggle" className={styles.switch}>
            {' '}
          </label>
        </span>
      </span>
      <span className={styles['inline-job-salary']}>
        <input placeholder="Min Salary" id="salaryRange" />
        <input placeholder="Max Salary" />
        <Select
          options={currencyOptions}
          placeholder="USD"
          value={selectedCurrency}
          name="TaskCategory"
          onSelectChange={handleCurrencyChange}
          borderRadius={10}
          height={50}
          isMulti={false}
        />
      </span>

      <JobDescriptionEdit setEditorVal={setEditorVal} />
      <button className={styles[`publish-job-btn`]}>Publish</button>
      <button className={styles[`cancel-job-btn`]}>Cancel</button>
      <button className={styles[`cancel-job-btn`]}>Delete</button>
      {/* <button onClick={() => updateJobEntry()}>Do it!</button>   */}
    </>
  );
};
export default JobDetails;
