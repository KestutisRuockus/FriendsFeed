import { useEffect, useState } from "react";
import EmojiPickerComponent from "../../../utils/EmojiPickerComponent";
import { ConversationWindowProps, Messages } from "./types";
import { auth } from "../../../firebase/firebaseConfig";

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
    <div className="text-sm">{content}</div>
  </div>
);
const ReceiverBubble = ({
  content,
  timestamp,
}: {
  content: string;
  timestamp: Date | undefined;
}) => (
  <div className="bg-bgColor text-primar border-2 border-bgColorExtra w-fit max-w-[67%] px-2 py-1 mb-4 ml-auto rounded-t-xl rounded-bl-xl">
    <p className="text-xs text-slate-500">
      {timestamp ? timestamp.toLocaleString() : ""}
    </p>
    <div className="text-sm">{content}</div>
  </div>
);

const NoMessagesComponent = () => <div>There are no messages</div>;

const ConversationWIndow = ({
  sendMessage,
  senderId,
  username,
  messages,
}: ConversationWindowProps) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [messageInput, setMessageInput] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Messages[] | null>(null);

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(messageInput + emoji);
  };

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleSend = async () => {
    if (messageInput.trim() === "") {
      return;
    }

    await sendMessage(messageInput, senderId);

    const NewMessage: Messages = {
      id: Date.now().toString(),
      content: messageInput,
      sender: senderId,
      timestamp: new Date(),
    };

    setAllMessages((prevMessages) => [...(prevMessages || []), NewMessage]);

    setMessageInput("");
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(messageInput, senderId);
    }
  };

  useEffect(() => {
    if (messages) {
      setAllMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    const container = document.getElementById("message-container");
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [allMessages]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-9 right-6 bg-secondary max-w-[90vw] w-[30rem] h-[30rem] border-2 border-bgColorExtra hover:opacity-100 rounded-t-lg rounded-bl-md cursor-default"
    >
      <div className="flex items-center justify-between bg-bgColorExtra text-bgColorSecondary px-2 py-1">
        <h2 className="font-bold">{username}</h2>
        <div className="flex gap-2">
          <p>_</p>
          <p>x</p>
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
              ></ReceiverBubble>
            ) : (
              <SenderBubble
                content={message.content}
                timestamp={message.timestamp}
              ></SenderBubble>
            )
          )
        )}
      </div>
      <div className="flex items-center h-[9%] w-full rounded-bl-lg bg-bgColorExtra">
        <input
          onChange={handleMessageInput}
          onKeyDown={handleEnterKeyDown}
          value={messageInput}
          type="text"
          placeholder="Aa..."
          className="h-[95%] px-2 rounded-bl-md w-full outline-none rounded-r-lg"
        />
        <div className="mt-[2px] ml-2">
          <EmojiPickerComponent
            open={openEmojiPicker}
            setOpen={setOpenEmojiPicker}
            onEmojiSelect={handleEmojiSelect}
          />
        </div>
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
