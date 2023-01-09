import Modal from 'components/Modal';
import { FC, MouseEvent, useEffect, useState } from 'react';
import getRandomString from 'utils/getRandomString';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import getGifPreview from 'utils/getGifPreview';
import styles from './index.module.scss';
import CreatePrjModal from '../CreatePrjModal';
import {
  useFetchAllProjectTemplates,
  useCreateProjectFromTemplate,
  useCreateTasksFromProjectTemplate,
} from './hooks';

interface ICreateUsingProjectTemplateProps {
  onClose: () => void;
  onNext: () => void;
  orgId: number;
  showModal?: boolean;
}

const CreateUsingProjectTemplate: FC<ICreateUsingProjectTemplateProps> = ({
  onClose,
  onNext,
  orgId,
  showModal,
}) => {
  const navigate = useNavigate();
  const [showProjectCreate, setShowProjectCreate] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [projectData, setProjectData] = useState<any>(null);

  useEffect(() => {
    if (projectData) {
      createProjectTasksFromTemplate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectData]);

  const fetchProjectTemplates = useFetchAllProjectTemplates(setCurrentTemplate);
  const createProjectFromTemplate =
    useCreateProjectFromTemplate(setProjectData);
  const createTasksFromProjectTemplate = useCreateTasksFromProjectTemplate();

  const filterSelectedTemplate = (selectedTemplate: any) =>
    setCurrentTemplate(selectedTemplate);

  if (showProjectCreate) {
    return <CreatePrjModal onClose={onClose} onNext={onNext} orgId={orgId} />;
  }

  const createTasksFromProjectTemplateFunc = () => {
    const temp: { [x: string]: any } = {};

    const flProjectCategoryData = projectData.flProjectCategory.map(
      (flProjectCategory: {
        flProjectCategoryId: number;
        categoryName: string;
      }) => {
        return {
          flProjectCategoryTemplateId: flProjectCategory.flProjectCategoryId,
          categoryName: flProjectCategory.categoryName,
        };
      }
    );

    currentTemplate?.flProjectCategoryTemplate?.forEach(
      (flProjectCategoryTemplate: {
        categoryName: string;
        tasksTemplate: any;
      }) => {
        temp[flProjectCategoryTemplate.categoryName] =
          flProjectCategoryTemplate.tasksTemplate;
      }
    );

    const mappedTasks = flProjectCategoryData.map(
      (flProjectCategory: {
        flProjectCategoryTemplateId: any;
        categoryName: string;
      }) => {
        return temp[flProjectCategory.categoryName].map(
          (task: { title: string; description: string }) => {
            return {
              ...task,
              flProjectCategoryTemplateId:
                flProjectCategory.flProjectCategoryTemplateId,
            };
          }
        );
      }
    );

    return mappedTasks.flat();
  };

  const createProjectTasksFromTemplate = () => {
    createTasksFromProjectTemplate.mutate({
      tasks: createTasksFromProjectTemplateFunc(),
    });

    navigate(`/project/${projectData.flProjectId_uuid}`);
  };

  const createProject = () => {
    const {
      flResourcesTemplate: resourcesFromProjectTemplate,
      flProjectCategoryTemplate: categoriesFromProjectTemplate,
    } = currentTemplate;

    const flResources = resourcesFromProjectTemplate.map(
      (resource: { title: string }) => ({ title: resource.title })
    );

    const flProjectCategory = categoriesFromProjectTemplate.map(
      (category: { categoryName: string; percentageAllocation: number }) => ({
        categoryName: category.categoryName,
        percentageAllocation: category.percentageAllocation,
      })
    );

    const {
      flProjectTemplateId,
      smartContractId,
      projectTaskContract,
      projectStatus,
      createdAt,
      updatedAt,
      flProjectCategoryTemplate,
      flResourcesTemplate,
      ...temp
    } = currentTemplate;

    const date = new Date();
    date.setDate(date.getDate() + 30);

    createProjectFromTemplate.mutate({
      ...temp,
      organisationId: orgId,
      flResources,
      flProjectCategory,
      timeOfCompletion: date.toISOString(),
    });
  };

  if (!showModal) {
    return (
      <div className={styles[`project-template-modal`]}>
        <div className={styles[`project-template-modal--picker`]}>
          <h2>Choose Template</h2>
          {fetchProjectTemplates.data?.map(
            (template: { name: string; flProjectTemplateId: number }) => (
              <TemplateOption
                title={template.name}
                key={getRandomString(5)}
                id={template.flProjectTemplateId.toString()}
                filterSelectedTemplate={() => filterSelectedTemplate(template)}
                selected={
                  currentTemplate?.flProjectTemplateId ===
                  template.flProjectTemplateId
                }
              />
            )
          )}
        </div>

        {currentTemplate && (
          <div className={styles[`project-template-modal--preview`]}>
            <div className={styles[`gif-preview`]}>
              <img
                src={getGifPreview(currentTemplate.name)}
                alt="template preview"
              />
            </div>
            <h2 className={styles[`template-name`]}>{currentTemplate?.name}</h2>
            <div className={styles[`text-content`]}>
              <p>{currentTemplate?.description}</p>
              <div className={styles.buttons}>
                <button onClick={createProject}>Get Template</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Modal
      onClose={onClose}
      width="1000px"
      height="700px"
      title="Use Project Template"
    >
      <div className={styles[`project-template-modal`]}>
        <div className={styles[`project-template-modal--picker`]}>
          <h2>Choose Template</h2>
          {fetchProjectTemplates.data?.map(
            (template: { name: string; flProjectTemplateId: number }) => (
              <TemplateOption
                title={template.name}
                key={getRandomString(5)}
                id={template.flProjectTemplateId.toString()}
                filterSelectedTemplate={() => filterSelectedTemplate(template)}
                selected={
                  currentTemplate?.flProjectTemplateId ===
                  template.flProjectTemplateId
                }
              />
            )
          )}
        </div>

        {currentTemplate && (
          <div className={styles[`project-template-modal--preview`]}>
            <div className={styles[`gif-preview`]}>
              <img
                src={getGifPreview(currentTemplate.name)}
                alt="template preview"
              />
            </div>
            <h2 className={styles[`template-name`]}>{currentTemplate?.name}</h2>
            <div className={styles[`text-content`]}>
              <p>{currentTemplate?.description}</p>
              <div className={styles.buttons}>
                <button onClick={createProject}>Get Template</button>
                <button onClick={() => setShowProjectCreate(true)}>
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
CreateUsingProjectTemplate.defaultProps = {
  showModal: true,
};

interface ITemplateOptionProps {
  id: string;
  title: string;
  filterSelectedTemplate: (templateId: number) => any;
  selected?: boolean;
}

const TemplateOption: FC<ITemplateOptionProps> = ({
  id,
  title,
  filterSelectedTemplate,
  selected,
}) => {
  const onClick = (e: MouseEvent<HTMLElement>) =>
    filterSelectedTemplate(Number(e.currentTarget.id));

  return (
    <div
      className={clsx(
        styles['template-option'],
        selected && styles['template-option--selected']
      )}
      onClick={onClick}
    >
      <p
        className={clsx(
          styles['template-option--title'],
          selected && styles['template-option--selected']
        )}
      >
        {title}
      </p>
    </div>
  );
};

TemplateOption.defaultProps = {
  selected: false,
};

export default CreateUsingProjectTemplate;
