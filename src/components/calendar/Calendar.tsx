"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("Primary");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [weeks, setWeeks] = useState<any[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useUser();

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL +
            "/api/media-admin/user/sponsor/calendar?year=2025&month=7",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setWeeks(data.weeks || []);

        const transformedEvents: CalendarEvent[] = [];
        (data.weeks || []).forEach((week: any) => {
          week.batches.forEach((batch: any) => {
            transformedEvents.push({
              id: batch.id,
              title: batch.sponsor?.display_name || "No Sponsor",
              start: batch.start_date,
              end: batch.end_date,
              allDay: true,
              extendedProps: {
                calendar: "Primary",
              },
            });
          });
        });
        setEvents(transformedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    if (user) fetchEvents();
  }, [user]);

  const findWeekForDate = (dateStr: string) => {
    const selectedDate = new Date(dateStr);
    for (const week of weeks) {
      const start = new Date(week.start_date);
      const end = new Date(week.end_date);
      if (selectedDate >= start && selectedDate <= end) {
        return week;
      }
    }
    return null;
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    const week = findWeekForDate(selectInfo.startStr);

    if (week) {
      setEventStartDate(week.start_date.split("T")[0]);
      setEventEndDate(week.end_date.split("T")[0]);
    } else {
      setEventStartDate(selectInfo.startStr);
      setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    }

    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar || "Primary");
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventLevel },
              }
            : event
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prev) => [...prev, newEvent]);
    }

    closeModal();
    resetModalFields();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("Primary");
    setSelectedEvent(null);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: openModal,
            },
          }}
        />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-xl">
            {selectedEvent ? "Edit Event" : "Add Event"}
          </h5>

          <input
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="input mt-4"
          />

          <div className="mt-4">
            <label className="block text-sm">Event Color</label>
            <div className="flex gap-4 mt-2">
              {Object.entries(calendarsEvents).map(([key]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="event-color"
                    value={key}
                    checked={eventLevel === key}
                    onChange={() => setEventLevel(key)}
                  />
                  {key}
                </label>
              ))}
            </div>
          </div>

          <input
            type="date"
            value={eventStartDate}
            onChange={(e) => setEventStartDate(e.target.value)}
            className="input mt-4"
          />

          <input
            type="date"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
            className="input mt-4"
          />

          <div className="flex gap-2 mt-6 justify-end">
            <button onClick={closeModal} className="btn-secondary">
              Close
            </button>
            <button onClick={handleAddOrUpdateEvent} className="btn-primary">
              {selectedEvent ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase()}`;
  return (
    <div className={`event-fc-color flex p-1 rounded-sm ${colorClass}`}>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
