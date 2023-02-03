import { IMemberData } from 'interfaces/organisation';
import { IUser } from 'interfaces/user';

const isOwner = (
  loggedInUser: Partial<IUser> | undefined,
  members: IMemberData
) => {
  return loggedInUser?.userId === members.owner[0].userId;
};

export default isOwner;
