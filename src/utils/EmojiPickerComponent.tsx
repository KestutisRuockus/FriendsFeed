import React from "react";
import EmojiPicker from "emoji-picker-react";

type EmojiPickerProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onEmojiSelect: (emoji: string) => void;
};

const EmojiPickerComponent: React.FC<EmojiPickerProps> = ({
  open,
  setOpen,
  onEmojiSelect,
}) => {
  const handleEmojiPickerToggle = () => setOpen(!open);

  const handleEmoji = (emojiObject: { emoji: string }) => {
    onEmojiSelect(emojiObject.emoji);
  };

  return (
    <div>
      <button
        onClick={handleEmojiPickerToggle}
        className="text-sm rounded-lg bg-white px-2 hover:opacity-50 transition-opacity duration-300"
      >
        Emojis +
      </button>
      <div className="w-full">
        {open && (
          <EmojiPicker
            style={{ width: 300, maxWidth: "100%" }}
            onEmojiClick={handleEmoji}
          />
        )}
      </div>
    </div>
  );
};

export default EmojiPickerComponent;
