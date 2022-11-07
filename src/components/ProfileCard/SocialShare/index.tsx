import React from 'react';
import Modal from 'components/Modal';
import { FC, ReactNode } from 'react';
import config from 'config';
import styles from './index.module.scss';
import { ReactComponent as TwitterIcon } from 'assets/illustrations/profile/twitter.svg';

interface ModalProps {
  handleClose: () => void;
}

const SocialShareModal: FC<ModalProps> = ({ handleClose }) => {
  const text = `Gm! Twitter Fam 🚀%0dI've just minted my builder profile on @neonsundae.%0dCome join me in bringing the future of work on blockchain 💜%0d%0d`;

  return (
    <Modal
      onClose={handleClose}
      width="700px"
      overflowY="auto"
      maxHeight="90vh"
      title="Wuhoo! let's share on twitter"
    >
      <div className={styles['share-content-container']}>
        <div className={styles['promoText']}>
          <p>Share on twitter and become eligible for $NEONS airdrop</p>
        </div>

        <div className={styles['tweet-preview']}>
          <div className={styles['tweet-group']}>
            <TwitterIcon
              className={styles['tweet-icon-preview']}
              width={35}
              height={35}
            />
            <div className={styles['tweet-box-everyone']}>Everyone</div>
          </div>
          <span>{text.replaceAll('%0d', '\n')}</span>
        </div>
        <button
          className={styles['disc-modal-save-btn']}
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=${text}&url=${'https://c87a-2404-e801-2003-2dd9-ed54-468d-e7c8-f833.ap.ngrok.io/profile/83'}%0d&hashtags=Web3,WAGMI,blockchain,futureofwork`
            )
          }
        >
          Tweet!
        </button>
      </div>
    </Modal>
  );
};

export default SocialShareModal;
