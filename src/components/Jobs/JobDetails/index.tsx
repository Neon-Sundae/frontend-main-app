/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import config from 'config';
import { useParams } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import Select, { Option } from 'components/Select';
import clsx from 'clsx';
import countries from 'assets/data/countries.json';
import currencies from 'assets/data/currency.json';
import styles from './index.module.scss';
import JobDescriptionEdit from '../JobDescriptionEdit/index';

interface IJobDetails {
  orgName: string;
  refetch: any;
  setShowCreate: any;
}
const jobTypeOptions = [
  { value: 'full time', label: 'Full Time ' },
  { value: 'part time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
];

const JobDetails: FC<IJobDetails> = ({ orgName, refetch, setShowCreate }) => {
  const temp: any = [];
  const tempCurrencies: any = [];
  useEffect(() => {
    if (!temp.length) {
      countries.forEach(country => {
        temp.push({ value: country.name, label: country.name });
      });
      setSelectedLocationOptions(temp);
    }
    if (!tempCurrencies.length) {
      const keys = Object.keys(currencies);
      keys.forEach(key => {
        tempCurrencies.push({ value: key, label: key });
      });
      setCurrencyOptions(tempCurrencies);
    }
  }, []);
  const [selectedLocationOptions, setSelectedLocationOptions] = useState<any>(
    []
  );
  const [currencyOptions, setCurrencyOptions] = useState<any>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>([]);
  const [selectedJobType, setSelectedJobType] = useState<any>([]);
  const walletId = useSelector((state: RootState) => state);
  const { orgId } = useParams();
  const [editorVal, setEditorVal] = useState([
    {
      children: [
        {
          text: '',
        },
      ],
    },
  ]);

  const [selectedCurrency, setSelectedCurrency] = useState<Option | null>(null);
  const [jobListingData, setJobListingData] = useState<any>({
    title: '',
    salaryMin: '',
    salaryMax: '',
    currency: '',
    role: '',
    location: '',
    isRemote: 'false',
    status: '',
    organisationId: '',
  });
  const [inputValue, setInputValue] = useState('');

  // const handleCategoryChange = (newValue: SingleValue<Option>) => {
  //   if (newValue) {
  //     setSelectedCategory(newValue);
  //   }
  // };

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
          title: jobListingData.title,
          description: JSON.stringify(editorVal),
          salaryMin: jobListingData.salaryMin,
          salaryMax: jobListingData.salaryMax,
          currency: selectedCurrency?.label,
          role: selectedJobType.label,
          location: selectedLocation.label,
          isRemote: true,
          status: jobListingData.status,
          organisationId: Number(orgId),
          salaryType: 'annual',
        }),
      });
    },
    {
      onSuccess: (res: any) => {
        console.log('success', res);
        setShowCreate(false);
        refetch();
      },
      onError: (err: any) => {
        console.log('err', err);
      },
    }
  );
  const handleJobTitleChange = e => {
    setJobListingData(prevState => ({
      ...prevState,
      title: e.target.value,
    }));
  };
  const handleJobStatusChange = e => {
    setJobListingData(prevState => ({
      ...prevState,
      status: e.target.checked ? 'active' : 'inactive',
    }));
  };
  const handleRemoteToggle = e => {
    setJobListingData(prevState => ({
      ...prevState,
      isRemote: e.target.checked ? 'true' : 'false',
    }));
  };

  const handleMinSalaryChange = e => {
    setJobListingData(prevState => ({
      ...prevState,
      salaryMin: e.target.value,
    }));
  };
  const handleMaxSalaryChange = e => {
    setJobListingData(prevState => ({
      ...prevState,
      salaryMax: e.target.value,
    }));
  };
  return (
    <>
      <span className={styles['inline-job-title']}>
        <input
          placeholder="Job Title here"
          className={styles[`job-title-it`]}
          onChange={e => handleJobTitleChange(e)}
        />
        <span className={styles['inline-job-status-label']}>
          <p>Active</p>
          <input
            type="checkbox"
            id="toggle"
            className={clsx(styles.checkbox, styles['job-active-checkbox'])}
            onChange={e => handleJobStatusChange(e)}
          />
          <label htmlFor="toggle" className={styles.switch}>
            {' '}
          </label>
        </span>
      </span>

      <h3 className={styles[`job-org-name`]}>{orgName}</h3>
      <span className={styles[`job-details-data-wrap`]}>
        <Select
          options={jobTypeOptions ?? []}
          placeholder="Job Type"
          value={selectedJobType}
          name="Job type"
          onSelectChange={newVal => setSelectedJobType(newVal)}
          borderRadius={10}
          height={50}
          isMulti={false}
        />
        <Select
          options={selectedLocationOptions ?? []}
          placeholder="Location"
          value={selectedLocation}
          onSelectChange={newVal => setSelectedLocation(newVal)}
          name="Location"
          borderRadius={10}
          height={50}
          width="250px"
          isMulti={false}
        />
        <span className={styles[`remote-check-job`]}>
          <p>Remote</p>
          <input
            type="checkbox"
            id="remoteToggle"
            className={styles.checkbox}
            onChange={e => handleRemoteToggle(e)}
          />
          <label htmlFor="remoteToggle" className={styles.switch}>
            {' '}
          </label>
        </span>
      </span>
      <span className={styles['inline-job-salary']}>
        <input
          placeholder="Min Salary"
          id="salaryRange"
          onChange={e => handleMinSalaryChange(e)}
        />
        <input
          placeholder="Max Salary"
          onChange={e => handleMaxSalaryChange(e)}
        />
        <Select
          options={currencyOptions}
          placeholder="USD"
          value={selectedCurrency}
          name="Currency"
          onSelectChange={newVal => setSelectedCurrency(newVal)}
          borderRadius={10}
          height={50}
          isMulti={false}
        />
      </span>
      <JobDescriptionEdit setEditorVal={setEditorVal} />
      <button
        className={styles[`publish-job-btn`]}
        onClick={() => updateJobEntry()}
      >
        Publish
      </button>
      <button
        className={styles[`cancel-job-btn`]}
        onClick={() => setShowCreate(false)}
      >
        Cancel
      </button>
    </>
  );
};

export default JobDetails;
