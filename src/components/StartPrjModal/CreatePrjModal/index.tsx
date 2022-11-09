import { FC, useEffect, useState } from 'react';
import { RootState } from 'reducers';
import { useSelector } from 'react-redux';
import Modal from 'components/Modal';
import Select from 'react-select';
import timezoneData from 'assets/data/timezones.json';
import getRandomString from 'utils/getRandomString';
import toast, { Toaster } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import config from 'config';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import { customStyles } from './selectStyles';
import styles from './index.module.scss';

interface ICreatePrjProps {
  onNext: () => void;
  onClose: () => void;
  orgId: number;
}

const CreatePrjModal: FC<ICreatePrjProps> = ({ onClose, onNext, orgId }) => {
  const navigate = useNavigate();

  const profile = useSelector((state: RootState) => state.profile.profile);

  const temp: any = [];
  useEffect(() => {
    if (!temp.length) {
      timezoneData.forEach(element => {
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

  const { isLoading, mutate: createProject } = useMutation(
    async () => {
      return fetch(`${config.ApiBaseUrl}/fl-project`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    },
    {
      onSuccess: async res => {
        const body = await res.json();
        navigate(`/project/${body.flProjectId_uuid}`);
      },
      onError: err => {
        console.log('err', err);
        setFormData({});
      },
    }
  );

  useEffect(() => {
    setFormData((prevState: any) => {
      const selectedOptionsLabel = selectedOptions?.map((option: any) => {
        return option.label;
      });
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
    } else if (
      formData.flProjectCategory[0].categoryName === '' ||
      formData.flProjectCategory[0].percentageAllocation === ''
    ) {
      setError((prevState: any) => ({
        ...prevState,
        message: 'Please add atleast one category and percentageAllocation',
      }));
    } else if (
      formData?.flResources.length !== 0 ||
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
    if (profile && profile.profileSmartContractId) {
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
        return {
          ...prevState,
        };
      });
      setSubmit(true);
    } else {
      toast.error('Please mint your profile');
      navigate(`/profile/${profile?.profileId}`);
    }
  };
  return (
    <>
      <Toaster />
      <Modal
        onClose={() => onClose()}
        width="700px"
        maxHeight="85vh"
        overflowY="auto"
        title="Start a Project"
      >
        <div className={styles.container}>
          <form>
            <div className={styles.row}>
              <div>
                <p className={styles.fieldNames}>Name</p>
                <input
                  className={styles.input}
                  type="text"
                  id="name"
                  placeholder="Project Name"
                  style={{ width: '100%' }}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <p className={styles.fieldNames}>Budget</p>
                <div className={styles.budget}>
                  <input
                    className={styles.input}
                    type="number"
                    id="budget"
                    placeholder="Project Budget"
                    style={{
                      width: '100%',
                      borderRadius: '5.6491px 0px 0px 5.6491px',
                    }}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        budget: Number(e.target.value),
                      })
                    }
                  />
                  <div className={styles.currency}>USDC</div>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              <div style={{ width: '100%' }}>
                <p className={styles.fieldNames}>Description</p>
                <textarea
                  id="description"
                  placeholder="Description"
                  className={styles.input}
                  style={{ width: '100%', height: '100px' }}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <p className={styles.fieldNames}>Project est. End Date</p>
                <input
                  className={styles.input}
                  type="date"
                  id="dueDate"
                  placeholder="Project Due Date"
                  onChange={e =>
                    setFormData({
                      ...formData,
                      timeOfCompletion: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <p className={styles.fieldNames}>Preferred Timezones</p>
                <Select
                  options={options}
                  styles={customStyles}
                  isMulti
                  onChange={options => setSelectedOptions(options)}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div style={{ width: '100%' }}>
                <p className={styles.fieldNames}>Talents Needed</p>
                <input
                  type="text"
                  id="resource-name"
                  placeholder="Talent needed for Projects ( e.g.  “JavaScript Developer”, “UI/UX Designer”)"
                  className={styles.input}
                  style={{ width: '100%' }}
                  onBlur={e => {
                    handleResourceChange(e);
                  }}
                />
                {Array.from(Array(addMoreResources.counter))?.map(
                  (c, index) => {
                    const uId = getRandomString(5);
                    return (
                      <div id={`${uId}`} key={index}>
                        <div className={styles.addHeight} />
                        <input
                          type="text"
                          placeholder="Talent needed for Projects ( e.g.  “JavaScript Developer”, “UI/UX Designer”)"
                          style={{ width: '100%' }}
                          className={styles.input}
                          onBlur={e => {
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
                              position: 'absolute',
                              right: '-40px',
                            }}
                          >
                            ❌
                          </div>
                        </span>
                      </div>
                    );
                  }
                )}
                {formData?.flResources?.map((element: any, index: any) => {
                  <h5 key={index}>{element}</h5>;
                })}
                <div>
                  <p className={styles.pointer} onClick={handleAddResource}>
                    Add more resources <span>+</span>
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.row} style={{ marginBottom: '5px' }}>
              <div>
                <p className={styles.fieldNames}>Categories</p>
                <input
                  type="text"
                  id="category"
                  placeholder="Category name (“Website Design”)"
                  className={styles.input}
                  onChange={e =>
                    setFormData((prevState: any) => {
                      prevState.flProjectCategory[0].categoryName =
                        e.target.value;
                      return {
                        ...prevState,
                      };
                    })
                  }
                />
              </div>
              <div>
                <p className={styles.fieldNames}>Percentage of Budget</p>
                <div className={styles.budget}>
                  <input
                    type="number"
                    id="percentageAllocation"
                    className={styles.input}
                    placeholder="% of budget for this category"
                    style={{
                      width: '100%',
                      borderRadius: '5.6491px 0px 0px 5.6491px',
                    }}
                    onChange={e =>
                      setFormData((prevState: any) => {
                        prevState.flProjectCategory[0].percentageAllocation =
                          parseFloat(e.target.value);
                        return {
                          ...prevState,
                        };
                      })
                    }
                  />
                  <div className={styles.currency}>%</div>
                </div>
              </div>
            </div>
            {Array.from(Array(addMoreCategories.counter))?.map((c, index) => {
              const uId: string = getRandomString(5);
              return (
                <div
                  key={index}
                  id={`resource-category-${uId}`}
                  className={styles.row}
                  style={{ marginBottom: '5px' }}
                >
                  <input
                    type="text"
                    id="name"
                    placeholder="Category name (“Website Design”)"
                    className={styles.input}
                    onBlur={e =>
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
                  <span style={{ position: 'relative' }}>
                    <div className={styles.budget}>
                      <input
                        type="text"
                        id="percentageAllocation"
                        className={styles.input}
                        placeholder="% of budget for this category"
                        style={{
                          width: '100%',
                          borderRadius: '5.6491px 0px 0px 5.6491px',
                        }}
                        onBlur={e =>
                          setFormData((prevState: any) => {
                            prevState.flProjectCategory[
                              prevState.flProjectCategory.length - 1
                            ].percentageAllocation = parseFloat(e.target.value);
                            return {
                              ...prevState,
                            };
                          })
                        }
                      />
                      <div className={styles.currency}>%</div>
                    </div>
                    <span
                      id={`resource-cancel-${uId}`}
                      className={styles.inputIcon}
                      onClick={() => {
                        handleRemoveCategory(uId);
                      }}
                    >
                      <div
                        style={{
                          marginLeft: '5px',
                          color: 'transparent',
                          textShadow: '0 0 0 white',
                          position: 'absolute',
                          right: '-40px',
                        }}
                      >
                        ❌
                      </div>
                    </span>
                  </span>
                </div>
              );
            })}
            <p className={styles.pointer} onClick={handleAddCategory}>
              Add more Categories <span>+</span>
            </p>
            <footer
              style={{ textAlign: 'center' }}
              onClick={e => e.preventDefault()}
            >
              <button
                className={styles.saveBtn}
                onClick={e => {
                  if (error.message.length) {
                    toast.error('Check for invalid or missing values!');
                  } else {
                    handleAddProject(e);
                  }
                }}
              >
                SAVE
              </button>
              &nbsp; &nbsp;
            </footer>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CreatePrjModal;
