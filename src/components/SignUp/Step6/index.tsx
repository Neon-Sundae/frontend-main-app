import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from 'utils/sessionStorageFunc';

import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import Select, { Option } from 'components/Select';
import options from 'assets/data/orgOptions.json';

import { SingleValue } from 'react-select';
import clsx from 'clsx';
import styles from './index.module.scss';

interface IStep6 {
  setActive: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  showOptions: boolean;
  active: string;
}

const Step6: FC<IStep6> = ({ setActive, setShowOptions, showOptions }) => {
  const step = useSelector((state: RootState) => state.user.step);
  const name = getSessionStorageItem('name');

  const [file, setFile] = useState<File | undefined>();
  const [localFile, setLocalFile] = useState<string | ArrayBuffer | null>(null);

  const [showSelectMenu, setShowSelectMenu] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActive('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSessionStorageItem('file', localFile);
  }, [localFile]);

  const [selectedOption, setSelectedOption] = useState<SingleValue<Option>>();
  const [organisationDescription, setOrganisationDescription] = useState('');

  const {
    register,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const orgName = useWatch({
    control,
    name: 'name',
  });

  if (Object.keys(errors).length > 0) {
    setActive('');
  }

  if (Object.keys(errors).length === 0) {
    setSessionStorageItem('organisationName', orgName);
    setSessionStorageItem('organisationDescription', organisationDescription);
    setActive('1');
  }

  const handleClick = (e: any) => {
    e.preventDefault();
    if (inputRef.current) inputRef.current.click();
  };

  const handleOrgLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) setFile(files[0]);
    const reader = new FileReader();
    reader.onloadend = function () {
      setLocalFile(reader.result);
    };
    if (files) {
      reader.readAsDataURL(files[0]);
    }
  };

  if (selectedOption?.label) {
    setSessionStorageItem('organisationVertical', selectedOption.label);
  }

  return (
    <>
      <div className={styles['step6-container']}>
        <div className={styles['chat-prompts-container--chat-message']}>
          {step !== 11 && (
            <span>
              <div className={styles['user-image']} />
              <div className={styles['user-choices']}>
                <TypeAnimation
                  style={{
                    whiteSpace: 'pre-line',
                    display: 'block',
                    marginBottom: '25px',
                  }}
                  defaultValue={orgName}
                  sequence={[
                    'Let’s build your organisation’s workflow 🚀 \n Give your organisation a name',
                    500,
                    () => {
                      setShowOptions(true);
                      setActive('');
                    },
                  ]}
                  cursor={false}
                  speed={80}
                />
                {showOptions && (
                  <span className={styles['input-wrapper']}>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Type here your organisation name"
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...register('name', {
                          required: true,
                        })}
                        style={{
                          border:
                            Object.keys(errors).length &&
                            '0.56px solid #FF8383',
                        }}
                      />
                      {Object.keys(errors).length > 0 && (
                        <p>* Name is required</p>
                      )}
                    </form>
                  </span>
                )}
              </div>
            </span>
          )}

          {(step === 8 || step === 9 || step === 10) && (
            <div className={styles['reply-prompt']}>
              <TypeAnimation
                defaultValue={orgName}
                sequence={[
                  `${orgName}`,
                  1000,
                  () => {
                    // dispatch(setSignUpStep(step + 1));
                  },
                ]}
                cursor={false}
                speed={80}
              />
              <img
                src={getDefaultAvatarSrc(name?.charAt(0).toUpperCase())}
                alt=""
                width="100px"
                height="100px"
              />
            </div>
          )}

          {(step === 9 || step === 10) && (
            <span>
              <div className={styles['user-image']} />
              <div className={styles['chat-message']}>
                <TypeAnimation
                  defaultValue={orgName}
                  style={{
                    whiteSpace: 'pre-line',
                    display: 'block',
                    marginBottom: '25px',
                  }}
                  sequence={[
                    `Which industry vertical does your \n organisation fall under?`,
                    500,
                    () => {
                      setShowSelectMenu(2);
                      divRef.current?.scrollIntoView({ behavior: 'smooth' });
                    },
                  ]}
                  cursor={false}
                  speed={80}
                />
                {showSelectMenu === 2 && (
                  <Select
                    options={options}
                    placeholder="Choose your organisation industry"
                    value={
                      selectedOption || {
                        value: 'Select Option',
                        label: 'Select Option',
                      }
                    }
                    onSelectChange={newVal => setSelectedOption(newVal)}
                    name="Location"
                    borderRadius={10}
                    height={50}
                    width="330px"
                    isMulti={false}
                  />
                )}
              </div>
            </span>
          )}

          {step === 10 && (
            <div className={styles['reply-prompt']}>
              <TypeAnimation
                defaultValue={orgName}
                sequence={[
                  `${selectedOption?.label ?? ''}`,
                  500,
                  () => {
                    setTimeout(() => {
                      setShowSelectMenu(3);
                    }, 1000);
                  },
                ]}
                cursor={false}
                speed={50}
              />
              <img
                src={getDefaultAvatarSrc(name?.charAt(0).toUpperCase())}
                alt=""
                width="100px"
                height="100px"
              />
              <div ref={divRef} id="here" />
            </div>
          )}

          {step === 11 && (
            <span>
              <div className={styles['user-image']} />
              <div className={styles['chat-message']}>
                <TypeAnimation
                  defaultValue={orgName}
                  style={{
                    whiteSpace: 'pre-line',
                    display: 'block',
                    marginBottom: '25px',
                  }}
                  sequence={[
                    `Tell us more about what your oragnisation does`,
                    500,
                  ]}
                  cursor={false}
                  speed={80}
                />
                <input
                  type="file"
                  ref={inputRef}
                  accept="image/png, image/jpeg"
                  className={styles['input-field-hidden']}
                  onChange={handleOrgLogoChange}
                />
                <form
                  onSubmit={e => {
                    e.preventDefault();
                  }}
                >
                  <input
                    className={styles['input-field']}
                    type="text"
                    placeholder="Type here your organisation description"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...register('description', {
                      required: true,
                    })}
                    onChange={e => setOrganisationDescription(e.target.value)}
                    style={{
                      border:
                        Object.keys(errors).length && '0.56px solid #FF8383',
                    }}
                  />
                  {Object.keys(errors).length > 0 && (
                    <p>* Description is required</p>
                  )}
                </form>

                <button
                  className={styles['upload-button']}
                  onClick={handleClick}
                >
                  <i className={clsx('material-icons', styles['upload-icon'])}>
                    upload
                  </i>
                  Add Logo
                </button>

                {file && <img src={URL.createObjectURL(file)} alt="" />}
              </div>
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Step6;
