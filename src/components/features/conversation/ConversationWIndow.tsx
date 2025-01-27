import { useEffect, useState } from "react";
import EmojiPickerComponent from "../../../utils/EmojiPickerComponent";
import { ConversationWindowProps, Messages } from "./types";
import { auth } from "../../../firebase/firebaseConfig";

const NoMessagesComponent = () => <div>There are no messages</div>;

const ConversationWIndow = ({
  sendMessage,
  senderId,
  username,
  messages,
  updateMessage,
  deleteMessage,
  isElementOpen,
  setIsElementOpen,
  removeActiveConversation,
  conversationId,
}: ConversationWindowProps) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [messageInput, setMessageInput] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Messages[] | null>(null);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [editingMessageId, setEditingMessageId] = useState<string>("");
  const [previousMessageContent, setPreviousMessageContent] =
    useState<string>("");

  const SenderBubble = ({
    content,
    timestamp,
  }: {
    content: string;
    timestamp: Date | undefined;
  }) => (
    <div className="bg-bgColorSecondary text-primary border-2 border-bgColorExtra w-fit max-w-[67%] px-2 py-1 mb-4 mr-auto rounded-t-xl rounded-br-xl">
      <p className="text-xs text-slate-500">
        {timestamp ? timestamp.toLocaleString() : ""}
      </p>
      <div className="text-sm break-words">{content}</div>
    </div>
  );

  const ReceiverBubble = ({
    content,
    timestamp,
    messageId,
  }: {
    content: string;
    timestamp: Date | undefined;
    messageId: string;
  }) => (
    <div className="bg-bgColor text-primar border-2 border-bgColorExtra w-fit max-w-[67%] ps-2 pe-0 py-1 mb-4 ml-auto rounded-t-xl rounded-bl-xl">
      <div className="flex justify-between items-center gap-1 pr-1">
        <p className="text-xs text-slate-500 me-4">
          {timestamp ? timestamp.toLocaleString() : ""}
        </p>
        <div className="flex justify-center items-center gap-2">
          <i
            onClick={() => deleteMessage(messageId)}
            className="fa-solid fa-trash-can text-xs text-red-600 cursor-pointer 
          hover:opacity-70 transition-opacity duration-300"
          ></i>
          <i
            onClick={() => editMessage(content, messageId)}
            className="fa-solid fa-pen text-xs text-green-600 cursor-pointer
          hover:opacity-70 transition-opacity duration-300"
          ></i>
        </div>
      </div>
      <div className="text-sm break-words">{content}</div>
    </div>
  );

  const editMessage = (content: string, messageId: string) => {
    setEditingMessageId(messageId);
    setPreviousMessageContent(content);
    setMessageInput(content);
    setIsEditingMode(true);
    scrollToConversationWindowBottom();
  };

  const cancelEditMode = () => {
    setIsEditingMode(false);
    setMessageInput("");
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(messageInput + emoji);
  };

  const openEmojis = () => {
    setOpenEmojiPicker(!openEmojiPicker);
  };

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const scrollToConversationWindowBottom = () => {
    const container = document.getElementById("message-container");
    if (container) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleSend = async () => {
    if (messageInput.trim() === "") {
      return;
    }

    if (isEditingMode && editingMessageId) {
      updateMessage(messageInput, editingMessageId);
      setIsEditingMode(false);
    } else {
      await sendMessage(messageInput, senderId);
    }
    setOpenEmojiPicker(false);
    setMessageInput("");
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(messageInput, senderId);
    }
  };

  const collapseConversationWindow = () => {
    setIsElementOpen(false);
  };

  useEffect(() => {
    if (messages) {
      setAllMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    scrollToConversationWindowBottom();
  }, [allMessages]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`absolute bottom-10 bg-secondary max-w-[90vw] ${
        isElementOpen
          ? "w-[30rem] h-[30rem] right-2"
          : "w-[0rem] h-[0rem] -right-2"
      } border-2 border-bgColorExtra hover:opacity-100 rounded-t-lg rounded-bl-md cursor-default transition-all duration-300`}
    >
      <div className="flex items-center justify-between bg-bgColorExtra text-bgColorSecondary px-2 py-1">
        <h2 className="font-bold">{username}</h2>
        <div className="flex gap-2">
          <p
            onClick={collapseConversationWindow}
            className="font-bold cursor-pointer hover:text-bgColor transition-all duration-300"
          >
            __
          </p>
          <p
            onClick={() => removeActiveConversation(conversationId)}
            className="font-bold cursor-pointer hover:text-bgColor transition-all duration-300"
          >
            x
          </p>
        </div>
      </div>
      <div
        id="message-container"
        className="h-[85%] px-4 py-4 overflow-y-auto overflow-hidden border-b-2 border-bgColorExtra"
      >
        {(allMessages?.length ?? 0) === 0 ? (
          <NoMessagesComponent />
        ) : (
          allMessages?.map((message) =>
            message.sender === auth.currentUser?.uid ? (
              <ReceiverBubble
                content={message.content}
                timestamp={message.timestamp}
                messageId={message.id}
              ></ReceiverBubble>
            ) : (
              <SenderBubble
                content={message.content}
                timestamp={message.timestamp}
              ></SenderBubble>
            )
          )
        )}
        {isEditingMode && (
          <div className="flex justify-between items-center bg-gray-100 ps-4 rounded-lg max-w-full">
            <div className="font-bold text-xs text-gray-400 overflow-hidden whitespace-nowrap flex items-center">
              Editing
              <span className="fitalic text-sm overflow-hidden text-ellipsis whitespace-nowrap inline-block max-w-[70%] truncate">
                {` " ${previousMessageContent} " `}
              </span>
              message
            </div>
            <div
              onClick={cancelEditMode}
              className="text-xs me-2 px-2 text-gray-400 hover:bg-black transition-colors duration-300 cursor-pointer rounded-lg h-fit w-fit py-1"
            >
              Cancel
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center h-[9%] w-full pb-[1px] rounded-bl-lg bg-bgColorExtra relative">
        <input
          onChange={handleMessageInput}
          onKeyDown={handleEnterKeyDown}
          value={messageInput}
          type="text"
          placeholder="Aa..."
          className="h-[95%] px-2 rounded-bl-md w-full outline-none rounded-r-lg"
        />
        <div
          onClick={openEmojis}
          className="flex justify-center items-center text-2xl text-white ml-2 hover:text-bgColor transition-all duration-300 cursor-pointer"
        >
          <i className="fa-regular fa-face-smile-wink"></i>
        </div>
        {openEmojiPicker && (
          <div className="absolute bottom-11 left-0">
            <EmojiPickerComponent
              open={openEmojiPicker}
              setOpen={setOpenEmojiPicker}
              onEmojiSelect={handleEmojiSelect}
            />
          </div>
        )}
        <div
          onClick={handleSend}
          className="h-full flex items-center text-white rotate-45 pl-2 pe-3 text-xl hover:text-bgColor transition-all duration-300 cursor-pointer"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </div>
      </div>
    </div>
  );
};

export default ConversationWIndow;
