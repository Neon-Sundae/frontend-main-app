/* eslint-disable no-underscore-dangle */
import { useNavigate } from 'react-router-dom';
import Card from 'components/Card';
import { ReactComponent as BrandImage } from 'assets/images/metadata/brand-image.svg';
import { useFetchUserOrganisations } from 'queries/organisation';
import { useFetchUserDetailsWrapper } from 'queries/user';
import styles from './index.module.scss';

const OrganisationCard = () => {
  const navigate = useNavigate();
  const userData = useFetchUserDetailsWrapper();
  const { data: userOrganisations, isLoading } = useFetchUserOrganisations(
    userData?.user.userId
  );

  if (isLoading) return null;

  return (
    <div className={styles['profile-organisation-container']}>
      {userOrganisations?.length === 0 && <p>No Organisations</p>}
      {userOrganisations?.map((org: any) => {
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
