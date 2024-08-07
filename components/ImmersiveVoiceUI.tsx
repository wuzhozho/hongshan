"use client"; 

import React, { useRef, useEffect } from "react";

interface ImmersiveVoiceUIProps {
  isRecording: boolean;
  onStartRecording: () => void;
}

const ImmersiveVoiceUI: React.FC<ImmersiveVoiceUIProps> = ({
  isRecording,
  onStartRecording,
}) => {
  const siriWaveRef = useRef<HTMLDivElement>(null);
  let siriWaveInstance: any = null;

  useEffect(() => {
    import("siriwave").then((module) => {
      if (siriWaveRef.current) {
        siriWaveInstance = new module.default({
          container: siriWaveRef.current,
          style: "ios9",
          speed: 0.04,
          amplitude: isRecording ? 0.3 : 0.1,
          width: window.innerWidth,
          height: window.innerHeight,
        });

        const canvas = siriWaveRef.current.querySelector("canvas");
        if (canvas) {
          canvas.style.position = "absolute";
          canvas.style.top = "-10%";
          canvas.style.left = "-65%";
          canvas.style.width = "200%";
          canvas.style.height = "110%";
          canvas.style.background = "#0f172a";
          canvas.style.zIndex = "1";
        }
      }
    });

    return () => {
      siriWaveInstance?.dispose();
    };
  }, [isRecording]);

  return (
    <div style={{ flexGrow: 1 }}> 
    <div ref={siriWaveRef} />
  </div>
  );
};

export default ImmersiveVoiceUI;