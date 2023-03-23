const setItem = (key: string, value: any): void =>
  sessionStorage.setItem(key, value);

const getItem = (key: string, type = 'none') => {
  if (type === 'json') {
    const value = sessionStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }
  const value = sessionStorage.getItem(key);
  if (value === 'undefined' || value === 'null') {
    return null;
  }
  return value;
};

export { getItem, setItem };
