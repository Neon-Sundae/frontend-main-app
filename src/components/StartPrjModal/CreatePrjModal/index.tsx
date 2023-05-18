/* eslint-disable react/jsx-props-no-spreading */
import { FC, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Modal from 'components/Modal';
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormGetValues,
  FieldErrors,
} from 'react-hook-form';
import Select, { MultiValue } from 'react-select';
import { Option } from 'components/Select';
import timezoneData from 'assets/data/timezones.json';
import clsx from 'clsx';
import { customStyles } from './selectStyles';
import styles from './index.module.scss';
import useCreateProject from './hooks';

interface ICreatePrjProps {
  onClose: () => void;
  orgId: number;
}

interface Inputs {
  name: string;
  budget: number;
  description: string;
  timeOfCompletion: string;
  flResources: { title: string }[];
  flProjectCategory: { categoryName: string; percentageAllocation: number }[];
}

interface OptionType {
  value: string;
  label: string;
}

const CreatePrjModal: FC<ICreatePrjProps> = ({ onClose, orgId }) => {
  return (
    <div className={styles['project-create-container']}>
      <Toaster />
      <Modal
        onClose={() => onClose()}
        width="700px"
        maxHeight="90vh"
        overflowY="auto"
        title="Start a Project"
      >
        <FormComponent options={timezoneData} orgId={orgId} />
      </Modal>
    </div>
  );
};

const defaultValues = {
  flResources: [{ title: '' }],
  flProjectCategory: [{ categoryName: '', percentageAllocation: 0 }],
};

interface FormComponentProps {
  options: OptionType[];
  orgId: number;
}

const FormComponent: FC<FormComponentProps> = ({ options, orgId }) => {
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onBlur',
    defaultValues,
  });

  const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>(
    []
  );
  const [selectError, setSelectError] = useState(false);

  const selectedOptionsLabel = selectedOptions?.map((option: any) => {
    return option.label;
  });

  const onSubmit: SubmitHandler<Inputs> = data => {
    setSelectError(selectedOptions.length === 0);
    Object.assign(data, {
      organisationId: orgId,
      preferredTimeZones: selectedOptionsLabel?.join(', '),
      timeOfCompletion: new Date(data.timeOfCompletion).toISOString(),
    });

    createProject.mutate(data);
  };

  const handleSelectOptionsChange = (newValue: MultiValue<Option>): void => {
    setSelectError(newValue?.length === 0);
    setSelectedOptions(newValue);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['project-create-container--form']}
    >
      <>
        <div className={styles['project-create-container--row']}>
          <label htmlFor="name" className={styles.label}>
            Name
            <input
              placeholder="Project Name"
              {...register('name', { required: true })}
              className={clsx(
                styles['project-create-container--input'],
                styles['name-field'],
                errors.name && styles.error
              )}
            />
            {errors.name && (
              <p className={styles['project-create-container--error-message']}>
                *Project Name is required
              </p>
            )}
          </label>

          <label htmlFor="budget" className={styles.label}>
            Budget
            <span className={styles['budget-currency-container']}>
              <input
                type="number"
                placeholder="Project Budget"
                {...register('budget', {
                  setValueAs: (v: string) => parseInt(v, 10),
                  required: true,
                })}
                className={clsx(
                  styles['project-create-container--input'],
                  styles['budget-field'],
                  errors.budget && styles.error
                )}
              />
              <div
                className={clsx(
                  styles['budget-currency'],
                  errors.budget && styles.error
                )}
              >
                <p>USDC</p>
              </div>
            </span>
            {errors.budget && (
              <p className={styles['project-create-container--error-message']}>
                *Project Budget is required
              </p>
            )}
          </label>
        </div>

        <div className={styles['project-create-container--row-second']}>
          <label htmlFor="description">
            Description
            <textarea
              placeholder="Project Description"
              {...register('description', { required: true })}
              className={clsx(
                styles['project-create-container--input'],
                errors.budget && styles.error
              )}
            />
            {errors.description && (
              <p className={styles['project-create-container--error-message']}>
                *Project Description is required
              </p>
            )}
          </label>
        </div>

        <div className={styles['project-create-container--row']}>
          <label htmlFor="timeOfCompletion">
            Project est. End Date
            <input
              {...register('timeOfCompletion', { required: true })}
              type="date"
              className={clsx(
                styles['project-create-container--input'],
                errors.timeOfCompletion && styles.error
              )}
            />
            {errors.timeOfCompletion && (
              <p className={styles['project-create-container--error-message']}>
                *Date is required
              </p>
            )}
          </label>

          <div className={styles['project-create-container--timezones']}>
            <h3 className={styles['project-create-container--label']}>
              Preferred Timezones
            </h3>
            <Select
              options={options}
              styles={customStyles}
              isMulti
              onChange={newValue => handleSelectOptionsChange(newValue)}
              className={styles[selectError ? 'select-error' : '']}
            />
            {selectError && (
              <p className={styles['project-create-container--error-message']}>
                *One timezone is required
              </p>
            )}
          </div>
        </div>

        <div className={styles['project-create-container--label']}>
          <TalentsRequiredField
            {...{
              control,
              register,
              defaultValues,
              getValues,
              setValue,
              errors,
            }}
          />
        </div>

        <div className={styles['project-create-container--label']}>
          <CategoriesRequiredField
            {...{
              control,
              register,
              defaultValues,
              getValues,
              setValue,
              errors,
            }}
          />
        </div>

        <div className={styles['submit-button-wrapper']}>
          <input
            type="submit"
            id="submit"
            value="SAVE"
            className={styles['submit-button']}
          />
        </div>
      </>
    </form>
  );
};

interface MultipleInputFieldsProps {
  control: Control<Inputs, any>;
  register: UseFormRegister<Inputs>;
  setValue: UseFormSetValue<Inputs>;
  getValues: UseFormGetValues<Inputs>;
  errors: FieldErrors<Inputs>;
}

const TalentsRequiredField: FC<MultipleInputFieldsProps> = ({
  control,
  register,
  errors,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'flResources',
  });

  return (
    <div className={styles['project-create-container--talents']}>
      <h3>Talents Needed</h3>
      <ul>
        {fields.map((item, index) => {
          return (
            <>
              <li
                key={item.id}
                className={styles['project-create-container--list']}
              >
                <input
                  {...register(`flResources.${index}.title`, {
                    required: true,
                  })}
                  className={clsx(
                    styles['project-create-container--input'],
                    styles['talents-input'],
                    errors.flResources && styles.error
                  )}
                  placeholder="Talent needed for Projects ( e.g.  “JavaScript Developer”, “UI/UX Designer”)"
                />

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className={styles['delete-button']}
                >
                  <i className={clsx('material-icons', styles['delete-icon'])}>
                    delete
                  </i>
                </button>
              </li>
              <div className={styles['empty-space']} />
            </>
          );
        })}
      </ul>
      {errors.flResources && (
        <p className={styles['project-create-container--error-message']}>
          *Ensure there are no empty fields
        </p>
      )}
      <section>
        <button
          type="button"
          onClick={() => {
            append({ title: '' });
          }}
          className={styles['add-more-button']}
        >
          Add more Resources +
        </button>
      </section>
    </div>
  );
};

const CategoriesRequiredField: FC<MultipleInputFieldsProps> = ({
  control,
  register,
  errors,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'flProjectCategory',
  });

  return (
    <div className={styles['project-create-container--categories']}>
      <h3>Categories</h3>
      <ul>
        {fields.map((item, index) => {
          return (
            <>
              <li
                key={item.id}
                className={styles['project-create-container--list']}
              >
                <input
                  {...register(`flProjectCategory.${index}.categoryName`, {
                    required: true,
                  })}
                  className={clsx(
                    styles['project-create-container--input'],
                    styles['category-field'],
                    errors.flProjectCategory && styles.error
                  )}
                  placeholder="Category name (“Website Design”)"
                />

                <input
                  {...register(
                    `flProjectCategory.${index}.percentageAllocation`,
                    {
                      required: true,
                      setValueAs: (v: string) => parseInt(v, 10),
                    }
                  )}
                  type="number"
                  className={clsx(
                    styles['project-create-container--input'],
                    styles['category-allocate-input'],
                    errors.flProjectCategory && styles.error
                  )}
                  placeholder="% of budget for this category"
                />

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className={styles['delete-button']}
                >
                  <i className={clsx('material-icons', styles['delete-icon'])}>
                    delete
                  </i>
                </button>
              </li>
              <div className={styles['empty-space']} />
            </>
          );
        })}
      </ul>
      {errors.flProjectCategory && (
        <p className={styles['project-create-container--error-message']}>
          *Empty fields are not allowed
        </p>
      )}
      <section>
        <button
          type="button"
          onClick={() => {
            append({
              categoryName: '',
              percentageAllocation: 0,
            });
          }}
          className={styles['add-more-button']}
        >
          Add more Categories +
        </button>
      </section>
    </div>
  );
};

export default CreatePrjModal;