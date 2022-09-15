import { FC } from 'react';
import config from 'config';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { revokeAccess } from 'utils/handleUnAuthorization';
import styles from './index.module.scss';

interface IDisconnectModal {
  handleClose: () => void;
  getFormattedWalletId: () => string;
  pictureFunc: () => string;
}

const DisconnectModal: FC<IDisconnectModal> = ({
  getFormattedWalletId,
  handleClose,
  pictureFunc,
}) => {
  const { user } = useSelector((state: RootState) => state.user);

  const handleCopyAddress = () => {
    if (user?.walletId) {
      navigator.clipboard.writeText(user.walletId);
      toast.success('Copied!');
    } else {
      toast.error('Failed to copy wallet address');
    }
  };

  return (
    <Modal title="Wallet Information" onClose={handleClose}>
      <p className={styles['disconnect-connected-text']}>Connected</p>
      <div className={styles['disconnect-content-container']}>
        <div>
          <div className={styles['disconnect-image-container']}>
            <img src={pictureFunc()} alt="your profile" />
          </div>
          <span className={styles['navbar-wallet-address']}>
            {getFormattedWalletId()}
          </span>
        </div>
        <button onClick={revokeAccess}>Disconnect</button>
      </div>
      <div className={styles['disconnect-action-container']}>
        <span
          className={styles['disconnect-copy-address']}
          onClick={handleCopyAddress}
        >
          <i className="material-icons">content_copy</i>
          Copy Address
        </span>
        <a
          href={`${config.explorerURL}/address/${user?.walletId}`}
          target="_blank"
          rel="noreferrer"
          className={styles['disconnect-explorer']}
        >
          <i className="material-icons">open_in_new</i>
          View on Explorer
        </a>
      </div>
    </Modal>
  );
};

export default DisconnectModal;
