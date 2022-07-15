/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/extensions */
import clsx from 'clsx';
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import _debounce from 'lodash/debounce';
import { ReactComponent as DeleteIcon } from 'assets/illustrations/icons/delete.svg';
import numberRange from 'utils/numberRange';
import months from 'utils/getMonthsArray';
import {
  useAddProfileEducation,
  useRemoveProfileEducation,
  useUpdateProfileEducation,
} from './hooks';
import styles from './index.module.scss';

const Education: FC = () => {
  const education = useSelector((state: RootState) => state.profile.education);
  const isEditable = useSelector(
    (state: RootState) => state.profile.isEditable
  );

  const addProfileEducation = useAddProfileEducation();

  return (
    <div className={styles['education-container']}>
      {education.map(d =>
        isEditable ? (
          <EducationCardEdit
            key={d.educationId}
            educationId={d.educationId}
            degree={d.degree}
            university={d.university}
            startDate={d.startDate}
            endDate={d.endDate}
          />
        ) : (
          <EducationCard
            key={d.educationId}
            educationId={d.educationId}
            degree={d.degree}
            university={d.university}
            startDate={d.startDate}
            endDate={d.endDate}
          />
        )
      )}
      {isEditable ? (
        <div className={styles['add-more-btn']} onClick={addProfileEducation}>
          <p>Add more</p>
          <i className="material-icons">add</i>
        </div>
      ) : null}
    </div>
  );
};

interface IEducation {
  educationId: number;
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
}

const EducationCard: FC<IEducation> = ({
  educationId,
  degree,
  university,
  startDate,
  endDate,
}) => {
  return (
    <div className={styles['education-card']}>
      <h2 className={styles.degree}>{degree}</h2>
      <div className={styles['university-date-container']}>
        <h5 className={styles.text}>{university}</h5>
        <span>|</span>
        <h5 className={styles.text}>
          {new Date(startDate).toLocaleDateString()} -{' '}
          {new Date(endDate).toLocaleDateString()}
        </h5>
      </div>
    </div>
  );
};

const EducationCardEdit: FC<IEducation> = ({
  educationId,
  degree,
  university,
  startDate,
  endDate,
}) => {
  const now = new Date();
  const [degreeLocal, setDegreeLocal] = useState(degree);
  const [universityLocal, setUniversityLocal] = useState(university);
  const [startDateLocal, setStartDateLocal] = useState(startDate);
  const [endDateLocal, setEndDateLocal] = useState(endDate);

  const payload = {
    educationId,
    degree: degreeLocal,
    university: universityLocal,
    startDate: startDateLocal,
    endDate: endDateLocal,
  };

  const removeProfileEducation = useRemoveProfileEducation();
  const updateProfileEducation = useUpdateProfileEducation();

  const handleDebounceFn = (name: string, value: string) => {
    updateProfileEducation({
      ...payload,
      [name]: value,
    });
  };

  const debounceFn: any = useCallback(_debounce(handleDebounceFn, 1000), []);

  const handleDegreeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDegreeLocal(value);
    debounceFn(name, value);
  };

  const handleUniversityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUniversityLocal(value);
    debounceFn(name, value);
  };

  const handleStartMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const tempDate = new Date(startDateLocal);
    tempDate.setMonth(parseInt(value, 10) - 1);
    setStartDateLocal(tempDate.toISOString());
    debounceFn(name, tempDate);
  };

  const handleStartYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const tempDate = new Date(startDateLocal);
    tempDate.setFullYear(parseInt(value, 10));
    setStartDateLocal(tempDate.toISOString());
    debounceFn(name, tempDate);
  };

  const handleEndMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const tempDate = new Date(endDateLocal);
    tempDate.setMonth(parseInt(value, 10) - 1);
    setEndDateLocal(tempDate.toISOString());
    debounceFn(name, tempDate);
  };

  const handleEndYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const tempDate = new Date(endDateLocal);
    tempDate.setFullYear(parseInt(value, 10));
    setEndDateLocal(tempDate.toISOString());
    debounceFn(name, tempDate);
  };

  const handleDelete = () => removeProfileEducation(educationId);

  const getStartMonthDefault = (value: number) =>
    value === new Date(startDateLocal).getMonth() + 1;

  const getStartYearDefault = (year: number) =>
    year === new Date(startDateLocal).getFullYear();

  const getEndMonthDefault = (value: number) =>
    value === new Date(endDateLocal).getMonth() + 1;

  const getEndYearDefault = (year: number) =>
    year === new Date(endDateLocal).getFullYear();

  return (
    <div className={styles['education-card']}>
      <div className={styles['title-delete-container']}>
        <input
          name="degree"
          className={clsx(styles.degree, styles['degree--edit'])}
          value={degreeLocal}
          onChange={handleDegreeChange}
        />
        <DeleteIcon width={23} height={23} onClick={handleDelete} />
      </div>
      <div className={styles['university-date-container']}>
        <input
          name="university"
          className={clsx(styles.text, styles['text--edit'])}
          value={universityLocal}
          onChange={handleUniversityChange}
        />
        <span>|</span>
        <span className={styles['input-date-container']}>
          <div>
            <select
              name="startDate"
              className={styles['input-select']}
              onChange={handleStartMonthChange}
            >
              {months.map(month => (
                <option
                  key={month.label}
                  value={month.value}
                  selected={getStartMonthDefault(month.value)}
                >
                  {month.label}
                </option>
              ))}
            </select>
            <select
              name="startDate"
              className={styles['input-select']}
              onChange={handleStartYearChange}
            >
              {numberRange(now.getFullYear() - 50, now.getFullYear() + 1).map(
                year => (
                  <option
                    key={year}
                    value={year}
                    selected={getStartYearDefault(year)}
                  >
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
          <span>-</span>
          <div>
            <select
              name="endDate"
              className={styles['input-select']}
              onChange={handleEndMonthChange}
            >
              {months.map(month => (
                <option
                  key={month.label}
                  value={month.value}
                  selected={getEndMonthDefault(month.value)}
                >
                  {month.label}
                </option>
              ))}
            </select>
            <select
              name="endDate"
              className={styles['input-select']}
              onChange={handleEndYearChange}
            >
              {numberRange(now.getFullYear() - 50, now.getFullYear() + 1).map(
                year => (
                  <option
                    key={year}
                    value={year}
                    selected={getEndYearDefault(year)}
                  >
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
        </span>
      </div>
    </div>
  );
};

export default Education;
