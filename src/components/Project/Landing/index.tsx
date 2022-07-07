import { FC } from 'react';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import Header from '../Header';
import Description from '../Description';
import { RootState } from 'reducers';

const Landing: FC = () => {

  const { usdcBalance } = useSelector((state: RootState) => state.profile);

  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar usdcBalance={usdcBalance} />
      <Header />
      <Description />
    </div>
  );
};

export default Landing;
