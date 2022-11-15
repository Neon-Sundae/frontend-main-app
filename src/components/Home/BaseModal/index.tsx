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
  disableButton?: boolean;
  setDisableButton?: any;
  buttonText?: string;
}

const BaseModal: FC<ComponentProps> = ({
  header,
  children,
  onNext,
  onClose,
  showBtn,
  disableButton,
  setDisableButton,
  buttonText,
}) => {
  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles.overlay}>
        <button type="button" onClick={onClose} className={styles['icon-cont']}>
          <span className={`material-icons ${styles.icon}`}>close</span>
        </button>
        <header className={styles.header}>
          <h3>{header}</h3>
        </header>
        <section>
          <div className={styles.wrapOrg}>{children}</div>
        </section>
        <footer className={styles.btnCont}>
          {showBtn ? (
            <button
              type="button"
              onClick={onNext}
              className={styles.btn}
              disabled={disableButton}
            >
              {buttonText}
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
BaseModal.defaultProps = {
  showBtn: false,
  children: <p> </p>,
  disableButton: false,
  setDisableButton: null,
  buttonText: 'Next',
};

export default BaseModal;
