/* eslint-disable no-unneeded-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/extensions */
import { ChangeEvent, FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import { IOrganisation, IOwnerData } from 'interfaces/organisation';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from 'reducers';
import _debounce from 'lodash/debounce';
import { ReactComponent as EditIcon } from 'assets/illustrations/icons/edit.svg';

import { useUpdateOrganisationDetails } from 'queries/organisation';
import CustomButtonModal from '../CustomButtonModal';
import styles from './index.module.scss';

interface IBasicDetails {
  organisation: IOrganisation;
  owner: IOwnerData | undefined;
}

const BasicDetails: FC<IBasicDetails> = ({ organisation, owner }) => {
  const params = useParams();
  const [whitepaper, setWhitepaper] = useState(
    organisation.whitepaper ?? 'https://defi.xyz/whitepaper.html'
  );
  const [description, setDescription] = useState(
    organisation.description ?? ''
  );
  const [open, setOpen] = useState(false);

  const isEditable = useSelector((state: RootState) => state.org.isEditable);

  const updateOrganisationDetails = useUpdateOrganisationDetails(params.orgId);

  const payload = {
    name: organisation.name,
    description,
    whitepaper,
    website: organisation.website,
  };

  const handleDebounceFn = (name: string, value: string) => {
    updateOrganisationDetails.mutate({
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

  const handleCustomButtonClick = () => {
    if (isEditable) setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.content}>
      <section className={styles.section}>
        <div className={styles['organisation-name-description']}>
          <span>
            <h3 className={styles['organisation-heading']}>
              Project Description
            </h3>

            <button
              onClick={handleCustomButtonClick}
              className={clsx(
                styles.button,
                isEditable && styles['button--edit']
              )}
            >
              {organisation.customButtonLink && (
                <a
                  href={`${organisation.customButtonLink}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {organisation.customButtonLabel ?? 'Custom Button'}
                </a>
              )}

              {!organisation.customButtonLink && (
                <>{organisation.customButtonLabel ?? 'Custom Button'}</>
              )}

              {isEditable && <EditIcon width={50} height={50} />}
            </button>
          </span>

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
      {open && (
        <CustomButtonModal
          handleClose={handleClose}
          customButtonLabel={organisation.customButtonLabel || ''}
          customButtonLink={organisation.customButtonLink || ''}
        />
      )}
    </div>
  );
};

interface ICreatedBy {
  owner: IOwnerData;
}

const CreatedBy: FC<ICreatedBy> = ({ owner }) => {
  const navigate = useNavigate();

  const {
    user: { name, profile },
  } = owner;

  const handleNavigation = () => {
    navigate(`/profile/${profile.profileId}`);
  };

  return (
    <div className={styles['organisation-profile-container']}>
      <div className={styles['image-container']}>
        <img
          src={
            profile.picture ||
            getDefaultAvatarSrc(name?.charAt(0).toUpperCase())
          }
          alt="profile"
        />
      </div>
      <p className={clsx(styles.text, styles['text--primary'])}>{name}</p>
      <p className={clsx(styles.text, styles['text--secondary'])}>
        {profile.title ?? ''}
      </p>
      <p className={clsx(styles.text, styles['text--addn'])}>
        Profile created on{' '}
        {new Date(profile.createdAt).toLocaleDateString('en-GB')}
      </p>
      <button className={styles.btn} onClick={handleNavigation}>
        View Profile
      </button>
    </div>
  );
};

export default BasicDetails;
