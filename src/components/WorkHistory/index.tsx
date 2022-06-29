/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { RootState } from 'reducers';
import _debounce from 'lodash/debounce';
import { ReactComponent as DeleteIcon } from 'assets/illustrations/icons/delete.svg';
import months from 'utils/getMonthsArray';
import numberRange from 'utils/numberRange';
import {
  useAddProfileWorkplace,
  useRemoveProfileWorkplace,
  useUpdateProfileWorkplace,
} from './hooks';
import styles from './index.module.scss';

const WorkHistory: FC = () => {
  const workplaces = useSelector(
    (state: RootState) => state.profile.workplaces
  );
  const isEditable = useSelector(
    (state: RootState) => state.profile.isEditable
  );

  const addProfileWorkplace = useAddProfileWorkplace();

  return (
    <div className={styles['work-history-container']}>
      {workplaces.map(d =>
        isEditable ? (
          <WorkplaceCardEdit
            key={d.workplaceId}
            workplaceId={d.workplaceId}
            role={d.role}
            nameValue={d.name}
            description={d.description}
            startDate={d.startDate}
            endDate={d.endDate}
          />
        ) : (
          <WorkplaceCard
            key={d.workplaceId}
            workplaceId={d.workplaceId}
            role={d.role}
            nameValue={d.name}
            description={d.description}
            startDate={d.startDate}
            endDate={d.endDate}
          />
        )
      )}
      {isEditable ? (
        <div className={styles['add-more-btn']} onClick={addProfileWorkplace}>
          <p>Add more</p>
          <i className="material-icons">add</i>
        </div>
      ) : null}
    </div>
  );
};

interface IWorkplace {
  workplaceId: number;
  role: string;
  nameValue: string;
  description: string;
  startDate: string;
  endDate: string;
}

const WorkplaceCard: FC<IWorkplace> = ({
  workplaceId,
  role,
  nameValue,
  description,
  startDate,
  endDate,
}) => {
  return (
    <div className={styles['workplace-card']}>
      <h2 className={styles.role}>{role}</h2>
      <div className={styles['organisation-date-container']}>
        <h5 className={styles.text}>{nameValue}</h5>
        <span>|</span>
        <h5 className={styles.text}>
          {new Date(startDate).toLocaleDateString()} -{' '}
          {new Date(endDate).toLocaleDateString()}
        </h5>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

const WorkplaceCardEdit: FC<IWorkplace> = ({
  workplaceId,
  role,
  nameValue,
  description,
  startDate,
  endDate,
}) => {
  const now = new Date();
  const [roleLocal, setRoleLocal] = useState(role);
  const [nameLocal, setNameLocal] = useState(nameValue);
  const [descriptionLocal, setDescriptionLocal] = useState(description);
  const [startDateLocal, setStartDateLocal] = useState(startDate);
  const [endDateLocal, setEndDateLocal] = useState(endDate);

  const payload = {
    workplaceId,
    role: roleLocal,
    name: nameLocal,
    description: descriptionLocal,
    startDate: startDateLocal,
    endDate: endDateLocal,
  };

  const removeProfileWorkplace = useRemoveProfileWorkplace();
  const updateProfileWorkplace = useUpdateProfileWorkplace();

  const handleDebounceFn = (name: string, value: string) => {
    console.log(name);
    console.log(value);

    updateProfileWorkplace({
      ...payload,
      [name]: value,
    });
  };

  const debounceFn: any = useCallback(_debounce(handleDebounceFn, 1000), []);

  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoleLocal(value);
    debounceFn(name, value);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNameLocal(value);
    debounceFn(name, value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDescriptionLocal(value);
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

  const handleDelete = () => removeProfileWorkplace(workplaceId);

  const getStartMonthDefault = (value: number) =>
    value === new Date(startDateLocal).getMonth() + 1;

  const getStartYearDefault = (year: number) =>
    year === new Date(startDateLocal).getFullYear();

  const getEndMonthDefault = (value: number) =>
    value === new Date(endDateLocal).getMonth() + 1;

  const getEndYearDefault = (year: number) =>
    year === new Date(endDateLocal).getFullYear();

  return (
    <div className={styles['workplace-card']}>
      <div className={styles['title-delete-container']}>
        <input
          name="role"
          className={clsx(styles.degree, styles['role--edit'])}
          value={roleLocal}
          onChange={handleRoleChange}
        />
        <DeleteIcon width={23} height={23} onClick={handleDelete} />
      </div>
      <div className={styles['organisation-date-container']}>
        <input
          name="name"
          className={clsx(styles.text, styles['text--edit'])}
          value={nameLocal}
          onChange={handleNameChange}
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
      <textarea
        name="description"
        className={clsx(styles.description, styles['description--edit'])}
        value={descriptionLocal}
        onChange={handleDescriptionChange}
      />
    </div>
  );
};

export default WorkHistory;
