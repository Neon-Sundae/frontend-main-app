import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import userImage from 'assets/images/profile/user-image.png';
import { ReactComponent as FoundersLabIcon } from 'assets/illustrations/icons/founderslab.svg';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import styles from './index.module.scss';
import useUpdateProfileDetails from './hooks';

const BasicDetailsEdit: FC = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);
  const user = useSelector((state: RootState) => state.user.user);

  const [name, setName] = useState(user?.name ?? 'Rachel Green');
  const [title, setTitle] = useState(profile?.title ?? 'Product Designer');
  const [bio, setBio] = useState(
    profile?.description ??
      `Lorem imsum text is here imsum text is here imsum text is here imsum
  text is here imsum text is here imsum text is here imsum text is here
  imsum.`
  );

  const updateProfileDetails = useUpdateProfileDetails();

  const handleSave = () => {
    updateProfileDetails({
      userId: user?.userId,
      profileId: profile?.profileId,
      name,
      title,
      description: bio,
    });
  };

  return (
    <>
      <ProfileImage />
      <NameDesignation
        title={title}
        setTitle={setTitle}
        name={name}
        setName={setName}
      />
      <ExperiencePoints />
      <ProfileAddressChain />
      <ProfileBio bio={bio} setBio={setBio} />
      <SaveProfile handleSave={handleSave} />
    </>
  );
};

interface ISaveProfile {
  handleSave: () => void;
}

const SaveProfile: FC<ISaveProfile> = ({ handleSave }) => {
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
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}

const NameDesignation: FC<INameDesignation> = ({
  title,
  setTitle,
  name,
  setName,
}) => {
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

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
        value={title}
        onChange={handleTitleChange}
      />
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
  bio: string;
  setBio: Dispatch<SetStateAction<string>>;
}

const ProfileBio: FC<IProfileBio> = ({ bio, setBio }) => {
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setBio(e.target.value);

  return (
    <textarea
      className={styles['profile-bio']}
      maxLength={140}
      value={bio}
      onChange={handleDescriptionChange}
    />
  );
};

export default BasicDetailsEdit;
