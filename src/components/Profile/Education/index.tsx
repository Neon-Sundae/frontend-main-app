import { FC } from 'react';
import styles from './index.module.scss';

const data = [
  {
    educationId: 1,
    degree: 'Creative Designer',
    university: 'Google Corporation',
    startDate: 'April 2019',
    endDate: 'June 2022',
  },
  {
    educationId: 2,
    degree: 'Creative Designer',
    university: 'Google Corporation',
    startDate: 'April 2019',
    endDate: 'June 2022',
  },
  {
    educationId: 3,
    degree: 'Creative Designer',
    university: 'Google Corporation',
    startDate: 'April 2019',
    endDate: 'June 2022',
  },
  {
    educationId: 4,
    degree: 'Creative Designer',
    university: 'Google Corporation',
    startDate: 'April 2019',
    endDate: 'June 2022',
  },
];

const Education: FC = () => {
  return (
    <div className={styles['education-container']}>
      {data.map(d => (
        <EducationCard
          key={d.educationId}
          degree={d.degree}
          university={d.university}
          startDate={d.startDate}
          endDate={d.endDate}
        />
      ))}
    </div>
  );
};

interface IEducation {
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
}

const EducationCard: FC<IEducation> = ({
  degree,
  university,
  startDate,
  endDate,
}) => {
  return (
    <div className={styles['education-card']}>
      <h2 className={styles.degree}>{degree}</h2>
      <div className={styles['university-date-container']}>
        <h5 className={styles.text}>{university}</h5>
        <span>|</span>
        <h5 className={styles.text}>
          {startDate} - {endDate}
        </h5>
      </div>
      {/* <p className={styles.description}>{description}</p> */}
    </div>
  );
};

export default Education;
