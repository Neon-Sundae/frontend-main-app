import { FC } from 'react';
import styles from './index.module.scss';
import FormComponent from './FormComponent';

interface IEditProjectProps {
  onClose: () => void;
}

const EditProjectForm: FC<IEditProjectProps> = ({ onClose }) => {
  return (
    <div className={styles.container}>
      <FormComponent />
    </div>
  );
};

export default EditProjectForm;
