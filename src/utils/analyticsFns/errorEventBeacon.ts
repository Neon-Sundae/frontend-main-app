import config from 'config';

const errorEventBeacon = (
  walletId: string | undefined,
  errorMessage: string
) => {
  const formData = new FormData();
  formData.append('walletId', walletId || '');
  formData.append('errorMessage', errorMessage);

  if (navigator) {
    navigator.sendBeacon(
      `${config.ApiBaseUrl}/analytics/error-event`,
      formData
    );
  }
};

export default errorEventBeacon;
