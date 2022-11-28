import NavBar from 'components/NavBar';
import bg from 'assets/illustrations/gradients/bg.png';
import styles from './index.module.scss';
import JobCards from '../JobCards';
import JobDetails from '../JobDetails';
import useFetchOrganisation from '../../Organisation/Landing/hooks';

const JobsLanding = () => {
  const { organisation, isLoading } = useFetchOrganisation();
  if (isLoading) return null;
  const { name: orgName } = organisation;
  console.log('orgName', orgName);
  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'space',
        backgroundAttachment: 'fixed',
      }}
    >
      <NavBar />
      <div className={styles['job-cards-all-wrap']}>
        <div className={styles['jobs-cards-wrap']}>
          <JobCards orgName={orgName} />
          <JobCards orgName={orgName} />
          <JobCards orgName={orgName} />
          <JobCards orgName={orgName} />
          <JobCards orgName={orgName} />
        </div>
        <div className={styles['jobs-card-details-wrap']}>
          <JobDetails orgName={orgName} />
        </div>
      </div>
    </div>
  );
};

export default JobsLanding;
