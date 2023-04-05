import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addProfileSkill,
  createProfileEducation,
  fetchProfileDetails,
  fetchProfileDetailsByUser,
  fetchProfileEducation,
  fetchProfileSkills,
  removeProfileEducation,
  removeProfileSkill,
  updateProfileEducation,
} from 'api/profile';
import { Option } from 'components/Select';
import { IProfileApiResponse, IProfileEducation } from 'interfaces/profile';

interface IUseFetchProfileEducation {
  profileId: string | undefined;
}

const useFetchProfileEducation = ({ profileId }: IUseFetchProfileEducation) => {
  return useQuery({
    queryKey: ['profile-education', profileId],
    queryFn: () => fetchProfileEducation({ profileId }),
    enabled: profileId !== undefined,
  });
};

const useCreateProfileEducation = ({
  profileId,
}: IUseFetchProfileEducation) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createProfileEducation({ profileId: Number(profileId) }),
    onSuccess: newEducation => {
      queryClient.setQueryData(
        ['profile-education', profileId],
        (old: IProfileEducation[] | undefined) => {
          if (old) {
            return [...old, newEducation];
          }
          return [newEducation];
        }
      );
    },
  });
};

interface IUseRemoveProfileEducation extends IUseFetchProfileEducation {
  educationId: number;
}

const useRemoveProfileEducation = ({
  educationId,
  profileId,
}: IUseRemoveProfileEducation) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => removeProfileEducation({ educationId }),
    onSuccess: () => {
      queryClient.setQueryData(
        ['profile-education', profileId],
        (old: IProfileEducation[] | undefined) => {
          if (old) {
            return old.filter(x => x.educationId !== educationId);
          }
          return [];
        }
      );
    },
  });
};

interface IUseUpdateProfileEducation {
  name: string;
  value: string;
}

const useUpdateProfileEducation = ({
  educationId,
  profileId,
}: IUseRemoveProfileEducation) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, value }: IUseUpdateProfileEducation) => {
      return updateProfileEducation({
        educationId,
        name,
        value,
      });
    },
    onSuccess: newEducation => {
      queryClient.setQueryData(
        ['profile-education', profileId],
        (old: IProfileEducation[] | undefined) => {
          if (old) {
            return old.map(x => {
              if (x.educationId === newEducation.educationId) {
                return newEducation;
              }
              return x;
            });
          }
          return [newEducation];
        }
      );
    },
  });
};

const useFetchProfileDetails = ({ profileId }: IUseFetchProfileEducation) => {
  return useQuery({
    queryKey: ['profile-details', profileId],
    queryFn: () => fetchProfileDetails({ profileId }),
    enabled: profileId !== undefined,
  });
};

const useFetchProfileDetailsWrapper = (
  profileId: string | undefined
): IProfileApiResponse | undefined => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(['profile-details', profileId]);
};

interface IUseFetchProfileDetailsByUser {
  userId: number | undefined;
}

const useFetchProfileDetailsByUser = ({
  userId,
}: IUseFetchProfileDetailsByUser) => {
  return useQuery({
    queryKey: ['profile-details-by-user', userId],
    queryFn: () => fetchProfileDetailsByUser({ userId }),
    enabled: userId !== undefined,
  });
};

const useFetchProfileSkills = ({ profileId }: IUseFetchProfileEducation) => {
  return useQuery({
    queryKey: ['profile-skills', profileId],
    queryFn: () => fetchProfileSkills({ profileId }),
    enabled: profileId !== undefined,
  });
};

interface IUseAddProfileSkill {
  selectedValue: Option;
}

const useAddProfileSkill = ({ profileId }: IUseFetchProfileEducation) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ selectedValue }: IUseAddProfileSkill) =>
      addProfileSkill({ profileId: Number(profileId), selectedValue }),
    onSuccess: newSkill => {
      queryClient.setQueryData(
        ['profile-skills', profileId],
        (old: Option[] | undefined) => {
          if (old) {
            return [...old, newSkill];
          }
          return [newSkill];
        }
      );
    },
  });
};

interface IUseRemoveProfileSkill {
  skillsId: number;
}

const useRemoveProfileSkill = ({ profileId }: IUseFetchProfileEducation) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ skillsId }: IUseRemoveProfileSkill) =>
      removeProfileSkill({ profileId: Number(profileId), skillsId }),
    onSuccess: skillsId => {
      queryClient.setQueryData(
        ['profile-skills', profileId],
        (old: Option[] | undefined) => {
          if (old) {
            return old.filter(x => x.value !== skillsId);
          }
          return [];
        }
      );
    },
  });
};

export {
  useFetchProfileEducation,
  useCreateProfileEducation,
  useRemoveProfileEducation,
  useUpdateProfileEducation,
  useFetchProfileDetails,
  useFetchProfileDetailsWrapper,
  useFetchProfileDetailsByUser,
  useFetchProfileSkills,
  useAddProfileSkill,
  useRemoveProfileSkill,
};
