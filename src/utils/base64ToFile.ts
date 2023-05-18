import getRandomString from './getRandomString';

const convertBase64ToFile = async (localFile: any) => {
  return fetch(localFile)
    .then(res => res.blob())
    .then(blob => {
      return new File([blob], `${getRandomString}`, {
        type: 'image/png',
      });
    });
};
export default convertBase64ToFile;
