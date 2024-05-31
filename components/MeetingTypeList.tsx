"use client";
import React, { useState } from "react";
import HomeCard from "@/components/HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";

const MeetingTypeList = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const client = useStreamVideoClient();

  const [meetingState, setMeetingState] = useState<0 | 1 | 2>(0);

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a date and time",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      const startedAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startedAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${id}`);
      }

      toast({
        title: "Meeting created",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to create meeting",
      });
    }
  };
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        title="New Meeting"
        description="Create instance meeting"
        icon="icons/add-meeting.svg"
        onClick={() => setMeetingState(1)}
        className="bg-orange-1"
      />
      <HomeCard
        title="Schedule Meeting"
        description="Plan your meeting"
        icon="icons/schedule.svg"
        onClick={() => {}}
        className="bg-blue-1"
      />
      <HomeCard
        title="View Recordings"
        description="Check out your recordings"
        icon="icons/recordings.svg"
        onClick={() => {}}
        className="bg-purple-1"
      />
      <HomeCard
        title="Join Meeting"
        description="via invitation link"
        icon="icons/join-meeting.svg"
        onClick={() => router.push("/recordings")}
        className="bg-yellow-1"
      />

      <MeetingModal
        isOpen={meetingState === 1}
        onClose={() => setMeetingState(0)}
        title="Start instance meeting"
        className="text-center"
        buttonText="Start meeting"
        onClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
