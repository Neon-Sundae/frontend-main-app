import { IOrganisation } from 'interfaces/organisation';
import { CREATE_ORG } from 'actions/organisation/types';

interface State {
  org: Partial<IOrganisation>[];
}

type Action = {
  type: typeof CREATE_ORG;
  org: Partial<IOrganisation>;
};

const initialState: State = {
  org: [],
};

const org = (state = initialState, action: Action): State => {
  switch (action.type) {
    case CREATE_ORG: {
      const orgArray = [...state.org, action.org];
      return {
        ...state,
        org: orgArray,
      };
    }
    default:
      return { ...state };
  }
};

export default org;
