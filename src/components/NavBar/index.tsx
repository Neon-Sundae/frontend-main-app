import { FC } from 'react';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founders-lab-light.svg';
import WalletBalButton from './WalletBalButton';
import ProfileButton from './ProfileButton';
import styles from './index.module.scss';

interface NavBarProps {
  usdcBalance: number,
}

const NavBar: FC<NavBarProps> = (props: any) => {
  return (
    <nav className={styles.nav}>
      <FoundersLabIcon width={227} height={29} />
      <div className={styles.actions}>
        <WalletBalButton {...props} />
        <ProfileButton />
      </div>
    </nav>
  );
};

export default NavBar;
