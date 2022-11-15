import { FC } from 'react';
import WalletDrawer from 'components/WalletDrawer';
import { RootState } from 'reducers';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as WalletIcon } from 'assets/illustrations/icons/wallet.svg';
import { toggleWalletDrawer } from 'actions/app';
import styles from './index.module.scss';

const WalletBalButton: FC = () => {
  const dispatch = useDispatch();
  const toggle = useSelector((state: RootState) => state.app.toggle);

  const handleToggle = () => {
    dispatch(toggleWalletDrawer(!toggle));
  };

  return (
    <>
      <WalletDrawer open={toggle} setOpen={handleToggle} />
      <button
        onClick={handleToggle}
        className={styles['open-wallet-drawer-btn']}
      >
        <WalletIcon width={28} height={28} />
      </button>
    </>
  );
};

export default WalletBalButton;
