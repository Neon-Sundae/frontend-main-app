import { ChangeEvent, FC, useState } from 'react';
import config from 'config';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import toast from 'react-hot-toast';
import Modal from 'components/Modal';
import { revokeAccess } from 'utils/handleUnAuthorization';
import useUpdateUserProfileEmail from './hooks';
import styles from './index.module.scss';

interface IDisconnectModal {
  handleClose: () => void;
  getFormattedWalletId: () => string;
  pictureFunc: () => string;
  getFormattedDomainName: () => string;
}

const DisconnectModal: FC<IDisconnectModal> = ({
  getFormattedWalletId,
  handleClose,
  pictureFunc,
  getFormattedDomainName,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [email, setEmail] = useState<string | null | undefined>(
    user && user.email
  );
  const updateProfileDetails = useUpdateUserProfileEmail();
  const handleCopyAddress = () => {
    if (user?.domain) {
      navigator.clipboard.writeText(user.domain);
      toast.success('Copied!');
    } else if (user?.walletId) {
      navigator.clipboard.writeText(user.walletId);
      toast.success('Copied!');
    } else {
      toast.error('Failed to copy wallet address');
    }
  };
  const updateEmail = () => {
    const formData = new FormData();
    if (email) {
      formData.append('email', email);
      updateProfileDetails.mutate({
        email,
      });
    }
    handleClose();
  };
  return (
    <Modal title="Settings" onClose={handleClose} width="550px" height="500px">
      <p className={styles['disconnect-connected-text']}>Wallet Information</p>
      <div className={styles['disconnect-content-container']}>
        <div>
          <div className={styles['disconnect-image-container']}>
            <img src={pictureFunc()} alt="your profile" />
          </div>
          <span
            className={styles['navbar-wallet-address']}
            title={user?.domain ? user.domain : user?.walletId}
          >
            {user?.domain ? getFormattedDomainName() : getFormattedWalletId()}
          </span>
          <div className={styles['disconnect-action-container']}>
            <span
              className={styles['disconnect-copy-address']}
              onClick={handleCopyAddress}
            >
              <i className="material-icons">content_copy</i>
            </span>
            <a
              href={`${config.explorerURL}/address/${user?.walletId}`}
              target="_blank"
              rel="noreferrer"
              className={styles['disconnect-explorer']}
            >
              <i className="material-icons">open_in_new</i>
            </a>
          </div>
        </div>
        <button onClick={revokeAccess}>Disconnect</button>
      </div>

      <p className={styles['disconnect-connected-text']}>Account Details</p>
      <div className={styles['disc-modal-email-edit-wrap']}>
        <p>Email</p>
        <input
          name="email"
          type="email"
          placeholder="email"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          defaultValue={user?.email || ''}
          className={styles['disc-modal-email-field']}
        />
        <button className={styles['disc-modal-save-btn']} onClick={updateEmail}>
          Save
        </button>
      </div>
    </Modal>
  );
};

export default DisconnectModal;
