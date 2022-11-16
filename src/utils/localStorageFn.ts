const setItem = (key: string, value: any): void =>
  localStorage.setItem(key, value);

const getItem = (key: string, type = 'none') => {
  if (type === 'json') {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }
  const value = localStorage.getItem(key);
  if (value === 'undefined' || value === 'null') {
    return null;
  }
  return value;
};

const removeItem = (key: string): void => localStorage.removeItem(key);

const handleLocalStorage = (status: string) => {
  window.localStorage.setItem('onboardStatus', status);
  window.dispatchEvent(new Event('storage'));
};

export { getItem, removeItem, setItem, handleLocalStorage };
