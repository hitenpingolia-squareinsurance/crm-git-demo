import { Component, OnInit } from "@angular/core";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from "date-fns";
import { Subject } from "rxjs";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import { EventColor } from "calendar-utils";
import { ApiService } from "../../providers/api.service";
import { MatDialog } from "@angular/material/dialog";
import { EditEventComponent } from "../edit-event/edit-event.component";

const colors: Record<string, EventColor> = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA",
  },
};
@Component({
  selector: "app-event-view",
  templateUrl: "./event-view.component.html",
  styleUrls: ["./event-view.component.css"],
})
export class EventViewComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: "Edit",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: "Delete",
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent("Deleted", event);
      },
    },
  ];

  refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  DataArr: any;
  year: any;
  month: any;
  constructor(public api: ApiService, public dialog: MatDialog) {}
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    //   //   //   console.log('yuvi',events);
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
        // this.addEvent_today(events);
      } else {
        this.activeDayIsOpen = true;
        this.addEvent_today(events);
      }
      this.viewDate = date;
    }
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: "New event",
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }
  closeOpenMonthViewDay() {
    // console.log(this.viewDate);
    // const year = this.viewDate.getFullYear();
    // console.log(year);
    this.GetEvent();
    this.activeDayIsOpen = false;
  }
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  public PolicyChartType = "bar";
  public RevenueChartType = "bar";

  public barChartLegend = false;

  public pieChartLabels = {
    scaleShowVerticalLines: false,
    responsive: true,
  };

  pieChartLabels2 = ["1", "2", "3", "4", "5", "6", "7"];
  pieChartData = [0, 0, 0, 0, 0, 0, 0];
  pieChartType = "pie";

  ngOnInit() {
    this.GetEvent();
  }

  GetEvent() {
    this.year = this.viewDate.getFullYear();
    const monthIndex = this.viewDate.getMonth();
    this.month = monthIndex + 1;
    // console.log(this.viewDate);
    // let year = this.viewDate.getFullYear();
    // console.log(year);
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));
    formData.append("year", this.year);
    formData.append("month", this.month);
    this.api.IsLoading();
    this.api.HttpPostType("Event/GetEvent", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.events = result["data"].map((eventData: any) => ({
            title: eventData.event_name,
            data: eventData,
            start: new Date(eventData.event_start),
            end: new Date(eventData.event_end),
            color: {
              primary: eventData.color,
              secondary: eventData.color.secondary,
            },
            // actions: this.actions,
            // resizable: {
            //   beforeStart: true,
            //   afterEnd: true,
            // },
            // draggable: true,
          }));
        } else {
          // this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        const newLocal = "Warning";
        this.api.Toast(
          newLocal,
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  addEvent_today(Event: any) {
    // alert(id);
    const dialogRef = this.dialog.open(EditEventComponent, {
      width: "70%",
      height: "70%",
      disableClose: true,
      data: { id: "0", type: "Events", Event: Event },
    });
  }
}
