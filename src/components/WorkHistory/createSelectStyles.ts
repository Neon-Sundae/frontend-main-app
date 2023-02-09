const creatableReactSelectStyles = {
  container: (styles: any) => ({
    ...styles,
    display: 'flex',
    justifyContent: 'center',
  }),

  control: (styles: { [x: string]: any }) => ({
    ...styles,
    fontFamily: 'Roboto Flex',
    fontWeight: 400,
    backgroundColor: '#2d2d35',
    borderWidth: 0.6,
    borderColor: '#fff',
    borderRadius: 5.6491,
    width: '225px',
    fontSize: 14,
    margin: '0 auto',
    padding: '0 10px',
    cursor: 'pointer',
    ':hover': {
      ...styles[':hover'],
      borderColor: '#fff',
    },
    ':active': {
      ...styles[':active'],
      borderColor: '#fff',
    },
  }),

  menu: (styles: any) => ({
    ...styles,
    backgroundColor: '#2d2d35',
    width: '100%',
    borderColor: '#fff',
    overflow: 'auto',
  }),

  option: (
    styles: { [x: string]: any },
    { isDisabled, isFocused, isSelected }: any
  ) => {
    return {
      ...styles,
      fontFamily: 'Roboto Flex',
      fontWeight: 100,
      backgroundColor: isSelected ? '#1d1d23' : '#2d2d35',
      color: 'white',
      cursor: isDisabled ? 'not-allowed' : 'default',
      width: '100%',
      fontSize: 14,
      ':active': {
        ...styles[':active'],
        // eslint-disable-next-line no-nested-ternary
        backgroundColor: !isDisabled
          ? isSelected
            ? 'white'
            : '#1d1d23'
          : undefined,
      },
      ':hover': {
        ...styles[':hover'],
        backgroundColor: '#3d3d47',
        cursor: 'pointer',
      },
    };
  },

  input: (styles: any) => ({
    ...styles,
    color: '#fff',
    outline: 'none',
  }),

  placeholder: (styles: any) => ({
    ...styles,
    color: '#fbfbfb',
    fontFamily: "'Roboto Flex', sans-serif",
    fontWeight: 100,
    fontSize: 14,
  }),

  singleValue: (styles: any) => ({ ...styles, color: 'white' }),

  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),

  indicatorsContainer: (styles: any) => ({ ...styles, display: 'none' }),

  multiValue: (styles: any) => {
    // const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: 'none',
    };
  },

  multiValueLabel: (styles: any) => ({
    ...styles,
    fontFamily: "'Roboto Flex', sans-serif",
    fontSize: '14',
    color: '#fff',
  }),

  multiValueRemove: (styles: any) => ({
    ...styles,
    color: '#fff',
    fontSize: '16',
    ':hover': {
      // backgroundColor: data.color,
      color: 'red',
    },
  }),
};

export default creatableReactSelectStyles;
