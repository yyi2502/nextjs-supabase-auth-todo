export type ProfileType = {
  id: string;
  name: string;
  introduce: string | null;
  avatar_url: string | null;
};

export type TodoType = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  completed: boolean;
  updated_at: string;
  created_at: string;
};
