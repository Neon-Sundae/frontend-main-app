import { IMemberData } from 'interfaces/organisation';
import { IUser } from 'interfaces/user';

const isOrganisationMember = (
  loggedInUser: Partial<IUser> | undefined,
  members: IMemberData | undefined
) => {
  const isMember = members?.all.find(x => x.userId === loggedInUser?.userId);

  return isMember !== undefined;
};

export default isOrganisationMember;
