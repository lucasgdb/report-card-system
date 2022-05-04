interface IAdminPasswordRecoveryRequest {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export default IAdminPasswordRecoveryRequest;
