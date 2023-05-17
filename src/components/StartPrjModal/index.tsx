import { FC, useState } from 'react';
import { ReactComponent as DummyImage1 } from 'assets/illustrations/task/task-dummy-1.svg';
import { ReactComponent as Add } from 'assets/illustrations/icons/add.svg';
import BaseModal from 'components/Home/BaseModal';
import StartOrgModal from 'components/StartOrgModal';
import toast, { Toaster } from 'react-hot-toast';
import getRandomString from 'utils/getRandomString';
import { useFetchUserOrganisations } from 'queries/organisation';
import { useFetchUserDetailsWrapper } from 'queries/user';
import styles from './index.module.scss';
import CreateUsingProjectTemplate from './CreateUsingProjectTemplate';

interface IStartPrjProps {
  onClose: () => void;
}

const StartPrjModal: FC<IStartPrjProps> = ({ onClose }) => {
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [selected, setSelected] = useState<any>(0);

  const userData = useFetchUserDetailsWrapper();
  const { data: userOrganisations, isLoading } = useFetchUserOrganisations(
    userData?.user.userId
  );

  if (isLoading) return null;

  const handleOrgModalShow = () => {
    setShowOrgModal(true);
  };
  const handleOrgModalClose = () => {
    setShowOrgModal(false);
  };
  if (showOrgModal) {
    return <StartOrgModal onClose={handleOrgModalClose} />;
  }
  const handleNext = () => {
    if (!selected) toast.error('Please select an organization');
    else setShowCreateProjectModal(true);
  };
  return (
    <div>
      {!showCreateProjectModal ? (
        <>
          <Toaster />
          <BaseModal
            onClose={onClose}
            header="Choose an organisation"
            onNext={handleNext}
            showBtn
            buttonText="Next"
          >
            <p className={styles.promptPara}>
              To Start a Project you need to choose an organisation
            </p>
            <section className={styles['org-list']}>
              {userOrganisations?.map((org: any) => {
                return (
                  <Organisation
                    key={getRandomString(5)}
                    id={org.organisationId}
                    organisation={org.name}
                    organisationImage={
                      org.profileImage ? (
                        <img
                          src={org.profileImage}
                          alt={org.name}
                          className={styles['org-image']}
                        />
                      ) : (
                        <DummyImage1
                          style={{
                            borderRadius: '50%',
                          }}
                          width={102.44}
                          height={102.44}
                        />
                      )
                    }
                    onClick={() => setSelected(org.organisationId)}
                    selected={selected}
                  />
                );
              })}
              <section
                className={styles.container}
                onClick={handleOrgModalShow}
              >
                <div className={styles['icon-cont']}>
                  <Add width={30} height={30} />
                </div>
                <p>Add an organisation</p>
              </section>
              <footer
                className={styles.btnCont}
                style={{ position: 'absolute', bottom: '8%', left: '27vw' }}
              />
            </section>
          </BaseModal>
        </>
      ) : (
        <CreateUsingProjectTemplate
          onClose={onClose}
          orgId={selected}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

interface IOrgProps {
  id: any;
  organisation: string;
  organisationImage: JSX.Element;
  onClick: () => any;
  selected: number | null;
}

const Organisation: FC<IOrgProps> = ({
  id,
  organisation,
  organisationImage,
  onClick,
  selected,
}) => {
  return (
    <div className={selected === id ? styles.selected : ''}>
      <section
        style={{ padding: '12px' }}
        className={styles.container}
        onClick={onClick}
      >
        {organisationImage}
        {selected === id ? (
          <strong>
            <p>{organisation}</p>{' '}
          </strong>
        ) : (
          <p>{organisation}</p>
        )}
      </section>
    </div>
  );
};

export default StartPrjModal;
