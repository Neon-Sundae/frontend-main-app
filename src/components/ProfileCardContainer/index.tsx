import { FC, ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { RootState } from 'reducers';
import gradient from 'assets/illustrations/profile/gradient.png';
import { useQuery } from '@tanstack/react-query';

import { useParams } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import config from 'config';
import styles from './index.module.scss';

interface IProfileCardContainer {
  children: ReactNode;
}

const ProfileCardContainer: FC<IProfileCardContainer> = ({ children }) => {
  const isEditable = useSelector(
    (state: RootState) => state.profile.isEditable
  );
  // const { profileId } = useParams();

  // const { data, refetch } = useQuery(
  //   ['user-profile-data', profileId],
  //   () =>
  //     fetch(`${config.ApiBaseUrl}/profile/${profileId}`, {
  //       method: 'GET',
  //       headers: { Authorization: `Bearer ${getAccessToken()}` },
  //     }).then(response => response.json()),
  //   {
  //     enabled: false,
  //     refetchOnMount: false,
  //   }
  // );

  // useEffect(() => {
  //   refetch();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div
      className={clsx(
        styles['profile-card-container'],
        isEditable && styles['profile-card-container--is-editable']
      )}
      style={{ backgroundImage: `url(${gradient})`, backgroundSize: 'cover' }}
    >
      {children}
    </div>
  );
};

export default ProfileCardContainer;
