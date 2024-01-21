import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { useTheme } from "next-themes";

export type Emoji = {
  id: string;
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
  aliases: string[];
  keywords: string[];
};

type EmojiPickerProps = {
  onSelect: (emoji: Emoji) => void;
};

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const { theme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Smile />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={60}
        className="flex border-none bg-transparent shadow-none drop-shadow-none"
      >
        <Picker theme={theme} data={data} onEmojiSelect={onSelect} />
      </PopoverContent>
    </Popover>
  );
}
