import { FC } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

interface IFileAttachmentCard {
  label: string;
  skills: string;
}

const FileAttachmentCard: FC<IFileAttachmentCard> = ({ label, skills }) => {
  return (
    <div className={styles['file-attachment-card']}>
      {skills && <div />}
      {!skills && (
        <i className={clsx('material-icons', styles['attachment-icon'])}>
          attachment
        </i>
      )}

      <span>{skills ?? label}</span>
    </div>
  );
};

export default FileAttachmentCard;
