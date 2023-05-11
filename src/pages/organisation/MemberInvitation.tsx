import { Background } from 'components/Login';
import InvitationAction from 'components/Organisation/InvitationAction';
import { ArcanaAuthLayout } from 'containers/ArcanaAuthLayout';

const MemberInvitation = () => {
  return (
    <ArcanaAuthLayout>
      <Background />
      <InvitationAction />
    </ArcanaAuthLayout>
  );
};

export default MemberInvitation;
