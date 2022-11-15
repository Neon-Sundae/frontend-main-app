import React from 'react';
import styles from './index.module.scss';
import Spinner from 'components/Project/Modal/Spinner';
import { FC } from 'react';
import { ReactComponent as CheckIcon } from 'assets/illustrations/icons/check.svg';
import { StringOptions } from 'sass';

interface IInteractionDiv {
  successState: string;
  message: string;
  title: string;
  projectName: string;
  bigMessage: String;
}
const InteractionDiv: FC<IInteractionDiv> = ({
  successState,
  message,
  title,
  projectName,
  bigMessage,
}) => {
  return (
    <>
      <div className={styles['interaction-container']}>
        <h4>{title}</h4>
        <div className={styles['interaction-spinner']}>
          {successState == 'success' ? (
            <CheckIcon width={100} height={100} />
          ) : (
            <Spinner />
          )}
        </div>
        {successState == 'success' ? (
          <p>
            {bigMessage} <span style={{ color: '#EBA8D0' }}>{projectName}</span>
          </p>
        ) : (
          <p>
            {bigMessage} <span style={{ color: '#EBA8D0' }}>{projectName}</span>
          </p>
        )}

        <span>{message}</span>
      </div>
    </>
  );
};

export default InteractionDiv;
