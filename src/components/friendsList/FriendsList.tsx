import Friend from "./Friend"

const FriendsList = () => {
  return (
    <div className="w-1/4 px-6 py-4 flex flex-col bg-bgColor bg-opacity-50">
      <h1 className="font-bold text-xl text-primary">Friends List</h1>
    <div className="flex items-center border-2 border-primary rounded-lg overflow-hidden my-2">
      <input 
        className="px-2 w-full outline-none" 
        type="text" 
        placeholder="Search Friend..." 
      />
      <button 
        className="px-3 h-full bg-primary flex items-center justify-center text-white hover:bg-hover hover:text-primary transition-colors duration-300 ease-in-out"
      >
        <i className="fa-solid fa-magnifying-glass"></i>
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