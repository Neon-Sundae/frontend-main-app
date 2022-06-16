import { ChangeEvent, FC, useState } from 'react';
import userImage from 'assets/images/profile/user-image.png';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { editProfile } from 'actions/profile';
import styles from './index.module.scss';

const BasicDetailsEdit: FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  return (
    <>
      <ProfileImage />
      <NameDesignation title={profile?.title} />
      <ExperiencePoints />
      <ProfileAddressChain />
      <ProfileBio description={profile?.description} />
      <SaveProfile />
    </>
  );
};

const SaveProfile: FC = () => {
  const dispatch = useDispatch();

  const handleSave = () => dispatch(editProfile(false));

  return (
    <div className={styles['save-profile']} onClick={handleSave}>
      <span className={styles.text}>Save</span>
      <i className="material-icons">done</i>
    </div>
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
  const [name, setName] = useState(user?.name ?? 'Rachel Green');
  const [localTitle, setLocalTitle] = useState(title ?? 'Product Designer');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLocalTitle(e.target.value);

  return (
    <div className={styles['name-designation']}>
      <input
        type="text"
        className={styles.name}
        value={name}
        onChange={handleNameChange}
      />
      <input
        type="text"
        className={styles.designation}
        value={localTitle}
        onChange={handleTitleChange}
      />
      {/* <h2 className={styles.name}>{user?.name ?? 'Rachel Green'}</h2>
      <h5 className={styles.designation}>Product Designer</h5> */}
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
  const [localDescription, setLocalDescription] = useState(
    description ??
      'Lorem imsum text is here imsum text is here imsum text is here imsum text is here imsum text is here imsum text is here imsum text is here imsum.'
  );

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setLocalDescription(e.target.value);

  return (
    <textarea
      className={styles['profile-bio']}
      maxLength={140}
      value={localDescription}
      onChange={handleDescriptionChange}
    />
  );
};

export default BasicDetailsEdit;
