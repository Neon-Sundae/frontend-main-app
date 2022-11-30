const handleApiErrors = async (response: Response) => {
  // Response status is not 200
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    } else if (response.status === 500) {
      throw new Error('Server error');
    } else if (response.status === 404) {
      throw new Error('Not Found');
    } else if (response.status === 400) {
      const json = await response.json();
      throw new Error(json.message);
    }
  }

  // Response status - 200
  const json = await response.json();
  return json;
};

// eslint-disable-next-line import/prefer-default-export
export { handleApiErrors };
