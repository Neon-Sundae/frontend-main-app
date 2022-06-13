import { FC } from 'react';
import styles from './index.module.scss';

const BlurBlobs: FC = () => {
  return (
    <>
      {/* Blue Blobs */}
      <BaseBlob
        blobColor="rgba(109, 121, 230, 0.3)"
        width={800}
        height={600}
        className="blob-blue-1"
      />
      <BaseBlob
        blobColor="#54a8f5"
        width={250}
        height={250}
        className="blob-blue-2"
      />
      <BaseBlob
        blobColor="rgba(255, 255, 255, 0.4)"
        width={114}
        height={100}
        className="blob-blue-3"
      />

      {/* Purple Blobs */}
      <BaseBlob
        blobColor="rgba(162, 109, 230, 0.36)"
        width={800}
        height={600}
        className="blob-purple-1"
      />
      <BaseBlob
        blobColor="white"
        width={330}
        height={301}
        className="blob-purple-2"
      />
    </>
  );
};

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

export default BlurBlobs;
