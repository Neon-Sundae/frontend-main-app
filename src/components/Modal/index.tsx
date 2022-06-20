import { FC, ReactNode } from 'react';
import BaseBlob from 'components/BaseBlob';
import styles from './index.module.scss';

interface ModalProps {
  children: ReactNode;
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
        <ModalBlobs />
      </div>
    </>
  );
};

const ModalBlobs: FC = () => {
  return (
    <>
      <BaseBlob
        blobColor="rgba(167, 153, 255, 0.15)"
        width={350}
        height={350}
        className="modal-blob-purple-1"
      />
      <BaseBlob
        blobColor="rgba(247, 153, 255, 0.15)"
        width={350}
        height={350}
        className="modal-blob-pink-1"
      />
    </>
  );
};

export default Modal;
