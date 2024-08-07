import React, { useState } from "react";
import styled from 'styled-components';
import { Mic as MicIcon, MicOff as MicOffIcon, MessageCircle as MessageCircleIcon } from "lucide-react"; 

interface ActionButtonsProps {
    isRecording: boolean;
    onStartRecording: () => void;
    onGoBack: () => void;
    onMicrophoneClick: () => void;
}

interface AnimatedMicIconProps extends React.SVGProps<SVGSVGElement> {
    isRecording: boolean;
}

const AnimatedMic = styled(MicIcon)<AnimatedMicIconProps>`
  animation: ${props => props.isRecording ? 'bounce 0.5s infinite alternate' : 'none'};

  @keyframes bounce {
    0% { transform: translateY(0); }
    100% { transform: translateY(-5px); }
  }
`;

const AnimatedMicOff = styled(MicOffIcon)<AnimatedMicIconProps>`
  animation: ${props => props.isRecording ? 'bounce 0.5s infinite alternate' : 'none'};

  @keyframes bounce {
    0% { transform: translateY(0); }
    100% { transform: translateY(-5px); }
  }
`;

const ImmersiveButton: React.FC<ActionButtonsProps> = ({
    isRecording,
    onGoBack,
    onMicrophoneClick,
}) => {
    const [isMicOn, setIsMicOn] = useState(true); // 初始状态：麦克风打开

    const handleMicrophoneClick = () => {
        setIsMicOn(!isMicOn); // 切换麦克风状态
        onMicrophoneClick();  // 执行传入的点击处理函数
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, left: 100, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            <div>
                <button style={{ height: '40px', width: '40px', borderRadius: '9999px', color: 'white', border: '1px solid white'}} onClick={onGoBack}>
                    <MessageCircleIcon color="black" /> 
                </button>
                <button style={{ height: '50px', width: '50px', borderRadius: '9999px', backgroundColor: '#ef4444', color: 'white', fontFamily: 'monospace' }} onClick={handleMicrophoneClick}>
                    {/* 根据 isMicOn 状态渲染不同的图标 */}
                    {/* {isMicOn ? (
                        <MicIcon style={{ backgroundColor: 'transparent' }} />
                    ) : (
                        <AnimatedMicOff isRecording={isRecording} style={{ backgroundColor: 'transparent' }} />
                    )} */}
                    {isMicOn ? (
                        <MicOffIcon style={{ backgroundColor: 'transparent' }} />
                    ) : (
                        <AnimatedMic isRecording={isRecording} style={{ backgroundColor: 'transparent' }} />
                    )}
                </button>
            </div>
        </div>
    );
};

export default ImmersiveButton;