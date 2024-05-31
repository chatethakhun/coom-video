"use client";
import React, { useState } from "react";
import HomeCard from "@/components/HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import ReactDatePicker from "react-datepicker";

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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
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
        onClick={() => setMeetingState(2)}
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

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 2}
          onClose={() => setMeetingState(0)}
          title="Create Meeting"
          className="text-center"
          buttonText="Join meeting"
          onClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="description"
              className="text-base text-normal leading-[22px] text-sky-2"
            >
              Add Description
            </label>
            <Textarea
              name="description"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible-ring-offset-0"
            />
            <label
              htmlFor="description"
              className="text-base text-normal leading-[22px] text-sky-2"
            >
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(dateSelected) => {
                setValues({ ...values, dateTime: dateSelected! });
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 2}
          onClose={() => setMeetingState(0)}
          title="Meeting created"
          className="text-center"
          buttonText="Copy link"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);

            toast({
              title: "Link copied to clipboard",
            });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}

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
