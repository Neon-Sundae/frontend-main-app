import { ReactElement, FC } from 'react';
import styles from './index.module.scss';

interface ModalProps {
  children: ReactElement;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ children, onClose }) => {
  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles.overlay}>
        <button type="button" onClick={onClose} className={styles['icon-cont']}>
          <span className={`material-icons ${styles.icon}`}>close</span>
        </button>
        {children}
      </div>
    </>
  );
};

export default Modal;
