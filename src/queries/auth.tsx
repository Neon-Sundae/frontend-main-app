import { useMutation } from '@tanstack/react-query';
import { updateFirstTimeUser, updateLoginStep } from 'actions/auth';
import { updateUser } from 'actions/user';
import {
  arcanaGenereateNonce,
  metamaskGenerateNonce,
  saveOrganisationSignupObjectives,
  saveUserOnboardData,
  saveUserSignupObjectives,
  verifySignature,
  verifyUdSignature,
} from 'api/auth';
import { IUseSaveUserOnboardData, IVerifySignature } from 'interfaces/auth';
import { useDispatch } from 'react-redux';
import { setAccessToken } from 'utils/authFn';

const useMetamaskGenerateNonce = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (walletId: string) => metamaskGenerateNonce(walletId),
    onSuccess: (data: any) => {
      dispatch(updateUser(data.user));
    },
  });
};

const useArcanaGenerateNonce = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (walletId: string) => arcanaGenereateNonce(walletId),
    onSuccess: (data: any) => {
      dispatch(updateUser(data.user));
    },
  });
};

const useVerifySignature = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (payload: IVerifySignature) => verifySignature(payload),
    onSuccess: (data: any) => {
      setAccessToken(data.accessToken);
      dispatch(updateFirstTimeUser(data.isFirstTimeUser));
      dispatch(updateLoginStep(2));
    },
  });
};

const useVerifyUdSignature = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: () => verifyUdSignature(),
    onSuccess: (data: any) => {
      setAccessToken(data.accessToken);
      dispatch(updateFirstTimeUser(data.isFirstTimeUser));
      dispatch(updateLoginStep(2));
    },
  });
};

const useSaveUserOnboardData = () => {
  return useMutation({
    mutationFn: (payload: IUseSaveUserOnboardData) =>
      saveUserOnboardData(payload),
  });
};

const useSaveUserSignupObjectives = () => {
  return useMutation({
    mutationFn: (objectives: string[]) => saveUserSignupObjectives(objectives),
  });
};

const useSaveOrganisationSignupObjectives = () => {
  return useMutation({
    mutationFn: (objectives: string[]) =>
      saveOrganisationSignupObjectives(objectives),
  });
};

export {
  useMetamaskGenerateNonce,
  useArcanaGenerateNonce,
  useVerifySignature,
  useVerifyUdSignature,
  useSaveUserOnboardData,
  useSaveUserSignupObjectives,
  useSaveOrganisationSignupObjectives,
};
