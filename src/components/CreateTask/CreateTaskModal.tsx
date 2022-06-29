import { Dispatch, FC, SetStateAction, useState } from 'react';
import { ActionMeta, SingleValue } from 'react-select';
import Modal from 'components/Modal';
import Select, { Option } from 'components/Select';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import clsx from 'clsx';
import GradientBtn from 'components/GradientBtn';
import styles from './index.module.scss';

interface IProfileSkills {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateTaskModal: FC<IProfileSkills> = ({ setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      onClose={handleClose}
      width="clamp(20rem, 50vw, 40rem)"
      height="min(80%, 50rem)"
    >
      <h1 className={styles['create-task-title']}>Create a Task</h1>
      <GradientBtn label="Save" onClick={handleClose} />
    </Modal>
  );
};

export default CreateTaskModal;
