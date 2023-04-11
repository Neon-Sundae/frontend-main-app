import { IMember, IMemberData, IOwnerData } from 'interfaces/organisation';
import { FC } from 'react';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';

interface IOrganisationPeopleCard {
  members: IMemberData;
}

const OrganisationPeopleCard: FC<IOrganisationPeopleCard> = ({ members }) => (
  <>
    {members.all.map((member: IMember) => (
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
  const navigate = useNavigate();
  return (
    <>
      <div
        className={styles['organisation-people-card-container']}
        onClick={() => navigate(`/profile/${member.user.profile.profileId}`)}
      >
        <span>
          <img
            src={
              member.user.profile.picture ||
              getDefaultAvatarSrc(member.user.name?.charAt(0).toUpperCase())
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
          {member.user.name}
        </h3>
        <p className={styles['organisation-people-card-container--title']}>
          {member.user.profile.title}
        </p>
        <p
          className={styles['organisation-people-card-container--description']}
        >
          {member.user.profile.description}
        </p>
      </div>
    </>
  );
};

export default OrganisationPeopleCard;
