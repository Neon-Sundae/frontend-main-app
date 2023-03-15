import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ReactComponent as Stroke } from 'assets/illustrations/icons/stroke.svg';
import Select, { SingleValue } from 'react-select';
import { Option } from 'components/Select';
import industryOptions from 'assets/data/industries.json';
import { setItem } from 'utils/sessionStorageFunc';
import { customStyles } from './selectStyles';
import styles from './index.module.scss';

interface Inputs {
  name: string;
  description: string;
}

interface IFile {
  id: string;
  file: File;
}
interface ICreateOrganisationForm {
  setStep: React.Dispatch<React.SetStateAction<string | null>>;
}

const CreateOrganisationForm: FC<ICreateOrganisationForm> = ({ setStep }) => {
  const [fileData, setFileData] = useState<IFile | null>(null);
  const [localFile, setLocalFile] = useState<string | ArrayBuffer | null>(null);

  console.log('localFile', localFile);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [selectedOption, setSelectedOption] = useState<SingleValue<Option>>({
    label: '',
    value: '',
  });

  const handleSelectOptionsChange = (newValue: SingleValue<Option>): void => {
    setSelectedOption(newValue);
  };

  const onSubmit: SubmitHandler<Inputs> = data => {
    const orgData = { ...data, ...selectedOption };
    setItem('orgData', JSON.stringify(orgData));
    setItem('file', localFile);
    setStep('step3');
  };

  return (
    <div className={styles['create-organisation-form-container']}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FileUpload
          fileData={fileData}
          setFileData={setFileData}
          setLocalFile={setLocalFile}
        />

        <input
          type="text"
          placeholder="Organisation Name"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('name', { required: true })}
        />

        <Select
          options={industryOptions}
          placeholder="Industry"
          styles={customStyles}
          onChange={newValue =>
            handleSelectOptionsChange(newValue as SingleValue<Option>)
          }
          isSearchable={false}
        />

        <textarea
          placeholder="Description"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...register('description', { required: true })}
        />
        {errors.name && <span>This field is required</span>}
        <input type="submit" value="Next" />
      </form>
    </div>
  );
};

interface IFileUploadProps {
  fileData: IFile | null;

  setFileData: Dispatch<SetStateAction<IFile | null>>;
  setLocalFile: Dispatch<SetStateAction<string | ArrayBuffer | null>>;
}

const FileUpload: FC<IFileUploadProps> = ({
  fileData,

  setFileData,
  setLocalFile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
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
    const reader = new FileReader();
    reader.onloadend = function () {
      console.log('RESULT', reader.result);
      setLocalFile(reader.result);
    };
    if (files) {
      reader.readAsDataURL(files[0]);
      setFileState(files);
    }
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <>
      <div className={styles['file-input-container']} onClick={handleClick}>
        {fileData ? (
          <div>
            <img
              src={URL.createObjectURL(fileData.file)}
              alt="file"
              className={styles.image}
            />
          </div>
        ) : (
          <span>
            <Stroke height={20} width={20} />
            <p>Add logo</p>
          </span>
        )}
      </div>
      <input
        ref={inputRef}
        id="profileImage"
        className={styles.attachments}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default CreateOrganisationForm;
