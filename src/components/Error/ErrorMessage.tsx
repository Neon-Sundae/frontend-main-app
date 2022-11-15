import { FC } from 'react';
import styles from './index.module.scss';

interface IErrorMessage {
  message: string;
  errorCode: number;
}

const ErrorMessage: FC<IErrorMessage> = ({ message, errorCode }) => {
  return (
    <div className={styles['error-message-wrap']}>
      <p>{errorCode}</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
