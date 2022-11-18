/* eslint-disable react/require-default-props */
/* eslint-disable no-nested-ternary */
import { FC } from 'react';
import Select, {
  ActionMeta,
  SingleValue,
  MultiValue,
  StylesConfig,
} from 'react-select';

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
    }
  | { label: string; value: number };

interface ComponentProps {
  options: Option[];
  placeholder: string;
  name: string;
  onSelectChange: (newValue: any, actionMeta: ActionMeta<Option>) => void;
  value: SingleValue<Option>;
  borderColor?: string;
  borderRadius?: number;
  height?: number;
  width?: string;
  isMulti: boolean;
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
  isMulti,
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
    multiValue: (styles, { data }) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: 'none',
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      fontFamily: "'Roboto Flex', sans-serif",
      fontSize: '14',
      color: '#fff',
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: '#fff',
      fontSize: '16',
      ':hover': {
        // backgroundColor: data.color,
        color: 'red',
      },
    }),
  };

  return (
    <Select
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...getSharedSelectProps()}
      maxMenuHeight={200}
      onChange={onSelectChange}
      value={value}
      styles={customStyles}
      isMulti={isMulti}
    />
  );
};

SelectComponent.defaultProps = {
  borderColor: '#fff',
  height: 38,
  borderRadius: 5.6491,
};

export default SelectComponent;
