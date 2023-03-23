import { Dispatch, SetStateAction } from 'react';
import getRandomString from './getRandomString';

const convertBase64ToFile = async (
  localFile: any,
  setFile: Dispatch<SetStateAction<File | undefined>>
) => {
  fetch(localFile)
    .then(res => res.blob())
    .then(blob => {
      setFile(
        new File([blob], `${getRandomString}`, {
          type: 'image/png',
        })
      );
    });
};
export default convertBase64ToFile;
