import { FC } from 'react';
import { ReactComponent as Money } from 'assets/illustrations/icons/money.svg';
import { ReactComponent as Graph } from 'assets/illustrations/icons/graph.svg';
import { ReactComponent as Time } from 'assets/illustrations/icons/time.svg';
import { ReactComponent as Resource } from 'assets/illustrations/icons/resource.svg';
import styles from './index.module.scss';

interface DescriptionProps {
  description: string;
  budget: number;
  timeOfCompletion: string;
  preferredTimeZones: string[];
  flResources: any[];
}

const Description: FC<DescriptionProps> = (props: DescriptionProps) => {
  const {
    description,
    budget,
    timeOfCompletion,
    preferredTimeZones,
    flResources,
  } = props;
  const dateToday = new Date();
  const end = new Date(timeOfCompletion);
  const days = Math.floor(
    (end.getTime() - dateToday.getTime()) / (1000 * 60 * 60 * 24)
  );
  const flResourcesStringJoined = flResources
    ?.map(resource => resource.title)
    .join(', ');
  return (
    <div className={styles.container}>
      <h4>Description</h4>
      <div className={styles.wrap}>
        <section className={styles.projectDescription}>
          <p>{description}</p>
        </section>
        <section className={styles.projectDetails}>
          <div className={styles.card}>
            <span className={styles.inline}>
              <Money />
              <p>Budget: {budget} USDC</p>
            </span>
            <span className={styles.inline}>
              <Time />
              <p>Timeline: {days} days</p>
            </span>
            <span className={styles.inline}>
              <Graph />
              <p>Timezones: {preferredTimeZones}</p>
            </span>
            <span className={styles.inline}>
              <Resource />
              <p>Looking For: {flResourcesStringJoined}</p>
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Description;
