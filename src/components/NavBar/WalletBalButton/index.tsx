import { FC, useState } from 'react';
import WalletDrawer from 'components/WalletDrawer';
import { ReactComponent as WalletIcon } from 'assets/illustrations/icons/wallet.svg';
import styles from './index.module.scss';

const WalletBalButton: FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(p => !p);
  };

  return (
    <>
      <WalletDrawer open={openDrawer} setOpen={setOpenDrawer} />
      <button
        onClick={toggleDrawer}
        className={styles['open-wallet-drawer-btn']}
      >
        <WalletIcon width={28} height={28} />
      </button>
    </>
  );
};

export default WalletBalButton;
