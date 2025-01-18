import { useEffect, useState } from "react";
import Friend from "./Friend";
import useScreenWidth from "../../../hooks/useScreenWidth";
import { useFetchUsers } from "../../../hooks/useFetchUsers";
import { FriendProps } from "./types";
import ConversationManager from "../conversation/ConversationManager";

const FriendsList = () => {
  const [collapsedFriendList, setCollapsedFriendList] =
    useState<boolean>(false);
  const [openConversations, setOpenConversations] = useState<FriendProps[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<FriendProps[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  const screenWidth = useScreenWidth();
  const { users, fetchUsers } = useFetchUsers();

  const handleCollapseBtn = () => setCollapsedFriendList(!collapsedFriendList);

  const addToOpenConversations = (user: FriendProps) => {
    if (!openConversations.some((usr) => usr.userId === user.userId)) {
      setOpenConversations((prev) => [user, ...prev]);
    }
  };

  const removeActiveConversation = (id: string) => {
    setOpenConversations((prev) =>
      prev.filter((conversation) => conversation.userId !== id)
    );
  };

  const handleSearchInputValue = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchInput(e.target.value);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchInput, users]);

  return (
    <aside
      className={`md:w-1/4 w-full px-2 py-4 flex flex-col bg-bgColorSecondary 
        ${
          collapsedFriendList ? "md:max-w-12" : "max-w-full"
        } transition-all duration-500 ease-in-out relative`}
    >
      <div
        className={`flex ${
          screenWidth < 768
            ? collapsedFriendList
              ? "justify-end"
              : "justify-between"
            : collapsedFriendList
            ? "flex-col-reverse"
            : "flex-row-reverse justify-end"
        } } gap-4`}
      >
        <h1
          className={`font-bold text-xl text-primary ${
            collapsedFriendList && screenWidth > 768
              ? "rotate-90 text-nowrap"
              : "rotate-0"
          } transition-all duration-1000 ease-in-out`}
        >
          Friends List
        </h1>

        <i
          onClick={handleCollapseBtn}
          className={`fa-solid ${
            collapsedFriendList
              ? "fa-up-right-and-down-left-from-center"
              : "fa-down-left-and-up-right-to-center"
          } 
          font-bold text-xl text-primary cursor-pointer hover:opacity-50 transition-opacity duration-1000 ease-in-out`}
        />
      </div>
      <div
        className={`${
          screenWidth < 768
            ? collapsedFriendList
              ? "h-0"
              : "h-[300px]"
            : collapsedFriendList
            ? "w-0"
            : "w-full"
        } overflow-hidden transition-all duration-1000`}
      >
        <div className="flex items-center border-2 border-primary rounded-lg overflow-hidden my-2">
          <input
            onChange={handleSearchInputValue}
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
          {filteredUsers.map((user) => (
            <Friend
              key={user.userId}
              user={user}
              onSelectUser={addToOpenConversations}
            />
          ))}
        </div>
      </div>
      {openConversations.length > 0 && (
        <ConversationManager
          activeConversations={openConversations}
          removeActiveConversation={removeActiveConversation}
        />
      )}
    </aside>
  );
};

export default FriendsList;
