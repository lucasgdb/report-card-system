interface IStudent {
  id: string;
  user_id: string;
  RM: string;
  fullname: string;
  password: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export default IStudent;
