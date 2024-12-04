import { Dispatch, SetStateAction } from "react";

export type PostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  currentContent: string;
  currentImage: string | null;
  postId: string;
  setEditablePostValues: Dispatch<SetStateAction<EditablePostValues>>;
};

export type EditablePostValues = {
  title: string;
  content: string;
  imageURL: string | null;
};
