import { useEffect, useState } from "react";
import { ConversationsProps } from "./types";
import ConversationWIndow from "./ConversationWIndow";
import { auth } from "../../../firebase/firebaseConfig";
import useChat from "../../../hooks/useChat";

const ConversationTab = ({
  user,
  removeActiveConversation,
  openConversationId,
  setOpenConversationId,
}: {
  user: ConversationsProps;
  removeActiveConversation: (id: string) => void;
  openConversationId: string | null;
  setOpenConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [isElementOpen, setIsElementOpen] = useState<boolean>(false);

  const { sendMessage, messages, updateMessage, deleteMessage } = useChat(
    auth.currentUser!.uid,
    user.userId
  );

  const handleOpenConversationId = () => {
    setOpenConversationId(user.userId);
    setIsElementOpen(!isElementOpen);
  };

  const handleCloseButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeActiveConversation(user.userId);
  };

  useEffect(() => {
    if (openConversationId === user.userId) {
      setIsElementOpen(true);
    } else {
      setIsElementOpen(false);
    }
  }, [openConversationId, user.userId]);

  return (
    <div
      onClick={handleOpenConversationId}
      className="flex justify-between items-center bg-bgColor ps-2 w-[120px] cursor-pointer hover:bg-bgColorSecondary transition-colors duration-300"
    >
      <ConversationWIndow
        sendMessage={sendMessage}
        senderId={auth.currentUser!.uid}
        username={user.name}
        messages={messages}
        updateMessage={updateMessage}
        deleteMessage={deleteMessage}
        isElementOpen={isElementOpen}
        setIsElementOpen={setIsElementOpen}
        removeActiveConversation={removeActiveConversation}
        conversationId={user.userId}
      />
      <p className="text-primary text-xs sm:text-sm font-bold truncate overflow-hidden whitespace-nowrap">
        {user.name}
      </p>
      <p
        onClick={handleCloseButton}
        className="px-2 hover:bg-primary hover:text-secondary transition-all duration-300"
      >
        X
      </p>
    </div>
  );
};

export default ConversationTab;
