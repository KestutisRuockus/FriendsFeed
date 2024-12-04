import { useState } from "react";
import Friend from "./Friend";
import useScreenWidth from "../../../hooks/useScreenWidth";

const FriendsList = () => {
  const screenWidth = useScreenWidth();

  const [collapsedFriendList, setCollapsedFriendList] =
    useState<boolean>(false);

  const handleCollapseBtn = () => setCollapsedFriendList(!collapsedFriendList);

  return (
    <aside
      className={`md:w-1/4 w-full px-2 py-4 flex flex-col bg-bgColorSecondary 
        ${collapsedFriendList ? "md:max-w-12" : ""}`}
    >
      <div
        className={`flex ${
          collapsedFriendList
            ? screenWidth < 768
              ? "flex-row-reverse items-center gap-4"
              : "flex-col gap-4"
            : "justify-between"
        }`}
      >
        {!collapsedFriendList && (
          <h1 className="font-bold text-xl text-primary">Friends List</h1>
        )}

        <i
          onClick={handleCollapseBtn}
          className={`fa-solid ${
            collapsedFriendList
              ? "fa-up-right-and-down-left-from-center"
              : "fa-down-left-and-up-right-to-center"
          } 
          font-bold text-xl text-primary cursor-pointer hover:opacity-50 transition-opacity duration-300`}
        />

        {collapsedFriendList && (
          <h1
            className={`font-bold text-xl text-primary ${
              screenWidth >= 768 ? "rotate-90" : ""
            } text-nowrap`}
          >
            Friends List
          </h1>
        )}
      </div>
      {!collapsedFriendList && (
        <>
          <div className="flex items-center border-2 border-primary rounded-lg overflow-hidden my-2">
            <input
              className="px-2 w-full outline-none"
              type="text"
              placeholder="Search Friend..."
            />
            <button className="px-3 h-full bg-primary flex items-center justify-center text-white hover:bg-hover hover:text-primary transition-colors duration-300 ease-in-out">
              <i className="p-1 fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div
            className={`${
              screenWidth < 768 ? "h-[300px]" : "h-[90vh]"
            } overflow-hidden overflow-y-scroll`}
          >
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
            <Friend />
          </div>
        </>
      )}
    </aside>
  );
};

export default FriendsList;
