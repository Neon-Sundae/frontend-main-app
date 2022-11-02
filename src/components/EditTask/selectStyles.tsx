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
    fontSize: 14,
  }),
  control: styles => ({
    ...styles,
    backgroundColor: '#2d2d35',
    borderWidth: 0.56491,
    borderColor: '#fff',
    borderRadius: '5.6491px',
    width: '282.45px',
    padding: '0 10px',
    cursor: 'pointer',
    ':hover': {
      ...styles[':hover'],
      borderColor: '#3c3c3c',
    },
    ':active': {
      ...styles[':active'],
      borderColor: '#3c3c3c',
    },
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: '#2d2d35',
    width: '100%',
    borderColor: '#3c3c3c',
    overflow: 'auto',
    zIndex: 2,
    fontSize: 14,
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      fontFamily: 'Roboto Flex',
      fontSize: 14,
      backgroundColor: isSelected ? '#1d1d23' : '#2d2d35',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
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
  }),
  placeholder: styles => ({
    ...styles,
    fontFamily: "'Roboto Flex', sans-serif",
    fontSize: 14,
    color: 'white',
  }),
  singleValue: (styles, { data }) => ({
    ...styles,
    color: 'white',
    fontSize: 14,
  }),
  multiValue: styles => ({
    ...styles,
    backgroundColor: 'none',
  }),
  multiValueLabel: styles => ({
    ...styles,
    color: 'white',
  }),
  indicatorSeparator: styles => ({ ...styles, display: 'none' }),
};
