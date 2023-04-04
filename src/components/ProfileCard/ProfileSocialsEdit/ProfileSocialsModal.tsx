import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import Modal from 'components/Modal';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import GradientBtn from 'components/GradientBtn';
import isValidUrl from 'utils/isValidUrl';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useFetchProfileDetailsWrapper } from 'queries/profile';
import styles from './index.module.scss';
import { useUpdateProfileSocial, useUpdateUserDiscordUserName } from './hooks';

interface IProfileSkills {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileSocialsModal: FC<IProfileSkills> = ({ setOpen }) => {
  const params = useParams();
  const profileData = useFetchProfileDetailsWrapper(params.profileId);
  const user = useSelector((state: RootState) => state.user.user);

  const [portfolio, setPortfolio] = useState(profileData?.portfolio ?? '');
  const [linkedin, setLinkedin] = useState(profileData?.linkedin ?? '');
  const [twitter, setTwitter] = useState(profileData?.twitter ?? '');
  const [instagram, setInstagram] = useState(profileData?.instagram ?? '');
  const [github, setGithub] = useState(profileData?.github ?? '');
  const [discordId, setDiscordId] = useState(user?.discordId ?? '');

  const updateProfileSocial = useUpdateProfileSocial();
  const updateDiscordUserName = useUpdateUserDiscordUserName();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (
      (twitter && !isValidUrl(twitter)) ||
      (linkedin && !isValidUrl(linkedin)) ||
      (instagram && !isValidUrl(instagram)) ||
      (portfolio && !isValidUrl(portfolio)) ||
      (github && !isValidUrl(github))
    )
      toast.error('Please input full url.');
    else
      updateProfileSocial({
        portfolio,
        linkedin,
        twitter,
        instagram,
        github,
        setOpen,
      });
    if (user && user.userId)
      updateDiscordUserName({
        userId: user.userId,
        discordId,
      });
  };

  return (
    <Modal onClose={handleClose}>
      <h1 className={styles['social-title']}>Socials</h1>
      <SocialInput
        title="Twitter"
        value={twitter}
        handleChange={e => setTwitter(e.target.value)}
      />
      <SocialInput
        title="Instagram"
        value={instagram}
        handleChange={e => setInstagram(e.target.value)}
      />
      <SocialInput
        title="LinkedIn"
        value={linkedin}
        handleChange={e => setLinkedin(e.target.value)}
      />
      <SocialInput
        title="Github"
        value={github}
        handleChange={e => setGithub(e.target.value)}
      />
      <SocialInput
        title="Website"
        value={portfolio}
        handleChange={e => setPortfolio(e.target.value)}
      />
      <SocialInput
        title="Discord"
        value={discordId}
        handleChange={e => setDiscordId(e.target.value)}
      />
      <GradientBtn label="Save" onClick={handleSave} />
    </Modal>
  );
};

interface ISocialInput {
  title: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SocialInput: FC<ISocialInput> = ({ title, value, handleChange }) => {
  return (
    <div className={styles['social-input']}>
      <span className={styles['social-input-title']}>{title}</span>
      <input
        type="text"
        placeholder="Write address here"
        className={styles['social-input-field']}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default ProfileSocialsModal;
