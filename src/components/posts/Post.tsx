import { SetStateAction, useEffect, useRef, useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import Comment from "./Comment";

const Post = () => {
    const [showMoreContent, setShowMoreContent] = useState<boolean>(false);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
    const [commentInput, setCommentInput] = useState<string>('');
    const contentRef = useRef<HTMLDivElement>(null);

    const handleShowMoreContentState = () => setShowMoreContent(!showMoreContent);

    const handleEmojiPickerElement = () => setOpenEmojiPicker(!openEmojiPicker);

    const handleCommentInput = (e: { target: { value: SetStateAction<string>; }; }) => setCommentInput(e.target.value);

    const handleEmoji = ((emojiObject: { emoji: string; }) => setCommentInput(commentInput + emojiObject.emoji));

    const handleCommentSubmit = () => {
        if(commentInput.trim() !== '') {
            console.log(commentInput);
            setCommentInput('');
        }
    }

    useEffect(() => {
        if (contentRef.current) {
          setIsOverflowing(contentRef.current.scrollHeight > 60);
        }
      }, []);

  return (
    <div
        className='sm:w-4/5 w-11/12 flex flex-col gap-4 border-8 rounded-lg border-secondary '
    >
        <div className="flex flex-col-reverse sm:flex-row justify-between py-4 px-8 lg:px-16 max-lg:pr-0">
            <h1
                className="w-full md:w-2/3 font-bold text-lg pt-4"
            >
                Post Title
            </h1>
            <div
                className="w-full md:w-1/3 flex gap-4 sm:justify-end items-center text-primary font-semibold text-sm"
            >
                <div>
                    <i className="fa-solid fa-user rounded-full">{/* <img src="" alt="" /> */}</i>
                </div>
                <div
                    className="flex flex-col mr-6"
                >
                    <div>User Name</div>
                    <div
                        className="italic"
                    >
                        Post date</div>
                </div>
            </div>
        </div>
        <div className="px-4">
            <img src='https://picsum.photos/600/400' alt="random" className='m-auto w-full max-w-[600px]'/>
        </div>
        <div className="py-4 px-8 lg:py-8 lg:px-16">
            <div
                ref={contentRef}
                className={`overflow-hidden transition-max-height duration-500 ease-in-out ${showMoreContent ? 'max-h-[300px] overflow-y-scroll' : 'max-h-[4.5rem]' }`}
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Exercitationem inventore veritatis debitis veniam iusto totam quis corrupti distinctio eaque in vitae quia fugit quasi laborum officia qui ullam vel rerum voluptate animi, accusantium consequuntur? Corporis quas laudantium ab, ullam omnis, dolorum qui consequuntur labore odio accusantium modi ut, repudiandae rerum deserunt! Adipisci dignissimos accusamus eum provident dolor cum velit, aspernatur consequatur, praesentium exercitationem odio tenetur ex qui consequuntur laborum veniam, incidunt ullam blanditiis molestiae sapiente! Qui, iste repudiandae quibusdam laboriosam, sint totam ut, officiis itaque ipsa ducimus ex ea eaque iusto! Dolorem et quas odio alias! Est porro ea explicabo, blanditiis deleniti consequuntur maxime veniam commodi reiciendis omnis possimus atque consequatur repellendus aliquid libero adipisci perferendis aspernatur a saepe nesciunt quas nihil. Laborum veritatis quaerat officiis recusandae odit praesentium ullam natus? Ipsam unde magni alias libero fuga, labore reiciendis incidunt fugit enim debitis quod rem natus harum itaque assumenda commodi molestiae non ad? Doloremque laudantium repudiandae tenetur iure? Vero, repellendus unde illum ipsa, et cupiditate autem eius quisquam velit ut officia, accusamus ipsam repudiandae illo. Dolor, cumque autem voluptatum adipisci ipsam labore molestias nam explicabo voluptatibus tenetur corrupti quos ratione placeat eius sequi iure quae rem minus ullam cum incidunt perspiciatis praesentium ad quod. Explicabo officia iusto laboriosam voluptatibus provident, pariatur consequuntur deleniti eveniet adipisci accusamus facilis porro unde hic quia aspernatur minima veritatis alias! Consectetur, minus tenetur atque, libero ratione necessitatibus assumenda aliquid pariatur illo omnis optio harum consequatur temporibus nulla nostrum quas quod facere numquam illum totam voluptate dolorum laborum nam deleniti! Natus cumque eius asperiores in consequatur libero aliquid? Doloremque laborum inventore atque id earum itaque, eveniet dolore et in, ab aspernatur deleniti qui quis! Distinctio debitis voluptatum quidem provident. Nesciunt, laudantium! Corrupti placeat voluptatum ullam repellat magnam facilis fugit deleniti minima nostrum, maxime laborum optio quasi.
            </div>
            {isOverflowing &&(
            <div
                onClick={handleShowMoreContentState}
                className="text-end cursor-pointer text-primary border-b-4 border-primary pb-4"
            >
                {showMoreContent ? 'Show less...' : 'See more...'}
            </div>
            )}
            <div className="my-6 flex gap-6">
                <div className="flex gap-1 items-center">
                    <p className="text-primary font-bold">Likes: <span>846</span></p> 
                    <i onClick={() => {}} className="fa-solid fa-thumbs-up  text-green-700 cursor-pointer hover:opacity-70 transition-opacity duration-300"></i>
                </div>
                <div className="flex gap-1 items-center">
                    <p className="text-primary font-bold">Dislikes: <span>231</span></p> 
                    <i onClick={() => {}} className="fa-solid fa-thumbs-down pt-1 text-rose-700 cursor-pointer hover:opacity-70 transition-opacity duration-300"></i>
                </div>
            </div>
            <div className="w-full">
                <Comment />
                <div className="flex w-full mt-2">
                    <input 
                        onKeyDown={(e: {key: string}) => {
                            if(e.key === 'Enter'){
                                handleCommentSubmit();
                            }
                        }}
                        onChange={handleCommentInput}
                        value={commentInput}
                        className="w-full pl-2 rounded-l-lg outline-none"
                        type="text" 
                        placeholder="Enter Comment..." />
                    <div 
                        onClick={handleCommentSubmit}
                        className="flex justify-center items-center bg-white px-2 rounded-r-lg hover:opacity-50 transition-opacity duration-300 cursor-pointer">
                        <i onClick={() => {}} className="fa-solid fa-location-arrow text-xl text-primary rotate-45" />
                    </div>
                    
                </div>
                <div>
                    <button onClick={handleEmojiPickerElement} className="text-sm rounded-lg bg-white px-2 hover:opacity-50 transition-opacity duration-300"
                    >
                        Emojis +
                    </button>
                    <div className="w-full">
                        {openEmojiPicker && <EmojiPicker style={{width: 300, maxWidth: '100%'}} onEmojiClick={handleEmoji}/>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Post;