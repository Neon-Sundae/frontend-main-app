import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founders-lab-light.svg';
import WalletBalButton from './WalletBalButton';
import ProfileButton from './ProfileButton';
import styles from './index.module.scss';

interface NavBarProps {
  usdcBalance: number,
}

const NavBar: FC<NavBarProps> = (props: any) => {

  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <FoundersLabIcon
        width={227}
        height={29}
        onClick={() => navigate('/dashboard')}
        className={styles.logo}
      />
      <div className={styles.actions}>
        <WalletBalButton {...props} />
        <ProfileButton />
      </div>
    </nav>
  );
};

export default NavBar;
