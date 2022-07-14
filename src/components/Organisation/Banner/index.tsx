import { FC } from 'react';
import gradient from 'assets/illustrations/organisation/gradient.svg';
import { ReactComponent as Instagram } from 'assets/illustrations/profile/instagram.svg';
import { ReactComponent as Linkedin } from 'assets/illustrations/profile/linkedin.svg';
import { ReactComponent as Twitter } from 'assets/illustrations/profile/twitter.svg';
import { ReactComponent as Apple } from 'assets/illustrations/organisation/apple.svg';
import { IOrganisation } from 'interfaces/organisation';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { editOrganisation } from 'actions/organisation';
import { RootState } from 'reducers';
import styles from './index.module.scss';

interface IBanner {
  organisation: IOrganisation;
}

const Banner: FC<IBanner> = ({ organisation }) => {
  const dispatch = useDispatch();
  const isEditable = useSelector((state: RootState) => state.org.isEditable);

  const handleEdit = () => {
    if (isEditable) {
      dispatch(editOrganisation(false));
    } else {
      dispatch(editOrganisation(true));
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.gradient}
        style={{ backgroundImage: `url(${gradient})` }}
      />
      <div className={styles.content}>
        <div className={styles.center}>
          <div className={styles.logo}>
            <Apple width={95} height={117} className={styles['logo-svg']} />
          </div>
        </div>
        <div className={styles.center}>
          {isEditable ? (
            <button className={styles.btn} onClick={handleEdit}>
              Save
            </button>
          ) : (
            <button className={styles.btn} onClick={handleEdit}>
              Edit Organisation
            </button>
          )}
        </div>
        <div className={clsx(styles.center, styles['org-socials'])}>
          <div className={styles['socials-row']}>
            <span className={styles['socials-header']}>Website:</span>
            <a
              href={organisation.website ?? '#'}
              target="_blank"
              rel="noreferrer"
            >
              {organisation.website ?? 'apple.com'}
            </a>
          </div>
          <div className={styles['socials-row']}>
            <span className={styles['socials-header']}>Socials:</span>
            <span className={styles['social-icon-container']}>
              {organisation.linkedin ? (
                <Linkedin width={37} height={37} />
              ) : null}
              {organisation.twitter ? <Twitter width={37} height={37} /> : null}
              {organisation.instagram ? (
                <Instagram width={37} height={37} />
              ) : null}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
