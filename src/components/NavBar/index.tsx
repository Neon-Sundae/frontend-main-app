import { useNavigate } from 'react-router-dom';

import { ReactComponent as NeonSundaeMainLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import WalletBalButton from './WalletBalButton';
import ProfileButton from './ProfileButton';
import styles from './index.module.scss';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <NeonSundaeMainLogo
        width={129.04}
        height={85.75}
        onClick={() => navigate('/dashboard')}
        className={styles.logo}
      />
      <div className={styles.actions}>
        <WalletBalButton />
        <ProfileButton />
      </div>
    </nav>
  );
};

export default NavBar;
