import IconButton from 'components/IconButton';
import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import { ReactComponent as UDIcon } from 'assets/illustrations/icons/ud-logo-icon.svg';
import { FC, useEffect, useRef, useState } from 'react';
import { LoginModalContent } from 'components/Login/LoginModal';
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
import DiscordIcon from 'assets/illustrations/icons/login/discord.png';
import GoogleIcon from 'assets/illustrations/icons/login/google.png';
import styles from './index.module.scss';

const style = {
  width: '268.65px',
  height: '58.12px',
  borderRadius: '20px',
};

const udStyle = {
  width: '268.65px',
  height: '58.12px',
  borderRadius: '20px',
  fontFamily: 'var(--font-family-montserrat)',
  fontSize: '14px',
};

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
  }, [newUserId]);

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

      if (!file) convertBase64ToFile(localFile, setFile);

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

  const socialLogin = async (option: string) => {
    await auth.loginWithSocial(option);
  };

  return (
    <div className={styles['sign-up-form']}>
      <section className={styles['sign-up-form--option-select']}>
        <p>Select wallet to sign up</p>
        <IconButton
          handleClick={handleMetamaskSignup}
          icon={<MetamaskIcon width={26.98} height={24.32} />}
          text="&nbsp; Metamask"
          style={style}
          active={active === 'metamask'}
        />
        <IconButton
          handleClick={signupWithWalletConnect}
          icon={<WalletConnectIcon width={26.98} height={24.32} />}
          text="&nbsp; Wallet Connect"
          style={style}
          active={active === 'walletConnect'}
        />
        <IconButton
          handleClick={signUpWithUD}
          icon={<UDIcon width={26.98} height={24.32} />}
          text="&nbsp; UNSTOPPABLE DOMAINS"
          style={udStyle}
          active={active === 'udLogin'}
        />
        <p>or sign up via email</p>
        <IconButton
          handleClick={handleEmailSignUp}
          text="Verified Email"
          style={style}
          active={active === 'emailLogin'}
        />
        <p>or sign up via socials</p>
        {auth.availableLogins.map((option: string) => (
          <button
            key={`${option}-key`}
            onClick={() => socialLogin(option)}
            ref={buttonRef}
            id={`${option}-key`}
            className={styles['social-login']}
          >
            {option === 'discord' && (
              <img src={DiscordIcon} alt="Discord Login Button" />
            )}
            {option === 'google' && (
              <img src={GoogleIcon} alt="Google Login Button" />
            )}
          </button>
        ))}
      </section>

      <section className={styles['sign-up-form--option-details']}>
        {showMetamask && (
          <div>
            <h2>Opening MetaMask...</h2>
            <p>Confirm connection in the extension</p>
            <br />
            <button
              className={styles['retry-button']}
              onClick={handleMetamaskSignup}
            >
              Retry
            </button>
          </div>
        )}

        {showEmail && (
          <>
            <h2>Sign up with email</h2>
            <h3>
              We&apos;ll email you with a login link for a password free sign
              in. Please do take note that an underlying Arcana Wallet will be
              created automatically so you can perform transactions and give
              permissions on Neon Sundae.
            </h3>
            <form onSubmit={handleSubmit(linkSignUp)}>
              <input
                className={styles['sign-up-form--option-details--email']}
                placeholder="Enter email here"
                type="email"
                required
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...register('email', { required: true })}
              />
              <button type="submit" disabled={disableButton}>
                Get link
              </button>
            </form>
          </>
        )}
        {!showMetamask && !showEmail && <LoginModalContent />}
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
