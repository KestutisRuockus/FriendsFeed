import React, { SetStateAction, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import Comment from "./Comment";
import { PostComponentProps } from "../../../pages/types";
import { auth, db } from "../../../firebase/firebaseConfig";
import PostModal from "./PostModal";
import { EditablePostValues } from "./types";
import ErrorMessage from "../../shared/ErrorMessage";
import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { deletePostImageFromFirebaseStorage } from "../../../utils/ImageUtils";

const Post = React.memo(
  ({
    post,
    removeDeletedPostFromPostsStateById,
    updatePostsStateById,
  }: PostComponentProps) => {
    const [showMoreContent, setShowMoreContent] = useState<boolean>(false);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
    const [commentInput, setCommentInput] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editablePostValues, setEditablePostValues] =
      useState<EditablePostValues>({
        title: post.title,
        content: post.content,
        imageURL: post.imageURL,
      });
    const [likesCount, setLikesCount] = useState<number>(0);
    const [dislikesCount, setDislikesCount] = useState<number>(0);

    const contentRef = useRef<HTMLDivElement>(null);

    const handleShowMoreContentState = () =>
      setShowMoreContent(!showMoreContent);

    const handleEmojiPickerElement = () => setOpenEmojiPicker(!openEmojiPicker);

    const handleCommentInput = (e: {
      target: { value: SetStateAction<string> };
    }) => setCommentInput(e.target.value);

    const handleEmoji = (emojiObject: { emoji: string }) =>
      setCommentInput(commentInput + emojiObject.emoji);

    const handleCommentSubmit = () => {
      if (commentInput.trim() !== "") {
        console.log(commentInput);
        setCommentInput("");
      }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleLikeButton = () => {
      handleInteraction(post.id, post.authorId, auth.currentUser!.uid, "like");
    };

    const handleDislikeButton = () => {
      handleInteraction(
        post.id,
        post.authorId,
        auth.currentUser!.uid,
        "dislike"
      );
    };

    const handleInteraction = async (
      postId: string,
      authorId: string,
      userId: string,
      interaction: "like" | "dislike"
    ) => {
      const postRef = doc(db, "posts", authorId, "userPosts", postId);

      const interactionRef = doc(
        db,
        "posts",
        authorId,
        "userPosts",
        postId,
        "interactions",
        userId
      );

      try {
        const interactionSnap = await getDoc(interactionRef);

        if (interactionSnap.exists()) {
          const currentInteraction = interactionSnap.data()?.interaction;

          if (currentInteraction === interaction) {
            await updateDoc(interactionRef, { interaction: "neutral" });

            if (interaction === "like") {
              await updateDoc(postRef, { likesCount: increment(-1) });
              setLikesCount((prevCount) => prevCount - 1);
            } else if (interaction === "dislike") {
              await updateDoc(postRef, { dislikesCount: increment(-1) });
              setDislikesCount((prevCount) => prevCount - 1);
            }
          } else {
            await setDoc(interactionRef, { interaction });

            if (interaction === "like") {
              await updateDoc(postRef, { likesCount: increment(1) });
              setLikesCount((prevCount) => prevCount + 1);

              if (currentInteraction === "dislike") {
                await updateDoc(postRef, { dislikesCount: increment(-1) });
                setDislikesCount((prevCount) => prevCount - 1);
              }
            } else if (interaction === "dislike") {
              await updateDoc(postRef, { dislikesCount: increment(1) });
              setDislikesCount((prevCount) => prevCount + 1);

              if (currentInteraction === "like") {
                await updateDoc(postRef, { likesCount: increment(-1) });
                setLikesCount((prevCount) => prevCount - 1);
              }
            }
          }
        } else {
          await setDoc(interactionRef, { interaction });

          if (interaction === "like") {
            await updateDoc(postRef, { likesCount: increment(1) });
            setLikesCount((prevCount) => prevCount + 1);
          } else if (interaction === "dislike") {
            await updateDoc(postRef, { dislikesCount: increment(1) });
            setDislikesCount((prevCount) => prevCount - 1);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    };

    const formatDate = () => {
      const date = new Date(post.date * 1000);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      let hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      hours = (+hours % 12).toString() || (12).toString();
      const amOrPm = +hours >= 12 ? "AM" : "PM";
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes} ${amOrPm}`;

      return formattedDateTime;
    };

    const deletePost = async () => {
      if (auth.currentUser?.uid && post.id) {
        try {
          const docRef = doc(
            db,
            "posts",
            auth.currentUser?.uid,
            "userPosts",
            post.id
          );
          await deleteDoc(docRef);
          deletePostImageFromFirebaseStorage(post.imageURL);
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
            setErrorMessage("Post was not deleted. Please try again");
          }
        } finally {
          removeDeletedPostFromPostsStateById(post.id);
        }
      }
    };

    useEffect(() => {
      if (contentRef.current) {
        setIsOverflowing(contentRef.current.scrollHeight > 60);
      }
    }, [editablePostValues.content]);

    useEffect(() => {
      setLikesCount(post.likesCount);
      setDislikesCount(post.dislikesCount);
    }, [post.dislikesCount, post.likesCount]);

    return (
      <div className="sm:w-4/5 w-11/12 flex flex-col gap-4 border-8 rounded-lg border-secondary relative">
        {isModalOpen && (
          <PostModal
            isOpen={true}
            onClose={closeModal}
            currentTitle={post.title}
            currentContent={post.content}
            currentImage={post.imageURL}
            postId={post.id}
            setEditablePostValues={setEditablePostValues}
            updatePostsStateById={updatePostsStateById}
          />
        )}
        <div className="flex flex-col-reverse sm:flex-row justify-between py-4 px-8 lg:px-16 max-lg:pr-0">
          <h1 className="w-full md:w-2/3 font-bold text-lg pt-4">
            {editablePostValues.title}
          </h1>
          <div className="w-full md:w-1/3 flex gap-4 sm:justify-end items-center text-primary font-semibold text-sm">
            <div className="flex flex-col items-center">
              <div className="flex gap-2 justify-center items-center">
                <i className="fa-solid fa-user rounded-full">
                  {/* <img src="" alt="" /> */}
                </i>
                <div className="flex flex-col mr-6">
                  <div>{post.author}</div>
                  <div className="italic">{formatDate()}</div>
                </div>
                {auth.currentUser?.displayName === post.author && (
                  <div className="flex justify-center items-center gap-4">
                    <i
                      onClick={deletePost}
                      className="fa-solid fa-trash-can text-xl text-red-600 cursor-pointer 
                            hover:opacity-70 transition-opacity duration-300"
                    ></i>
                    <i
                      onClick={openModal}
                      className="fa-solid fa-pen text-xl text-green-600 cursor-pointer
                            hover:opacity-70 transition-opacity duration-300"
                    ></i>
                  </div>
                )}
              </div>
              <div>
                <ErrorMessage message={errorMessage} />
              </div>
            </div>
          </div>
        </div>
        {editablePostValues.imageURL && (
          <div className="px-4">
            <img
              src={
                editablePostValues.imageURL ? editablePostValues.imageURL : ""
              }
              alt="post image"
              className="m-auto w-full max-w-[600px]"
            />
          </div>
        )}

        <div className="py-4 px-8 lg:py-8 lg:px-16">
          <div
            ref={contentRef}
            className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
              showMoreContent
                ? "max-h-[300px] overflow-y-scroll"
                : "max-h-[4.5rem]"
            }`}
          >
            {editablePostValues.content}
          </div>
          {isOverflowing && (
            <div
              onClick={handleShowMoreContentState}
              className="text-end cursor-pointer text-primary border-b-4 border-primary pb-4"
            >
              {showMoreContent ? "Show less..." : "See more..."}
            </div>
          )}
          <div className="my-6 flex gap-6">
            <div className="flex gap-1 items-center">
              <span className="text-green-700 font-bold">{likesCount}</span>
              <i
                onClick={handleLikeButton}
                className="fa-solid fa-thumbs-up  text-green-700 cursor-pointer hover:opacity-70 transition-opacity duration-300"
              ></i>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-red-700 font-bold">{dislikesCount}</span>
              <i
                onClick={handleDislikeButton}
                className="fa-solid fa-thumbs-down pt-1 text-rose-700 cursor-pointer hover:opacity-70 transition-opacity duration-300"
              ></i>
            </div>
          </div>
          <div className="w-full">
            <Comment />
            <div className="flex w-full mt-2">
              <input
                onKeyDown={(e: { key: string }) => {
                  if (e.key === "Enter") {
                    handleCommentSubmit();
                  }
                }}
                onChange={handleCommentInput}
                value={commentInput}
                className="w-full pl-2 rounded-l-lg outline-none"
                type="text"
                placeholder="Enter Comment..."
              />
              <div
                onClick={handleCommentSubmit}
                className="flex justify-center items-center bg-white px-2 rounded-r-lg hover:opacity-50 transition-opacity duration-300 cursor-pointer"
              >
                <i
                  onClick={() => {}}
                  className="fa-solid fa-location-arrow text-xl text-primary rotate-45"
                />
              </div>
            </div>
            <div>
              <button
                onClick={handleEmojiPickerElement}
                className="text-sm rounded-lg bg-white px-2 hover:opacity-50 transition-opacity duration-300"
              >
                Emojis +
              </button>
              <div className="w-full">
                {openEmojiPicker && (
                  <EmojiPicker
                    style={{ width: 300, maxWidth: "100%" }}
                    onEmojiClick={handleEmoji}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Post;
