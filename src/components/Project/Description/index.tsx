import { FC, useState, useEffect } from 'react';
import styles from './index.module.scss';
import timezoneData from 'assets/data/timezones.json';
import Select from 'react-select';
import { customStyles } from '../../StartPrjModal/CreatePrjModal/selectStyles';
import { csvJson } from 'utils/csvJson'

interface DescriptionProps {
  description: string;
  budget: number;
  timeOfCompletion: string;
  preferredTimeZones: string[];
  flResources: any[];
  edit: boolean;
  input: (event: any) => void;
  flProjectCategory: any[];
  selectedTimeZones: (options: any) => void;
}
import { formatDate } from "utils/formatDate";
const Description: FC<DescriptionProps> = (props: DescriptionProps) => {
  const [options, setOptions] = useState<any>(null);
  const [defaultOptions, setDefaultOptions] = useState<any>(null);
  const temp: any = [];
  const {
    description,
    budget,
    timeOfCompletion,
    preferredTimeZones,
    flResources,
    flProjectCategory,
    edit,
    input,
    selectedTimeZones
  } = props;

  useEffect(() => {
    if (!temp.length) {
      const tempDefaultOptions: any = []
      timezoneData.forEach((element) => {
        tempDefaultOptions.push({ value: element.value, label: element.text });
      });
      setDefaultOptions(tempDefaultOptions);
      timezoneData.forEach((element) => {
        if (preferredTimeZones.includes(element.text)) {
          temp.push({
            label: element.text,
            text: element.text
          })
          console.log('temp', temp);
        }
      });
      setOptions(temp);
    }
  }, []);

  const dateToday = new Date();
  const end = new Date(timeOfCompletion);
  const date = end.toDateString().replace(/\//g, '-');

  const days = Math.floor(
    (end.getTime() - dateToday.getTime()) / (1000 * 60 * 60 * 24)
  );
  const flResourcesStringJoined = flResources
    ?.map((resource) => resource.title)
    .join(', ');

  const flProjectCategoryStringified =
    flProjectCategory?.map((category) => category.categoryName)
      .join(', ');

  console.log('options', options);
  console.log('temp', temp);

  return (
    <div className={styles.container}>
      <h4>Company Description</h4>
      <div className={styles.wrap}>
        <section className={styles.projectDescription}>
          {edit ? (<><input defaultValue={description} name='description' placeholder="Project Description" onChange={(e) => input(e)} /></>) : (<p>{description}</p>)}
        </section>
        <section className={styles.projectDetails}>
          <div className={styles.card}>
            {edit ? (<><input defaultValue={budget} name='budget' placeholder='Budget in USDC' onChange={(e) => input(e)} />
              <input type="date" defaultValue={formatDate(date)} placeholder='Due Date' />
              <Select
                options={defaultOptions}
                styles={customStyles}
                isMulti
                defaultValue={options}
                onChange={(options) => {
                  setOptions(options)
                  selectedTimeZones(options)
                }}
              />

              <span className={styles.multipleInputs}>
                {/* map flResources to input fields */}
                {flResources && flResources.map((resource, index) => (
                  <input key={index} defaultValue={resource.title} name={`flResources[${index}].title`} placeholder='Resource' onChange={(e) => input(e)} />
                ))}
              </span>
              {/* <input defaultValue={flResourcesStringJoined} name='flResources' placeholder='Resources Required' onChange={(e) => input(e)} /> */}

              <span className={styles.multipleInputs}>
                <input placeholder="Category"></input>
                <input placeholder="Percent"></input>
              </span>
            </>) : (<> <p>Budget: {budget} USDC</p>
              <p>Timeline: {days} days</p>
              <p>Preferred TimeZones: {preferredTimeZones}</p>
              <p>Looking For: {flResourcesStringJoined}</p>
              <p>Project Categories: {flProjectCategory
                ?.map((category) => `${category.categoryName} - ${category.percentageAllocation}%`)
                .join(', ')}</p>
            </>)
            }
          </div>
        </section>
      </div >
    </div >
  );
};

export default Description;
