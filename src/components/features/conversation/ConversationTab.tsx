import { ConversationsProps } from "./types";

const ConversationTab = ({
  user,
  removeActiveConversation,
}: {
  user: ConversationsProps;
  removeActiveConversation: (id: string) => void;
}) => {
  return (
    <div className="flex justify-between items-center bg-bgColor ps-2 w-[150px] cursor-pointer hover:opacity-70 transition-opacity duration-300">
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
