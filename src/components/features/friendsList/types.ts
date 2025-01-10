export type FriendProps = {
  userId: string;
  name: string;
};

export type UserProps = {
  user: FriendProps;
  onSelectUser: (user: FriendProps) => void;
};
