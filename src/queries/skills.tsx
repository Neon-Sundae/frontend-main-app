import { useQuery } from '@tanstack/react-query';
import { fetchAppSkills } from 'api/skills';

const useFetchAppSkills = () => {
  return useQuery({
    queryKey: ['app-skills'],
    queryFn: fetchAppSkills,
  });
};

export { useFetchAppSkills };
