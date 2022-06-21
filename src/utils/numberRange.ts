const numberRange = (start: number, end: number) => {
  return [...Array(end - start).keys()].map(i => i + start);
};

export default numberRange;
