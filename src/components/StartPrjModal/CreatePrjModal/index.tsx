import { FC } from 'react';
import BaseModal from 'components/Home/BaseModal';
import styles from './index.module.scss';

interface ICreatePrjProps {
  onNext: () => void;
  onClose: () => void;
}

const CreatePrjModal: FC<ICreatePrjProps> = ({ onClose, onNext }) => {
  return (
    <BaseModal header="Create a Project" onNext={onNext} onClose={onClose}>
      <form className={styles['create-prj']}>
        <div className={styles['input-unit']}>
          <label htmlFor="prjName">
            Project Name
            <input type="text" id="prjName" className={styles.name} />
          </label>
        </div>
        <div className={styles['input-unit']}>
          <label htmlFor="prjDesc">
            Project Description
            <textarea name="prjDesc" id="prjDesc" className={styles.desc} />
          </label>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreatePrjModal;
