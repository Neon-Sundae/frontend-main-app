/* eslint-disable react/jsx-props-no-spreading */
import Modal from 'components/Modal';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import styles from './index.module.scss';
import useUpdateCustomButton from './hooks';

interface ICustomButtonModal {
  handleClose: () => void;
}

const CustomButtonModal: FC<ICustomButtonModal> = ({ handleClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { orgId } = useParams();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Modal
      title="Custom Button"
      onClose={handleClose}
      width="550px"
      height="300px"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles['custom-button-form']}
      >
        <input placeholder="Label" {...register('label', { required: true })} />
        {errors.label && <span>Label is required</span>}
        <input {...register('link', { required: true })} />
        {errors.link && <span>Link is required</span>}
        <input type="submit" value="Save" />
      </form>
    </Modal>
  );
};

export default CustomButtonModal;
