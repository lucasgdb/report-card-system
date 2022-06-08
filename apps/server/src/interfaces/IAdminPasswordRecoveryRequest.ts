type Status = 'PENDING' | 'CHANGED';

interface IAdminPasswordRecoveryRequest {
  id: string;
  email: string;
  token: string;
  status: Status;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export default IAdminPasswordRecoveryRequest;
