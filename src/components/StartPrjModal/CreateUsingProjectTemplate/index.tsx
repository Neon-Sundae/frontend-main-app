import Modal from 'components/Modal';
import { FC, MouseEvent, useEffect, useState } from 'react';
import Loading from 'components/Loading';
import getRandomString from 'utils/getRandomString';
import clsx from 'clsx';
import styles from './index.module.scss';
import gif from './deleteme.gif';
import CreatePrjModal from '../CreatePrjModal';
import {
  fetchAllProjectTemplates,
  useCreateProjectFromTemplate,
} from './hooks';

interface ICreateUsingProjectTemplateProps {
  onClose: () => void;
  onNext: () => void;
  orgId: number;
}

const CreateUsingProjectTemplate: FC<ICreateUsingProjectTemplateProps> = ({
  onClose,
  onNext,
  orgId,
}) => {
  const [showProjectCreate, setShowProjectCreate] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);

  const useFetchProjectTemplates = fetchAllProjectTemplates(setCurrentTemplate);
  const createProjectFromTemplate = useCreateProjectFromTemplate();

  const filterSelectedTemplate = (selectedTemplate: any) =>
    setCurrentTemplate(selectedTemplate);

  if (showProjectCreate) {
    return <CreatePrjModal onClose={onClose} onNext={onNext} orgId={orgId} />;
  }

  const createProject = () => {
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
    createProjectFromTemplate.mutate({ ...temp, organisationId: orgId });
  };

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
          {useFetchProjectTemplates.data?.map(
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
              <img src={gif} alt="template preview" />
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
      className={styles['template-option']}
      style={{ border: selected ? '0.56px solid #fff' : '' }}
      onClick={e => onClick(e)}
      id={id}
    >
      <p
        className={clsx(
          styles['template-option--title'],
          selected ? 'selected' : ''
        )}
        style={{ color: selected ? '#fff' : '' }}
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
