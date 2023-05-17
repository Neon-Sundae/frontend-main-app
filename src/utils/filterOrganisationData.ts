import { IOrganisationSelectData } from 'interfaces/organisation';

const filterOrganisationData = (
  name: string,
  data: IOrganisationSelectData[] | undefined
): IOrganisationSelectData[] => {
  if (data) {
    return data.filter(
      (organisation: { label: string }) => organisation.label === name
    );
  }
  return [];
};

export default filterOrganisationData;
