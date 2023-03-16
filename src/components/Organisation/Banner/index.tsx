/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FC, useCallback, useState, useRef } from 'react';
import gradient from 'assets/illustrations/organisation/gradient.png';
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
import { ReactComponent as EditIcon } from 'assets/illustrations/icons/edit.svg';
import Background from 'assets/illustrations/profile/pp-bg.png';
import { Toaster } from 'react-hot-toast';
import StartPrjModal from 'components/StartPrjModal';
import { useParams } from 'react-router-dom';
import isOrganisationMember from 'utils/accessFns/isOrganisationMember';
import useFetchOrganisationOwnerManager from 'hooks/useFetchOrganisationOwnerManager';
import styles from './index.module.scss';
import OrganisationSocialModal from './OrganisationSocialModal';
import { useUpdateOrganisation, useUpdateOrganisationImage } from './hooks';

interface IBanner {
  organisation: IOrganisation;
}

const Banner: FC<IBanner> = ({ organisation }) => {
  const { orgId } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefCover = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const isEditable = useSelector((state: RootState) => state.org.isEditable);
  const user = useSelector((state: RootState) => state.user.user);

  const [nameLocal, setNameLocal] = useState(organisation.name ?? '');
  const [website, setWebsite] = useState(organisation.website ?? '');
  const [open, setOpen] = useState(false);
  const [orgLogoFileData, setOrgLogoFileData] = useState<File | null>(null);
  const [orgCoverFileData, setCoverLogoFileData] = useState<File | null>(null);
  const [showPrjModal, setShowPrjModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const updateOrganisation = useUpdateOrganisation(organisation.organisationId);

  const { members } = useFetchOrganisationOwnerManager(orgId);

  const updateOrganisationImageHandler = useUpdateOrganisationImage();
  const payload = {
    name: nameLocal,
    description: organisation.description,
    whitepaper: organisation.whitepaper,
    website,
  };

  const handleEdit = () => {
    dispatch(editOrganisation(true));
  };

  const handleSave = async () => {
    if (isEditable) {
      setImageLoading(true);
      if (orgCoverFileData) {
        await updateOrganisationImageHandler(
          orgCoverFileData,
          'bannerImage',
          'banner',
          organisation.organisationId
        );
      }
      if (orgLogoFileData) {
        await updateOrganisationImageHandler(
          orgLogoFileData,
          'profileImage',
          'profile',
          organisation.organisationId
        );
      }
      setImageLoading(false);
      dispatch(editOrganisation(false));
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

  const handleOrgLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) setOrgLogoFileData(files[0]);
  };

  const handleOrgCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    if (files) setCoverLogoFileData(files[0]);
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    if (isEditable) {
      if (inputRef.current) inputRef.current.click();
    }
  };

  const handleOrgCoverClick = (e: any) => {
    e.preventDefault();
    if (isEditable) {
      if (inputRefCover.current) inputRefCover.current.click();
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <input
        ref={inputRefCover}
        id="bannerImage"
        className={styles.attachments}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleOrgCoverChange}
      />
      <div
        className={styles.gradient}
        style={
          orgCoverFileData
            ? {
                backgroundImage: `url(${URL.createObjectURL(
                  orgCoverFileData
                )})`,
              }
            : {
                backgroundImage: `url(${organisation.bannerImage ?? gradient})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }
        }
      />
      <div className={styles.content}>
        <div className={styles.center}>
          <input
            ref={inputRef}
            id="profileImage"
            className={styles.attachments}
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleOrgLogoChange}
          />
          <OrgLogo
            organisation={organisation}
            isEditable={isEditable}
            handleClick={handleClick}
            orgLogoFileData={orgLogoFileData}
          />
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
          {isOrganisationMember(user, members) ? (
            isEditable ? (
              <button
                className={styles.btn}
                onClick={handleSave}
                disabled={imageLoading}
              >
                {imageLoading ? 'Saving...' : 'Save'}
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
                href={`https://${website}` ?? '#'}
                target="_blank"
                rel="noreferrer"
                className={styles['organisation-website']}
              >
                {website}
              </a>
            )}
          </div>
          <div className={styles['socials-row']}>
            {isEditable ? (
              <span
                className={styles['social-icon-container--edit']}
                onClick={() => setOpen(true)}
              >
                Add socials
              </span>
            ) : (
              <span className={styles['social-icon-container']}>
                {organisation.instagram ? (
                  <a
                    href={`${organisation.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Instagram width={30} height={30} />
                  </a>
                ) : null}
                {organisation.linkedin ? (
                  <a
                    href={`${organisation.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin width={30} height={30} />
                  </a>
                ) : null}
                {organisation.twitter ? (
                  <a
                    href={`${organisation.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Twitter width={30} height={30} />
                  </a>
                ) : null}
              </span>
            )}
          </div>
          {isEditable && (
            <button
              onClick={handleOrgCoverClick}
              className={styles.coverPicBtn}
            >
              <EditIcon width={50} height={50} />
            </button>
          )}
        </div>
      </div>
      {open && (
        <OrganisationSocialModal
          organisation={organisation}
          setOpen={setOpen}
        />
      )}
      {showPrjModal && <StartPrjModal onClose={() => setShowPrjModal(false)} />}
    </div>
  );
};

interface IOrgLogo {
  organisation: IOrganisation;
  isEditable: boolean;
  handleClick: any;
  orgLogoFileData: any;
}

const OrgLogo: FC<IOrgLogo> = ({
  organisation,
  isEditable,
  handleClick,
  orgLogoFileData,
}) => {
  return (
    <div>
      {organisation.profileImage ? ( // checks for images from db
        <div className={styles.logo} onClick={handleClick}>
          {/* to show edit icon over image */}
          {isEditable ? (
            <>
              <img
                alt="background"
                src={
                  orgLogoFileData
                    ? URL.createObjectURL(orgLogoFileData)
                    : organisation.profileImage
                }
                className={styles.bgImage}
              />
              <div className={styles.centered}>
                <EditIcon width={50} height={50} />
              </div>
            </>
          ) : (
            <img src={organisation && organisation.profileImage} alt="logo" />
          )}
        </div>
      ) : (
        // shows default image
        <div className={styles['logo-svg']} onClick={handleClick}>
          <Bitcoin width={100} height={100} />
          {isEditable && (
            <>
              <img
                alt="background"
                src={
                  orgLogoFileData
                    ? URL.createObjectURL(orgLogoFileData)
                    : Background
                }
                className={styles.bgImageDefault}
              />
              <div className={styles.centeredEdit}>
                <EditIcon width={50} height={50} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Banner;
