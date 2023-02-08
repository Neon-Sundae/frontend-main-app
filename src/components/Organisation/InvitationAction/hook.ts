import config from 'config';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';

const useAcceptInvitation = () => {
  const navigate = useNavigate();

  const acceptInvitation = async (invitationToken: string) => {
    const accessToken = getAccessToken();

    try {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/invitation/accept`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ invitationToken }),
        }
      );
      const json = await handleApiErrors(response);
      navigate(`/organisation/${json.organisationId}?show=teams`);
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    }
  };

  return acceptInvitation;
};

const useRejectInvitation = () => {
  const navigate = useNavigate();

  const rejectInvitation = async (invitationToken: string) => {
    const accessToken = getAccessToken();

    try {
      const response = await fetch(
        `${config.ApiBaseUrl}/organisation/invitation/reject`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ invitationToken }),
        }
      );
      await handleApiErrors(response);
      navigate('/login');
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    }
  };

  return rejectInvitation;
};

export { useAcceptInvitation, useRejectInvitation };
