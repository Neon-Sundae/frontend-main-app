import {
  FC,
  SetStateAction,
  Dispatch,
  useState,
  ChangeEvent,
  useRef,
  DragEvent,
} from 'react';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import BaseModal from 'components/Home/BaseModal';
import { ReactComponent as Stroke } from 'assets/illustrations/icons/stroke.svg';
import clsx from 'clsx';
import styles from './index.module.scss';
import useCreateOrganisation from './hook';

interface ComponentProps {
  onClose: () => void;
}

export interface IFile {
  id: string;
  file: File;
}

const StartOrgModal: FC<ComponentProps> = ({ onClose }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');
  const [fileData, setFileData] = useState<IFile | null>(null);
  const [disableButton, setDisableButton] = useState(false);
  const [showStepTwo, setShowStepTwo] = useState(false);
  const createOrganisation = useCreateOrganisation(setDisableButton);

  const handleCreateOrganisation = async () => {
    if (orgName && orgDesc && user?.userId) {
      await createOrganisation({
        name: orgName,
        description: orgDesc,
        userId: user.userId.toString(),
        image: fileData?.file,
      });
    }
  };

  const handleStepOne = () => {
    if (orgName.trim().length === 0) return;
    setShowStepTwo(true);
  };

  const handleStepTwo = () => {
    if (orgDesc.trim().length === 0) return;
    setDisableButton(true);
    handleCreateOrganisation();
  };

  const StepOneModal = (
    <StepModal
      setInputChange={setOrgName}
      onClose={onClose}
      onNext={handleStepOne}
      placeholder="Enter organisation name"
      fileData={fileData}
      setFileData={setFileData}
      buttonText="Next"
    />
  );

  const StepTwoModal = (
    <StepModal
      setInputChange={setOrgDesc}
      onClose={onClose}
      onNext={handleStepTwo}
      placeholder="Enter short description"
      fileData={fileData}
      setFileData={setFileData}
      disableButton={disableButton}
      setDisableButton={setDisableButton}
      buttonText="Create"
    />
  );

  return (
    <>
      {!showStepTwo && StepOneModal}
      {showStepTwo && StepTwoModal}
    </>
  );
};

interface IStepProps {
  onClose: () => void;
  onNext: () => void;
  placeholder: string;
  fileData: IFile | null;
  setFileData: Dispatch<SetStateAction<IFile | null>>;
  setInputChange: Dispatch<SetStateAction<string>>;
  disableButton?: boolean;
  setDisableButton?: any;
  buttonText?: string;
}

const StepModal: FC<IStepProps> = ({
  onClose,
  onNext,
  placeholder,
  fileData,
  setFileData,
  setInputChange,
  disableButton,
  setDisableButton,
  buttonText,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: any) => {
    e.preventDefault();
    if (inputRef.current) inputRef.current.click();
  };

  const setFileState = (files: FileList | null) => {
    const fileArray: IFile[] = [];
    if (files) {
      fileArray.push({
        id: `${files[0].name}-${files[0].size}`,
        file: files[0],
      });

      setFileData(fileArray[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    setFileState(files);
  };

  const handleDropChange = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    setFileState(files);
  };

  const handleDragEvent = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (disableButton) setDisableButton(false);
    setInputChange(event.target.value);
  };

  return (
    <BaseModal
      showBtn
      header="Start an organization"
      onClose={onClose}
      onNext={onNext}
      disableButton={disableButton}
      buttonText={buttonText}
    >
      <section className={styles.content}>
        {placeholder !== 'Enter short description' && (
          <>
            <div
              className={styles['file-input-container']}
              onClick={handleClick}
              onDrop={handleDropChange}
              onDragOver={handleDragEvent}
            >
              {fileData ? (
                <div className={styles['file-image-wrapper']}>
                  <img
                    src={URL.createObjectURL(fileData.file)}
                    alt="file"
                    className={styles.image}
                  />
                </div>
              ) : (
                <Stroke height={30} width={30} />
              )}
            </div>
            <input
              ref={inputRef}
              id="profileImage"
              className={styles.attachments}
              type="file"
              accept="image/png, image/jpeg"
              onDrop={handleDropChange}
              onChange={handleFileChange}
              onDragOver={handleDragEvent}
            />
            <input
              type="text"
              className={styles['create-organisation-modal']}
              placeholder={placeholder}
              required
              onChange={handleInputChange}
            />
          </>
        )}
        {placeholder === 'Enter short description' && (
          <textarea
            className={clsx(
              styles['create-organisation-modal'],
              styles['text-area-field']
            )}
            placeholder={placeholder}
            required
            onChange={handleInputChange}
          />
        )}
      </section>
    </BaseModal>
  );
};

StepModal.defaultProps = {
  disableButton: false,
  setDisableButton: '',
  buttonText: 'Next',
};

export default StartOrgModal;
