/* eslint-disable import/extensions */
import nftWebsite from 'assets/videos/nft-website.gif';
import nftCollection from 'assets/videos/nft-collection.gif';

const camelize = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: string, index: number) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

const getGifPreview = (templateName: string) => {
  const formattedTemplateName = camelize(templateName);
  console.log('formattedTemplateName', formattedTemplateName);
  if (formattedTemplateName === 'nFTWebsite') return nftWebsite;
  if (formattedTemplateName === 'nFTCollection') return nftCollection;
  return undefined;
};

export default getGifPreview;
