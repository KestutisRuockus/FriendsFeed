const Friend = () => {
  return (
    <div 
      className="flex items-center gap-3 rounded-lg hover:bg-bgColor hover:bg-opacity-80 transition-all duration-300 ease-in-out px-2 overflow-hidden"
    >
      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
      <i className="fa-solid fa-user rounded-full">{/* <img src="" alt="" /> */}</i>
      <p
        className="text-primary font-semibold cursor-pointer py-1 whitespace-nowrap overflow-hidden text-ellipsis"
      >
        MarkMark HolstonHolston
      </p>
    </div>
  )
}

export default Friend