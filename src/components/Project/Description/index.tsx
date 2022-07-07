import { FC } from 'react';
import styles from './index.module.scss';

const Description: FC = () => {
  return (
    <div className={styles.container}>
      <h4>Company Description</h4>
      <div className={styles.wrap}>
        <section className={styles.projectDescription}>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
            consectetur doloremque eius, omnis ad, repellendus ipsam asperiores
            corporis molestiae voluptatem molestias dolorum sunt vel at
            accusamus quas et ullam ducimus? Lorem, ipsum dolor sit amet
            consectetur adipisicing elit.{' '}
          </p>
        </section>
        <section className={styles.projectDetails}>
          <div className={styles.card}>
            <p>Budget: 15,000 USDC</p>
            <p>Timeline: 3 months</p>
            <p>Preferred TimeZones: SGT / UTC + 8</p>
            <p>Looking for: Designer, Developer</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Description;
