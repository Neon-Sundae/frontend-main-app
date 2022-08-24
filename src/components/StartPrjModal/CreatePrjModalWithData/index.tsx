import { FC } from 'react';
import Modal from 'components/Modal';

import EditProjectForm from '../EditProjectForm';

interface CreatePrjModalWithDataProps {
  onClose: () => void;
}

const CreatePrjModalWithData: FC<CreatePrjModalWithDataProps> = ({
  onClose,
}) => {
  return (
    <Modal onClose={onClose} width="700px" overflowY="auto" maxHeight="90vh">
      <EditProjectForm onClose={onClose} />
    </Modal>
  );
};

export default CreatePrjModalWithData;
