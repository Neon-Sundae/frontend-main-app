import { useSelector } from 'react-redux';
import BlurBlobs from 'components/BlurBlobs';
import NavBar from 'components/NavBar';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'components/Card';
import Banner from '../Banner';
import CreatedBy from '../CreatedBy';
import styles from './index.module.scss';
import { RootState } from 'reducers';

const Landing: FC = () => {
  const { orgId } = useParams();

  const { usdcBalance, profileContractAddress } = useSelector((state: RootState) => state.profile);

  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar usdcBalance={usdcBalance} profileAddress={profileContractAddress} />
      <Banner />
      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.child}>
            <p>Company Description</p>
            <div>
              <CompanyDesc />
            </div>
          </div>
          <div className={styles.child}>
            <p>Profile Created By</p>
            <div>
              <CreatedBy />
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.child}>
            <p className={styles.whitePaper}>White Paper</p>
            <a href="http://#">
              https://breath.example.com/brother/action.html?basketball=bridge&branch=arm
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

const CompanyDesc = () => {
  return (
    <Card className={styles.description}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Magna eget est lorem
        ipsum dolor sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Magna eget est lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Magna eget est lorem ipsum dolor sit amet. Lorem
        ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Magna eget est lorem ipsum
        dolor sit amet.
      </p>
    </Card>
  );
};

export default Landing;
