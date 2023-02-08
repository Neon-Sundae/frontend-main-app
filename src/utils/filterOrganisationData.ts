interface IOrganisationData {
  label: string;
  value: number;
}

const filterOrganisationData = (
  name: string,
  data: IOrganisationData[]
): IOrganisationData[] =>
  data &&
  data.filter(function (organisation: { label: string }) {
    return organisation.label === name;
  });

export default filterOrganisationData;
