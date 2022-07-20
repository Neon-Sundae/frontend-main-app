import { FC, useState, useEffect } from 'react';
import styles from './index.module.scss';
import timezoneData from 'assets/data/timezones.json';
import Select from 'react-select';
import { customStyles } from '../../StartPrjModal/CreatePrjModal/selectStyles';
import { formatDate } from "utils/formatDate";
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

const Description: FC<DescriptionProps> = (props: DescriptionProps) => {
  const [options, setOptions] = useState<any>(null);
  const [defaultOptions, setDefaultOptions] = useState<any>(null);
  let temp: any = [], tempDefaultOptions: any = [];
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
  console.log('flResources', flResources);
  useEffect(() => {
    if (!temp.length || !tempDefaultOptions.length) {
      timezoneData.forEach((element) => {
        tempDefaultOptions.push({ value: element.value, label: element.text });
      });
      setDefaultOptions(tempDefaultOptions);
      selectedTimeZones(options);
      timezoneData.forEach((element) => {
        if (preferredTimeZones.includes(element.text)) {
          temp.push({
            label: element.text,
            text: element.text
          });
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
              <input type="date" name='timeOfCompletion' defaultValue={formatDate(date)} placeholder='Due Date' onChange={(e) => input(e)} />
              {/* <Select
                options={defaultOptions}
                styles={customStyles}
                isMulti
                value={options}
                onChange={(options) => {
                  setOptions(options)
                  selectedTimeZones(options)
                }}
              /> */}
              {/* <span className={styles.multipleInputs}>
                {flResources && flResources.map((resource, index) => (
                  <input key={index} defaultValue={resource.title} name={`flResources[${index}].title, ${resource.flResourceId}`} placeholder='Resource' onChange={(e) => input(e)} />
                ))}
              </span> */}
              {/* {flProjectCategory && flProjectCategory.map((category, index) => (
                <span key={index} className={styles.multipleInputsHorizontal} >
                  <input defaultValue={category.categoryName} name={`flProjectCategory[${index}].categoryName, ${category.flProjectCategoryId}`} placeholder='Category' onChange={(e) => input(e)} />
                  <input defaultValue={category.percentageAllocation} name={`flProjectCategory[${index}].percent`} placeholder='Percent' onChange={(e) => input(e)} />
                </span>
              ))} */}
            </>) : (<> <p>Budget: {budget} USDC</p>
              <p>Timeline: {days} days</p>

            </>)
            }
            <p>Preferred TimeZones: {preferredTimeZones}</p>
            <p>Looking For: {flResourcesStringJoined}</p>
            <p>Project Categories: {flProjectCategory
              ?.map((category) => `${category.categoryName} - ${category.percentageAllocation}%`)
              .join(', ')}</p>
          </div>
        </section>
      </div >
    </div >
  );
};

export default Description;
