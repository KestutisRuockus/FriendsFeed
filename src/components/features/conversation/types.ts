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

export type ConversationWindowProps = {
  sendMessage: SendMessage;
  senderId: string;
  username: string;
  messages: Messages[];
};
