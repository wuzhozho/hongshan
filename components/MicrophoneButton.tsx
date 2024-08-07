// components/MicrophoneButton.tsx
import React from "react";
import { Button, Loader } from "@mantine/core";
import { IconMicrophone } from "@tabler/icons-react";

interface MicrophoneButtonProps {
  audioState: string;
  onClick: () => void;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ audioState, onClick }) => {
  return (
    <Button
      // ... 其他样式 ...
      onClick={onClick}
    >
      {audioState === "recording" ? (
        <Loader size="3em" variant="bars" color="white" sx={{ opacity: 1 }} />
      ) : audioState === "transcribing" ? (
        <Loader size="2em" color="white" sx={{ opacity: 1 }} />
      ) : (
        <IconMicrophone size="3em" />
      )}
    </Button>
  );
};

export default MicrophoneButton;