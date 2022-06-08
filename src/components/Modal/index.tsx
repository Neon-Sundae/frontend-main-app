import { ReactElement, FC } from 'react';
import styles from './index.module.scss';

interface ModalProps {
  children: ReactElement;
  onClose: () => null;
}

const Modal: FC<ModalProps> = ({ children, onClose }) => {
  return (
    <>
      <Backdrop />
      <Overlay onClose={onClose}>{children}</Overlay>
    </>
  );
};

const Backdrop: FC = () => {
  return <div className={styles.backdrop} />;
};

interface OverlayProps {
  children: ReactElement;
  onClose: () => null;
}

const Overlay: FC<OverlayProps> = ({ children, onClose }) => {
  return (
    <div className={styles.overlay}>
      <button type="button" onClick={onClose} className={styles['icon-cont']}>
        <span className={`material-icons ${styles.icon}`}>close</span>
      </button>
      {children}
    </div>
  );
};

export default Modal;
