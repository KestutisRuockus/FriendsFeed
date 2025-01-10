import { useEffect, useState } from "react";
import ConversationTab from "./ConversationTab";
import { ConversationsProps } from "./types";
import OverflowConversationTab from "./OverflowConversationTab";

const ConversationManager = ({
  activeConversations,
  removeActiveConversation,
}: {
  activeConversations: ConversationsProps[];
  removeActiveConversation: (id: string) => void;
}) => {
  const [visibleConversations, setVisibleConversations] = useState<
    ConversationsProps[]
  >([]);
  const [overflowConversations, setOverflowConversations] = useState<
    ConversationsProps[]
  >([]);
  const [isOveflowConversationOpen, setIsOveflowConversationOpen] =
    useState<boolean>(false);

  const calculateVisibleTabs = () => {
    const screenWidth = window.innerWidth;
    const conversationTabWidth = 170;
    const gapBetweenConversationsTabs = 16;
    const moreButtonWidth = 60;

    const countOfVisibleTabs = Math.floor(
      (screenWidth - moreButtonWidth) /
        (conversationTabWidth + gapBetweenConversationsTabs)
    );

    const overflowtabs = activeConversations.slice(countOfVisibleTabs);
    setVisibleConversations(activeConversations.slice(0, countOfVisibleTabs));
    setOverflowConversations(overflowtabs);
  };

  const handleMoreButton = () =>
    setIsOveflowConversationOpen(!isOveflowConversationOpen);

  const swapOverflowWithVisible = (user: ConversationsProps) => {
    setOverflowConversations((prevOveflowConversation) => [
      ...prevOveflowConversation,
      visibleConversations[0],
    ]);

    setVisibleConversations((prevVisibleConversations) => {
      setOverflowConversations((prevOverflowConversations) =>
        prevOverflowConversations.filter(
          (overflowConversation) => overflowConversation.userId !== user.userId
        )
      );
      return [...prevVisibleConversations.slice(1), user];
    });
  };

  useEffect(() => {
    calculateVisibleTabs();
    const handleResize = () => calculateVisibleTabs();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversations]);

  return (
    <div className="fixed bottom-0 right-0 w-fit flex flex-nowrap gap-4 items-center justify-end px-6 h-10 bg-bgColorExtra rounded-t-lg z-50">
      {visibleConversations.map((user) => (
        <ConversationTab
          key={user.userId}
          user={user}
          removeActiveConversation={removeActiveConversation}
        />
      ))}
      {overflowConversations.length > 0 && (
        <div className="relative">
          <div
            className={`${
              isOveflowConversationOpen ? "max-h-[400px]" : "max-h-[0px]"
            }  overflow-y-auto absolute bottom-8 -right-4 flex flex-col-reverse bg-white rounded-md w-fit transition-all duration-300`}
          >
            {overflowConversations.map((user) => (
              <OverflowConversationTab
                user={user}
                removeActiveConversation={removeActiveConversation}
                swapOverflowWithVisible={swapOverflowWithVisible}
              />
            ))}
          </div>
          <button onClick={handleMoreButton} className="w-[60px] bg-white">
            {isOveflowConversationOpen ? "Close" : " More..."}
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversationManager;
