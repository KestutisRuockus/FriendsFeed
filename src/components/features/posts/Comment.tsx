import { useEffect, useRef, useState } from "react";

const Comment = () => {
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
        <p className="text-sm font-semibold text-primary">Ben Benson</p>
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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
        reiciendis fugit similique nemo adipisci expedita numquam commodi
        necessitatibus inventore aspernatur, doloribus quasi, vel, quis error
        magnam laboriosam sapiente explicabo dolor animi! Aperiam in porro
        mollitia recusandae, vitae natus optio sint sed vero corrupti animi
        iusto ab perferendis quasi maiores inventore?
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
