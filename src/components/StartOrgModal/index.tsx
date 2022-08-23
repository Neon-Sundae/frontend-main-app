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

  const [showStepTwo, setShowStepTwo] = useState(false);

  // const { createOrganisation } = useCreateOrg();
  const createOrganisation = useCreateOrganisation();

  const handleCreateOrganisation = () => {
    const formData = new FormData();

    if (orgName && orgDesc && user?.userId) {
      formData.append('name', orgName);
      formData.append('description', orgDesc);
      formData.append('userId', user.userId.toString());

      if (fileData) {
        formData.append('file', fileData.file);
      }

      createOrganisation.mutate(formData);
    }
  };

  const handleStepOne = () => {
    if (orgName.trim().length === 0) return;

    setShowStepTwo(true);
  };

  const handleStepTwo = () => {
    if (orgDesc.trim().length === 0) return;

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
}

const StepModal: FC<IStepProps> = ({
  onClose,
  onNext,
  placeholder,
  fileData,
  setFileData,
  setInputChange,
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputChange(event.target.value);
  };

  return (
    <BaseModal
      showBtn
      header="Start an organization"
      onClose={onClose}
      onNext={onNext}
    >
      <section className={styles.content}>
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
      </section>
    </BaseModal>
  );
};

export default StartOrgModal;
