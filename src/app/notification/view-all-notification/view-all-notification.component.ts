import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../providers/api.service";

@Component({
  selector: "app-view-all-notification",
  templateUrl: "./view-all-notification.component.html",
  styleUrls: ["./view-all-notification.component.css"],
})
export class ViewAllNotificationComponent implements OnInit {
  NotificationsAr: any = [];

  constructor(public api: ApiService, private router: Router) {}

  ngOnInit() {
    this.GetNotifications();
  }

  GetNotifications() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "Chat/ViewAll?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.NotificationsAr = result["data"];
          } else {
            //alert(result['message']);
            this.api.Toast("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
  }
}
