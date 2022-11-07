import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { editProfile } from 'actions/profile';
import { RootState } from 'reducers';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import { ReactComponent as EditIcon } from 'assets/illustrations/icons/edit.svg';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
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
      <div onClick={handleOpen}>
        <p>Share me</p>
      </div>
      {shareOpen ? <SocialShareModal handleClose={handleClose} /> : null}
      <ProfileImage picture={profile?.picture} />
      <NameDesignation title={profile?.title} user={profile?.user} />
      <ExperiencePoints />
      <ProfileAddressChain />
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
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <div className={styles['profile-image']}>
      <div className={styles['image-wrapper']}>
        <img
          alt="user"
          src={
            picture || getDefaultAvatarSrc(user?.name?.charAt(0).toUpperCase())
          }
        />
      </div>
    </div>
  );
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

const ProfileAddressChain = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const name = useSelector((state: RootState) => state.user.user?.name);
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  const { createProfile, deploying } = useProfileManage();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(profile?.profileSmartContractId ?? '');
    toast.success('Copied!');
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
