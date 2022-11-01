import { FC } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

interface IFileSkillsCard {
  label?: string;
  skills?: string;
}

const FileSkillsCard: FC<IFileSkillsCard> = ({ label, skills }) => {
  return (
    <div className={styles['file-attachment-card']}>
      {skills && <div />}
      {!skills && (
        <i className={clsx('material-icons', styles['attachment-icon'])}>
          attachment
        </i>
      )}
      {skills && <span>{skills}</span>}
      {label && <span>{label}</span>}
    </div>
  );
};

FileSkillsCard.defaultProps = {
  skills: '',
  label: '',
};

export default FileSkillsCard;
