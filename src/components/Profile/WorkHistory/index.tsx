import { FC } from 'react';
import styles from './index.module.scss';

const data = [
  {
    workplaceId: 1,
    role: 'Creative Designer',
    name: 'Google Corporation',
    description:
      'Lorem imsum text is here imsum text is here   imsum text is here imsum text is here imsumz shs s.  BioLorem imsum text is here imsum text is here   imsum text is here imsum text is here  imsum  here BioLorem imsum text is    imsum text is here imsum text is here imsum. BioLorem imsum text isimsum text is here   imsum text is here imsum text is here imsum. here imsum text is here',
    startDate: 'April 2019',
    endDate: 'June 2022',
    isWorking: true,
  },
  {
    workplaceId: 2,
    role: 'Creative Designer',
    name: 'Google Corporation',
    description:
      'Lorem imsum text is here imsum text is here   imsum text is here imsum text is here imsumz shs s.  BioLorem imsum text is here imsum text is here   imsum text is here imsum text is here  imsum  here BioLorem imsum text is    imsum text is here imsum text is here imsum. BioLorem imsum text isimsum text is here   imsum text is here imsum text is here imsum. here imsum text is here',
    startDate: 'April 2019',
    endDate: 'June 2022',
    isWorking: true,
  },
  {
    workplaceId: 3,
    role: 'Creative Designer',
    name: 'Google Corporation',
    description:
      'Lorem imsum text is here imsum text is here   imsum text is here imsum text is here imsumz shs s.  BioLorem imsum text is here imsum text is here   imsum text is here imsum text is here  imsum  here BioLorem imsum text is    imsum text is here imsum text is here imsum. BioLorem imsum text isimsum text is here   imsum text is here imsum text is here imsum. here imsum text is here',
    startDate: 'April 2019',
    endDate: 'June 2022',
    isWorking: true,
  },
  {
    workplaceId: 4,
    role: 'Creative Designer',
    name: 'Google Corporation',
    description:
      'Lorem imsum text is here imsum text is here   imsum text is here imsum text is here imsumz shs s.  BioLorem imsum text is here imsum text is here   imsum text is here imsum text is here  imsum  here BioLorem imsum text is    imsum text is here imsum text is here imsum. BioLorem imsum text isimsum text is here   imsum text is here imsum text is here imsum. here imsum text is here',
    startDate: 'April 2019',
    endDate: 'June 2022',
    isWorking: true,
  },
];

const WorkHistory: FC = () => {
  return (
    <div className={styles['work-history-container']}>
      {data.map(d => (
        <WorkHistoryCard
          key={d.workplaceId}
          role={d.role}
          name={d.name}
          description={d.description}
          startDate={d.startDate}
          endDate={d.endDate}
          isWorking={d.isWorking}
        />
      ))}
    </div>
  );
};

interface IWorkHistory {
  role: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isWorking: boolean;
}

const WorkHistoryCard: FC<IWorkHistory> = ({
  role,
  name,
  description,
  startDate,
  endDate,
  isWorking,
}) => {
  return (
    <div className={styles['work-history-card']}>
      <h2 className={styles.role}>{role}</h2>
      <div className={styles['organisation-date-container']}>
        <h5 className={styles.text}>{name}</h5>
        <span>|</span>
        <h5 className={styles.text}>
          {startDate} - {isWorking ? 'Present' : endDate}
        </h5>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default WorkHistory;
