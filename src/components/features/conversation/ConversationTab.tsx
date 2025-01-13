import { useState } from "react";
import { ConversationsProps } from "./types";
import ConversationWIndow from "./ConversationWIndow";

const ConversationTab = ({
  user,
  removeActiveConversation,
}: {
  user: ConversationsProps;
  removeActiveConversation: (id: string) => void;
}) => {
  const [isElementOpen, setIsElementOpen] = useState<boolean>(false);

  const handleToggleElement = () => setIsElementOpen(!isElementOpen);

  return (
    <div
      onClick={handleToggleElement}
      className="flex justify-between items-center bg-bgColor ps-2 w-[150px] cursor-pointer hover:bg-bgColorSecondary transition-colors duration-300"
    >
      {isElementOpen && <ConversationWIndow />}
      <p className="text-primary text-sm font-bold truncate overflow-hidden whitespace-nowrap">
        {user.name}
      </p>
      <p
        onClick={() => removeActiveConversation(user.userId)}
        className="px-2 hover:bg-primary hover:text-secondary transition-all duration-300"
      >
        X
      </p>
    </div>
  );
};

export default ConversationTab;
