import { ReactComponent as MetamaskIcon } from 'assets/illustrations/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from 'assets/illustrations/icons/walletconnect.svg';
import { ReactComponent as UDIcon } from 'assets/illustrations/icons/ud-logo-icon.svg';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { providers } from 'ethers';
import { useProvider } from '@arcana/auth-react';
import { useForm } from 'react-hook-form';
import { detectMetamask, requestEthereumAccounts } from 'utils/web3EventFn';
import { signArcanaMessage, signMessage } from 'utils/ethereumFn';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCreateOrganisation } from 'queries/organisation';
import regexEmail from 'utils/regex/email';
import {
  useArcanaGenerateNonce,
  useMetamaskGenerateNonce,
  useSaveOrganisationSignupObjectives,
  useSaveUserOnboardData,
  useSaveUserSignupObjectives,
  useVerifySignature,
  useVerifyUdSignature,
} from 'queries/auth';
import { useUpdateOrganisationImage } from 'hooks/useUpdateOrganisationImage';
import { getMetamaskAccountData } from 'api/auth';
import { useArcanaSignup } from 'hooks/auth';
import { trackAmplitudeEvent } from 'config/amplitude';
import IconButton from '../IconButton';
import styles from './index.module.scss';

interface IEmailTypeForm {
  email: string;
}

const SignUpForm = () => {
  const { provider } = useProvider();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const onboardingData = useSelector(
    (state: RootState) => state.auth.onboardingData
  );
  const walletConnectProvider = useSelector(
    (state: RootState) => state.app.walletConnectProvider
  );
  const arcanaAuth = useSelector((state: RootState) => state.auth.arcanaAuth);
  const { register, handleSubmit, watch } = useForm<IEmailTypeForm>();

  const formValues = watch();

  const createOrganisation = useCreateOrganisation();
  const updateOrganisationImageHandler = useUpdateOrganisationImage();

  const metamaskGenerateNonce = useMetamaskGenerateNonce();
  const verifySignature = useVerifySignature();
  const saveUserOnboardData = useSaveUserOnboardData();
  const saveUserSignupObjectives = useSaveUserSignupObjectives();
  const saveOrganisationSignupObjectives =
    useSaveOrganisationSignupObjectives();
  const verifyUdSignature = useVerifyUdSignature();
  const { arcanaEmailSignupInit } = useArcanaSignup();
  const arcanaGenereateNonce = useArcanaGenerateNonce();

  useEffect(() => {
    (async () => {
      if (arcanaAuth.address) {
        const data = await arcanaGenereateNonce.mutateAsync(arcanaAuth.address);
        const signature = await signArcanaMessage(
          provider,
          data.message,
          arcanaAuth.address
        );
        await verifyAndSaveData(data, signature, arcanaAuth.address);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arcanaAuth.address]);

  const handleMetamaskSignup = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const { walletId, provider: ethereumProvider } =
          await getMetamaskAccountData();
        if (!walletId) {
          throw new Error('Please connect your wallet');
        }

        const data = await metamaskGenerateNonce.mutateAsync(walletId);

        const signature = await signMessage(ethereumProvider, data.message);
        if (!signature) {
          throw new Error('Please sign the message');
        }

        await verifyAndSaveData(data, signature, walletId);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleWalletConnectSignup = async () => {
    try {
      await walletConnectProvider.enable();
      const web3Provider = new providers.Web3Provider(walletConnectProvider);

      const accounts = await web3Provider.listAccounts();

      const { chainId } = await web3Provider.getNetwork();
      await walletConnectProvider.disconnect();

      // TODO - Use testnet and mainnet chain ID check
      if (chainId !== 137) {
        throw new Error('Please change the network to Polygon');
      }

      if (!accounts.length) {
        throw new Error('Please connect your wallet');
      }

      const data = await metamaskGenerateNonce.mutateAsync(accounts[0]);

      const signature = await signMessage(walletConnectProvider, data.message);
      if (!signature) {
        throw new Error('Please sign the message');
      }

      await verifyAndSaveData(data, signature, accounts[0]);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUdSignup = async () => {
    try {
      const ethereumProvider = detectMetamask();
      const data = await verifyUdSignature.mutateAsync();
      const account = await requestEthereumAccounts(ethereumProvider);
      await verifyAndSaveData(data, null, account, true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const verifyAndSaveData = async (
    data: any,
    signature: string | null,
    walletId: any,
    isUdSignup = false
  ) => {
    try {
      const {
        email,
        industry,
        name,
        objective,
        orgDescription,
        orgLogo,
        orgName,
        userType,
        workType,
      } = onboardingData;

      if (!isUdSignup) {
        await verifySignature.mutateAsync({
          isFirstTimeUser: data.isFirstTimeUser,
          signature,
          walletId,
          message: data.message,
        });
      }

      await saveUserOnboardData.mutateAsync({
        workType,
        name,
        email,
      });

      if (userType === 'Team') {
        const createOrgData = await createOrganisation.mutateAsync({
          description: orgDescription,
          industry,
          name: orgName,
          userId: data.user.userId.toString(),
        });

        if (orgLogo) {
          await updateOrganisationImageHandler(
            orgLogo,
            'profileImage',
            'profile',
            createOrgData.organisationId
          );
        }

        await saveOrganisationSignupObjectives.mutateAsync(objective);
        trackAmplitudeEvent('onb_org_suc');
      } else {
        await saveUserSignupObjectives.mutateAsync(objective);
        trackAmplitudeEvent('onb_individual_suc');
      }

      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const onSubmit = async (data: IEmailTypeForm) => {
    await arcanaEmailSignupInit(data.email);
  };

  if (error === 'Bad Request' || error === 'User Already Exist!') {
    toast(() => <LoginButton setError={setError} />);
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
          />
          <IconButton
            handleClick={handleWalletConnectSignup}
            icon={<WalletConnectIcon width={26.98} height={24.32} />}
            text="&nbsp; Wallet Connect"
          />
          <IconButton
            handleClick={handleUdSignup}
            icon={<UDIcon width={26.98} height={24.32} />}
            text="Unstoppable Domains"
          />
        </div>

        <p>Or create a wallet with your email and sign up</p>
        <form
          className={styles['sign-up-form-form']}
          onSubmit={handleSubmit(onSubmit)}
        >
          <span>Use</span>
          <input
            className={styles['sign-up-form-email']}
            defaultValue={onboardingData.email}
            type="email"
            {...register('email', { required: true })}
          />
          <input
            type="submit"
            value="Get link"
            className={styles['sign-up-form-submit']}
            disabled={
              !regexEmail.test(formValues.email || onboardingData.email)
            }
          />
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
