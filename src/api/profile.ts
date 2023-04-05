import config from 'config';
import {
  IProfileApiResponse,
  IProfileEducation,
  IProfileSkills,
} from 'interfaces/profile';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { Option } from 'components/Select';
import { normalizeSkills } from 'utils/normalizeSkills';

interface IFetchProfileEducation {
  profileId: string | undefined;
}

const fetchProfileEducation = async ({ profileId }: IFetchProfileEducation) => {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${config.ApiBaseUrl}/profile/education/${profileId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json: IProfileEducation[] = await handleApiErrors(response);
  return json;
};

interface ICreateProfileEducation {
  profileId: number | undefined;
}

const createProfileEducation = async ({
  profileId,
}: ICreateProfileEducation) => {
  const accessToken = getAccessToken();
  const now = new Date();

  const payload = {
    degree: 'Computer Science',
    university: 'National University of Singapore',
    startDate: now.toISOString(),
    endDate: now.toISOString(),
    profileId,
  };

  const response = await fetch(`${config.ApiBaseUrl}/profile/education/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await handleApiErrors(response);
  return json;
};

interface IRemoveProfileEducation {
  educationId: number;
}

const removeProfileEducation = async ({
  educationId,
}: IRemoveProfileEducation) => {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${config.ApiBaseUrl}/profile/education/${educationId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  await handleApiErrors(response);
};

interface IUpdateProfileEducation {
  educationId: number;
  name: string;
  value: string;
}

const updateProfileEducation = async ({
  educationId,
  name,
  value,
}: IUpdateProfileEducation) => {
  const accessToken = getAccessToken();

  const payload = {
    [name]: value,
  };

  const response = await fetch(
    `${config.ApiBaseUrl}/profile/education/${educationId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }
  );
  const json = await handleApiErrors(response);
  return json;
};

interface IFetchProfileDetials {
  profileId: string | undefined;
}

const fetchProfileDetails = async ({ profileId }: IFetchProfileDetials) => {
  const accessToken = getAccessToken();

  const response = await fetch(`${config.ApiBaseUrl}/profile/${profileId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json: IProfileApiResponse = await handleApiErrors(response);
  return json;
};

interface IFetchProfileDetailsByUser {
  userId: number | undefined;
}

const fetchProfileDetailsByUser = async ({
  userId,
}: IFetchProfileDetailsByUser) => {
  const accessToken = getAccessToken();

  const response = await fetch(`${config.ApiBaseUrl}/profile/user/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json: IProfileApiResponse = await handleApiErrors(response);
  return json;
};

const fetchProfileSkills = async ({ profileId }: IFetchProfileDetials) => {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${config.ApiBaseUrl}/profile/skills/${profileId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json: IProfileSkills[] = await handleApiErrors(response);
  const normalizedSkills = normalizeSkills(json);
  return normalizedSkills;
};

interface IAddProfileSkill {
  selectedValue: Option;
  profileId: number | undefined;
}

const addProfileSkill = async ({
  selectedValue,
  profileId,
}: IAddProfileSkill) => {
  const accessToken = getAccessToken();

  const payload = {
    skillsId: selectedValue?.value,
    profileId,
  };

  const response = await fetch(`${config.ApiBaseUrl}/profile/skill`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  await handleApiErrors(response);
  return selectedValue;
};

interface IRemoveProfileSkill {
  skillsId: number;
  profileId: number | undefined;
}

const removeProfileSkill = async ({
  skillsId,
  profileId,
}: IRemoveProfileSkill) => {
  const accessToken = getAccessToken();

  const payload = {
    profileId,
    skillsId,
  };

  const response = await fetch(`${config.ApiBaseUrl}/profile/skill`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  await handleApiErrors(response);
  return skillsId;
};

export {
  fetchProfileEducation,
  createProfileEducation,
  removeProfileEducation,
  updateProfileEducation,
  fetchProfileDetails,
  fetchProfileDetailsByUser,
  fetchProfileSkills,
  addProfileSkill,
  removeProfileSkill,
};
