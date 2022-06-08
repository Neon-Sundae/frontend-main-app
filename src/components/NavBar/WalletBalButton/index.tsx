import { FC } from 'react';
import { ReactComponent as WalletIcon } from 'assets/illustrations/icons/wallet.svg';
import { ReactComponent as VisibilityIcon } from 'assets/illustrations/icons/visibility.svg';
import clsx from 'clsx';
import styles from './index.module.scss';

const WalletBalButton: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <WalletIcon width={28} height={28} />
      </div>
      <div className={styles.content}>
        <div
          className={clsx(
            styles['text--primary'],
            styles['text--align'],
            styles['text--clickable']
          )}
        >
          <span>1500,63 usdc</span>
          <span className="material-icons">keyboard_arrow_down</span>
        </div>
        <span
          className={clsx(
            styles['text--secondary'],
            styles['text--clickable'],
            styles['text--align']
          )}
        >
          Hide balance
          <VisibilityIcon width={15} height={15} />
        </span>
      </div>
    </div>
  );
};

export default WalletBalButton;
