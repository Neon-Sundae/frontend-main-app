import { FC } from 'react';
import userImage from 'assets/images/profile/user-image.png';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import { ReactComponent as EditIcon } from 'assets/illustrations/icons/edit.svg';
import { useDispatch, useSelector } from 'react-redux';
import { editProfile } from 'actions/profile';
import { RootState } from 'reducers';
import styles from './index.module.scss';

const BasicDetails: FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  return (
    <>
      <ProfileImage />
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

const ProfileImage: FC = () => {
  return (
    <div className={styles['profile-image']}>
      <div className={styles['image-wrapper']}>
        <img alt="user" src={userImage} />
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
      <h5 className={styles.designation}>{title ?? 'Product Designer'}</h5>
    </div>
  );
};

const ExperiencePoints: FC = () => {
  return (
    <div className={styles['experience-points']}>
      <span className={styles.value}>
        1230 <span className={styles.label}>XP</span>
      </span>
    </div>
  );
};

const ProfileAddressChain: FC = () => {
  return (
    <div className={styles['profile-address-chain']}>
      <div className={styles['address-container']}>
        <FoundersLabIcon width={28} height={28} />
        <p className={styles['profile-address']}>6j6p2W....TzLSHWQfFc</p>
        <i className="material-icons-200">content_copy</i>
      </div>
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
