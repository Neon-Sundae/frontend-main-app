import { useMutation } from '@tanstack/react-query';
import { updateFirstTimeUser, updateLoginStep } from 'actions/auth';
import { updateUser } from 'actions/user';
import {
  metamaskGenerateNonce,
  saveUserOnboardData,
  verifySignature,
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

const useSaveUserOnboardData = () => {
  return useMutation({
    mutationFn: (payload: IUseSaveUserOnboardData) =>
      saveUserOnboardData(payload),
  });
};

export { useMetamaskGenerateNonce, useVerifySignature, useSaveUserOnboardData };
