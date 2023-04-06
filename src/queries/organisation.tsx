import { useQuery } from '@tanstack/react-query';
import { fetchAllOrganisations } from 'api/organisation';

const useFetchAllOrganisations = () => {
  return useQuery({
    queryKey: ['all-organisations'],
    queryFn: fetchAllOrganisations,
  });
};

export { useFetchAllOrganisations };
