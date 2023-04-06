export const normalizeAllOrganisations = (data: any[]) => {
  return data?.map(
    (organisation: { name: string; organisationId: number }) => ({
      label: organisation.name,
      value: organisation.organisationId.toString(),
    })
  );
};
