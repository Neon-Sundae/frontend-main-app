import { FC, ReactNode } from 'react';
import BaseBlob from 'components/BaseBlob';
import styles from './index.module.scss';

interface ModalProps {
  children: ReactNode;
  width?: string;
  height?: string;
  maxHeight?: string;
  overflowY?: any;
  onClose: () => void;
  title?: string;
}

const Modal: FC<ModalProps> = ({
  children,
  width,
  height,
  maxHeight,
  overflowY,
  onClose,
  title,
}) => {
  return (
    <>
      <div className={styles.backdrop} />
      <div
        className={styles.overlay}
        style={{ width, height, maxHeight, overflowY }}
      >
        {title && (
          <div className={styles.titleDiv}>
            <h1>{title}</h1>
            <button
              type="button"
              onClick={onClose}
              className={styles['icon-cont']}
            >
              <span className={`material-icons ${styles.icon}`}>close</span>
            </button>
          </div>
        )}

        {children}
        <ModalBlobs />
      </div>
    </>
  );
};

Modal.defaultProps = {
  width: '617px',
  overflowY: 'clip',
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
