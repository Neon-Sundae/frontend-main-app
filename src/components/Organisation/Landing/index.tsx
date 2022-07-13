import BlurBlobs from 'components/BlurBlobs';
import NavBar from 'components/NavBar';
import { FC } from 'react';
import clsx from 'clsx';
import ProfileImage from 'assets/images/profile/user-image.png';
import bg from 'assets/illustrations/organisation/bg.svg';
import { IOrganisation } from 'interfaces/organisation';
import Banner from '../Banner';
import styles from './index.module.scss';
import useFetchOrganisation from './hooks';

const Landing: FC = () => {
  const { organisation, isLoading } = useFetchOrganisation();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className={styles['organisation-container']}
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* <BlurBlobs /> */}
      <NavBar />
      <Banner organisation={organisation} />
      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles['organisation-name-description']}>
            <h3 className={styles['organisation-heading']}>
              {organisation.name}
            </h3>
            <div className={styles.description}>
              <p>{organisation.description}</p>
            </div>
          </div>
          <div className={styles['organisation-profile-created']}>
            <h3 className={styles['organisation-heading']}>
              Profile Created By
            </h3>
            <CreatedBy organisation={organisation} />
          </div>
        </section>
        <div className={styles['whitepaper-container']}>
          <h3
            className={clsx(
              styles['organisation-heading'],
              styles['organisation-heading--whitepaper']
            )}
          >
            White Paper
          </h3>
          <a
            href={organisation.whitepaper ?? '#'}
            target="_blank"
            rel="noreferrer"
            className={styles['organisation-whitepaper-link']}
          >
            {organisation.whitepaper ?? 'https://defi.xyz/whitepaper.html'}
          </a>
        </div>
      </div>
    </div>
  );
};

interface ICreatedBy {
  organisation: IOrganisation;
}

const CreatedBy: FC<ICreatedBy> = ({ organisation }) => {
  const { organisationUser } = organisation;
  const {
    name,
    profile: { title, createdAt },
  } = organisationUser[0];

  return (
    <div className={styles['organisation-profile-container']}>
      <div className={styles['image-container']}>
        <img src={ProfileImage} alt="Profile" />
      </div>
      <p className={clsx(styles.text, styles['text--primary'])}>{name}</p>
      <p className={clsx(styles.text, styles['text--secondary'])}>
        {title ?? ''}
      </p>
      <p className={clsx(styles.text, styles['text--addn'])}>
        Profile created on {new Date(createdAt).toLocaleDateString('en-GB')}
      </p>
      <button className={styles.btn}>View Profile</button>
    </div>
  );
};

export default Landing;
