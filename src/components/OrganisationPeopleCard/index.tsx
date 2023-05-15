import { IMember, IMemberData, IOwnerData } from 'interfaces/organisation';
import { FC } from 'react';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

interface IOrganisationPeopleCard {
  members: IMemberData | undefined;
}

const OrganisationPeopleCard: FC<IOrganisationPeopleCard> = ({ members }) => (
  <>
    {members?.all.map((member: IMember) => (
      <OrganisationPeopleCardContainer member={member} />
    ))}
  </>
);

interface IOrganisationPeopleCardContainer {
  member: IOwnerData;
}

const OrganisationPeopleCardContainer: FC<IOrganisationPeopleCardContainer> = ({
  member,
}) => {
  const { user } = member;
  const navigate = useNavigate();
  return (
    <>
      <div
        className={styles['organisation-people-card-container']}
        onClick={() => navigate(`/profile/${user.profile.profileId}`)}
      >
        <span>
          <img
            src={
              user.profile.picture ||
              getDefaultAvatarSrc(user.name?.charAt(0).toUpperCase())
            }
            alt=""
            width="54.07px"
            height="56.42px"
          />
          <p className={styles['organisation-people-card-container--role']}>
            {member.role.split('.').pop()}
          </p>
        </span>

        <h3 className={styles['organisation-people-card-container--user-name']}>
          {user.name}
        </h3>
        <p className={styles['organisation-people-card-container--title']}>
          {user.profile.title}
        </p>
        <p
          className={styles['organisation-people-card-container--description']}
        >
          {user.profile.description}
        </p>
      </div>
    </>
  );
};

export default OrganisationPeopleCard;
