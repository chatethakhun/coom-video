"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import MeetingCard from "./MeetingCard";
import { useRouter } from "next/navigation";

interface CallListProps {
  type: "upcoming" | "ended" | "recordings";
}
const CallList = ({ type }: CallListProps) => {
  const { callRecordings, upcomingCalls, endedCalls, isLoading } =
    useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case "upcoming":
        return upcomingCalls;
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "upcoming":
        return "No upcoming calls";
      case "ended":
        return "No ended calls";
      case "recordings":
        return "No recordings";
      default:
        return "No calls";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "upcoming":
        return "/icons/upcoming.svg";
      case "ended":
        return "/icons/previous.svg";
      case "recordings":
        return "/icons/recordings.svg";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
    };

    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallMessage = getNoCallsMessage();
  const icon = getIcon();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((call: Call | CallRecording) => (
          <MeetingCard
            key={(call as Call).id}
            icon={icon}
            title={
              (call as Call).state?.custom?.description ||
              (call as CallRecording).filename?.substring(0, 20) ||
              "No Description"
            }
            date={
              (call as Call).state?.startsAt?.toLocaleString() ||
              (call as CallRecording).start_time.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/join.svg" : ""}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(call as CallRecording).url}`)
                : () => router.push(`/meeting/${(call as Call).id}`)
            }
            link={
              type === "recordings"
                ? (call as CallRecording).url
                : process.env.NEXT_PUBLIC_BASE_URL +
                  "/meeting/" +
                  (call as Call).id
            }
            buttonText={type === "recordings" ? "Join" : "Start"}
          />
        ))
      ) : (
        <h1>{noCallMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
