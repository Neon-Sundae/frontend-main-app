import { INormalizeSkills, ISkills } from 'actions/skills';

const normalizeSkills = (skills: ISkills[]) => {
  const data = skills?.map(skill => ({
    label: skill.name,
    value: skill.skillsId,
  }));

  return data;
};

const deNormalizeSkills = (skills: INormalizeSkills[]) => {
  const data = skills.map(skill => ({
    skillsId: skill.value,
    name: skill.label,
  }));

  return data;
};

export { normalizeSkills, deNormalizeSkills };
