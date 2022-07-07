import { FC, useEffect, useState } from 'react';
import { ReactComponent as DummyImage1 } from 'assets/illustrations/task/task-dummy-1.svg';
import { ReactComponent as Edit } from 'assets/illustrations/icons/stroke.svg';
import BaseModal from 'components/Home/BaseModal';
import StartOrgModal from 'components/StartOrgModal';
import styles from './index.module.scss';

import CreatePrjModal from './CreatePrjModal';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from 'react-query';
import getRandomString from 'utils/getRandomString';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import config from 'config';
interface IStartPrjProps {
  onClose: () => void;
}

let organizationId: number = 0;
const StartPrjModal: FC<IStartPrjProps> = ({ onClose }) => {
  const userId = useSelector((state: RootState) => state.user.user?.userId);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const { isLoading, error, data, isFetching } = useQuery('userOrgs', () =>
    fetch(`${config.ApiBaseUrl}/organisation/user/${userId}`, {
      method: 'GET',
    }).then((response) => response.json())
  );
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
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
    {
      !organizationId
        ? toast.error('Please select an organization')
        : setShowCreateProjectModal(true);
    }
  };

  return (
    <>
      {!showCreateProjectModal ? (
        <>
          <Toaster />
          <BaseModal
            onClose={onClose}
            header="Choose an organisation to start a project"
            onNext={handleNext}
            showBtn={true}
          >
            <section className={styles['org-list']}>
              {data.map((org: any) => (
                <Organisation
                  key={getRandomString(5)}
                  id={org.organisationId}
                  organisation={org.name}
                  organisationImage={
                    org.bannerImage ? (
                      org.bannerImage
                    ) : (
                      <DummyImage1 width={135} height={135} />
                    )
                  }
                />
              ))}
              <section
                className={styles.container}
                onClick={handleOrgModalShow}
              >
                <div className={styles['icon-cont']}>
                  <Edit width={30} height={30} />
                </div>
                <p>Add an organisation</p>
              </section>
              <footer
                className={styles.btnCont}
                style={{ position: 'absolute', bottom: '8%', left: '27vw' }}
              ></footer>
            </section>
          </BaseModal>
        </>
      ) : (
        <CreatePrjModal
          onClose={onClose}
          onNext={() => {
            console.log('next!');
          }}
          orgId={organizationId}
        />
      )}
    </>
  );
};

interface IOrgProps {
  id: number;
  organisation: string;
  organisationImage: JSX.Element;
  style?: React.CSSProperties;
}

const Organisation: FC<IOrgProps> = ({
  id,
  organisation,
  organisationImage,
}) => {
  const [orgId, setOrgId] = useState(0);
  const [resetSelect, setResetSelect] = useState(false);
  useEffect(() => {
    if (!resetSelect) organizationId = 0;
  }, [resetSelect]);
  return (
    <section
      style={{ padding: '12px' }}
      className={styles.container}
      onClick={() => {
        setResetSelect((v) => !v);
        if (resetSelect) setOrgId(0);
        else setOrgId(id);
        organizationId = id;
      }}
    >
      {organisationImage}
      {orgId != 0 ? (
        <p>
          <strong>{organisation}</strong>
        </p>
      ) : (
        <p>{organisation}</p>
      )}
    </section>
  );
};

export default StartPrjModal;
