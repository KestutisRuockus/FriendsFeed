import { useEffect, useState } from "react";
import EmojiPickerComponent from "../../../utils/EmojiPickerComponent";

const messages = [
  {
    id: "225",
    message:
      "Hi, djhsalkjfhljkdsahfjlhasjlhf shdasjflsajlkhfkjash jdashjkhdkjashdkj",
    sender: "me",
  },
  {
    id: "331",
    message:
      "Hey! mauhsdhsajhj jkhd kjshajkdhksahdkjhsakjh kjhdkj hsakjh djkashkjdh ajsk",
    sender: "other",
  },
  {
    id: "225",
    message:
      "Hi, djhsalkjfhljkdsahfjlhasjlhf shdasjflsajlkhfkjash jdashjkhdkjashdkj",
    sender: "me",
  },
  {
    id: "331",
    message:
      "Hey! mauhsdhsajhj jkhd kjshajkdhksahdkjhsakjh kjhdkj hsakjh djkashkjdh ajsk",
    sender: "other",
  },
];

type Messages = {
  id: string;
  message: string;
  sender: string;
};

const SenderBubble = ({ text }: { text: string }) => (
  <div className="bg-bgColorSecondary text-primary border-2 border-bgColorExtra w-fit max-w-[67%] px-2 py-1 mb-4 mr-auto rounded-t-xl rounded-br-xl">
    <p className="text-xs text-slate-500">2025-01-02</p>
    <div className="text-sm">{text}</div>
  </div>
);
const ReceiverBubble = ({ text }: { text: string }) => (
  <div className="bg-bgColor text-primar border-2 border-bgColorExtra w-fit max-w-[67%] px-2 py-1 mb-4 ml-auto rounded-t-xl rounded-bl-xl">
    <p className="text-xs text-slate-500">2025-01-02</p>
    <div className="text-sm">{text}</div>
  </div>
);

const NoMessagesComponent = () => <div>There are no messages</div>;

const ConversationWIndow = () => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [messageInput, setMessageInput] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Messages[] | null>(null);

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(messageInput + emoji);
  };

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      setAllMessages([
        ...(allMessages || []),
        {
          id: String(Math.random() * 1000000),
          message: messageInput,
          sender: "me",
        },
      ]);
      setMessageInput("");
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (messages) {
      setAllMessages(messages);
    }
  }, []);

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
        <h2 className="font-bold">Sender Name</h2>
        <div className="flex gap-2">
          <p>_</p>
          <p>x</p>
        </div>
      </div>
      <div
        id="message-container"
        className="h-[85%] px-4 py-4 overflow-y-auto overflow-hidden border-b-2 border-bgColorExtra"
      >
        {(allMessages ?? []).length === 0 ? (
          <NoMessagesComponent />
        ) : (
          allMessages?.map((message) =>
            message.sender === "me" ? (
              <ReceiverBubble text={message.message}></ReceiverBubble>
            ) : (
              <SenderBubble text={message.message}></SenderBubble>
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
        {/* <div className="text-white bg-blue-600 mx-auto px-2 text-lg">:D</div> */}
        <div
          onClick={sendMessage}
          className="h-full flex items-center text-white rotate-45 pl-2 pe-3 text-xl hover:text-bgColor transition-all duration-300 cursor-pointer"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </div>
      </div>
    </div>
  );
};

export default ConversationWIndow;
