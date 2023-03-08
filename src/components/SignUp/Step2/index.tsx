/* eslint-disable react/jsx-props-no-spreading */
import { FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import CreateOrganisationForm from '../CreateOrganisationForm';
import styles from './index.module.scss';

interface IStep2 {
  setStep: React.Dispatch<React.SetStateAction<string | null>>;
}

interface Inputs {
  name: string;
}

const Step2: FC<IStep2> = ({ setStep }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  return (
    <div className={styles['step2-container']}>
      <h2>Let’s create your organisation</h2>
      <h3>You can always change these later</h3>

      <CreateOrganisationForm setStep={setStep} />
    </div>
  );
};

export default Step2;
