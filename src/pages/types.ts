export type PostProps = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  date: number;
  author: string;
  likesCount: number;
  dislikesCount: number;
  imageURL: string | null;
  comments: CommentsProps | null;
};

export type CommentsProps = {
  commentId: string;
  commentatorId: string;
  commentatorName?: string;
  commentText: string;
  date: string;
}[];

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
