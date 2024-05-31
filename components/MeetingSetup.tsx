import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
interface MeetingSetupProps {
  setIsSetupComplete: (value: boolean) => void;
}
const MeetingSetup = ({ setIsSetupComplete }: MeetingSetupProps) => {
  const [isMicCamToggleOn, setIsMicCamToggleOn] =
    React.useState<boolean>(false);
  const call = useCall();

  if (!call) throw new Error("Call not found");

  useEffect(() => {
    if (isMicCamToggleOn) {
      call?.camera?.disable();
      call?.microphone?.disable();
    } else {
      call?.camera?.enable();
      call?.microphone?.enable();
    }
  }, [isMicCamToggleOn, call?.camera, call?.microphone]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label
          htmlFor=""
          className="flex items-center justify-center gap-2 font-medium"
        >
          <input
            type="checkbox"
            checked={isMicCamToggleOn}
            onChange={() => setIsMicCamToggleOn(!isMicCamToggleOn)}
          />
          Join with microphone and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
      >
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
