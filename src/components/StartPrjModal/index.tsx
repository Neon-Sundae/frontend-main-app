import { FC, useEffect, useState } from 'react';
import { ReactComponent as DummyImage1 } from 'assets/illustrations/task/task-dummy-1.svg';
import { ReactComponent as Edit } from 'assets/illustrations/icons/stroke.svg';
import BaseModal from 'components/Home/BaseModal';
import StartOrgModal from 'components/StartOrgModal';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';

const data = [
  {
    orgId: 1,
    organisation: 'Axie Infinity',
    organisationImage: <DummyImage1 width={135} height={135} />,
  },
];

interface IStartPrjProps {
  onClose: () => void;
}
let organizationId: number = 0;
const StartPrjModal: FC<IStartPrjProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [showOrgModal, setShowOrgModal] = useState(false);

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
    if (!organizationId) {
      alert('Please select an organisation');
    } else {
      navigate(`/project/create`);
    }
  };

  return (
    <BaseModal
      onClose={onClose}
      header="Choose an organisation to start a project"
      onNext={handleNext}
    >
      <section className={styles['org-list']}>
        {data.map((org) => (
          <Organisation
            id={org.orgId}
            organisation={org.organisation}
            organisationImage={org.organisationImage}
            key={org.orgId}
          />
        ))}
        <section className={styles.container} onClick={handleOrgModalShow}>
          <div className={styles['icon-cont']}>
            <Edit width={30} height={30} />
          </div>
          <p>Add an organisation</p>
        </section>
      </section>
    </BaseModal>
  );
};

interface IOrgProps {
  id: number;
  organisation: string;
  organisationImage: JSX.Element;
}

const Organisation: FC<IOrgProps> = ({
  id,
  organisation,
  organisationImage,
}) => {
  const [orgId, setOrgId] = useState(0);
  const [resetSelect, setResetSelect] = useState(false);
  console.log(resetSelect);
  return (
    <section
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
