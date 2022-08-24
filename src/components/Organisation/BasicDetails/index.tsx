/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/extensions */
import { ChangeEvent, FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import { IOrganisation } from 'interfaces/organisation';
import ProfileImage from 'assets/images/profile/user-image.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'reducers';
import _debounce from 'lodash/debounce';
import styles from './index.module.scss';
import { useUpdateOrganisation } from '../Banner/hooks';

interface IBasicDetails {
  organisation: IOrganisation;
}

const BasicDetails: FC<IBasicDetails> = ({ organisation }) => {
  const [whitepaper, setWhitepaper] = useState(
    organisation.whitepaper ?? 'https://defi.xyz/whitepaper.html'
  );
  const [description, setDescription] = useState(
    organisation.description ?? ''
  );

  const isEditable = useSelector((state: RootState) => state.org.isEditable);

  const updateOrganisation = useUpdateOrganisation(organisation.organisationId);

  const payload = {
    name: organisation.name,
    description,
    whitepaper,
    website: organisation.website,
  };

  const handleDebounceFn = (name: string, value: string) => {
    updateOrganisation.mutate({
      ...payload,
      [name]: value,
    });
  };

  const debounceFn: any = useCallback(_debounce(handleDebounceFn, 1000), []);

  const handleWhitepaperChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWhitepaper(value);
    debounceFn(name, value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDescription(value);
    debounceFn(name, value);
  };

  return (
    <div className={styles.content}>
      <section className={styles.section}>
        <div className={styles['organisation-profile-created']}>
          <h3 className={styles['organisation-heading']}>Profile Created By</h3>
          <CreatedBy organisation={organisation} />
        </div>
        <div className={styles['organisation-name-description']}>
          <h3 className={styles['organisation-heading']}>
            Company Description
          </h3>
          <div
            className={clsx(
              styles.description,
              isEditable && styles['description--edit']
            )}
          >
            {isEditable ? (
              <textarea
                name="description"
                className={styles['description--textarea']}
                value={description}
                onChange={handleDescriptionChange}
              />
            ) : (
              <p>{description}</p>
            )}
          </div>
          <div className={styles['whitepaper-container']}>
            <h3
              className={clsx(
                styles['organisation-heading'],
                styles['organisation-heading--whitepaper']
              )}
            >
              White Paper
            </h3>
            {isEditable ? (
              <input
                type="text"
                name="whitepaper"
                className={styles['organisation-whitepaper-edit']}
                value={whitepaper}
                onChange={handleWhitepaperChange}
              />
            ) : (
              <a
                href={organisation.whitepaper ?? '#'}
                target="_blank"
                rel="noreferrer"
                className={styles['organisation-whitepaper-link']}
              >
                {whitepaper}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

interface ICreatedBy {
  organisation: IOrganisation;
}

const CreatedBy: FC<ICreatedBy> = ({ organisation }) => {
  const navigate = useNavigate();

  const { organisationUser } = organisation;
  const {
    name,
    profile: { title, createdAt, profileId, picture },
  } = organisationUser[0];

  const handleNavigation = () => {
    navigate(`../../profile/${profileId}`);
  };

  return (
    <div className={styles['organisation-profile-container']}>
      <div className={styles['image-container']}>
        <img src={picture ?? ProfileImage} alt="Profile" />
      </div>
      <p className={clsx(styles.text, styles['text--primary'])}>{name}</p>
      <p className={clsx(styles.text, styles['text--secondary'])}>
        {title ?? ''}
      </p>
      <p className={clsx(styles.text, styles['text--addn'])}>
        Profile created on {new Date(createdAt).toLocaleDateString('en-GB')}
      </p>
      <button className={styles.btn} onClick={handleNavigation}>
        View Profile
      </button>
    </div>
  );
};

export default BasicDetails;
