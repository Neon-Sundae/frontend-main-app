import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import { ReactComponent as UDIcon } from 'assets/illustrations/icons/ud-logo-icon.svg';
import { FC, useEffect, useRef, useState } from 'react';

import {
  useArcanaWallet,
  useMetamaskSignup,
  useUnstoppableDomains,
  useWalletConnectSignup,
} from 'components/Login/Step1/hooks';
import { useAuth, useProvider } from '@arcana/auth-react';
import { useForm } from 'react-hook-form';
import { getSessionStorageItem } from 'utils/sessionStorageFunc';
import useCreateOrganisation from 'components/StartOrgModal/hook';
import convertBase64ToFile from 'utils/base64ToFile';
import useCreateProfile from 'components/Dashboard/FirstTimeUser/hooks';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import IconButton from '../IconButton';
import styles from './index.module.scss';

const SignUpForm = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const auth = useAuth();
  const { signup } = useArcanaWallet();
  const { provider } = useProvider();
  const [disableButton, setDisableButton] = useState(false);
  const [newUserId, setNewUserId] = useState(0);

  const createProfile = useCreateProfile(setNewUserId);

  const [file, setFile] = useState<File | undefined>();
  const createOrganisation = useCreateOrganisation(setDisableButton);

  useEffect(() => {
    const triggerSignUp = async () => {
      await signup(auth.user?.address, provider);
      createProfile.mutate({
        name: getSessionStorageItem('name'),
        email: auth?.user?.email || '',
      });
    };
    if (auth.user) {
      triggerSignUp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
    if (newUserId) saveOrgData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newUserId, file]);

  const [error, setError] = useState('');
  const [active, setActive] = useState('');

  const [showMetamask, setShowMetamask] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const generateNonce = useMetamaskSignup(setNewUserId);
  const walletConnectGenerateNonce = useWalletConnectSignup(setNewUserId);
  const unstoppableDomains = useUnstoppableDomains(setNewUserId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginWithMetaMask = () => {
    setError('');
    setShowMetamask(true);
    generateNonce({ setError });
  };

  const handleMetamaskSignup = () => {
    setError('');
    setActive('metamask');
    setShowEmail(false);
    if (typeof window.ethereum !== 'undefined') {
      loginWithMetaMask();
    } else {
      setShowMetamask(true);
    }
  };

  const signupWithWalletConnect = async () => {
    setError('');
    setActive('walletConnect');
    walletConnectGenerateNonce({ setError });
  };

  const signUpWithUD = () => {
    setError('');
    setActive('udLogin');
    unstoppableDomains.signup(setError);
  };

  const handleEmailSignUp = () => {
    setError('');
    setActive('emailLogin');
    setShowMetamask(false);
    setShowEmail(true);
  };

  const linkSignUp = async (formData: any) => {
    const { email } = formData;
    await auth.loginWithLink(email);
  };

  const saveOrgData = async () => {
    const orgData = JSON.parse(getSessionStorageItem('orgData'));

    if (orgData) {
      const localFile = getSessionStorageItem('file');

      if (!file) await convertBase64ToFile(localFile, setFile);

      if (!disableButton)
        await createOrganisation({
          name: orgData.name,
          description: orgData.description,
          userId: newUserId.toString(),
          image: file,
          industry: getSessionStorageItem('choices'),
        });
    }
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
          onSubmit={handleSubmit(linkSignUp)}
        >
          <button>Use</button>
          <input
            className={styles['sign-up-form-email']}
            placeholder="emailabcd@gmail.com"
            type="email"
            required
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register('email', { required: true })}
          />
          <button type="submit" disabled={disableButton}>
            Get link
          </button>
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
