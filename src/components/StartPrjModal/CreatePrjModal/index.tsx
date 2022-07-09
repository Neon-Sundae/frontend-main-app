import { FC, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import styles from './index.module.scss';
import Select from 'react-select';
import timezoneData from 'assets/data/timezones.json';
import { customStyles } from './selectStyles';
import getRandomString from 'utils/getRandomString';
import toast, { Toaster } from 'react-hot-toast';
import { useMutation } from 'react-query';
import config from 'config';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import { json } from 'stream/consumers';
interface ICreatePrjProps {
  onNext: () => void;
  onClose: () => void;
  orgId: number;
}

const CreatePrjModal: FC<ICreatePrjProps> = ({ onClose, onNext, orgId }) => {
  const navigate = useNavigate();
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
    name: '',
    description: '',
    timeOfCompletion: '',
    budget: '',
    preferredTimeZones: [],
    organisationId: '',
    flResources: [],
    flProjectCategory: [{ categoryName: '', percentageAllocation: '' }],
  });
  const [error, setError] = useState<any>({
    message: '',
  });
  const [options, setOptions] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<any>(null);
  const [addMoreResources, setAddMoreResources] = useState<any>({ counter: 0 });
  const [addMoreCategories, setAddMoreCategories] = useState<any>({
    counter: 0,
  });

  const [submit, setSubmit] = useState<boolean>(false);

  const { isLoading: isLoading, mutate: createProject } = useMutation(
    async () => {
      return await fetch(`${config.ApiBaseUrl}/fl-project`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    },
    {
      onSuccess: async (res) => {
        const body = await res.json();

        navigate(`/project/${body.flProjectId}`);
      },
      onError: (err) => {
        console.log('err', err);
        console.log(setFormData({}));
      },
    }
  );

  useEffect(() => {
    setFormData((prevState: any) => {
      const selectedOptionsLabel = selectedOptions?.map((option: any) => {
        return option.label;
      });
      // if selectedOptionslabel has length of 1 or more
      if (selectedOptionsLabel?.length === 1)
        prevState.preferredTimeZones = selectedOptionsLabel[0];
      prevState.preferredTimeZones = selectedOptionsLabel?.join(', ');
      return {
        ...prevState,
      };
    });
  }, [selectedOptions]);

  useEffect(() => {
    if (submit) {
      createProject();
    }

    if (!formData.organisationId) {
      setFormData((prevState: any) => {
        prevState.organisationId = orgId;
        return {
          ...prevState,
        };
      });
    }
    if (formData.name === '' || formData.description === '') {
      setError((prevState: any) => ({
        ...prevState,
        message: 'Please add project name and description',
      }));
    } else if (formData.timeOfCompletion === '') {
      setError((prevState: any) => ({
        ...prevState,
        message: 'Please add a due date',
      }));
    } else if (formData.preferredTimeZones === '') {
      setError((prevState: any) => ({
        ...prevState,
        message: 'Please add a timezone',
      }));
    } else if (formData.flResources.length === 0) {
      setError((prevState: any) => ({
        ...prevState,
        message: 'Please add atleast one resource',
      }));
      return;
    } else if (
      formData.flProjectCategory[0].categoryName === '' ||
      formData.flProjectCategory[0].percentageAllocation === ''
    ) {
      setError((prevState: any) => ({
        ...prevState,
        message: 'Please add atleast one category and percentageAllocation',
      }));
      return;
    } else if (
      formData.flResources.length !== 0 ||
      formData.flProjectCategory.length !== 0
    ) {
      setError((prevState: any) => ({
        ...prevState,
        message: '',
      }));
    } else {
      // do nothing
    }
  }, [formData, submit]);

  const handleAddResource = () =>
    setAddMoreResources((prevState: any) => ({
      counter: prevState.counter + 1,
    }));

  const handleResourceChange = (e: any) => {
    e.preventDefault();
    setFormData((prevState: any) => {
      const target = e.target as HTMLInputElement;
      if (target.value === '') {
        prevState.flResources = [];
        return {
          ...prevState,
        };
      }
      if (target.value !== '')
        prevState.flResources.indexOf(target.value) === -1
          ? prevState.flResources.push(target.value)
          : setError((prevState: any) => ({
              ...prevState,
              message: 'Duplicate resources not allowed',
            }));
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
      prevState.flResources.splice(prevState.flResources.indexOf(input), 1);
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
      const index = prevState.flProjectCategory.findIndex(
        (x: any) => x.categoryName === input
      );
      if (index > -1) prevState.flProjectCategory.splice(index, 1);
      return {
        ...prevState,
      };
    });
  };

  const handleAddProject = (e: any) => {
    if (error.message !== '') toast.error(error.message);
    if (error.message === '') {
    }
    const temp: any = [];
    setFormData((prevState: any) => {
      prevState.flResources?.map((resource: any) => {
        // find resource in temp array and if its not there add it
        if (temp.indexOf({ title: resource }) === -1) {
          temp.push({ title: resource });
        }
      });
      prevState.flResources = temp;
      const isoDate = new Date(prevState.timeOfCompletion);
      prevState.timeOfCompletion = isoDate.toISOString();
      // get sum of project category percentage allocation
      const sum = prevState.flProjectCategory.reduce(
        (acc: number, curr: any) => acc + curr.percentageAllocation,
        0
      );
      prevState.budget = sum;
      return {
        ...prevState,
      };
    });
    setSubmit(true);
  };

  return (
    <>
      <Toaster />
      <Modal
        onClose={() => onClose()}
        width="700px"
        height="80vh"
        overflowY={'auto'}
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
                      name: e.target.value,
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
                      description: e.target.value,
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
                  {/* FIXME: move input to seperate comp */}
                  <input
                    className={styles.input}
                    type="date"
                    id="dueDate"
                    placeholder="Project Due Date"
                    style={{ width: '300px' }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeOfCompletion: e.target.value,
                      })
                    }
                  />
                  &nbsp; &nbsp;
                  <span style={{ position: 'relative' }}>
                    <label style={{ position: 'absolute', top: '-35px' }}>
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
                  {Array.from(Array(addMoreResources.counter))?.map(
                    (c, index) => {
                      const uId = getRandomString(5);
                      return (
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
                            <div
                              style={{
                                color: 'transparent',
                                textShadow: '0 0 0 white',
                              }}
                            >
                              ❌
                            </div>
                          </span>
                        </div>
                      );
                    }
                  )}
                  {formData.flResources?.map((element: any, index: any) => {
                    <h5 key={index}>{element}</h5>;
                  })}
                </div>
                <div>
                  <p className={styles.pointer} onClick={handleAddResource}>
                    Add more resources <span className={styles.plus}>+</span>
                  </p>
                </div>
              </div>
              <br />
              <div>
                <br />
                <h4>Budget</h4>
                <br />
                <input
                  type="text"
                  id="name"
                  placeholder="Write a category"
                  className={styles.input}
                  onChange={(e) =>
                    setFormData((prevState: any) => {
                      prevState.flProjectCategory[0].categoryName =
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
                  <label style={{ position: 'absolute', top: '-49px' }}>
                    % of Budget
                  </label>
                  <input
                    type="text"
                    id="percentageAllocation"
                    className={styles.input}
                    placeholder=""
                    style={{ width: '48%' }}
                    onChange={(e) =>
                      setFormData((prevState: any) => {
                        prevState.flProjectCategory[0].percentageAllocation =
                          parseFloat(e.target.value);
                        return {
                          ...prevState,
                        };
                      })
                    }
                  />
                </span>
                {Array.from(Array(addMoreCategories.counter))?.map(
                  (c, index) => {
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
                              prevState.flProjectCategory.push({
                                categoryName: e.target.value,
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
                            id="percentageAllocation"
                            className={styles.input}
                            placeholder=""
                            style={{ width: '48%' }}
                            onBlur={(e) =>
                              setFormData((prevState: any) => {
                                prevState.flProjectCategory[
                                  prevState.flProjectCategory.length - 1
                                ].percentageAllocation = parseFloat(
                                  e.target.value
                                );
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
                            <div
                              style={{
                                color: 'transparent',
                                textShadow: '0 0 0 white',
                              }}
                            >
                              ❌
                            </div>
                          </span>
                        </span>
                      </div>
                    );
                  }
                )}
                <p className={styles.pointer} onClick={handleAddCategory}>
                  Add more Categories <span className={styles.plus}>+</span>
                </p>
                <br />
              </div>
              <br />
              <footer
                style={{ textAlign: 'center' }}
                onClick={(e) => e.preventDefault()}
              >
                <button
                  className={styles.saveBtn}
                  onClick={(e) => handleAddProject(e)}
                >
                  SAVE
                </button>
                &nbsp; &nbsp;
              </footer>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreatePrjModal;
