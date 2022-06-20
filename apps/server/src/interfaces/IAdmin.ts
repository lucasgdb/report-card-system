interface IAdmin {
  id: string;
  user_id: string;
  email: string;
  fullname: string;
  password: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export default IAdmin;
