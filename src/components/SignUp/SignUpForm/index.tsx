import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import { ReactComponent as UDIcon } from 'assets/illustrations/icons/ud-logo-icon.svg';
import { FC, useEffect, useState } from 'react';

import { useAuth, useProvider } from '@arcana/auth-react';
import { useForm, useWatch } from 'react-hook-form';
import { getSessionStorageItem } from 'utils/sessionStorageFunc';

import convertBase64ToFile from 'utils/base64ToFile';

import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import useCreateOrganisation from 'components/StartOrgModal/hook';
import regexEmail from 'utils/regex/email';
import IconButton from '../IconButton';
import styles from './index.module.scss';
import useMetamaskOnboardUser from './hooks/useMetamaskOnboardUser';
import useArcanaOnboardUser from './hooks/useArcanaOnboardUser';
import useUdOnboardUser from './hooks/useUdOnboardUser';
import useWalletConnectOnboardUser from './hooks/useWalletConnectOnboardUser';

const SignUpForm = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [emailFromSessionStorage, setEmail] = useState(
    getSessionStorageItem('email') ?? getSessionStorageItem('organisationEmail')
  );

  const [disableButton, setDisableButton] = useState(false);
  const provider = useProvider();
  const createOrganisation = useCreateOrganisation(setDisableButton);
  const [apiStep, setApiStep] = useState(0);
  const auth = useAuth();
  const { createUser, updateProfile, saveUserOnboardData } =
    useMetamaskOnboardUser(setApiStep);
  const createArcanaUser = useArcanaOnboardUser(setApiStep);
  const createUdUser = useUdOnboardUser(setApiStep);
  const createWdUser = useWalletConnectOnboardUser();

  useEffect(() => {
    if (apiStep === 2) updateUserProfile();
    if (apiStep === 3) {
      saveUserOnboardDataFunc();
      if (!getSessionStorageItem('organisationName')) {
        navigate('/dashboard');
      } else {
        saveOrgData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiStep]);

  useEffect(() => {
    if (auth.user) createArcanaUser.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const [error, setError] = useState('');
  const [active, setActive] = useState('');

  // const generateNonce = useMetamaskSignup(setNewUserId);

  const {
    register,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const email = useWatch({
    control,
    name: 'email',
  });

  const loginWithMetaMask = () => {
    createUser.mutate();
  };

  const handleMetamaskSignup = () => {
    if (typeof window.ethereum !== 'undefined') {
      loginWithMetaMask();
    }
  };

  const signupWithWalletConnect = async () => {
    createWdUser(setApiStep);
  };

  const signUpWithUD = () => {
    createUdUser.mutate();
  };

  const linkSignUp = async (userEmail: string) => {
    await auth.loginWithLink(userEmail);
  };

  const saveOrgData = async () => {
    const organisationName = getSessionStorageItem('organisationName');
    const organisationDescription = getSessionStorageItem(
      'organisationDescription'
    );

    if (organisationName && organisationDescription) {
      const localFile = getSessionStorageItem('file');
      const convertedFile = await convertBase64ToFile(localFile);
      if (user?.userId)
        await createOrganisation({
          name: organisationName,
          description: organisationDescription,
          userId: user.userId.toString(),
          image: convertedFile || undefined,
          industry: getSessionStorageItem('choices'),
        });
    }
  };

  const saveUserOnboardDataFunc = () => {
    const data: any[] = [];
    const choices = getSessionStorageItem('choices');
    const flow = getSessionStorageItem('flow');
    const work = getSessionStorageItem('work');

    data.push(JSON.parse(choices), flow, work, { userId: user?.userId });

    saveUserOnboardData.mutate(data);
  };

  const updateUserProfile = () => {
    console.log('inside updateUserProfile');
    updateProfile.mutate({
      userId: user?.userId,
      name:
        getSessionStorageItem('name') ??
        getSessionStorageItem('organisationName'),
      email:
        getSessionStorageItem('email') ??
        getSessionStorageItem('organisationEmail'),
      work:
        getSessionStorageItem('work') ??
        getSessionStorageItem('organisationVertical'),
    });
  };

  if (error === 'Bad Request' || error === 'User Already Exist!') {
    toast(t => <LoginButton setError={setError} />);
  }

  return (
    <div className={styles['sign-up-form']}>
      <section className={styles['sign-up-form--option-select']}>
        <p>Signup via your wallet</p>

        <div className={styles['buttons-container']}>
          <IconButton
            handleClick={handleMetamaskSignup}
            icon={<MetamaskIcon width={26.98} height={24.32} />}
            text="&nbsp; Metamask"
            active={active === 'metamask'}
          />
          <IconButton
            handleClick={signupWithWalletConnect}
            icon={<WalletConnectIcon width={26.98} height={24.32} />}
            text="&nbsp; Wallet Connect"
            active={active === 'walletConnect'}
          />
          <IconButton
            handleClick={signUpWithUD}
            icon={<UDIcon width={26.98} height={24.32} />}
            text="Unstoppable Domains"
            active={active === 'udLogin'}
          />
        </div>

        <p>Or create a wallet with your email and sign up</p>
        <form
          className={styles['sign-up-form']}
          onSubmit={e => e.preventDefault()}
        >
          <button aria-label="Use">Use</button>
          <input
            className={styles['sign-up-form-email']}
            defaultValue={emailFromSessionStorage}
            type="email"
            required
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('email', { required: true, pattern: regexEmail })}
            style={{
              border: Object.keys(errors).length && '0.56px solid #FF8383',
            }}
          />
          <button
            type="submit"
            disabled={disableButton}
            onClick={() => {
              linkSignUp(email ?? emailFromSessionStorage);
            }}
          >
            Get link
          </button>
          {Object.keys(errors).length > 0 && (
            <p className={styles['sign-up-form-email-error']}>
              * Your email looks so wrong!
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

interface ILoginButton {
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const LoginButton: FC<ILoginButton> = ({ setError }) => {
  const navigate = useNavigate();

  return (
    <span>
      User already exists, click to
      <button
        onClick={() => {
          setError('');
          navigate('/login');
        }}
        className={styles['toast-button']}
      >
        Login
      </button>
    </span>
  );
};

export default SignUpForm;
