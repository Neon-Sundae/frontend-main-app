import { IMemberData } from 'interfaces/organisation';
import { IUser } from 'interfaces/user';

const isOrganisationMember = (
  loggedInUser: Partial<IUser> | undefined,
  members: IMemberData | undefined
) => {
  const isMember = members?.all.find(() => {
    return (x: { user: { userId: number | undefined } }) =>
      x.user?.userId === loggedInUser?.userId;
  });

  return isMember !== undefined;
};

export default isOrganisationMember;
