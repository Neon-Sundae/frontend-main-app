/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ChangeEvent,
  FC,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';
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
import { ReactComponent as EditIcon } from 'assets/illustrations/icons/edit.svg';
import Background from 'assets/illustrations/profile/pp-bg.png';
import styles from './index.module.scss';
import OrganisationSocialModal from './OrganisationSocialModal';
import {
  useUpdateOrganisation,
  useUpdateOrgPic,
  useUpdateOrgCoverPic,
} from './hooks';

interface IBanner {
  organisation: IOrganisation;
}

interface IFile {
  id: string;
  file: File;
}

const Banner: FC<IBanner> = ({ organisation }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefCover = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const isEditable = useSelector((state: RootState) => state.org.isEditable);
  const user = useSelector((state: RootState) => state.user.user);

  const [nameLocal, setNameLocal] = useState(organisation.name ?? 'Polkadot');
  const [website, setWebsite] = useState(organisation.website ?? '');
  const [open, setOpen] = useState(false);
  const [orgLogoFileData, setOrgLogoFileData] = useState<IFile | null>(null);
  const [orgCoverFileData, setCoverLogoFileData] = useState<IFile | null>(null);

  const updateOrganisation = useUpdateOrganisation(organisation.organisationId);
  const updateOrgPicture = useUpdateOrgPic(organisation.organisationId);
  const updateCoverOrgPicture = useUpdateOrgCoverPic(
    organisation.organisationId
  );
  let updatedOrgCoverUrl = null;
  console.log(organisation);
  const payload = {
    name: nameLocal,
    description: organisation.description,
    whitepaper: organisation.whitepaper,
    website,
  };
  const formData = new FormData();
  useEffect(() => {
    if (orgLogoFileData) {
      formData.append('file', orgLogoFileData.file);
      formData.append('type', 'logo');
      updateOrgPicture.mutate(formData);
    }
    if (orgCoverFileData) {
      formData.append('file', orgCoverFileData.file);
      formData.append('type', 'cover');
      updatedOrgCoverUrl = URL.createObjectURL(orgCoverFileData.file);
      updateCoverOrgPicture.mutate(formData);
    }
  }, [orgLogoFileData, orgCoverFileData]);

  const handleEdit = () => {
    console.log('isEditable', isEditable);
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
  const setFileState = (files: FileList | null) => {
    const fileArray: IFile[] = [];
    if (files) {
      fileArray.push({
        id: `${files[0].name}-${files[0].size}`,
        file: files[0],
      });
      setOrgLogoFileData(fileArray[0]);
    }
  };
  const setCoverFileState = (files: FileList | null) => {
    const fileArray: IFile[] = [];
    if (files) {
      fileArray.push({
        id: `${files[0].name}-${files[0].size}`,
        file: files[0],
      });
      setCoverLogoFileData(fileArray[0]);
    }
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

  const handleOrgLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    setFileState(files);
  };
  const handleOrgCoverChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    setCoverFileState(files);
  };

  const handleClick = (e: any) => {
    e.preventDefault();
    if (inputRef.current) inputRef.current.click();
  };
  const handleOrgCoverClick = (e: any) => {
    e.preventDefault();
    if (inputRefCover.current) inputRefCover.current.click();
  };

  return (
    <div className={styles.container}>
      <input
        ref={inputRefCover}
        id="orgCoverImage"
        className={styles.attachments}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleOrgCoverChange}
      />
      <div
        className={styles.gradient}
        style={
          updatedOrgCoverUrl
            ? { backgroundImage: `url(${updatedOrgCoverUrl})` }
            : {
                backgroundImage: `url(${organisation.bannerImage ?? gradient})`,
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
          {organisation.profileImage ? (
            <div
              className={styles.logo}
              onClick={isEditable ? handleClick : () => {}}
            >
              <img
                src={
                  orgLogoFileData && orgLogoFileData.file
                    ? URL.createObjectURL(orgLogoFileData.file)
                    : organisation.profileImage
                }
                alt="logo"
              />
              {isEditable ? (
                <img
                  alt="background"
                  src={Background}
                  className={styles.bgImage}
                />
              ) : (
                <> </>
              )}

              {isEditable ? (
                <div className={styles.centered}>
                  <EditIcon width={50} height={50} />
                </div>
              ) : (
                <> </>
              )}
            </div>
          ) : orgLogoFileData && orgLogoFileData.file ? (
            <div
              className={styles.logo}
              onClick={isEditable ? handleClick : () => {}}
            >
              <img src={URL.createObjectURL(orgLogoFileData.file)} alt="logo" />
            </div>
          ) : (
            <Bitcoin
              width={80}
              height={80}
              className={styles['logo-svg']}
              onClick={isEditable ? handleClick : () => {}}
            />
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
          {isEditable ? (
            <button
              onClick={handleOrgCoverClick}
              className={styles.coverPicBtn}
            >
              <EditIcon width={50} height={50} />
            </button>
          ) : (
            <p />
          )}
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
