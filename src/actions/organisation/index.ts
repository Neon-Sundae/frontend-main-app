import { IOrganisation } from 'interfaces/organisation';
import { CREATE_ORG } from './types';

export const createOrg = (org: Partial<IOrganisation>) => ({
  type: CREATE_ORG,
  org,
});
