import { Dispatch, SetStateAction } from "react";
import { PostProps } from "../../../pages/types";

export type PostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  currentContent: string;
  currentImage: string | null;
  postId: string;
  setEditablePostValues: Dispatch<SetStateAction<EditablePostValues>>;
  updatePostsStateById: (
    postId: string,
    newPostValues: Partial<PostProps>
  ) => void;
};

export type EditablePostValues = {
  title: string;
  content: string;
  imageURL: string | null;
};

export type CommentsProps = {
  commentatorId: string;
  commentatorName?: string;
  commentText: string;
  date: string;
};

export type SingleCommentProps = {
  comment: CommentsProps;
};
