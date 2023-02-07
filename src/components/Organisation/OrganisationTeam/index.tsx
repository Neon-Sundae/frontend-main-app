import {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  MouseEvent,
  SetStateAction,
  useState,
} from 'react';
import Modal from 'components/Modal';
import { ReactComponent as DeleteIcon } from 'assets/illustrations/icons/delete-2.svg';
import getDefaultAvatarSrc from 'utils/getDefaultAvatarSrc';
import {
  useAddManager,
  useDeleteOrganisationMember,
  useDeleteUserInvitation,
  useFetchOrganisationMembers,
  useTransferOwnership,
} from './hooks';
import styles from './index.module.scss';

const OrganisationTeam: FC = () => {
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showDeleteInvitationModal, setShowDeleteInvitationModal] =
    useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [memberId, setMemberId] = useState('');

  const { data, isLoading } = useFetchOrganisationMembers();
  const { addManagerInvitation } = useAddManager({
    modalStatus: setShowAddManagerModal,
  });
  const { transferOwnershipInvitation } = useTransferOwnership({
    modalStatus: setShowTransferModal,
  });
  const { deleteOrganisationMember } = useDeleteOrganisationMember({
    modalStatus: setShowDeleteUserModal,
  });
  const { deleteUserInvitation } = useDeleteUserInvitation({
    modalStatus: setShowDeleteInvitationModal,
  });

  const openAddManagerModal = () => setShowAddManagerModal(true);
  const openTransferModal = () => setShowTransferModal(true);

  const handleTransferOwnership = (email: string) => {
    transferOwnershipInvitation.mutate(email);
  };

  const handleAddManager = (email: string) => {
    addManagerInvitation.mutate(email);
  };

  const handleDelete =
    (email: string, type: string) => (e: MouseEvent<HTMLDivElement>) => {
      setDeleteEmail(email);
      setMemberId(e.currentTarget.id);

      if (type === 'user') {
        setShowDeleteUserModal(true);
      } else if (type === 'invitation') {
        setShowDeleteInvitationModal(true);
      }
    };

  const handleDeleteUser = () => {
    deleteOrganisationMember.mutate(memberId);
  };

  const handleDeleteInvitation = () => {
    deleteUserInvitation.mutate(memberId);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles['organisation-team-container']}>
      <div className={styles['content-header']}>
        <h1>Team</h1>
        <div className={styles['content-header--action-container']}>
          <button onClick={openTransferModal}>Transfer Ownership</button>
          <button onClick={openAddManagerModal}>Add Manager</button>
        </div>
      </div>
      <div className={styles['content-table-container']}>
        <table className={styles['content-table']}>
          <thead className={styles['table-header']}>
            <th>Team Member</th>
            <th>Role</th>
            <th aria-label="invite status" />
            <th>Email</th>
            <th aria-label="delete member" />
          </thead>
          <tbody className={styles['table-body']}>
            {data.members.map((member: any) => (
              <tr key={member.organisation_user_id}>
                <td className={styles['team-member-data']}>
                  <div className={styles['avatar-image']}>
                    <img
                      alt="avatar"
                      src={
                        member.user.profile.picture ||
                        getDefaultAvatarSrc(
                          member.user.name.charAt(0).toUpperCase()
                        )
                      }
                    />
                  </div>
                  <span>{member.user.name}</span>
                </td>
                <td className={styles['role-data']}>
                  {member.role.split('.')[1]}
                </td>
                <td />
                <td className={styles['email-data']}>{member.user.email}</td>
                {member.role !== 'Type.Owner' && (
                  <td className={styles['delete-member-data']}>
                    <div
                      id={member.organisation_user_id}
                      onClick={handleDelete(member.user.email, 'user')}
                    >
                      <DeleteIcon width={21} height={21} />
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {data.invitations.map((invitation: any) => (
              <tr key={invitation.organisation_user_invites_id}>
                <td className={styles['team-member-data']}>
                  <div className={styles['avatar-image']}>
                    <img
                      alt="avatar"
                      src={getDefaultAvatarSrc(
                        invitation.email.charAt(0).toUpperCase()
                      )}
                    />
                  </div>
                </td>
                <td className={styles['role-data']}>
                  {invitation.role.split('.')[1]}
                </td>
                <td className={styles['invite-sent-data']}>
                  <span>Invite sent</span>
                </td>
                <td className={styles['email-data']}>{invitation.email}</td>
                <td className={styles['delete-member-data']}>
                  <div
                    id={invitation.organisation_user_invites_id}
                    onClick={handleDelete(invitation.email, 'invitation')}
                  >
                    <DeleteIcon width={21} height={21} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddManagerModal && (
        <ActionModal
          title="Add Manager"
          description="Add more people as managers of the organisations"
          btnText="Invite to Organisation"
          hideModal={setShowAddManagerModal}
          handleSubmit={handleAddManager}
        />
      )}
      {showTransferModal && (
        <ActionModal
          title="Transfer ownership"
          description="We will send an email to proceed with next steps for transferring the
        ownership"
          btnText="Transfer Ownership"
          hideModal={setShowTransferModal}
          handleSubmit={handleTransferOwnership}
        />
      )}
      {showDeleteUserModal && (
        <DeleteModal
          title="Delete Member"
          hideModal={setShowDeleteUserModal}
          email={deleteEmail}
          handleSubmit={handleDeleteUser}
        />
      )}
      {showDeleteInvitationModal && (
        <DeleteModal
          title="Delete invitation"
          hideModal={setShowDeleteInvitationModal}
          email={deleteEmail}
          handleSubmit={handleDeleteInvitation}
        />
      )}
    </div>
  );
};

interface IActionModal {
  title: string;
  description: string;
  btnText: string;
  hideModal: Dispatch<SetStateAction<boolean>>;
  handleSubmit: (email: string) => void;
}

const ActionModal: FC<IActionModal> = ({
  title,
  description,
  btnText,
  hideModal,
  handleSubmit,
}) => {
  const [email, setEmail] = useState('');

  const handleClose = () => hideModal(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(email);
  };

  return (
    <Modal
      title={title}
      onClose={handleClose}
      width="425px"
      height="378px"
      padding="13px 30px"
    >
      <p className={styles['modal-descriptive-text']}>{description}</p>
      <form className={styles['org-member-modal-form']} onSubmit={submit}>
        <div className={styles['email-field']}>
          <input
            required
            type="email"
            placeholder="Email"
            className={styles['email-field']}
            value={email}
            onChange={handleChange}
          />
        </div>
        <input type="submit" value={btnText} className={styles['submit-btn']} />
      </form>
    </Modal>
  );
};

interface IDeleteModal {
  title: string;
  email: string;
  hideModal: Dispatch<SetStateAction<boolean>>;
  handleSubmit: () => void;
}

const DeleteModal: FC<IDeleteModal> = ({
  title,
  email,
  hideModal,
  handleSubmit,
}) => {
  const handleClose = () => hideModal(false);

  return (
    <Modal
      title={title}
      onClose={handleClose}
      width="425px"
      height="300px"
      padding="13px 30px"
    >
      <p className={styles['modal-descriptive-text']}>
        Are you sure you want to delete {email}?
      </p>
      <div className={styles['modal-delete-action']}>
        <button onClick={handleSubmit} className={styles['delete-member']}>
          Yes, delete
        </button>
        <button onClick={handleClose} className={styles['cancel-delete']}>
          No, cancel
        </button>
      </div>
    </Modal>
  );
};

export default OrganisationTeam;
