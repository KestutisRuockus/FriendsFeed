export type ConversationsProps = {
  userId: string;
  name: string;
};

export type Messages = {
  id: string;
  content: string;
  sender: string;
  timestamp?: Date | undefined;
};

type SendMessage = (content: string, senderId: string) => Promise<void>;

type UpdateMessage = (updatedMessageContent: string, messageId: string) => void;

type DeleteMessage = (messageId: string) => void;

type RemoveActiveConversationProps = (messageId: string) => void;

export type ConversationWindowProps = {
  sendMessage: SendMessage;
  senderId: string;
  username: string;
  messages: Messages[];
  updateMessage: UpdateMessage;
  deleteMessage: DeleteMessage;
  isElementOpen: boolean;
  setIsElementOpen: React.Dispatch<React.SetStateAction<boolean>>;
  removeActiveConversation: RemoveActiveConversationProps;
  conversationId: string;
};
