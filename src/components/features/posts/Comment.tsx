import { useEffect, useRef, useState } from "react";
import { SingleCommentProps } from "./types";

const Comment = ({ comment }: SingleCommentProps) => {
  const [showMoreComment, setShowMoreComment] = useState<boolean>(false);
  const [isCommentOverflowing, setIsCommentOverflowing] =
    useState<boolean>(false);
  const commentRef = useRef<HTMLDivElement>(null);

  const handleShowMoreCommentState = () => setShowMoreComment(!showMoreComment);

  useEffect(() => {
    if (commentRef.current) {
      setIsCommentOverflowing(commentRef.current.scrollHeight > 60);
    }
  }, []);

  return (
    <div className="w-full bg-bgColorSecondary px-4 py-2 rounded-lg my-2">
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-user rounded-full text-xs">
          {/* <img src="" alt="" /> */}
        </i>
        <p className="text-sm font-semibold text-primary">
          {comment.commentatorName}
        </p>
      </div>
      <div
        ref={commentRef}
        className={`overflow-hidden transition-max-height duration-500 ease-in-out 
                ${
                  showMoreComment
                    ? "max-h-[300px] overflow-y-scroll"
                    : "max-h-[3rem]"
                }`}
      >
        {comment.commentText}
        <p className="text-[0.6rem] text-gray-400">{comment.date}</p>
      </div>
      {isCommentOverflowing && (
        <div
          onClick={handleShowMoreCommentState}
          className="text-end cursor-pointer text-primary border-b-4 border-primary pb-4"
        >
          {showMoreComment ? "Show less..." : "See more..."}
        </div>
      )}
    </div>
  );
};

export default Comment;
