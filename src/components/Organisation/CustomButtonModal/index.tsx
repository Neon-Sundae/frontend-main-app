import Modal from 'components/Modal';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import styles from './index.module.scss';
import useUpdateOrgCustomButton from './hooks';

interface ICustomButtonModal {
  handleClose: () => void;
  customButtonLabel: string;
  customButtonLink: string;
}

const CustomButtonModal: FC<ICustomButtonModal> = ({
  handleClose,
  customButtonLabel,
  customButtonLink,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { orgId } = useParams();

  const updateCustomButton = useUpdateOrgCustomButton(
    Number(orgId),
    handleClose
  );

  const onSubmit = (data: any) => {
    const { label, link } = data;
    updateCustomButton.mutate({
      customButtonLabel: label,
      customButtonLink: link,
      handleClose,
    });
  };

  return (
    <Modal
      title="Custom Button"
      onClose={handleClose}
      width="390px"
      height="372px"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles['custom-button-form']}
      >
        <span>
          <input
            placeholder="Label"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('label', { required: true })}
            className={clsx(errors.label && styles.error)}
            defaultValue={customButtonLabel}
          />
          {errors.label && <p>* Label is required</p>}
        </span>
        <span>
          <input
            type="url"
            placeholder="Link"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('link', { required: true })}
            className={clsx(errors.link && styles.error)}
            defaultValue={customButtonLink}
          />
          {errors.link && <p>* Link is required</p>}
        </span>

        <input type="submit" value="Save" />
      </form>
    </Modal>
  );
};

export default CustomButtonModal;
