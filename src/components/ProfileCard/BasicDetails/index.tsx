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
import { useFetchProfileDetailsWrapper } from 'queries/profile';
import { useFetchUserDetailsWrapper } from 'queries/user';
import styles from './index.module.scss';
import useProfileManage from './hooks';
import SocialShareModal from '../SocialShare';

const BasicDetails: FC = () => {
  const params = useParams();
  const userData = useFetchUserDetailsWrapper();
  const profileData = useFetchProfileDetailsWrapper(params.profileId);
  const [shareOpen, setShareOpen] = useState(false);

  // * This condition's working to differentiate between the logged in user and the profile user
  const isLoggedInUser = userData?.user.userId === profileData?.userId;

  const showEditIcon = () => {
    if (!isLoggedInUser) {
      return null;
    }

    if (profileData?.profileId && userData) {
      return <EditIconContainer id="edit-icon" />;
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
      <ProfileImage
        picture={profileData?.picture}
        username={profileData?.user?.name}
      />
      <NameDesignation title={profileData?.title} user={profileData?.user} />
      <ExperiencePoints />
      <ProfileAddressChain
        setShare={val => setShareOpen(val)}
        profileSmartContractId={profileData?.profileSmartContractId}
        title={profileData?.title}
      />
      <ProfileBio description={profileData?.description} />
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
  username: string | null | undefined;
}

const ProfileImage: FC<ProfileImageProps> = ({ picture, username }) => {
  return (
    <div className={styles['profile-image']}>
      <div className={styles['image-wrapper']}>
        <img
          alt="user"
          src={
            picture || getDefaultAvatarSrc(username?.charAt(0).toUpperCase())
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
  profileSmartContractId: string | null | undefined;
  title: string | null | undefined;
  setShare: Dispatch<SetStateAction<boolean>>;
}

const ProfileAddressChain: FC<IProfileAddressChain> = ({
  profileSmartContractId,
  title,
  setShare,
}) => {
  const name = useSelector((state: RootState) => state.user.user?.name);
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (showShareModal) handleShareOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showShareModal]);

  const { createProfile, deploying } = useProfileManage();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(profileSmartContractId || '');
    toast.success('Copied!');
  };

  const handleShareOpen = () => {
    setShare(true);
  };

  const handleMintOnChain = () => {
    clickEventBeacon(walletId);
    createProfile(name, title || 'Product Designer', walletId);
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
            {profileSmartContractId ===
              '0x0000000000000000000000000000000000000000' ||
            profileSmartContractId === null ||
            profileSmartContractId === '' ? (
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
                  {profileSmartContractId?.slice(0, 6)}...
                  {profileSmartContractId?.slice(
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    profileSmartContractId.length - 6,
                    profileSmartContractId.length
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
      {renderByDeployingState()}
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
