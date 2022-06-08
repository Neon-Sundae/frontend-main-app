import { FC } from 'react';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founders-lab-light.svg';
import WalletBalButton from './WalletBalButton';
import ProfileButton from './ProfileButton';
import styles from './index.module.scss';

const NavBar: FC = () => {
  return (
    <nav className={styles.nav}>
      <FoundersLabIcon width={227} height={29} />
      <div className={styles.actions}>
        <WalletBalButton />
        <ProfileButton />
      </div>
    </nav>
  );
};

export default NavBar;
