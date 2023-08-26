import OrganisationPeopleCard from 'components/OrganisationPeopleCard';
import { IMemberData } from 'interfaces/organisation';
import { FC } from 'react';
import styles from './index.module.scss';

interface IPeopleTab {
  members: IMemberData | undefined;
}

const PeopleTab: FC<IPeopleTab> = ({ members }) => {
  return (
    <div className={styles['people-tab']}>
      <OrganisationPeopleCard members={members} />
    </div>
  );
};

export default PeopleTab;
