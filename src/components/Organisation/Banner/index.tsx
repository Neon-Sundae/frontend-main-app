/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FC, useCallback, useState } from 'react';
import gradient from 'assets/illustrations/organisation/gradient.svg';
import { ReactComponent as Instagram } from 'assets/illustrations/profile/instagram.svg';
import { ReactComponent as Linkedin } from 'assets/illustrations/profile/linkedin.svg';
import { ReactComponent as Twitter } from 'assets/illustrations/profile/twitter.svg';
import { ReactComponent as Bitcoin } from 'assets/illustrations/organisation/bitcoin.svg';
import { IOrganisation } from 'interfaces/organisation';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import _debounce from 'lodash/debounce';
import { editOrganisation } from 'actions/organisation';
import { RootState } from 'reducers';
import styles from './index.module.scss';
import OrganisationSocialModal from './OrganisationSocialModal';
import { useUpdateOrganisation } from './hooks';

interface IBanner {
  organisation: IOrganisation;
}

const Banner: FC<IBanner> = ({ organisation }) => {
  const dispatch = useDispatch();
  const isEditable = useSelector((state: RootState) => state.org.isEditable);
  const user = useSelector((state: RootState) => state.user.user);

  const [nameLocal, setNameLocal] = useState(organisation.name ?? 'Polkadot');
  const [website, setWebsite] = useState(organisation.website ?? '');
  const [open, setOpen] = useState(false);

  const updateOrganisation = useUpdateOrganisation(organisation.organisationId);

  const payload = {
    name: nameLocal,
    description: organisation.description,
    whitepaper: organisation.whitepaper,
    website,
  };

  const handleEdit = () => {
    if (isEditable) {
      dispatch(editOrganisation(false));
    } else {
      dispatch(editOrganisation(true));
    }
  };

  const handleDebounceFn = (nameTemp: string, value: string) => {
    updateOrganisation.mutate({
      ...payload,
      [nameTemp]: value,
    });
  };

  const debounceFn: any = useCallback(_debounce(handleDebounceFn, 1000), []);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNameLocal(value);
    debounceFn(name, value);
  };

  const handleWebsiteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWebsite(value);
    debounceFn(name, value);
  };

  const isFounder = () => {
    if (user?.userId === organisation.organisationUser[0].userId) return true;
    return false;
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.gradient}
        style={{ backgroundImage: `url(${gradient})` }}
      />
      <div className={styles.content}>
        <div className={styles.center}>
          {organisation.profileImage ? (
            <div className={styles.logo}>
              <img src={organisation.profileImage} alt="logo" />
            </div>
          ) : (
            <Bitcoin width={80} height={80} className={styles['logo-svg']} />
          )}
        </div>
        <div className={styles.center}>
          {isEditable ? (
            <input
              type="text"
              name="name"
              className={styles['organisation-name--edit']}
              value={nameLocal}
              onChange={handleNameChange}
            />
          ) : (
            <h2 className={styles['organisation-name']}>{organisation.name}</h2>
          )}
          {isFounder() ? (
            isEditable ? (
              <button className={styles.btn} onClick={handleEdit}>
                Save
              </button>
            ) : (
              <button className={styles.btn} onClick={handleEdit}>
                Edit Organisation
              </button>
            )
          ) : null}
        </div>
        <div className={clsx(styles.center, styles['org-socials'])}>
          <div className={styles['socials-row']}>
            <span className={styles['socials-header']}>Website:</span>
            {isEditable ? (
              <input
                type="text"
                name="website"
                className={styles['organisation-website--edit']}
                value={website}
                onChange={handleWebsiteChange}
              />
            ) : (
              <a
                href={website ?? '#'}
                target="_blank"
                rel="noreferrer"
                className={styles['organisation-website']}
              >
                {website}
              </a>
            )}
          </div>
          <div className={styles['socials-row']}>
            <span className={styles['socials-header']}>Socials:</span>
            {isEditable ? (
              <span
                className={styles['social-icon-container--edit']}
                onClick={() => setOpen(true)}
              >
                Add socials
              </span>
            ) : (
              <span className={styles['social-icon-container']}>
                {organisation.linkedin ? (
                  <a
                    href={`https://${organisation.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin width={30} height={30} />
                  </a>
                ) : null}
                {organisation.twitter ? (
                  <a
                    href={`https://${organisation.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Twitter width={30} height={30} />
                  </a>
                ) : null}
                {organisation.instagram ? (
                  <a
                    href={`https://${organisation.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Instagram width={30} height={30} />
                  </a>
                ) : null}
              </span>
            )}
          </div>
        </div>
      </div>
      {open && (
        <OrganisationSocialModal
          organisation={organisation}
          setOpen={setOpen}
        />
      )}
    </div>
  );
};

export default Banner;
