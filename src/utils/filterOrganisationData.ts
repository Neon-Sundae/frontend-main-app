import { IOrganisationSelectData } from 'interfaces/organisation';

const filterOrganisationData = (
  name: string,
  data: IOrganisationSelectData[]
): IOrganisationSelectData[] =>
  data &&
  data.filter(function (organisation: { label: string }) {
    return organisation.label === name;
  });

export default filterOrganisationData;
