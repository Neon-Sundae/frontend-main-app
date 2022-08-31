/* eslint-disable no-underscore-dangle */
import { useNavigate } from 'react-router-dom';
import Card from 'components/Card';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import styles from './index.module.scss';
import useFetchUserOrgs from './hooks';

const OrganisationCard = () => {
  const userOrgs = useFetchUserOrgs();
  const navigate = useNavigate();

  return (
    <div className={styles['profile-organisation-container']}>
      {userOrgs?.data?.length === 0 && <p>No Organisations</p>}
      {userOrgs?.data?.map((org: any) => {
        return (
          <div
            key={org.organisationId}
            className={styles.wrap}
            onClick={() => {
              navigate(`/organisation/${org.organisationId}`);
            }}
            style={{ cursor: 'pointer' }}
          >
            <Card showTransparentBg className={styles.cardsContainer}>
              <header>
                {org?.profileImage ? (
                  <div className={styles['organisation-image-wrapper']}>
                    <img src={org?.profileImage} alt="Organisation profile" />
                  </div>
                ) : (
                  <BrandImage
                    width="72px"
                    height="72px"
                    className={styles['organisation-default-image']}
                    style={{
                      borderRadius: '50%',
                    }}
                  />
                )}
                <h3 className={styles['text--primary']}>{org.name}</h3>
              </header>
              <p>{org?._count?.flProjects} Projects</p>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default OrganisationCard;
