import { StylesConfig } from 'react-select';

export type Option =
  | {
      value: number;
      label: string;
    }
  | {
      value: string;
      label: string;
    };

export const customStyles: StylesConfig<Option> = {
  container: styles => ({
    ...styles,
    color: 'white',
  }),
  control: styles => ({
    ...styles,
    backgroundColor: 'none',
    border: '0.661017px solid #ffffff',
    borderRadius: '5.6491px',
    height: '50px',
    width: '300px',
    padding: '0 20px',
    cursor: 'pointer',
    marginBottom: '15px',

    ':hover': {
      ...styles[':hover'],
    },
    ':active': {
      ...styles[':active'],
    },
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: '#2d2d35',
    width: '100%',
    borderColor: '#3c3c3c',
    overflow: 'auto',
    zIndex: 2,
    fontFamily: 'Roboto Flex',
    fontSize: 16,
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      fontFamily: 'Roboto Flex',
      backgroundColor: isSelected ? '#1d1d23' : '#2d2d35',
      cursor: isDisabled ? 'not-allowed' : 'default',
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
  input: styles => ({
    ...styles,
    outline: 'none',
    color: 'white',
    padding: 0,
    margin: 0,
    background: 'transparent',
  }),
  placeholder: styles => ({
    ...styles,
    fontFamily: "'Roboto Flex', sans-serif",
    fontSize: 16,
    color: 'white',
  }),
  singleValue: (styles, { data }) => ({
    ...styles,
    color: 'white',
    fontFamily: "'Roboto Flex', sans-serif",
    fontSize: 16,
  }),

  indicatorSeparator: styles => ({ ...styles, display: 'none' }),
};
