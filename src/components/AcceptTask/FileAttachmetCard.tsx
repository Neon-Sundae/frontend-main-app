import { FC } from 'react';
import clsx from 'clsx';
import styles from './index.module.scss';

interface IFileAttachmentCard {
  label: string;
}

const FileAttachmentCard: FC<IFileAttachmentCard> = ({ label }) => {
  return (
    <div className={styles['file-attachment-card']}>
      <i className={clsx('material-icons', styles['attachment-icon'])}>
        attachment
      </i>
      <span>{label}</span>
    </div>
  );
};

export default FileAttachmentCard;
