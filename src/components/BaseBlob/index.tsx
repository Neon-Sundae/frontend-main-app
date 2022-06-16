import { FC } from 'react';
import styles from './index.module.scss';

interface IBaseBlob {
  blobColor: string;
  width: number;
  height: number;
  className: string;
}

const BaseBlob: FC<IBaseBlob> = ({ blobColor, width, height, className }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={styles[className]}
    >
      <path
        fill={blobColor}
        d="M67.8,-21C77.6,7.9,68,44.1,44.6,61C21.2,77.9,-15.9,75.4,-40.8,57.1C-65.7,38.8,-78.4,4.6,-69.6,-23.1C-60.8,-50.7,-30.4,-71.8,-0.7,-71.5C29.1,-71.3,58.1,-49.8,67.8,-21Z"
        transform="translate(100 100)"
      />
    </svg>
  );
};

export default BaseBlob;
