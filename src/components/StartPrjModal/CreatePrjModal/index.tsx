import { FC, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import styles from './index.module.scss';
import Select from 'react-select';
import timezoneData from 'assets/data/timezones.json';
import { customStyles } from './selectStyles';
import getRandomString from 'utils/getRandomString';
interface ICreatePrjProps {
  onNext: () => void;
  onClose: () => void;
}

const CreatePrjModal: FC<ICreatePrjProps> = ({ onClose, onNext }) => {
  const temp: any = [];

  useEffect(() => {
    if (!temp.length) {
      timezoneData.forEach((element) => {
        temp.push({ value: element.value, label: element.text });
      });
      setOptions(temp);
    }
  }, []);

  const [formData, setFormData] = useState<any>({
    projectName: '',
    projectDescription: '',
    projectDue: '',
    projectTimezones: [],
    projectOrganisation: '',
    projectAddResources: [],
    projectCategoriesAndBudget: [{ category: '', budget: '' }],
  });

  const [options, setOptions] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<any>(null);
  const [addMoreResources, setAddMoreResources] = useState<any>({ counter: 0 });
  const [addMoreCategories, setAddMoreCategories] = useState<any>({
    counter: 0,
  });

  const handleAddResource = () =>
    setAddMoreResources((prevState: any) => ({
      counter: prevState.counter + 1,
    }));

  const handleResourceChange = (e: any) => {
    e.preventDefault();
    setFormData((prevState: any) => {
      const target = e.target as HTMLInputElement;
      if (target.value === '') {
        prevState.projectAddResources = [];
        return {
          ...prevState,
        };
      }
      if (target.value !== '')
        prevState.projectAddResources.indexOf(target.value) === -1
          ? prevState.projectAddResources.push(target.value)
          : alert('Resource with same name already exist');
      return {
        ...prevState,
      };
    });
  };

  const handleRemoveResource = (uId: string) => {
    const input = document
      .getElementById(`${uId}`)
      ?.querySelector('input')?.value;
    // @ts-ignore: Object is possibly 'null'.
    document.getElementById(`${uId}`).remove();
    setFormData((prevState: any) => {
      prevState.projectAddResources.splice(
        prevState.projectAddResources.indexOf(input),
        1
      );
      return {
        ...prevState,
      };
    });
  };

  const handleAddCategory = () =>
    setAddMoreCategories((prevState: any) => ({
      counter: prevState.counter + 1,
    }));

  const handleRemoveCategory = (uId: string) => {
    const input = document
      .getElementById(`resource-category-${uId}`)
      ?.querySelector('input')?.value;
    // @ts-ignore: Object is possibly 'null'.
    document.getElementById(`resource-category-${uId}`).remove();
    setFormData((prevState: any) => {
      const index = prevState.projectCategoriesAndBudget.findIndex(
        (x: any) => x.category === input
      );
      if (index > -1) prevState.projectCategoriesAndBudget.splice(index, 1);
      return {
        ...prevState,
      };
    });
  };

  return (
    <Modal
      onClose={() => onClose()}
      width="700px"
      height="80vh"
      overflowY="auto"
    >
      <div className={styles.container}>
        <div className={styles.formContentWrap}>
          <form>
            <h2>Start a Project</h2>
            <br />
            <br />
            <div>
              <input
                className={styles.input}
                type="text"
                id="name"
                placeholder="Project Name"
                style={{ width: '100%' }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectName: e.target.value,
                  })
                }
              />
            </div>
            <br />
            <div>
              <textarea
                id="description"
                placeholder="Description"
                className={styles.input}
                style={{ width: '100%', height: '100px' }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectDescription: e.target.value,
                  })
                }
              />
            </div>
            <br />
            <div>
              <h4>Project Timeline</h4>
              <br />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <input
                  className={styles.input}
                  type="date"
                  id="dueDate"
                  placeholder="Project Due Date"
                  style={{ width: '300px' }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      projectDue: e.target.value,
                    })
                  }
                />
                &nbsp; &nbsp;
                <span style={{ position: 'relative' }}>
                  <label style={{ position: 'absolute', top: '-42px' }}>
                    <h4 style={{ width: '220px' }}>Preferred Timezones</h4>
                  </label>
                  <Select
                    options={options}
                    styles={customStyles}
                    isMulti
                    onChange={(options) => setSelectedOptions(options)}
                  />
                </span>
              </div>
              <br />
            </div>
            <div>
              <br />

              <h4>Resources needed</h4>
              <br />
              <div>
                <input
                  type="text"
                  id="resource-name"
                  placeholder="Add a resource"
                  className={styles.input}
                  style={{ width: '100%' }}
                  onBlur={(e) => {
                    handleResourceChange(e);
                  }}
                />
                {Array.from(Array(addMoreResources.counter)).map((c, index) => {
                  const uId = getRandomString(5);
                  return (
                    <>
                      <div id={`${uId}`} key={index}>
                        <div className={styles.addHeight}></div>
                        <input
                          type="text"
                          placeholder="Add a resource"
                          style={{ width: '100%' }}
                          className={styles.input}
                          onBlur={(e) => {
                            handleResourceChange(e);
                          }}
                        />
                        <span
                          id={`resource-cancel-${index}`}
                          className={styles.inputIcon}
                          onClick={() => {
                            handleRemoveResource(uId);
                          }}
                        >
                          ❌
                        </span>
                      </div>
                    </>
                  );
                })}
                {formData.projectAddResources.map(
                  (element: any, index: any) => {
                    <h5 key={index}>{element}</h5>;
                  }
                )}
              </div>
              <div>
                <p className={styles.pointer} onClick={handleAddResource}>
                  Add more resources <span className={styles.plus}>+</span>
                </p>
              </div>
            </div>
            <br />
            <div>
              <h4>Budget</h4>
              <br />
              <input
                type="text"
                id="name"
                placeholder="Write a category"
                className={styles.input}
                onChange={(e) =>
                  setFormData((prevState: any) => {
                    prevState.projectCategoriesAndBudget[0].category =
                      e.target.value;
                    return {
                      ...prevState,
                    };
                  })
                }
                style={{ width: '48%' }}
              />
              &nbsp; &nbsp; &nbsp;
              <span style={{ position: 'relative' }}>
                <label style={{ position: 'absolute', top: '-42px' }}>
                  % of Budget
                </label>
                <input
                  type="text"
                  id="budget"
                  className={styles.input}
                  placeholder="Budget"
                  style={{ width: '48%' }}
                  onChange={(e) =>
                    setFormData((prevState: any) => {
                      prevState.projectCategoriesAndBudget[0].budget =
                        e.target.value;
                      return {
                        ...prevState,
                      };
                    })
                  }
                />
              </span>
              {Array.from(Array(addMoreCategories.counter)).map((c, index) => {
                const uId: string = getRandomString(5);
                return (
                  <div key={index} id={`resource-category-${uId}`}>
                    <div className={styles.addHeight}></div>
                    <input
                      type="text"
                      id="name"
                      placeholder="Write a category"
                      className={styles.input}
                      style={{ width: '48%' }}
                      onBlur={(e) =>
                        setFormData((prevState: any) => {
                          prevState.projectCategoriesAndBudget.push({
                            category: e.target.value,
                          });
                          return {
                            ...prevState,
                          };
                        })
                      }
                    />
                    &nbsp; &nbsp; &nbsp;
                    <span style={{ position: 'relative' }}>
                      <input
                        type="text"
                        id="budget"
                        className={styles.input}
                        placeholder="Budget"
                        style={{ width: '48%' }}
                        onBlur={(e) =>
                          setFormData((prevState: any) => {
                            prevState.projectCategoriesAndBudget[
                              prevState.projectCategoriesAndBudget.length - 1
                            ].budget = e.target.value;
                            return {
                              ...prevState,
                            };
                          })
                        }
                      />
                      <span
                        id={`resource-cancel-${uId}`}
                        className={styles.inputIcon}
                        onClick={() => {
                          handleRemoveCategory(uId);
                        }}
                      >
                        X
                      </span>
                    </span>
                  </div>
                );
              })}
              <p className={styles.pointer} onClick={handleAddCategory}>
                Add more Categories <span className={styles.plus}>+</span>
              </p>
              <br />
            </div>
            <br />
            <footer
              style={{ textAlign: 'center', marginTop: '10px' }}
              onClick={(e) => e.preventDefault()}
            >
              <button className={styles.saveBtn}>SAVE</button> &nbsp; &nbsp;
            </footer>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePrjModal;
