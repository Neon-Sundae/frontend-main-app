/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import config from 'config';
import { useParams } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import Select, { Option } from 'components/Select';
import clsx from 'clsx';
import countries from 'assets/data/countries.json';
import currencies from 'assets/data/currency.json';
import styles from './index.module.scss';
import JobDescriptionEdit from '../JobDescriptionEdit';

const jobTypeOptions = [
  { label: 'Full Time', value: 'Full Time' },
  { label: 'Part Time', value: 'Part Time' },
  { label: 'Contract', value: 'Contract' },
];
interface IJobDetails {
  orgName: string;
  refetch: any;
  setShowCreate: any;
  jobEntryData?: any;
  setShowView: any;
  selectedJobUuid: string;
  setSelectedJobUuid: any;
}

const JobDetails: FC<IJobDetails> = ({
  orgName,
  refetch,
  setShowCreate,
  jobEntryData,
  setShowView,
  selectedJobUuid,
  setSelectedJobUuid,
}) => {
  const temp: any = [];
  const tempCurrencies: any = [];

  const [editorVal, setEditorVal] = useState('');
  const [initActiveVal, setInitActiveVal] = useState<any>(true);

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
  const { orgId } = useParams();

  const [selectedCurrency, setSelectedCurrency] = useState<Option | null>(null);
  const [jobListingData, setJobListingData] = useState<any>({
    title: '',
    salaryMin: '',
    salaryMax: '',
    currency: '',
    role: '',
    location: '',
    isRemote: jobEntryData && jobEntryData.isRemote === true,
    status:
      jobEntryData && jobEntryData.active === 'active' ? 'active' : 'inactive',
    organisationId: '',
  });

  const { mutate: createJobEntry } = useMutation(
    async () => {
      return fetch(`${config.ApiBaseUrl}/job`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: jobListingData.title,
          description: editorVal,
          salaryMin: jobListingData.salaryMin,
          salaryMax: jobListingData.salaryMax,
          currency: selectedCurrency?.label,
          role: selectedJobType.label,
          location: selectedLocation.label,
          isRemote: jobListingData.isRemote === 'true',
          status: jobListingData.status,
          organisationId: Number(orgId),
          salaryType: 'annual',
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          const { jobId_uuid } = data;
          setSelectedJobUuid(jobId_uuid);
        });
    },
    {
      onSuccess: () => {
        setShowCreate(false);
        refetch();
      },
      onError: (err: any) => {
        console.log('err', err);
      },
    }
  );
  const handleJobTitleChange = (e: any) => {
    setJobListingData((prevState: any) => ({
      ...prevState,
      title: e.target.value,
    }));
  };
  const handleJobStatusChange = (e: any) => {
    setInitActiveVal(undefined);
    setJobListingData((prevState: any) => ({
      ...prevState,
      status: e.target.checked ? 'active' : 'inactive',
    }));
  };
  const handleRemoteToggle = (e: any) => {
    setJobListingData((prevState: any) => ({
      ...prevState,
      isRemote: e.target.checked ? 'true' : 'false',
    }));
  };

  const handleMinSalaryChange = (e: any) => {
    setJobListingData((prevState: any) => ({
      ...prevState,
      salaryMin: e.target.value,
    }));
  };
  const handleMaxSalaryChange = (e: any) => {
    setJobListingData((prevState: any) => ({
      ...prevState,
      salaryMax: e.target.value,
    }));
  };

  if (jobEntryData)
    return (
      <JobDetailsEdit
        jobEntryData={jobEntryData}
        selectedJobType={selectedJobType}
        setSelectedJobType={setSelectedJobType}
        selectedLocationOptions={selectedLocationOptions}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        currencyOptions={currencyOptions}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        setEditorVal={setEditorVal}
        setShowCreate={setShowCreate}
        setShowView={setShowView}
        selectedJobUuid={selectedJobUuid}
        refetch={refetch}
        editorVal={editorVal}
        handleMinSalaryChange={handleMinSalaryChange}
        handleMaxSalaryChange={handleMaxSalaryChange}
        setJobListingData={setJobListingData}
        jobListingData={jobListingData}
      />
    );
  return (
    <form onSubmit={() => createJobEntry()}>
      <span className={styles['inline-job-title']}>
        <div className={styles['inline-job-div']}>
          <input
            placeholder="Job Title here"
            className={styles[`job-title-it`]}
            onChange={e => handleJobTitleChange(e)}
            required
          />
          <span className={styles[`job-title-span`]}>
            {jobListingData.title}
          </span>
        </div>
        <span className={styles['inline-job-status-label']}>
          <p>Active</p>
          <input
            type="checkbox"
            id="toggleTwo"
            className={clsx(styles.checkbox, styles['job-active-checkbox'])}
            onChange={e => handleJobStatusChange(e)}
            defaultChecked={initActiveVal ?? jobListingData.status}
          />
          <label htmlFor="toggleTwo" className={styles.switch}>
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
            id="remoteToggleTwo"
            className={styles.checkbox}
            onChange={e => handleRemoteToggle(e)}
          />
          <label htmlFor="remoteToggleTwo" className={styles.switch}>
            {' '}
          </label>
        </span>
      </span>
      <span className={styles['inline-job-salary']}>
        <input
          placeholder="Min Salary"
          id="salaryRange"
          onChange={e => handleMinSalaryChange(e)}
          required
        />
        <input
          placeholder="Max Salary"
          onChange={e => handleMaxSalaryChange(e)}
          required
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
      <JobDescriptionEdit setEditorVal={setEditorVal} editorVal={editorVal} />
      <input
        className={styles[`publish-job-btn`]}
        type="submit"
        value="Publish"
      />
      <button
        className={styles[`cancel-job-btn`]}
        onClick={() => {
          setShowCreate(false);
          setShowView(false);
        }}
      >
        Cancel
      </button>
    </form>
  );
};

interface IJobDetailsEdit {
  jobEntryData: any;
  selectedJobType: any;
  setSelectedJobType: any;
  selectedLocationOptions: any;
  selectedLocation: any;
  setSelectedLocation: any;
  currencyOptions: any;
  selectedCurrency: any;
  setSelectedCurrency: any;
  setEditorVal: any;
  setShowCreate: any;
  setShowView: any;
  selectedJobUuid: string;
  refetch: any;
  editorVal: any;
  handleMinSalaryChange: any;
  setJobListingData: any;
  handleMaxSalaryChange: any;
  jobListingData: any;
}

const JobDetailsEdit: FC<IJobDetailsEdit> = ({
  jobEntryData,
  selectedJobType,
  setSelectedJobType,
  selectedLocationOptions,
  selectedLocation,
  setSelectedLocation,
  currencyOptions,
  selectedCurrency,
  setSelectedCurrency,
  setEditorVal,
  setShowCreate,
  setShowView,
  selectedJobUuid,
  refetch,
  editorVal,
  handleMinSalaryChange,
  setJobListingData,
  handleMaxSalaryChange,
  jobListingData,
}) => {
  const { orgId } = useParams();

  useEffect(() => {
    setSelectedJobType({ value: jobEntryData.role, label: jobEntryData.role });
    setSelectedLocation({
      value: jobEntryData.location,
      label: jobEntryData.location,
    });
    setSelectedCurrency({
      value: jobEntryData.currency,
      label: jobEntryData.currency,
    });
    setEditorVal(jobEntryData.description);
  }, []);

  const [remote, setRemote] = useState(jobEntryData.isRemote);
  const [status, setStatus] = useState(jobEntryData.jobStatus);

  const { mutate: updateJobEntryMut } = useMutation(
    async () => {
      return fetch(`${config.ApiBaseUrl}/job/${selectedJobUuid}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: jobListingData.title
            ? jobListingData.title
            : jobEntryData.title,
          description: editorVal,
          salaryMin: jobListingData.salaryMin
            ? jobListingData.salaryMin
            : jobEntryData.salaryMin,
          salaryMax: jobListingData.salaryMax
            ? jobListingData.salaryMax
            : jobEntryData.salaryMax,
          currency: selectedCurrency?.label,
          role: selectedJobType.label,
          location: selectedLocation.label,
          isRemote: remote,
          status: status ? 'active' : 'inactive',
          organisationId: Number(orgId),
          salaryType: 'annual',
        }),
      });
    },
    {
      onSuccess: () => {
        setShowCreate(false);
        refetch();
      },
      onError: (err: any) => {
        console.log('err', err);
      },
    }
  );

  const { mutate: deleteJobEntry } = useMutation(
    async () => {
      return fetch(`${config.ApiBaseUrl}/job/${selectedJobUuid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });
    },
    {
      onSuccess: () => {
        setShowCreate(false);
        setShowView(false);
        refetch();
      },
      onError: (err: any) => {
        console.log('err', err);
      },
    }
  );

  const handleJobTitleChange = (e: any) => {
    setJobListingData((prevState: any) => ({
      ...prevState,
      title: e.target.value,
    }));
  };

  const handleCancelBtn = () => {
    setShowCreate(false);
    setShowView(false);
  };

  return (
    <>
      <span className={styles['inline-job-title']}>
        <div className={styles['inline-job-div']}>
          <input
            placeholder="Job Title here"
            className={styles[`job-title-it`]}
            onChange={e => handleJobTitleChange(e)}
            required
          />
          <span className={styles[`job-title-span`]}>
            {jobEntryData.title ?? jobListingData.title}
          </span>
        </div>

        <span className={styles['inline-job-status-label']}>
          <p>Active</p>
          <input
            type="checkbox"
            id="toggleThree"
            className={clsx(styles.checkbox, styles['job-active-checkbox'])}
            checked={status}
            onChange={() => setStatus(!status)}
          />
          <label htmlFor="toggleThree" className={styles.switch}>
            {' '}
          </label>
        </span>
      </span>
      <h3 className={styles[`job-org-name`]}>{jobEntryData.orgName}</h3>
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
            id="remoteToggleThree"
            className={styles.checkbox}
            checked={remote}
            onChange={() => setRemote(!remote)}
          />
          <label htmlFor="remoteToggleThree" className={styles.switch}>
            {' '}
          </label>
        </span>
      </span>
      <span className={styles['inline-job-salary']}>
        <input
          placeholder="Min Salary"
          id="salaryRange"
          defaultValue={jobEntryData.salaryMin}
          onChange={e => handleMinSalaryChange(e)}
        />
        <input
          placeholder="Max Salary"
          defaultValue={jobEntryData.salaryMax}
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
      <JobDescriptionEdit setEditorVal={setEditorVal} editorVal={editorVal} />
      <button
        className={styles[`publish-job-btn`]}
        onClick={() => updateJobEntryMut()}
      >
        Update
      </button>

      <button
        className={styles[`cancel-job-btn`]}
        onClick={() => handleCancelBtn()}
      >
        Cancel
      </button>
      <button
        className={styles[`cancel-job-btn`]}
        onClick={() => deleteJobEntry()}
      >
        Delete
      </button>
    </>
  );
};

JobDetails.defaultProps = {
  jobEntryData: null,
};

export default JobDetails;
