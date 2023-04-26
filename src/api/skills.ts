import config from 'config';
import { handleApiErrors } from 'utils/handleApiErrors';
import { ISkills } from 'interfaces/skills';
import { normalizeSkills } from 'utils/normalizeSkills';

const fetchAppSkills = async () => {
  const response = await fetch(`${config.ApiBaseUrl}/skills`, {
    method: 'GET',
  });
  const json: ISkills[] = await handleApiErrors(response);
  const normalizedSkillsData = normalizeSkills(json);
  return normalizedSkillsData;
};

export { fetchAppSkills };
