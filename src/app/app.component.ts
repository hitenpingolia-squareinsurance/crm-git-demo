import { Component, HostListener } from "@angular/core";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from "../environments/environment";

import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { ApiService } from "./providers/api.service";
import { FcmService } from "./providers/fcm.service";
import { PusherService } from "./providers/pusher.service";
import { SessionExpiredComponent } from "./modals/session-expired/session-expired.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Console } from "console";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  //title = 'CRM';
  message: any = null;

  IsLoggedIn: string = "FALSE";
  LoginUserId: any = 0;
  interval: any;
  CurrentUrl: string;
  windownPoupupstatus: any = 0;
  currentRoute: string;
  currentUrl1: string;
  urlSegment: any;
  urlSegmentRoot: any;
  urlSegmentSub: any;
  CallLoginExpired: number = 0;

  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    public fcm: FcmService,
    public pusher: PusherService,
    private router: Router
  ) {
    this.StopCutCopyPaste();

    this.requestPermission();
    this.listen();
    this.message = this.message;
    // console.log('fcm-data'+this.message);

    this.api.currentMessage.subscribe(
      (message) => {
        // console.log("Calling From Login/Service Page ");
        this.IsLoggedIn = message["IsLoggedIn"];
        // console.log(message);
        this.UpdateBodyClass();
      },
      (err) => {}
    );

    // console.log(this.IsLoggedIn);

    this.LoginUserId = this.api.GetUserData("Id");
    this.CurrentUrl = window.location.pathname;

    if (this.api.CheckLoginStatus() == "TRUE") {
      this.IsLoggedIn = "TRUE";

      if (this.CurrentUrl == "/") this.router.navigate(["dashboard"]);
    } else {
      this.IsLoggedIn = "FALSE";
      if (this.api.CheckLoginStatus() == "FALSE") {
        if (
          this.CurrentUrl == "/login/agent" ||
          this.CurrentUrl == "/login/user" ||
          this.CurrentUrl == "/login/sp" ||
          this.CurrentUrl == "/login/employee" ||
          this.CurrentUrl == "/login/admin"
        ) {
        } else {
          const params = new URLSearchParams(window.location.search);
          var name = params.get("type");

          if (
            this.CurrentUrl == "/Logoutweb" &&
            (name == "employee" || name == "agent" || name == "user")
          ) {
            window.location.href =
              this.api.ReturnWebUrl() + "/logout-users/" + name;
          } else {
            window.location.href = "https://www.squareinsurance.in";
          }
        }
      }
    }

    this.realTimePageServiceCall();
  }

  @HostListener("document:click", ["$event"])
  handleClick(event: Event) {
    this.StopCutCopyPaste();

    var splitted = this.router.url.split("/");
    if (typeof splitted[1] != "undefined") {
      this.urlSegment = splitted[1];
    }

    if (this.api.CheckLoginStatus() == "FALSE" && this.urlSegment != "login") {
      localStorage.removeItem("LoginType");
      localStorage.removeItem("Token");
      localStorage.removeItem("UserData");
      localStorage.setItem("Logged_In", "FALSE");
      localStorage.removeItem("Login_Token");

      let a = document.createElement("a");
      a.target = "";
      a.href = this.api.ReturnWebUrl() + "/logout-users/agent";
      a.click();
      window.location.href = "https://www.squareinsurance.in";
    }

    clearInterval(this.interval);

    // alert(this.api.CheckSessionExpiredStatus());

    // console.log(this.api.CheckLoginStatus());
    // console.log(this.api.CheckSessionExpiredStatus());
    // console.log(this.CallLoginExpired);

    if (
      this.api.CheckLoginStatus() == "TRUE" &&
      this.api.CheckSessionExpiredStatus() == "TRUE" &&
      this.CallLoginExpired == 0
    ) {
      ///  alert();
      this.loginExpired();
    }
  }

  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    this.StopCutCopyPaste();

    if (event.keyCode == 44) {
      return false;
    }
  }

  ngOnInit(): void {
    // this.requestPermission();
    // this.listen();
    // this.CheckSessionExpired();

    if (
      this.api.CheckLoginStatus() == "TRUE" &&
      this.api.CheckSessionExpiredStatus() == "TRUE" &&
      this.CallLoginExpired == 0
    ) {
      this.loginExpired();
    }

    this.UpdateBodyClass();
    //this.loadScript();
    if (
      this.api.GetUserType() == "employee" ||
      this.api.GetUserType() == "agent"
    ) {
      if (this.api.CheckLoginStatus() == "TRUE") {
        //   //   //   console.log("CHECK sESSION");
      }
    }

    const words = this.CurrentUrl.split("/");
    var splitted = this.router.url.toString();

    if (words[3] == "1") {
      this.windownPoupupstatus = "1";
    } else {
      this.windownPoupupstatus = "0";
    }
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          // console.log("Hurraaa!!! we got the token.....");
          // console.log(currentToken);

          const formData = new FormData();
          formData.append("fcmId", currentToken);
          formData.append("token", "square123123");
          formData.append("loginId", this.api.GetUserData("Id"));
          formData.append("loginType", this.api.GetUserType());

          this.api
            .HttpPostType("Chat/UpdateWebMsgToken", formData)
            .then((result: any) => {
              //  alert(result);
            });
        } else {
          // console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        // console.log('An error occurred while retrieving token. ', err);
      });
  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      // console.log('Message received. ', payload);
      this.message = payload;
    });
  }

  StopCutCopyPaste() {}

  realTimePageServiceCall() {
    if (this.api.CheckLoginStatus() == "TRUE") {
      this.pusher.channel.bind("new-notifictions", (data) => {
        // console.log(data);

        var res = JSON.parse(data.Message);
        // console.log(res.Page + " 123");
        if (res.Receiver_Id === this.LoginUserId) {
          var PageName = res.Page; //'Claim';
          if (res.Is_Notify == 1) {
            this.api.Toast("Notification", res.Title);
          }
          this.api.changeComponent(PageName);
        }
      });
    } else {
      // alert();
      // window.location.href = 'https://www.squareinsurance.in';
    }
  }

  // StartSession() {
  //   if (
  //     this.api.GetUserType() == "employee" ||
  //     this.api.GetUserType() == "agent"
  //   ) {
  //     if (this.api.CheckLoginStatus() == "TRUE") {
  //       var SessionExpired = this.api.GetUserData("SessionExpired");
  //       // var SessionExpired = 1;
  //       //    // console.log("SessionExpired Time :- " + SessionExpired);
  //       var countdown = SessionExpired * 60 * 1000; // 30 minutes
  //       this.interval = setInterval(() => {
  //         countdown -= 1000;
  //         var min = Math.floor(countdown / (60 * 1000));
  //         var sec = Math.floor((countdown - min * 60 * 1000) / 1000);

  //         if (countdown <= 0) {
  //           //alert("30 min!");
  //           clearInterval(this.interval);
  //           if (this.api.CheckLoginStatus() == "TRUE") {
  //             this.CheckSessionExpired();
  //             //doSomething();
  //           }
  //         } else {
  //           // // console.log(min + " : " + sec);
  //         }
  //       }, 1000); //1000ms. = 1sec.
  //     }
  //   }
  // }

  CheckSessionExpired(): void {
    if (
      this.api.GetUserType() == "employee" ||
      this.api.GetUserType() == "agent"
    ) {
      // alert("App componenet Se call Hua ");
      const dialogRef = this.dialog.open(SessionExpiredComponent, {
        width: "45rem",
        height: "350px",
        disableClose: true,
        data: { Id: 0 },
      });

      dialogRef.afterClosed().subscribe((result: any) => {});
    }
  }

  loginExpired() {
    if (
      this.api.GetUserType() == "employee" ||
      this.api.GetUserType() == "agent"
    ) {
      this.CallLoginExpired = 1;
      // alert("yE CALL HUA HAI ");
      // alert("App componenet Se call Hua ");
      const dialogRef = this.dialog.open(SessionExpiredComponent, {
        width: "45rem",
        height: "350px",
        disableClose: true,
        data: { Id: 0 },
      });

      dialogRef.afterClosed().subscribe((result: any) => {});
    }
  }

  UpdateBodyClass() {
    const body = document.getElementsByTagName("body")[0];
    //// console.log(body);
    if (this.IsLoggedIn == "TRUE") {
      body.classList.remove("login-page");
      body.classList.add(
        "hold-transition",
        "skin-blue",
        "sidebar-mini",
        "skin-black-light"
      );
    } else {
      body.classList.remove("skin-blue", "sidebar-mini");
      body.classList.add("hold-transition", "login-page");
    }
  }

  public loadScript() {
    var isFound = false;
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; ++i) {
      if (
        scripts[i].getAttribute("src") != null &&
        scripts[i].getAttribute("src").includes("loader")
      ) {
        isFound = true;
      }
    }

    if (!isFound) {
      var dynamicScripts = [];
      if (this.api.CheckLoginStatus() == "TRUE") {
        dynamicScripts = [
          "assets/bower_components/jquery/dist/jquery.min.js",
          "assets/bower_components/bootstrap/dist/js/bootstrap.min.js",
          "assets/bower_components/fastclick/lib/fastclick.js",
          "assets/dist/js/adminlte.min.js",
          "assets/bower_components/jquery-sparkline/dist/jquery.sparkline.min.js",
          "assets/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js",
          "assets/plugins/jvectormap/jquery-jvectormap-world-mill-en.js",
          "assets/bower_components/jquery-slimscroll/jquery.slimscroll.min.js",
          "assets/bower_components/chart.js/Chart.js",
          "assets/dist/js/pages/dashboard2.js",
          "assets/dist/js/demo.js",
        ];
      } else {
        dynamicScripts = [
          "assets/bower_components/jquery/dist/jquery.min.js",
          "assets/bower_components/bootstrap/dist/js/bootstrap.min.js",
          //"plugins/iCheck/icheck.min.js",
          //"assets/dist/js/login.js"
        ];
      }

      for (var i = 0; i < dynamicScripts.length; i++) {
        let node = document.createElement("script");
        node.src = dynamicScripts[i];
        node.type = "text/javascript";
        node.async = false;
        node.charset = "utf-8";
        document.getElementsByTagName("body")[0].appendChild(node);
      }
    }
  }

  ActiveMenus(CurrentUrls: any) {
    // alert(CurrentUrls);
    setTimeout(function () {
      $("a.DirectMenus").each(function (index) {
        var HrefAll = $(this).attr("href");
        //   // console.log(HrefAll);

        if (CurrentUrls.trim() == HrefAll.trim()) {
          //    // console.log(HrefAll.trim()+' = '+CurrentUrls.trim());

          $(".ClickAnchorMenu").removeClass("SubMenuActive");
          $(".entericonclass").remove();
          $(this).addClass("SubMenuActive");
          $(this)
            .last()
            .append(
              '<i class="fa fa-arrow-right iconmenuclass entericonclass" aria-hidden="true"></i> '
            );
        }
      });
    }, 500);
  }
}
