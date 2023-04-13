import { IMember, IMemberData } from 'interfaces/organisation';
import { IUser } from 'interfaces/user';

const isOrganisationMember = (
  loggedInUser: Partial<IUser> | undefined,
  members: IMemberData,
  preview?: boolean
) => {
  const isMember = members.all.find(
    (x: IMember) => x.user.userId === loggedInUser?.userId
  );

  if (preview) return false;

  return isMember !== undefined;
};

export default isOrganisationMember;
