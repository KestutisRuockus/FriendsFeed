import { useEffect, useRef, useState } from "react";
import ErrorMessage from "../../shared/ErrorMessage";
import { PostModalProps } from "./types";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebaseConfig";
import {
  compressImage,
  saveImageToFirebaseStorage,
} from "../../../utils/ImageUtils";

const PostModal = ({
  isOpen,
  onClose,
  currentTitle,
  currentContent,
  currentImage,
  postId,
  setEditablePostValues,
  updatePostsStateById,
}: PostModalProps) => {
  const [newTitle, setnewTitle] = useState<string>("");
  const [newContent, setnewContent] = useState<string>("");
  const [newImage, setnewImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [TemporaryImageUrl, setTemporaryImageURL] = useState<string | null>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const parentRef = useRef<HTMLDivElement>(null);

  console.log(newImage);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setnewTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setnewContent(e.target.value);

  const updatePost = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const newData = {
      title: newTitle,
      content: newContent,
      imageURL: currentImage,
    };

    if (newImage) {
      newData.imageURL = await saveImageToFirebaseStorage(
        currentImage,
        newImage,
        "posts"
      );
    }

    if (
      currentTitle === newTitle &&
      currentContent === newContent &&
      currentImage === newData.imageURL
    ) {
      setErrorMessage("You did not make any changes to your post.");
      return;
    } else {
      try {
        setUploading(true);
        const postRef = doc(
          db,
          `posts/${auth.currentUser?.uid}/userPosts/${postId}`
        );
        await updateDoc(postRef, newData);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          setErrorMessage(
            "Error occuried. Post was not updated... Please try again"
          );
        }
      } finally {
        setEditablePostValues(newData);
        updatePostsStateById(postId, newData);
        setErrorMessage("Post updated successfully");
        setUploading(false);
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFile = e.target.files ? e.target.files[0] : undefined;
    if (chosenFile) {
      try {
        const compressedFile = await compressImage(chosenFile);
        setnewImage(compressedFile);
        const TemporaryImageUrl = URL.createObjectURL(compressedFile);
        setTemporaryImageURL(TemporaryImageUrl);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen && parentRef.current) {
      parentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setnewTitle(currentTitle);
    setnewContent(currentContent);
    setTemporaryImageURL(currentImage);
  }, [currentContent, currentImage, currentTitle]);

  return (
    <div
      ref={parentRef}
      className="w-full absolute inset-0 flex items-center justify-center z-10"
    >
      <form className="w-11/12 sm:w-4/5 lg:w-3/5 bg-secondary flex flex-col justify-center items-start border-2 border-primary rounded-lg p-8 max-[500px]:p-4 relative">
        <i
          onClick={onClose}
          className="fa-solid fa-square-xmark absolute right-2 top-2 text-3xl text-primary cursor-pointer hover:opacity-70 transition-opacity duration-300"
        />
        <div className="w-full flex justify-center">
          <h2 className="text-2xl text-center font-bold text-primary">
            Edit Post
          </h2>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-center items-end my-6">
          <div>
            <label className="text-xs font-semibold text-primary px-1">
              Image (optional):
            </label>
            <input
              onChange={handleImageChange}
              type="file"
              className="w-full rounded-lg px-2 outline-none mb-2 bg-none"
            />
          </div>
          <div>
            {TemporaryImageUrl && <img src={TemporaryImageUrl} width={480} />}
          </div>
        </div>
        <label className="text-xs font-semibold text-primary px-1">
          Title:<sup className="text-red-600 font-bold">*</sup>
        </label>
        <input
          onChange={handleTitleChange}
          value={newTitle}
          type="text"
          className="w-full rounded-lg px-2 outline-none mb-2 bg-bgColorSecondary"
        />
        <label className="text-xs font-semibold text-primary px-1">
          Content:<sup className="text-red-600 font-bold">*</sup>
        </label>
        <textarea
          onChange={handleContentChange}
          value={newContent}
          className="w-full h-60 rounded-lg px-2 py-1 outline-none bg-bgColorSecondary"
        />
        <button
          onClick={updatePost}
          className="bg-primary px-2 py-1 rounded-lg hover:bg-opacity-60 transition-colors duration-500 mx-auto mt-8 text-white"
        >
          {uploading ? "Updating..." : "Update post"}
        </button>
        <div className="mx-auto">
          <ErrorMessage message={errorMessage} />
        </div>
      </form>
    </div>
  );
};

export default PostModal;
