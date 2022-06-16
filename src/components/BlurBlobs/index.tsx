import { FC } from 'react';
import BaseBlob from 'components/BaseBlob';

const BlurBlobs: FC = () => {
  return (
    <>
      {/* Blue Blobs */}
      <BaseBlob
        blobColor="rgba(109, 121, 230, 0.3)"
        width={800}
        height={600}
        className="window-blob-blue-1"
      />
      <BaseBlob
        blobColor="#54a8f5"
        width={250}
        height={250}
        className="window-blob-blue-2"
      />
      <BaseBlob
        blobColor="rgba(255, 255, 255, 0.4)"
        width={114}
        height={100}
        className="window-blob-blue-3"
      />

      {/* Purple Blobs */}
      <BaseBlob
        blobColor="rgba(162, 109, 230, 0.36)"
        width={800}
        height={600}
        className="window-blob-purple-1"
      />
      <BaseBlob
        blobColor="white"
        width={330}
        height={301}
        className="window-blob-purple-2"
      />
    </>
  );
};

export default BlurBlobs;
