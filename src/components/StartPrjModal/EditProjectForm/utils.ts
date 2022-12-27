/* eslint-disable radix */
import timezoneData from 'assets/data/timezones.json';

const formatDateFunction = (date: any) => {
  return date?.substring(0, 10);
};
const formattedPreferredTimeZones = (preferredTimeZones: string) => {
  if (preferredTimeZones?.length > 1) {
    const timezoneArr = preferredTimeZones?.split(', ');
    const temp: { label: any; value: any }[] = [];
    timezoneArr?.map((timezone: any) => {
      return temp.push({ label: timezone, value: timezone });
    });
    return temp;
  }
  return preferredTimeZones;
};

const normalizeFormData = (oldData: any) => {
  const {
    name,
    description,
    timeOfCompletion,
    budget,
    preferredTimeZones,
    organisationId,
    flResources,
    flProjectCategory,
  } = oldData;
  const formattedTimeOfCompletion = formatDateFunction(timeOfCompletion);
  const formattedBudget = budget?.toString();
  const formattedPreferredTimeZonesNormalized =
    formattedPreferredTimeZones(preferredTimeZones);
  const formattedFlResources = flResources?.map((resource: any) => {
    return {
      flResourceId: resource.flResourceId,
      title: resource.title,
    };
  });
  const formattedFlProjectCategory = flProjectCategory?.map((category: any) => {
    return {
      flProjectCategoryId: category.flProjectCategoryId,
      categoryName: category.categoryName,
      percentageAllocation: category.percentageAllocation,
    };
  });
  return {
    name,
    description,
    timeOfCompletion: formattedTimeOfCompletion,
    budget: formattedBudget,
    preferredTimeZones: formattedPreferredTimeZonesNormalized,
    organisationId,
    flResources: formattedFlResources,
    flProjectCategory: formattedFlProjectCategory,
  };
};

const formatTimeZones = () => {
  const temp: any[] = [];
  timezoneData.forEach(element => {
    temp.push({ value: element.value, label: element.text });
  });
  return temp;
};

const formatToISODate = (date: any) => {
  // eslint-disable-next-line prefer-template
  const dateStr = new Date(date + 'T00:00:00');
  return dateStr.toISOString();
};
const handleRemoveResource = (uId: string) => {
  const allIts = document
    .getElementById(`resource-${uId}`)
    ?.querySelectorAll('input');
  // @ts-ignore: Object is possibly 'null'.
  document.getElementById(`resource-${uId}`).remove();
  return {
    // @ts-ignore: Object is possibly 'null'.
    flResourceId: parseInt(allIts[0].id),
  };
};

const handleSubmitBtn = (selectedTimeZones: any) => {
  const res: any[] = [];
  const cats: any[] = [];
  const projectName = document.getElementById('name') as HTMLInputElement;
  const desc = document.getElementById('description') as HTMLTextAreaElement;
  const dueDate = document.getElementById('dueDate') as HTMLInputElement;
  const timeZones = selectedTimeZones;
  const projBudget = document.getElementById('budget') as HTMLInputElement;
  document.querySelectorAll('#resourcesContainer').forEach(el => {
    const it = el.querySelectorAll('input');
    it.forEach(inputField => {
      res.push({
        flResourceId: parseInt(inputField.id),
        title: inputField.value,
      });
    });
  });
  document.querySelectorAll('#categoriesContainer').forEach(el => {
    const it = el.querySelectorAll('input');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < it.length; i++) {
      // if index is divisible by 2, then it is a category
      if (i % 2 === 0) {
        cats.push({
          flProjectCategoryId: parseInt(it[i].id),
          categoryName: it[i].value,
          percentageAllocation: it[i + 1]?.value,
        });
      }
    }
  });
  const timeZoneString = timeZones.map((tz: any) => tz.value).join(',');
  const data = {
    name: projectName.value,
    description: desc.value,
    timeOfCompletion: formatToISODate(dueDate.value),
    budget: parseInt(projBudget.value, 10),
    preferredTimeZones: timeZoneString,
    flResources: res,
    flProjectCategory: cats,
  };
  return data;
};
export {
  normalizeFormData,
  formatTimeZones,
  formatToISODate,
  handleRemoveResource,
  handleSubmitBtn,
};
