import clsx from 'clsx';
import {
  ChangeEvent,
  DragEvent,
  FC,
  MouseEvent,
  useRef,
  useState,
} from 'react';
import getRandomString from 'utils/getRandomString';
import styles from './index.module.scss';

export interface IFile {
  id: string;
  file: File;
  fileName: string;
  baseFileName: string;
  fileExtension: string;
}

const TaskFileUpload: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filesArray, setFilesArray] = useState<IFile[] | null>(null);

  const handleClick = (e: any) => {
    e.preventDefault();
    if (inputRef.current) inputRef.current.click();
  };

  const setFileState = (files: FileList | null) => {
    const fileArray = [];
    if (files) {
      for (let i = 0; i < files?.length; i += 1) {
        const [fileName, fileExtension] = files[i].name.split('.');
        fileArray.push({
          id: getRandomString(5),
          file: files[i],
          fileName: `${fileName}-${getRandomString(10)}.${fileExtension}`,
          baseFileName: `${fileName}.${fileExtension}`,
          fileExtension,
        });
      }

      if (filesArray) {
        setFilesArray([...filesArray, ...fileArray]);
      } else {
        setFilesArray(fileArray);
      }
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    setFileState(files);
  };

  const handleDropChange = async (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    setFileState(files);
  };

  const handleDragEvent = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleRemove = (id: string) => {
    const newData = filesArray?.filter(file => file.id !== id);
    if (newData) setFilesArray(newData);
  };

  return (
    <div className={styles['task-attachments-container']}>
      <h4 className={styles['difficulty-price-label']}>Attachments</h4>
      <div
        className={styles['file-input-container']}
        onClick={handleClick}
        onDrop={handleDropChange}
        onDragOver={handleDragEvent}
      >
        {filesArray ? (
          filesArray.map(file => (
            <div>
              <FileAttachmentCard
                key={file.id}
                id={file.id}
                label={file.baseFileName}
                onClick={handleRemove}
              />
            </div>
          ))
        ) : (
          <span className={styles['file-upload-text']}>Drag &#38; Drop</span>
        )}
      </div>
      <input
        multiple
        ref={inputRef}
        id="attachments"
        className={styles.attachments}
        type="file"
        accept="image/png, image/jpeg, application/pdf"
        onDrop={handleDropChange}
        onChange={handleFileChange}
        onDragOver={handleDragEvent}
      />
    </div>
  );
};

interface IFileAttachmentCard {
  label: string;
  id: string;
  onClick: (id: string) => void;
}

const FileAttachmentCard: FC<IFileAttachmentCard> = ({
  id,
  label,
  onClick,
}) => {
  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    onClick(id);
  };

  return (
    <div className={styles['file-attachment-card']}>
      <i className={clsx('material-icons', styles['attachment-icon'])}>
        attachment
      </i>
      <span>{label}</span>
      <i
        className={clsx('material-icons', styles['close-icon'])}
        onClick={handleClick}
      >
        close
      </i>
    </div>
  );
};

export default TaskFileUpload;
