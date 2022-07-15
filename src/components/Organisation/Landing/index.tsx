import NavBar from 'components/NavBar';
import { FC } from 'react';
import bg from 'assets/illustrations/organisation/bg.svg';
import Banner from '../Banner';
import styles from './index.module.scss';
import useFetchOrganisation from './hooks';
import BasicDetails from '../BasicDetails';
import OrganisationProjects from '../OrganisationProjects';

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
      <NavBar />
      <Banner organisation={organisation} />
      <BasicDetails organisation={organisation} />
      <OrganisationProjects organisation={organisation} />
    </div>
  );
};

export default Landing;
