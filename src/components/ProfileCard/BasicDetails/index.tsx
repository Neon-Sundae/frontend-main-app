import { FC, useState, SetStateAction, Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { editProfile } from 'actions/profile';
import { RootState } from 'reducers';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import { ReactComponent as EditIcon } from 'assets/illustrations/icons/edit.svg';
import { ReactComponent as ShareIcon } from 'assets/illustrations/icons/share.svg';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import clickEventBeacon from 'utils/analyticsFns/clickEventBeacon';
import styles from './index.module.scss';
import useProfileManage from './hooks';
import SocialShareModal from '../SocialShare';

const BasicDetails: FC = () => {
  const { profileId } = useParams();
  const profile = useSelector((state: RootState) => state.profile.profile);
  const user = useSelector((state: RootState) => state.user.user);
  const [shareOpen, setShareOpen] = useState(false);

  const showEditIcon = () => {
    if (profileId && user) {
      if (user.userId === parseInt(profileId, 10)) {
        return <EditIconContainer id="edit-icon" />;
      }
    }

    return null;
  };

  const handleClose = () => {
    setShareOpen(false);
  };

  const handleOpen = () => {
    setShareOpen(true);
  };
  return (
    <>
      <ShareIcon
        onClick={handleOpen}
        className={styles['share-icon']}
        width={20}
        height={20}
      />
      {shareOpen ? <SocialShareModal handleClose={handleClose} /> : null}
      <ProfileImage picture={profile?.picture} />
      <NameDesignation title={profile?.title} user={profile?.user} />
      <ExperiencePoints />
      <ProfileAddressChain setShare={val => setShareOpen(val)} />
      <ProfileBio description={profile?.description} />
      {showEditIcon()}
    </>
  );
};

interface IEditContainer {
  id: string;
}

const EditIconContainer: FC<IEditContainer> = ({ id }) => {
  const dispatch = useDispatch();

  const handleEdit = () => dispatch(editProfile(true));

  return (
    <EditIcon
      id={id}
      width={50}
      height={50}
      className={styles['edit-icon']}
      onClick={handleEdit}
    />
  );
};

interface ProfileImageProps {
  picture?: string | null;
}

const ProfileImage: FC<ProfileImageProps> = ({ picture }) => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  return (
    <div className={styles['profile-image']}>
      <div className={styles['image-wrapper']}>
        <img
          alt="user"
          src={
            picture ||
            getDefaultAvatarSrc(profile?.user?.name?.charAt(0).toUpperCase())
          }
        />
      </div>
    </div>
  );
};

ProfileImage.defaultProps = {
  picture: undefined,
};

interface INameDesignation {
  title: string | null | undefined;
  user:
    | {
        name: string | null;
      }
    | undefined;
}

const NameDesignation: FC<INameDesignation> = ({ title, user }) => {
  return (
    <div className={styles['name-designation']}>
      <h2 className={styles.name}>{user?.name ?? ''}</h2>
      <h5 className={styles.designation}>{title ?? ''}</h5>
    </div>
  );
};

const ExperiencePoints = () => {
  const { xp } = useSelector((state: RootState) => state.profile);

  return (
    <div className={styles['experience-points']}>
      <span className={styles.value}>
        {Number(xp).toLocaleString()} <span className={styles.label}>XP</span>
      </span>
    </div>
  );
};

interface IProfileAddressChain {
  setShare: Dispatch<SetStateAction<boolean>>;
  // handleOpen: () => void;
}

const ProfileAddressChain: FC<IProfileAddressChain> = ({ setShare }) => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const name = useSelector((state: RootState) => state.user.user?.name);
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (showShareModal) handleShareOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showShareModal]);

  const { createProfile, deploying } = useProfileManage();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(profile?.profileSmartContractId ?? '');
    toast.success('Copied!');
  };

  const handleShareOpen = () => {
    setShare(true);
  };

  const handleMintOnChain = () => {
    clickEventBeacon(walletId);
    createProfile(name, profile?.title || 'Product Designer', walletId);
  };

  const renderByDeployingState = () => {
    switch (deploying) {
      case 'deploying':
        return (
          <div
            className={styles['profile-address-chain']}
            id="profile-address-chain"
          >
            <p className={styles['profile-address']}>
              Minting...⏳ it takes some seconds
            </p>
          </div>
        );
      case 'deploy_success':
        if (!showShareModal) setShowShareModal(true);
        return (
          <div
            className={styles['profile-address-chain']}
            id="profile-address-chain"
          >
            <p className={styles['profile-address']}>
              Almost there...Fetching data
            </p>
          </div>
        );
      default:
        return (
          <div
            className={styles['profile-address-chain']}
            id="profile-address-chain"
          >
            {profile?.profileSmartContractId ===
              '0x0000000000000000000000000000000000000000' ||
            profile?.profileSmartContractId === null ||
            profile?.profileSmartContractId === '' ? (
              <div
                className={styles['address-container']}
                id="profile-address-container"
                style={{ cursor: 'pointer' }}
                onClick={handleMintOnChain}
              >
                <span className="material-icons" style={{ color: '#FAA5B9' }}>
                  close
                </span>
                <p className={styles['profile-address']}>Mint on Chain</p>
                <div />
              </div>
            ) : (
              <div className={styles['address-container']}>
                <FoundersLabIcon width={28} height={28} />
                <p className={styles['profile-address']}>
                  {profile?.profileSmartContractId?.slice(0, 6)}...
                  {profile?.profileSmartContractId?.slice(
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    profile?.profileSmartContractId.length - 6,
                    profile?.profileSmartContractId.length
                  )}
                </p>
                <i
                  className="material-icons-200"
                  style={{ cursor: 'pointer' }}
                  onClick={handleCopyAddress}
                >
                  content_copy
                </i>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={styles['profile-address-chain']} id="profile-address-chain">
      {
        renderByDeployingState()
        /* {profile?.profileSmartContractId === 
        '0x0000000000000000000000000000000000000000' ||
      profile?.profileSmartContractId === null ||
      profile?.profileSmartContractId === '' ? (
        <div
          className={styles['address-container']}
          id="profile-address-container"
          style={{ cursor: 'pointer' }}
          onClick={() => createProfile(name, profile?.title, walletId)}
        >
          <span className="material-icons" style={{ color: '#FAA5B9' }}>
            close
          </span>
          <p className={styles['profile-address']}>Mint on Chain</p>
          <div />
        </div>
      ) : (
        <div className={styles['address-container']}>
          <FoundersLabIcon width={28} height={28} />
          <p className={styles['profile-address']}>
            {profile?.profileSmartContractId?.slice(0, 6)}...
            {profile?.profileSmartContractId?.slice(
              // eslint-disable-next-line no-unsafe-optional-chaining
              profile?.profileSmartContractId.length - 6,
              profile?.profileSmartContractId.length
            )}
          </p>
          <i className="material-icons-200" onClick={handleCopyAddress}>
            content_copy
          </i>
        </div>
      )} */
      }
      <p className={styles['sync-text']}>
        Sync On Chain <i className="material-icons-200">sync</i>
      </p>
    </div>
  );
};

interface IProfileBio {
  description: string | null | undefined;
}

const ProfileBio: FC<IProfileBio> = ({ description }) => {
  return (
    <p className={styles['profile-bio']}>{description || 'Add your bio'}</p>
  );
};

export default BasicDetails;
