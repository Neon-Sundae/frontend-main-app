import { ChangeEvent, FC, useRef, useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import Select, { Option } from 'components/Select';
import options from 'assets/data/orgOptions.json';
import { ReactComponent as NeonSundaeMainLogo } from 'assets/illustrations/icons/neon-sundae-main-logo.svg';
import { SingleValue } from 'react-select';
import clsx from 'clsx';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { updateOnboardingData, updateSignUpStep } from 'actions/auth';
import PromptFooter from '../PromptFooter';
import { SignupSteps } from 'interfaces/auth';

enum OrgSteps {
  'OrganisationName',
  'OrganisationNameReply',
  'OrganisationIndustry',
  'OrganisationIndustryReply',
  'OrganisationLogo',
}

interface IOrganisationNameForm {
  orgName: string;
}

interface IOrganisationDescriptionForm {
  orgDescription: string;
}

const Step6: FC = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File>();
  const [orgSteps, setOrgSteps] = useState<OrgSteps[]>([
    OrgSteps.OrganisationName,
  ]);
  const [currentStep, setCurrentStep] = useState<OrgSteps>(
    OrgSteps.OrganisationName
  );
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SingleValue<Option>>();

  const inputRef = useRef<HTMLInputElement>(null);

  const onboardingData = useSelector(
    (state: RootState) => state.auth.onboardingData
  );

  const { register, handleSubmit, watch } = useForm<IOrganisationNameForm>();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    watch: watch2,
  } = useForm<IOrganisationDescriptionForm>();

  const orgNameFormValues = watch();
  const orgDescriptionFormValues = watch2();

  const isDisabledCheck = () => {
    if (currentStep === OrgSteps.OrganisationName) {
      return orgNameFormValues.orgName === '';
    } else if (currentStep === OrgSteps.OrganisationLogo) {
      return orgDescriptionFormValues.orgDescription === '';
    }
    return false;
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    if (inputRef.current) inputRef.current.click();
  };

  const handleOrgLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) setFile(files[0]);
  };

  const back = () => {
    if (currentStep === OrgSteps.OrganisationName) {
      dispatch(updateSignUpStep(SignupSteps.WorkType));
    } else if (currentStep === OrgSteps.OrganisationIndustry) {
      handleBackOrgStep([OrgSteps.OrganisationName], OrgSteps.OrganisationName);
    } else if (currentStep === OrgSteps.OrganisationLogo) {
      handleBackOrgStep(
        [
          OrgSteps.OrganisationName,
          OrgSteps.OrganisationNameReply,
          OrgSteps.OrganisationIndustry,
        ],
        OrgSteps.OrganisationIndustry
      );
    }
  };

  const handleOrgStep = (step: OrgSteps) => {
    setOrgSteps([...orgSteps, step]);
    setCurrentStep(step);
  };

  const handleBackOrgStep = (
    newSteps: OrgSteps[],
    newCurrentStep: OrgSteps
  ) => {
    setOrgSteps(newSteps);
    setCurrentStep(newCurrentStep);
    if (newCurrentStep === OrgSteps.OrganisationIndustry)
      setShowSelectMenu(true);
  };

  const onSubmit = (data: IOrganisationNameForm) => {
    dispatch(updateOnboardingData({ orgName: data.orgName }));
    handleOrgStep(OrgSteps.OrganisationNameReply);
  };

  const onIndustrySelect = (newVal: any) => {
    setSelectedOption(newVal);
    dispatch(updateOnboardingData({ industry: newVal.value }));
    handleOrgStep(OrgSteps.OrganisationIndustryReply);
  };

  const onSubmit2 = (data: IOrganisationDescriptionForm) => {
    dispatch(
      updateOnboardingData({
        orgDescription: data.orgDescription,
        orgLogo: file,
      })
    );
    dispatch(updateSignUpStep(SignupSteps.Email));
  };

  return (
    <>
      <div className={styles['step6-container']}>
        <div className={styles['chat-prompts-container--chat-message']}>
          {orgSteps.includes(OrgSteps.OrganisationName) && (
            <span>
              <div className={styles['user-image']}>
                <NeonSundaeMainLogo width={70} height={85.75} />
              </div>
              <div className={styles['user-choices']}>
                <TypeAnimation
                  style={{
                    whiteSpace: 'pre-line',
                    display: 'block',
                  }}
                  sequence={[
                    "Let's build your organisation's workflow 🚀 \n Give your organisation a name",
                    500,
                    () => {
                      setShowOptions(true);
                    },
                  ]}
                  cursor={false}
                  speed={80}
                />
                {showOptions && (
                  <form
                    id={
                      currentStep === OrgSteps.OrganisationName
                        ? 'hook-form'
                        : ''
                    }
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles['input-wrapper']}
                  >
                    <input
                      type="text"
                      placeholder="Your organisation name here"
                      {...register('orgName', {
                        required: true,
                      })}
                    />
                  </form>
                )}
              </div>
            </span>
          )}

          {orgSteps.includes(OrgSteps.OrganisationNameReply) && (
            <div className={styles['reply-prompt']}>
              <TypeAnimation
                sequence={[
                  orgNameFormValues.orgName,
                  1000,
                  () => handleOrgStep(OrgSteps.OrganisationIndustry),
                ]}
                cursor={false}
                speed={80}
              />
              <img
                src={getDefaultAvatarSrc(
                  onboardingData.name.charAt(0).toUpperCase()
                )}
                alt=""
                width="100px"
                height="100px"
              />
            </div>
          )}

          {orgSteps.includes(OrgSteps.OrganisationIndustry) && (
            <span>
              <div className={styles['user-image']}>
                <NeonSundaeMainLogo width={70} height={85.75} />
              </div>
              <div className={styles['chat-message']}>
                <TypeAnimation
                  defaultValue={orgNameFormValues.orgName}
                  style={{
                    whiteSpace: 'pre-line',
                    display: 'block',
                    marginBottom: '25px',
                  }}
                  sequence={[
                    `Which industry vertical does your \n organisation fall under?`,
                    500,
                    () => setShowSelectMenu(true),
                  ]}
                  cursor={false}
                  speed={80}
                />
                {showSelectMenu && (
                  <Select
                    options={options}
                    placeholder="Choose your organisation industry"
                    value={
                      selectedOption || {
                        value: 'Select Option',
                        label: 'Select Option',
                      }
                    }
                    onSelectChange={onIndustrySelect}
                    name="Industry"
                    borderRadius={10}
                    height={50}
                    width="400px"
                    isMulti={false}
                  />
                )}
              </div>
            </span>
          )}

          {orgSteps.includes(OrgSteps.OrganisationIndustryReply) && (
            <div className={styles['reply-prompt']}>
              <TypeAnimation
                sequence={[
                  `${selectedOption?.value ?? ''}`,
                  500,
                  () => {
                    setShowSelectMenu(false);
                    handleOrgStep(OrgSteps.OrganisationLogo);
                  },
                ]}
                cursor={false}
                speed={50}
              />
              <img
                src={getDefaultAvatarSrc(
                  onboardingData.name.charAt(0).toUpperCase()
                )}
                alt=""
                width="100px"
                height="100px"
              />
            </div>
          )}

          {orgSteps.includes(OrgSteps.OrganisationLogo) && (
            <span>
              <div className={styles['user-image']}>
                <NeonSundaeMainLogo width={70} height={85.75} />
              </div>
              <div className={styles['chat-message']}>
                <TypeAnimation
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
                  id={
                    currentStep === OrgSteps.OrganisationLogo ? 'hook-form' : ''
                  }
                  onSubmit={handleSubmit2(onSubmit2)}
                >
                  <input
                    className={styles['input-field']}
                    type="text"
                    placeholder="Type here your organisation description"
                    {...register2('orgDescription', {
                      required: true,
                    })}
                  />
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
        <PromptFooter prev={back} isDisabled={isDisabledCheck()} />
      </div>
    </>
  );
};

export default Step6;
