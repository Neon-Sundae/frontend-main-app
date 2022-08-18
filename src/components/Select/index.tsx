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
      borderWidth: 1.2,
      borderColor,
      borderRadius,
      width: '100%',
      height,
      margin: '0 auto',
      padding: '0 20px',
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
        fontWeight: 400,
        backgroundColor: isSelected ? '#1d1d23' : '#2d2d35',
        color: 'white',
        cursor: isDisabled ? 'not-allowed' : 'default',
        width: '100%',

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
    input: styles => ({ ...styles, backgroundColor: 'red', outline: 'none' }),
    placeholder: styles => ({
      ...styles,
      color: 'white',
      fontFamily: "'Roboto Flex', sans-serif",
      fontWeight: 500,
      fontSize: 18,
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
  borderColor: '#3c3c3c',
  height: 55,
  borderRadius: 20,
};

export default SelectComponent;
