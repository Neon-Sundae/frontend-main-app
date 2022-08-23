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
            className={styles.wrap}
            onClick={() => {
              navigate(`/organisation/${org.organisationId}`);
            }}
            style={{ cursor: 'pointer' }}
          >
            <Card
              showTransparentBg
              className={styles.cardsContainer}
              key={org.organisationId}
            >
              <header>
                {org?.profileImage ? (
                  <div className={styles['organisation-image-wrapper']}>
                    <img src={org?.profileImage} alt="Organisation profile" />
                  </div>
                ) : (
                  <BrandImage
                    width="71.14px"
                    height="73.53px"
                    className={styles['organisation-default-image']}
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
