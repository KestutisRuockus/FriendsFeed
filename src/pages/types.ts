export type PostProps = {
  id: string;
  title: string;
  content: string;
  date: number;
  author: string;
  comments: string[];
  like: number;
  dislike: number;
  imageURL: string | null;
};

export type PostComponentProps = {
  post: PostProps;
  removeDeletedPostFromPostsStateById: (postId: string) => void;
  updatePostsStateById: (
    postId: string,
    newPostValues: Partial<PostProps>
  ) => void;
};

export type ProfileProps = {
  name: string;
  email: string | null | undefined;
  birthdate: string;
  location: string;
  gender: string;
  posts?: PostProps[];
};
