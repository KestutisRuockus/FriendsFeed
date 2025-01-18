import { ConversationsProps } from "./types";

const OverflowConversationTab = ({
  user,
  removeActiveConversation,
  swapOverflowWithVisible,
  setOpenConversationId,
}: {
  user: ConversationsProps;
  removeActiveConversation: (id: string) => void;
  swapOverflowWithVisible: (user: ConversationsProps) => void;
  setOpenConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const handleElementClick = () => {
    swapOverflowWithVisible(user);
    setOpenConversationId(user.userId);
  };

  const handleCloseButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeActiveConversation(user.userId);
  };

  return (
    <div
      onClick={handleElementClick}
      key={user.userId}
      className="flex justify-between items-center gap-4 w-[200px] ps-4 pe-2 py-2 text-secondary cursor-pointer bg-bgColorExtra hover:bg-bgColor hover:text-primary transition-colors duration-300"
    >
      <p className="text-sm font-bold truncate overflow-hidden whitespace-nowrap">
        {user.name}
      </p>
      <p
        onClick={handleCloseButton}
        className="font-bold px-2 rounded-md hover:bg-bgColorExtra hover:text-secondary transition-colors duration-300"
      >
        X
      </p>
    </div>
  );
};

export default OverflowConversationTab;
