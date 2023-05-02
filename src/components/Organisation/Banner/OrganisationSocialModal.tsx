import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import Modal from 'components/Modal';
import GradientBtn from 'components/GradientBtn';
import { IOrganisation } from 'interfaces/organisation';
import isValidUrl from 'utils/isValidUrl';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useUpdateOrganisationDetails } from 'queries/organisation';
import styles from './index.module.scss';

interface IProfileSkills {
  setOpen: Dispatch<SetStateAction<boolean>>;
  organisation: IOrganisation;
}

const OrganisationSocialModal: FC<IProfileSkills> = ({
  setOpen,
  organisation,
}) => {
  const params = useParams();
  const updateOrganisationDetails = useUpdateOrganisationDetails(
    params.orgId,
    setOpen
  );

  const [linkedin, setLinkedin] = useState(organisation.linkedin ?? '');
  const [twitter, setTwitter] = useState(organisation.twitter ?? '');
  const [instagram, setInstagram] = useState(organisation.instagram ?? '');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (
      (twitter && !isValidUrl(twitter)) ||
      (linkedin && !isValidUrl(linkedin)) ||
      (instagram && !isValidUrl(instagram))
    )
      toast.error('Please input full url.');
    else
      updateOrganisationDetails.mutate({
        linkedin,
        instagram,
        twitter,
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

export default OrganisationSocialModal;
