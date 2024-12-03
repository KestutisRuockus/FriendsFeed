import { SetStateAction, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import Comment from "./Comment";
import { PostComponentProps } from "../../pages/types";
import { auth } from "../../firebase/firebaseConfig";
import PostModal from "./PostModal";
import { EditablePostValues } from "./types";

const Post = ({ post }: PostComponentProps) => {
  const [showMoreContent, setShowMoreContent] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editablePostValues, setEditablePostValues] =
    useState<EditablePostValues>({
      title: post.title,
      content: post.content,
      imageURL: post.imageURL,
    });

  const handleShowMoreContentState = () => setShowMoreContent(!showMoreContent);

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

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > 60);
    }
  }, []);

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

  const deletePost = () => console.log("Delete icon; " + post.id);

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
        />
      )}
      <div className="flex flex-col-reverse sm:flex-row justify-between py-4 px-8 lg:px-16 max-lg:pr-0">
        <h1 className="w-full md:w-2/3 font-bold text-lg pt-4">
          {editablePostValues.title}
        </h1>
        <div className="w-full md:w-1/3 flex gap-4 sm:justify-end items-center text-primary font-semibold text-sm">
          <div>
            <i className="fa-solid fa-user rounded-full">
              {/* <img src="" alt="" /> */}
            </i>
          </div>
          <div className="flex gap-2 justify-center items-center">
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
        </div>
      </div>
      <div className="px-4">
        <img
          src={editablePostValues.imageURL ? editablePostValues.imageURL : ""}
          alt="post image"
          className="m-auto w-full max-w-[600px]"
        />
      </div>
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
            <p className="text-primary font-bold">
              Likes: <span>{post.like}</span>
            </p>
            <i
              onClick={() => {}}
              className="fa-solid fa-thumbs-up  text-green-700 cursor-pointer hover:opacity-70 transition-opacity duration-300"
            ></i>
          </div>
          <div className="flex gap-1 items-center">
            <p className="text-primary font-bold">
              Dislikes: <span>{post.dislike}</span>
            </p>
            <i
              onClick={() => {}}
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
};

export default Post;
