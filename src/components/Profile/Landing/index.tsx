import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import NavBar from 'components/NavBar';
import BlurBlobs from 'components/BlurBlobs';
import ProfileCard from 'components/ProfileCard';
import ProfileCardEdit from 'components/ProfileCardEdit';
import styles from './index.module.scss';
import useGetProfileData from './hooks';
import ProfileContent from '../ProfileContent';

const Landing: FC = () => {
  const isEditable = useSelector(
    (state: RootState) => state.profile.isEditable
  );
  useGetProfileData();

  return (
    <div className={styles.container}>
      <BlurBlobs />
      <NavBar />
      <div className={styles['profile-card-content-container']}>
        {isEditable ? <ProfileCardEdit /> : <ProfileCard />}
        <ProfileContent />
      </div>
    </div>
  );
};

export default Landing;
