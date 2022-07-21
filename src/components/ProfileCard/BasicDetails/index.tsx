import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { editProfile } from 'actions/profile';
import { RootState } from 'reducers';
import userImage from 'assets/images/profile/user-image.png';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import { ReactComponent as EditIcon } from 'assets/illustrations/icons/edit.svg';
import styles from './index.module.scss';
import useProfileManage from './hooks';

const BasicDetails: FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  return (
    <>
      <ProfileImage picture={profile?.picture} />
      <NameDesignation title={profile?.title} />
      <ExperiencePoints />
      <ProfileAddressChain />
      <ProfileBio description={profile?.description} />
      <EditIconContainer />
    </>
  );
};

const EditIconContainer: FC = () => {
  const dispatch = useDispatch();

  const handleEdit = () => dispatch(editProfile(true));

  return (
    <EditIcon
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
  return (
    <div className={styles['profile-image']}>
      <div className={styles['image-wrapper']}>
        <img alt="user" src={picture ? picture : userImage} />
      </div>
    </div>
  );
};

interface INameDesignation {
  title: string | null | undefined;
}

const NameDesignation: FC<INameDesignation> = ({ title }) => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className={styles['name-designation']}>
      <h2 className={styles.name}>{user?.name ?? 'Rachel Green'}</h2>
      <h5 className={styles.designation}>{title ?? 'Add title'}</h5>
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

  const { profileContractAddress, profile } = useSelector((state: RootState) => state.profile);
  const name = useSelector((state: RootState) => state.user.user?.name);
  const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  const { createProfile } = useProfileManage();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(profileContractAddress);
    toast.success("Copied!");
  }

  return (
    <div className={styles['profile-address-chain']}>
      {
        profileContractAddress === "0x0000000000000000000000000000000000000000" ? (
          <div className={styles['address-container']} style={{ cursor: 'pointer' }} onClick={() => createProfile(name, profile?.title, walletId)}>
            <span className="material-icons" style={{ color: '#FAA5B9' }}>close</span>
            <p className={styles['profile-address']}>
              Mint on Chain
            </p>
            <div></div>
          </div>
        ) : (
          <div className={styles['address-container']}>
            <FoundersLabIcon width={28} height={28} />
            <p className={styles['profile-address']}>
              {profileContractAddress?.slice(0, 6)}...{profileContractAddress?.slice(profileContractAddress.length - 6, profileContractAddress.length)}
            </p>
            <i className="material-icons-200" onClick={handleCopyAddress}>content_copy</i>
          </div>
        )
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
    <p className={styles['profile-bio']}>
      {description ??
        `Lorem imsum text is here imsum text is here imsum text is here imsum
      text is here imsum text is here imsum text is here imsum text is here
      imsum.`}
    </p>
  );
};

export default BasicDetails;
