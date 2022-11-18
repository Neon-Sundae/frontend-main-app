import Modal from 'components/Modal';
import { FC, ReactElement } from 'react';
import BaseBlob from 'components/BaseBlob';
import styles from './index.module.scss';

interface ComponentProps {
  header: string;
  children?: JSX.Element | JSX.Element[];
  onNext: () => void;
  onClose: () => void;
  showBtn?: boolean;
  noCloseBtn?: boolean;
}

const BaseModal: FC<ComponentProps> = ({
  header,
  children,
  onNext,
  onClose,
  showBtn,
  noCloseBtn,
}) => {
  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles.overlay}>
        {!noCloseBtn && (
          <button
            type="button"
            onClick={onClose}
            className={styles['icon-cont']}
          >
            <span className={`material-icons ${styles.icon}`}>close</span>
          </button>
        )}

        <header className={styles.header}>
          <h3>{header}</h3>
        </header>
        <section>
          <div className={styles.wrapOrg}>{children}</div>
        </section>
        <footer className={styles.btnCont}>
          {showBtn ? (
            <button type="button" onClick={onNext} className={styles.btn}>
              Next
            </button>
          ) : (
            ''
          )}
        </footer>
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

export default BaseModal;
