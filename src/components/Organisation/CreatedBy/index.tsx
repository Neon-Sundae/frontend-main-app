import { FC } from 'react';
import Card from 'components/Card';
import ProfileImage from 'assets/images/profile/user-image.png';
import styles from './index.module.scss';

const CreatedBy: FC = () => {
  return (
    <Card className={styles.container}>
      <>
        <div className={styles['image-cont']}>
          <div className={styles.image}>
            <img src={ProfileImage} alt="your profile" />
          </div>
        </div>
        <p className={styles['text--primary']}>Steve Jobs</p>
        <p className={styles['text--secondary']}>Managing Director</p>
        <p className={styles['text--addn']}>
          Profile created on 23rd April 2022
        </p>
        <footer className={styles.btnCont}>
          <ViewProfileBtn />
        </footer>
      </>
    </Card>
  );
};

const ViewProfileBtn: FC = () => {
  return <button className={styles.btn}>View Profile</button>;
};

export default CreatedBy;
