import { FC } from 'react';
import styles from './index.module.scss';

interface IOverviewTab {
  description: string | null;
  whitepaper: string | null;
}

const OverviewTab: FC<IOverviewTab> = ({ description, whitepaper }) => {
  return (
    <div className={styles['overview-tab']}>
      <section className={styles['overview-tab--description']}>
        <h2 className={styles['overview-tab--heading']}>Project Description</h2>
        <p>{description}</p>
      </section>
      <section className={styles['overview-tab--whitepaper']}>
        <h2 className={styles['overview-tab--heading']}>White Paper</h2>
        <a href={whitepaper || ''}>{whitepaper}</a>
      </section>
    </div>
  );
};

export default OverviewTab;
