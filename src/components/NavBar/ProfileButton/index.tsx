import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import clsx from 'clsx';
import { RootState } from 'reducers';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { useQuery } from '@tanstack/react-query';
import { fillProfileData } from 'actions/profile';
import { normalizeSkills } from 'utils/normalizeSkills';
import { fillProfileSkillsData } from 'actions/skills';
import styles from './index.module.scss';
import DisconnectModal from './DisconnectModal';

const ProfileButton: FC = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { profileId } = useParams();

  const { user } = useSelector((state: RootState) => state.user);

  const currentUserProfilePicture = useSelector(
    (state: RootState) => state.profile.currentUserProfilePicture
  );

  const { data, refetch } = useQuery(
    ['user-profile-data', profileId],
    () =>
      fetch(`${config.ApiBaseUrl}/profile/${profileId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }).then(response => response.json()),
    {
      enabled: false,
      refetchOnMount: false,
    }
  );

  useEffect(() => {
    if (profileId) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  useEffect(() => {
    if (data) {
      dispatch(fillProfileData(data));
      const skillsData = normalizeSkills(data?.profileSkills);
      dispatch(fillProfileSkillsData(skillsData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const pictureFunc = () => {
    return (
      currentUserProfilePicture ||
      getDefaultAvatarSrc(user?.name?.charAt(0).toUpperCase())
    );
  };

  const handleNavigation = () => {
    dispatch(fillProfileData(data));
    const skillsData = normalizeSkills(data?.profileSkills);
    dispatch(fillProfileSkillsData(skillsData));

    navigate(`/profile/${user?.userId}`);
  };

  const getFormattedWalletId = () => {
    if (user?.walletId) {
      return `${user.walletId.slice(0, 6)}...${user.walletId.slice(
        // eslint-disable-next-line no-unsafe-optional-chaining
        user.walletId.length - 6,
        user.walletId.length
      )}`;
    }

    return '';
  };

  const getFormattedDomainName = () => {
    if (user?.domain) {
      return `${user.domain.slice(0, 6)}...${user.domain.slice(
        user.domain.length - 6,
        user.domain.length
      )}`;
    }
    return '';
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles['image-cont']}
        title="Visit Profile"
        onClick={handleNavigation}
      >
        <div className={styles.image}>
          <img src={pictureFunc()} alt="your profile" />
        </div>
        <p className={styles['profile-text']}>Profile</p>
      </div>
      <div
        id="navbar-wallet-information"
        className={styles.content}
        title="Wallet Information"
        onClick={handleOpen}
      >
        <p className={styles['navbar-username']}>{user?.name}</p>
        <span
          className={styles['navbar-wallet-address']}
          title={user?.domain ? user.domain : user?.walletId}
        >
          {user?.domain ? getFormattedDomainName() : getFormattedWalletId()}
        </span>
        <div className={clsx(styles['text--secondary'], styles['text--align'])}>
          <span>Connected Wallet</span>
          <WalletConnIndicator />
        </div>
      </div>
      {open && (
        <DisconnectModal
          handleClose={handleClose}
          pictureFunc={pictureFunc}
          getFormattedWalletId={getFormattedWalletId}
          getFormattedDomainName={getFormattedDomainName}
        />
      )}
      <Toaster />
    </div>
  );
};

const WalletConnIndicator: FC = () => {
  return (
    <div className={styles['indicator-outer']}>
      <div className={styles['indicator-fill']} />
    </div>
  );
};

export default ProfileButton;
