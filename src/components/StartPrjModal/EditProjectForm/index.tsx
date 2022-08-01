/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import Select from 'react-select';
import getRandomString from 'utils/getRandomString';
import { useState, FC, useEffect } from 'react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { normalizeFormData, formatTimeZones, handleSubmitBtn } from './utils';
import {
  useProjectData,
  useUpdateProjectData,
  useUpdateProjectResources,
  useDeleteProjectResource,
  useCreateProjectResource,
  useCreateNewCategory,
  useDeleteCategory,
  useUpdateCategory,
} from './hooks';
import styles from './index.module.scss';
import { customStyles } from './selectStyles';

interface IEditProjectFormProps {
  onClose: () => void;
}

const EditProjectForm: FC<IEditProjectFormProps> = ({ onClose }) => {
  const { projectData } = useProjectData();
  const prevData = normalizeFormData(projectData);
  const [formData, setFormData] = useState(prevData);
  const [selectedTimeZones, setSelectedTimeZones] = useState<any>(
    formData.preferredTimeZones
  );
  const [addMoreResources, setAddMoreResources] = useState({
    counter: 0,
  });
  const [addMoreCategories, setAddMoreCategories] = useState({
    counter: 0,
  });
  const udpateProjectData = useUpdateProjectData();
  const updateProjectRes = useUpdateProjectResources();
  const createProjectRes = useCreateProjectResource();
  const deleteProjectRes = useDeleteProjectResource();
  const createNewCategory = useCreateNewCategory();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  useEffect(() => {
    setFormData(formData);
  }, [formData]);

  const handleAddResource = (e: any) => {
    setAddMoreResources((prevState: any) => ({
      counter: prevState.counter + 1,
    }));
  };

  const handleAddCategories = (e: any) => {
    setAddMoreCategories((prevState: any) => ({
      counter: prevState.counter + 1,
    }));
  };

  const handleSubmit = (e: any) => {
    const res = handleSubmitBtn(selectedTimeZones);
    udpateProjectData.mutate({
      name: res.name,
      description: res.description,
      timeOfCompletion: res.timeOfCompletion,
      preferredTimeZones: res.preferredTimeZones,
      budget: res.budget,
    });
    toast.success('Project updated successfully');
  };

  const runDeleteProjectResMutation = (flResourceId: number) => {
    deleteProjectRes.mutate({
      flResourceId,
    });
  };

  const handleRemoveResource = (uId: string) => {
    const allIts = document
      .getElementById(`resource-${uId}`)
      ?.querySelectorAll('input');
    const input = allIts![0].value;
    document.getElementById(`resource-${uId}`)!.remove();
    const projectResId: any = allIts![0].id;
    if (projectResId) {
      runDeleteProjectResMutation(projectResId);
    }
    setFormData((prevState: any) => {
      const index = prevState.flResources.findIndex(
        (x: any) => x.title === input
      );
      if (index > -1) prevState.flResources.splice(index, 1);
      return {
        ...prevState,
      };
    });
  };

  const createNewProjectRes = (e: any) => {
    createProjectRes.mutate({
      title: e.target.value,
    });
  };

  const handleCategoryDelete = (uid: string) => {
    const allIts = document
      .getElementById(`resource-category-${uid}`)!
      .querySelectorAll('input');
    const categoryId: any = allIts![0].id;
    if (categoryId) {
      deleteCategory.mutate({
        categoryId,
      });
      setFormData((prevState: any) => {
        const index = prevState.flProjectCategory.findIndex(
          (x: any) => x.categoryName === allIts![0].value
        );
        if (index > -1) prevState.flProjectCategory.splice(index, 1);
        return {
          ...prevState,
        };
      });
    }
    document.getElementById(`resource-category-${uid}`)!.remove();
  };

  const handleCategoryChange = (uid: string) => {
    const allIts = document
      .getElementById(`resource-category-${uid}`)
      ?.querySelectorAll('input');
    const input = allIts![0].value;
    if (allIts![0].value && allIts![1].value && !allIts![0].id) {
      createNewCategory.mutate({
        categoryName: allIts![0].value,
        percentageAllocation: parseFloat(allIts![1].value),
      });
    }
    formData.flProjectCategory.forEach((x: any) => {
      if (x.flProjectCategoryId === Number(allIts![0].id)) {
        updateCategory.mutate({
          categoryId: Number(allIts![0].id),
          categoryName: allIts![0].value,
          percentageAllocation: parseFloat(allIts![1].value),
        });
      }
      setFormData((prevState: any) => {
        const index = prevState.flProjectCategory.findIndex(
          (el: any) => el.flProjectCategoryId === Number(allIts![0].id)
        );
        if (index > -1) {
          prevState.flProjectCategory[index].categoryName = allIts![0].value;
          prevState.flProjectCategory[index].percentageAllocation = Number(
            allIts![1].value
          );
        }
        return {
          ...prevState,
        };
      });
    });
  };
  const handleResourceChange = (uid: string) => {
    const allIts = document
      .getElementById(`resource-${uid}`)
      ?.querySelectorAll('input');

    formData.flResources.forEach((x: any) => {
      if (x.flResourceId === Number(allIts![0].id)) {
        updateProjectRes.mutate({
          flResourceId: Number(allIts![0].id),
          title: allIts![0].value,
        });
        setFormData((prevState: any) => {
          const index = prevState.flResources.findIndex(
            (el: any) => el.flResourceId === Number(allIts![0].id)
          );
          if (index > -1) {
            prevState.flResources[index].title = allIts![0].value;
          }
          return {
            ...prevState,
          };
        });
      }
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Edit Project</h2>
        <input type="text" defaultValue={formData.name} id="name" />
        <textarea defaultValue={formData.description} id="description" />
        <div className={styles.dateTimeZoneContainer}>
          <p className={styles.heading1}>Project Timeline</p>
          <p className={styles.heading2}>Preferred Timezone</p>
          <div className={styles.inputsWrapper}>
            <input
              type="date"
              defaultValue={formData.timeOfCompletion}
              id="dueDate"
              className={styles.datePick}
            />
            <Select
              defaultValue={selectedTimeZones}
              isMulti
              styles={customStyles}
              options={formatTimeZones()}
              onChange={options => setSelectedTimeZones(options)}
            />
          </div>
        </div>
        <p className={styles.secHead}>Budget</p>
        <input
          type="number"
          defaultValue={formData.budget}
          id="budget"
          readOnly
        />
        <p className={styles.secHead}>Resources Required</p>
        <div id="resourcesContainer">
          {formData.flResources.map(
            (resource: {
              flResourceId: string | undefined;
              title: string | undefined;
            }) => {
              const uid = getRandomString(5);
              return (
                <div
                  key={getRandomString(5)}
                  className={styles.savedResContainer}
                >
                  <span
                    className={styles.wrapIconAndInput}
                    id={`resource-${uid}`}
                    onBlur={() => handleResourceChange(uid)}
                  >
                    <input
                      id={resource?.flResourceId}
                      type="text"
                      defaultValue={resource?.title}
                    />
                    <button className={styles.cancelBtn}>
                      <div
                        onClick={() => handleRemoveResource(uid)}
                        className={styles.cancelIcon}
                      >
                        ❌
                      </div>
                    </button>
                  </span>
                </div>
              );
            }
          )}
          {Array.from(Array(addMoreResources.counter))?.map((c, index) => {
            const uid = getRandomString(5);
            return (
              <div key={index} id={uid} className={styles.addResWrap}>
                <span
                  className={styles.wrapIconAndInput}
                  id={`resource-${uid}`}
                  onBlur={() => handleResourceChange(uid)}
                >
                  <input type="text" onBlur={e => createNewProjectRes(e)} />
                  <button className={styles.cancelBtn}>
                    <div
                      onClick={() => handleRemoveResource(uid)}
                      className={styles.cancelIcon}
                    >
                      ❌
                    </div>
                  </button>
                </span>
              </div>
            );
          })}
        </div>
        <button
          onClick={e => {
            handleAddResource(e);
          }}
          className={styles.addMore}
        >
          Add More Resources +
        </button>
        <div id="categoriesContainer" className={styles.catBudgetWrap}>
          <p className={styles.head1}>Category</p>
          <p className={styles.head2}>% of Budget</p>
          {formData.flProjectCategory.map(
            (category: {
              flProjectCategoryId: string | undefined;
              categoryName: string | readonly string[] | undefined;
              percentageAllocation: number | readonly string[] | undefined;
            }) => {
              const uid = getRandomString(5);
              return (
                <div key={getRandomString(5)} id={uid}>
                  <span
                    className={styles.inlineIt}
                    id={`resource-category-${uid}`}
                    onBlur={() => handleCategoryChange(uid)}
                  >
                    <input
                      type="text"
                      defaultValue={category.categoryName}
                      className={styles.stylesItInline}
                      id={category?.flProjectCategoryId}
                    />

                    <span
                      className={clsx(
                        styles.wrapIconAndInput,
                        styles.budgetNum
                      )}
                    >
                      <input
                        type="text"
                        defaultValue={category.percentageAllocation}
                        className={styles.stylesItInline}
                      />
                      <button
                        onClick={() => handleCategoryDelete(uid)}
                        className={styles.cancelBtn}
                      >
                        <div className={styles.cancelIcon}>❌</div>
                      </button>
                    </span>
                  </span>
                </div>
              );
            }
          )}
          {Array.from(Array(addMoreCategories.counter)).map((c, index) => {
            const uid = getRandomString(5);
            return (
              <div key={index} className={styles.catContainer}>
                <span
                  className={styles.inlineIt}
                  id={`resource-category-${uid}`}
                  onBlur={() => handleCategoryChange(uid)}
                >
                  <input type="text" className={styles.stylesItInline} />
                  <span
                    className={clsx(styles.wrapIconAndInput, styles.budgetNum)}
                  >
                    <input type="text" className={styles.stylesItInline} />
                    <button
                      onClick={() => handleCategoryDelete(uid)}
                      className={styles.cancelBtn}
                    >
                      <div className={styles.cancelIcon}>❌</div>
                    </button>
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        <button
          onClick={e => handleAddCategories(e)}
          className={styles.addMore}
        >
          Add More Categories +
        </button>
      </div>
      <div className={styles.centerBtn}>
        <button onClick={e => handleSubmit(e)} className={styles.saveBtn}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default EditProjectForm;
