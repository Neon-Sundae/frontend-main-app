/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */
import { FC } from 'react';
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select';

export type Option =
  | {
      value: number;
      label: string;
    }
  | {
      value: string;
      label: string;
    }
  | {
      value: number;
      label: JSX.Element;
    };

interface ComponentProps {
  options: Option[];
  placeholder: string;
  name: string;
  onSelectChange: (
    newValue: SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => void;
  value: SingleValue<Option>;
  borderColor?: string;
  borderRadius?: number;
  height?: number;
  width?: string;
}

const SelectComponent: FC<ComponentProps> = ({
  options,
  placeholder,
  name,
  onSelectChange,
  value,
  borderColor,
  borderRadius,
  height,
  width,
}) => {
  const getSharedSelectProps = () => {
    return {
      name,
      options,
      placeholder,
      className: 'profile-skills-select',
    };
  };

  const customStyles: StylesConfig<Option> = {
    container: styles => ({
      ...styles,
      display: 'flex',
      justifyContent: 'center',
    }),
    control: styles => ({
      ...styles,
      fontFamily: 'Roboto Flex',
      fontWeight: 400,
      backgroundColor: '#2d2d35',
      borderWidth: 0.6,
      borderColor,
      borderRadius,
      width: width || '100%',
      fontSize: 14,
      margin: '0 auto',
      padding: '0 10px',
      cursor: 'pointer',
      ':hover': {
        ...styles[':hover'],
        borderColor,
      },
      ':active': {
        ...styles[':active'],
        borderColor,
      },
    }),
    menu: styles => ({
      ...styles,
      backgroundColor: '#2d2d35',
      width: '100%',
      borderColor,
      overflow: 'auto',
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
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
      backgroundColor: 'red',
      outline: 'none',
    }),
    placeholder: styles => ({
      ...styles,
      color: '#fbfbfb',
      fontFamily: "'Roboto Flex', sans-serif",
      fontWeight: 100,
      fontSize: 14,
    }),
    singleValue: (styles, { data }) => ({ ...styles, color: 'white' }),
    indicatorSeparator: styles => ({ ...styles, display: 'none' }),
  };

  return (
    <Select
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...getSharedSelectProps()}
      maxMenuHeight={200}
      onChange={onSelectChange}
      value={value}
      isSearchable={false}
      styles={customStyles}
      isMulti={false}
    />
  );
};

SelectComponent.defaultProps = {
  borderColor: '#fff',
  height: 38,
  borderRadius: 5.6491,
};

export default SelectComponent;
