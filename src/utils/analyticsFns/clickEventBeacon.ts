import config from 'config';

const clickEventBeacon = (walletId: string | undefined) => {
  const formData = new FormData();
  formData.append('walletId', walletId || '');

  if (navigator) {
    navigator.sendBeacon(
      `${config.ApiBaseUrl}/analytics/click-event`,
      formData
    );
  }
};

export default clickEventBeacon;
