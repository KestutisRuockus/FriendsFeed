export type PostProps = {
    id: string;
    content: string;
    createdAt: string;
  };

export type ProfileProps = {
    name: string;
    email: string | null | undefined;
    birthdate: string;
    location: string;
    gender: string;
    posts?: PostProps[]
}