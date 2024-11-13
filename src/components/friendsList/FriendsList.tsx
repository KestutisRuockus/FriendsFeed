import { useState } from "react"
import Friend from "./Friend"
import useScreenWidth from "../../hooks/useScreenWidth"

const FriendsList = () => {
  const screenWidth = useScreenWidth();

  const [collapsedFriendList, setCollapsedFriendList] = useState<boolean>(false);

  return (
    <div className={`md:w-1/4 w-full px-4 py-4 flex flex-col bg-bgColorSecondary`}>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl text-primary">Friends List</h1>
        <h1 className={`font-bold text-xl text-primary cursor-pointer hover:opacity-50 transition-opacity duration-300`}>Collapse Friend List</h1>
      </div>
    <div className="flex items-center border-2 border-primary rounded-lg overflow-hidden my-2">
      <input 
        className="px-2 w-full outline-none" 
        type="text" 
        placeholder="Search Friend..." 
      />
      <button 
        className="px-3 h-full bg-primary flex items-center justify-center text-white hover:bg-hover hover:text-primary transition-colors duration-300 ease-in-out"
      >
        <i className="p-1 fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
      <Friend />
      <Friend />
      <Friend />
      <Friend />
    </div>
  )
}

export default FriendsList