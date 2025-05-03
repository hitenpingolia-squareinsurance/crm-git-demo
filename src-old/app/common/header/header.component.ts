import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ShareUrlComponent } from "../../modals/share-url/share-url.component";
import { ApiService } from "../../providers/api.service";
import { SocketioService } from "../../providers/socketio.service";
import { PusherService } from "../../providers/pusher.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ForgotPasswordComponent } from "src/app/account/forgot-password/forgot-password.component";
import $ from "jquery";
import { GetRmDetailsComponent } from "../../modals/get-rm-details/get-rm-details.component";
import { ConversationalSettingsComponent } from "src/app/pos-management/conversational-settings/conversational-settings.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  CountNotifications: any = 0;
  NotificationsAr: any = [];
  myWindow: any;
  LoginUserId: any = 0;
  HeaderStatus: number = 0;
  HeaderLifeTrainngLabel: any = "Start to Life Training";
  LoginType: string;
  PosStatus: any;
  Life_Training_Status: any;
  UserTypesView: string;
  ChangePassword: any;
  GemsStatus: any;
  PrimeStatus: any;
  currentUrl: any;
  urlSegment: string;
  urlSegmentRoot: any;
  urlSegmentId: any;
  urlSegmentSub: any;
  CopyPasteRights: number;
  LoginId: any;
  FetchData: any;
  RmData: any;
  TeleRmData: any;
  ShowGemsLabels: boolean = false;
  UserLoginType: any;
  DataArr: any;
  ProfileImage: any;
  ShareUrlDATAaRR: any;
  DepartmentIdLoginUser: any;
  visible: boolean = false;
  MainNavigation: any;
  navigationData: any;
  filteredItems: any;
  FavoriteMenuData: any;

  enteredOTP: any;
  timerId: any;
  ResendOtpButton: any;
  NewSendType: any;
  lobData: any;
  mobile: any;
  email: any;
  id: any;
  activeLink: string;
  pathname: string;
  activevalue: string | null;
  code: any;
  WhatsAppCheck: any;
  Partner: any;

  //ATTENDANCE MARK CONST
  attendanceInTime: any;
  attendanceOutTime: any;
  attendanceMarkButtonText = "Mark";

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: Router,
    public api: ApiService,
    public socketService: SocketioService,
    private pusherService: PusherService,
    public dialog: MatDialog,

    private router: Router
  ) {
    //   //   //   console.log(this.pathname);
    this.LoginUserId = this.api.GetUserData("Id");
    this.GetNotifications(0);
    this.CopyPasteRights = 0;
    this.DepartmentIdLoginUser = this.api.GetUserData("department");
    this.UserLoginType = this.api.GetUserData("Type");
    //alert(window.location.pathname);

    // if(window.location.pathname == "/Agent/ExamStart/TGlmZQ%3D%3D" || window.location.pathname == "/Agent/Training/TGlmZQ%3D%3D") {
    // 	this.HeaderStatus = 0;
    // }
    // else{//else

    // var splitted = this.router.url.split("/");

    this.LoginType = this.api.GetUserType();
    // alert(this.LoginType);
    this.ChangePassword = 0;

    if (this.LoginType == "agent") {
      //agent

      this.CheckGemsRewards();
      this.PosStatus = this.api.GetUserData("pos_status");
      this.Life_Training_Status = this.api.GetUserData("Life_Training_Status");
      this.PrimeStatus = this.api.GetPrimeStatus();
      this.GemsStatus = this.api.GetGemsStatus();

      // alert(this.GemsStatus);
      // alert(this.PrimeStatus);
      // this.ChangePassword = 1;

      if (this.PosStatus == "2" && this.Life_Training_Status == 0)
        this.CheckStatusLife();
    }

    //agent
    //}

    if (this.LoginType == "employee") {
      this.ChangePassword = 1;
    }

    // if(this.urlSegment =='business-reports' ||  this.urlSegment =='policy-issuance-reports' || this.urlSegment =='manage-renewal-request' ||  this.urlSegment =='earning-reports'){
    //   this.api.DataRightsNavigation('Rights');
    // }else{
    //   this.api.DataRightsNavigation('Default');
    // }
    // let num = [7, 8, 9];
    // num.forEach(function (value) {
    // this.ppp(value);
    // });

    this.getAttendanceMarkTime();
  }
  // ppp(value){
  // // alert(value);
  // }

  setActive(link: string) {
    this.activeLink = link;
    localStorage.setItem("activevalue", link);

    this.pathname = window.location.pathname;

    this.activevalue = localStorage.getItem("activevalue");
  }

  CheckGemsRewards() {
    var Ids = this.api.GetUserData("agent_id");
    var Roles = this.api.GetUserType();

    this.api.IsLoading();
    this.api.HttpGetType("PrimeAgent/CheckGems/" + btoa(Ids)).then(
      (result) => {
        this.api.HideLoading();

        if (result["Status"] == true) {
          this.ShowGemsLabels = false;
        } else {
          this.ShowGemsLabels = true;
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  CopyText(inputElement) {
    this.api.CopyText(inputElement);
    // navigator.clipboard.writeText(inputElement);
  }

  ngOnInit() {
    const loginStatus = localStorage.getItem("password_change_status");

    if (loginStatus === "0") {
      setTimeout(() => {
        const changePasswordLink = document.getElementById("change_password");
        if (changePasswordLink) {
          changePasswordLink.click();
        }
      }, 0);
    } else if (loginStatus === "2") {
      setTimeout(() => {
        const changePasswordLink = document.getElementById("change_password");
        if (changePasswordLink) {
          changePasswordLink.click();
        }
      }, 0);
    }

    this.Partner = this.api.GetUserData("Partner");
    if (this.PrimeStatus == 3) {
      if (window.location.pathname === "/Wallet/gems-wallet") {
        window.location.href = "/dashboard";
      }
    }

    this.favoritemenu();
    this.NewMenusData();
    this.showProfile();
    this.mobile = this.api.GetUserData("number");
    this.email = this.api.GetUserData("email");
    this.code = this.api.GetUserData("Code");

    this.api.TargetComponent.subscribe(
      (page) => {
        if (page != "AppComponent") {
          this.CountNotifications += 1;
          this.playAudio();
        }
      },
      (err) => {}
    );

    // *ngIf="LoginType
    if (this.LoginType == "agent") {
      this.getAgentData();
    }
    this.setWhatsAppHref();
  }

  // ngOnInit() {
  //   const loginStatus = localStorage.getItem("password_change_status");

  //   if (loginStatus === "0") {
  //     setTimeout(() => {
  //       const changePasswordLink = document.getElementById("change_password");
  //       if (changePasswordLink) {
  //         changePasswordLink.click();
  //       }
  //     }, 0);
  //   }

  //   this.Partner = this.api.GetUserData("Partner");
  //   if (this.PrimeStatus == 3) {
  //     if (window.location.pathname === "/Wallet/gems-wallet") {
  //       window.location.href = "/dashboard";
  //     }
  //   }

  //   this.favoritemenu();
  //   this.NewMenusData();
  //   this.showProfile();
  //   this.mobile = this.api.GetUserData("number");
  //   this.email = this.api.GetUserData("email");
  //   this.code = this.api.GetUserData("Code");

  //   // this.StopCutCopyPaste();
  //   // alert(this.currentUrl );

  //   // this.socketService.setupSocketConnection();

  //   // this.socketService.ReceiveMessage().subscribe((res: any) => {

  //   //     // console.log(res);
  //   //     if(res.Receiver_Id === this.api.GetUserData('Id') ){

  //   //       this.CountNotifications += 1;
  //   //       this.api.Toast('Notification',res.Message);
  //   //     }

  //   //   });

  //   /*
  //   this.pusherService.channel.bind('new-notifictions', data  => {
  //      var res = JSON.parse(data.Message);
  //      if(res.Receiver_Id === this.LoginUserId ){
  //       this.CountNotifications += 1;
  //       this.api.Toast('Notification',res.Title);
  //       this.playAudio();
  //      }

  //     });
  //   */

  //   this.api.TargetComponent.subscribe(
  //     (page) => {
  //       if (page != "AppComponent") {
  //         this.CountNotifications += 1;
  //         this.playAudio();
  //       }
  //     },
  //     (err) => {}
  //   );

  //   // *ngIf="LoginType
  //   if (this.LoginType == "agent") {
  //     this.getAgentData();
  //   }
  //   this.setWhatsAppHref();
  // }

  CheckStatusLife() {
    var Ids = this.api.GetUserData("Id");
    var Roles = this.api.GetUserType();

    this.api.IsLoading();
    this.api
      .HttpGetType(
        "TrainingExam/CheckLifeTrainingStatus/" + btoa(Ids) + "/header"
      )
      .then(
        (result) => {
          this.api.HideLoading();

          if (result["Status"] == true) {
            if (result["Training_Stage"] == "Complete") {
              this.HeaderStatus = 0;
              this.HeaderLifeTrainngLabel = "";
            } else if (result["Training_Stage"] == "Exam") {
              this.HeaderStatus = 1;
              this.HeaderLifeTrainngLabel = "Contiune to exam";
            } else if (result["Training_Stage"] == "Training") {
              this.HeaderStatus = 1;
              this.HeaderLifeTrainngLabel = "Contiune to training";
            }
          } else {
            this.api.Toast("Warning", result["Msg"]);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  showProfile() {
    this.api
      .HttpGetType(
        "Profile/GetProfile?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then(
        (result: any) => {
          if (result["status"] == true) {
            this.DataArr = result["Data"];

            this.ProfileImage = this.DataArr.profile;
            //   //   //   console.log(this.ProfileImage);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  ClicksLifeTraining(Types: any) {
    if (Types == "training" || Types == "")
      this.route.navigate(["Agent/Training/" + btoa("Life")]);
    else if (Types == "exam")
      this.route.navigate(["Agent/ExamStart/" + btoa("Life")]);
  }

  playAudio() {
    var notification_sound = new Audio("assets/audio/notification-sound.wav");
    notification_sound.play();
  }

  GetNotifications(Type) {
    //alert();
    if (Type == 0) {
      //this.api.IsLoading();
      this.api
        .HttpGetType(
          "Chat/GetNotifications?User_Id=" +
            this.api.GetUserData("Id") +
            "&Type=" +
            Type
        )
        .then(
          (result) => {
            //this.api.HideLoading();

            if (result["status"] == 1) {
              this.NotificationsAr = result["data"];
              this.CountNotifications = result["UnSeenCount"];
            } else {
              //alert(result['message']);
              //this.api.Toast('Warning',result['msg']);
            }
          },
          (err) => {
            // Error log
            //// console.log(err);
            //this.api.HideLoading();
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
            //this.api.ErrorMsg('Network Error :- ' + err.message);
          }
        );
    } else if (Type == 1) {
      // seen notifictions

      this.api
        .HttpGetType(
          "Chat/GetNotifications?User_Id=" +
            this.api.GetUserData("Id") +
            "&Type=" +
            Type
        )
        .then(
          (result) => {
            //this.api.HideLoading();
            this.CountNotifications = 0;
            this.NotificationsAr = result["data"];
          },
          (err) => {
            this.api.Toast(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
            //this.api.ErrorMsg('Network Error :- ' + err.message);
          }
        );
    }
  }

  BackToPanel() {
    var User_Id = this.api.GetUserData("Id");
    var User_Type = this.api.GetUserType();

    if (User_Type == "sp" || User_Type == "user" || User_Type == "agent") {
      let a = document.createElement("a");
      a.target = "_blank";
      a.href =
        "https://www.squareinsurance.in/Agents/check/" +
        btoa(User_Id) +
        "/" +
        btoa(User_Type);
      a.click();
    } else if (User_Type == "employee") {
      let a = document.createElement("a");
      a.target = "_blank";
      a.href =
        "https://www.squareinsurance.in/Prequotes/SetSessionEmployee/BackToPanel/" +
        btoa(User_Id);
      a.click();
    }
  }

  BackToEmployeePanel() {
    var User_Id = this.api.GetUserData("Id");
    var User_Type = this.api.GetUserType();

    if (User_Type == "employee") {
      let a = document.createElement("a");
      a.target = "_blank";
      a.href =
        "https://crmapi.squareinsurance.in/admin/admin_login/employee_login?name=" +
        btoa(User_Id);
      a.click();
    }
  }

  Logout() {
    // this.api.IsLoading();
    // localStorage.removeItem('LoginType');
    // localStorage.removeItem('Token');
    // localStorage.removeItem('UserData');
    // localStorage.setItem('Logged_In', 'FALSE');
    // this.api.changeMessage({IsLoggedIn :"FALSE"});

    let a = document.createElement("a");
    a.target = "";
    a.href = this.api.ReturnWebUrl() + "/agents/logout/crm";
    a.click();
  }

  ShareUrl() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("UserCode", this.api.GetUserData("Code"));
    formData.append("UserType", this.api.GetUserType());

    this.api.IsLoading();
    this.api.HttpPostType("Auth/ShareUrl", formData).then(
      (result: any) => {
        this.api.HideLoading();

        if (result["status"] == true) {
          //this.CloseModel();
          // console.log(result['Data']);

          this.ShareUrlDATAaRR = result["Data"];
          //this.PostingData = result['PostingData'];

          //this.api.Toast('Success',result['Message']);
        } else {
          this.api.Toast("Warning", result["Message"]);
        }
      },
      (err) => {
        // Error log
        this.api.HideLoading();
        //// console.log(err.message);
        this.api.Toast("Warning", err.message);
      }
    );
  }

  // ShareUrl() {
  //   const dialogRef = this.dialog.open(ShareUrlComponent, {
  //     width: "auto",
  //     height: "auto",
  //     disableClose: true,
  //     data: {},
  //   });

  //   dialogRef.afterClosed().subscribe((result:any) => {});
  // }

  ForgetPassword(LoginType: any, ActionType: any) {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: "30%",
      height: "auto",
      disableClose: true,
      data: { LoginType: LoginType, Action: ActionType },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  ClickMyRmTeleRm() {
    var User_Id = this.api.GetUserData("Id");
    var User_Type = this.api.GetUserType();
    const dialogRef = this.dialog.open(GetRmDetailsComponent, {
      // width: "50%",
      // height: "50%",

      width: "auto",
      height: "auto",
      disableClose: true,

      // disableClose: true,
      data: { User_Id: User_Id, User_Type: User_Type },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  // hideShowDiv()
  // {

  //   this.visible = !this.visible;

  // }

  // hidediv(){
  //   !this.visible;
  // }

  ///yuvraj code

  NewMenusData() {
    //  return false;
    this.api.IsLoading();
    this.api
      .HttpGetSOCKET_ENDPOINT(
        "Menus/" +
          this.api.GetUserData("Id") +
          "/" +
          this.api.GetUserType() +
          "/NewMenus"
      )
      .then(
        (result: any) => {
          //   //   //   console.log(result);

          var data = JSON.parse(
            this.api.decryptText(JSON.parse(result[0].body).response)
          );
          if (data.status == 1) {
            this.MainNavigation = data.MainNavigation;

            // this.navigationData = [];
            // this.MainNavigation.forEach(element => {
            //   if (element.SubMenu.length === 0) {
            //     this.navigationData.push({
            //       Route: element.Route,
            //       Name: element.Name
            //     });
            //   }
            //   if (element.SubMenu.length !== 0) {
            //     element.SubMenu.forEach(NewSumbenu => {
            //       this.navigationData.push({
            //         Route: NewSumbenu.Route,
            //         Name: NewSumbenu.Name
            //       });
            //     });
            //   }
            // });

            this.navigationData = [];
            this.MainNavigation.forEach((element) => {
              let menuItem = {
                Menuname: element.Name,
                Route: element.Route,
                Name: element.Name,
                search_keys: element.search_keys,
                subMenu: [],
              };

              if (element.SubMenu.length !== 0) {
                element.SubMenu.forEach((NewSumbenu) => {
                  menuItem.subMenu.push({
                    Route: NewSumbenu.Route,
                    Name: NewSumbenu.Name,
                    search_keys: NewSumbenu.search_keys,
                  });
                });
              }
              this.navigationData.push(menuItem);
            });
            this.api.HideLoading();
            this.filterItems("");
          } else {
            this.api.Toast("Warning", data.msg);
          }
        },
        (err) => {
          this.api.HideLoading();
          this.api.Toast(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
        }
      );
  }

  // filterItems(searchTerm: string) {

  //   const lowerCaseSearchTerm = searchTerm.toLowerCase();

  //   let filteredMainMenuItems = this.navigationData.map(item => {
  //     const matchesMainItem = item.Name.toLowerCase().includes(lowerCaseSearchTerm);

  //     if (!Array.isArray(item.subMenu)) {
  //       return matchesMainItem ? item : null;
  //     }

  //     // Filter subMenu items
  //     const filteredSubMenu = item.subMenu.filter(subItem =>
  //       subItem.Name.toLowerCase().includes(lowerCaseSearchTerm)
  //     );

  //     // Check if main item matches or any subMenu items match
  //     if (matchesMainItem || filteredSubMenu.length > 0) {
  //       // If main item matches, expand all subMenu items
  //       const updatedSubMenu = matchesMainItem ? item.subMenu : filteredSubMenu;
  //       const updatedItem = {
  //         ...item,
  //         subMenu: updatedSubMenu
  //       };
  //       return updatedItem;
  //     }

  //     return null;
  //   }).filter(item => item !== null);

  //   // Continue with favorite items logic as before
  //   const favoriteRoutes = new Set(this.FavoriteMenuData.map(fav => fav.Route));

  //   const [favoriteItems, nonFavoriteItems] = filteredMainMenuItems.reduce(([fav, nonFav], item) => {
  //     const isFavorite = favoriteRoutes.has(item.Route) || item.subMenu.some(subItem => favoriteRoutes.has(subItem.Route));
  //     if (isFavorite) {
  //       fav.push(item);
  //     } else {
  //       nonFav.push(item);
  //     }
  //     return [fav, nonFav];
  //   }, [[], []]);

  //   // Combine favorite items at the top with non-favorite items
  //   this.filteredItems = [...favoriteItems, ...nonFavoriteItems];

  ////   //   //   console.log('Filtered items:', this.filteredItems);

  // }

  filterItems(searchTerm: string) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let filteredMainMenuItems = this.navigationData
      .map((item) => {
        // Check if the main item matches the search term
        const matchesMainItem =
          item.Name.toLowerCase().includes(lowerCaseSearchTerm) ||
          (item.search_keys &&
            item.search_keys.some((key) =>
              key.toLowerCase().includes(lowerCaseSearchTerm)
            ));
        if (!Array.isArray(item.subMenu)) {
          return matchesMainItem ? item : null;
        }

        // Filter subMenu items
        const filteredSubMenu = item.subMenu.filter(
          (subItem) =>
            subItem.Name.toLowerCase().includes(lowerCaseSearchTerm) ||
            (subItem.search_keys &&
              subItem.search_keys.some((key) =>
                key.toLowerCase().includes(lowerCaseSearchTerm)
              ))
        );

        if (matchesMainItem || filteredSubMenu.length > 0) {
          const updatedSubMenu = matchesMainItem
            ? item.subMenu
            : filteredSubMenu;
          const updatedItem = {
            ...item,
            subMenu: updatedSubMenu,
          };
          return updatedItem;
        }

        return null;
      })
      .filter((item) => item !== null);

    const favoriteRoutes = new Set(
      this.FavoriteMenuData.map((fav) => fav.Route)
    );

    const [favoriteItems, nonFavoriteItems] = filteredMainMenuItems.reduce(
      ([fav, nonFav], item) => {
        const isFavorite =
          favoriteRoutes.has(item.Route) ||
          item.subMenu.some((subItem) => favoriteRoutes.has(subItem.Route));
        if (isFavorite) {
          fav.push(item);
        } else {
          nonFav.push(item);
        }
        return [fav, nonFav];
      },
      [[], []]
    );

    // Combine favorite items at the top with non-favorite items
    this.filteredItems = [...favoriteItems, ...nonFavoriteItems];
    // console.log('Filtered items:', this.filteredItems);
  }

  //yuvraj
  favoritemenu() {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("UserType", this.api.GetUserType());

    this.api.IsLoading();
    this.api.HttpPostType("data/favoritemenu", formData).then(
      (result: any) => {
        this.api.HideLoading();
        if (result["status"] == true) {
          this.FavoriteMenuData = result["data"];
        } else {
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", err.message);
      }
    );
  }

  RedirectToWEbs(Url) {
    var UserDatas = this.api.GetUserData("Id");
    var GetUserType = this.api.GetUserType();

    // alert( UserDatas);
    // alert( GetUserType);
    // return false;
    let a = document.createElement("a");
    a.target = "_blank";
    if (GetUserType == "employee") {
      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/Prequotes/SetSessionEmployee/login/" +
      //   btoa(UserDatas) +
      //   "?ReturnUrl=" +
      //   Url;
    } else {
      if (GetUserType == "user") {
        GetUserType = "agent";
      }

      a.href =
        this.api.ReturnWebUrl() +
        "/redirecting-session-users/" +
        GetUserType +
        "/" +
        btoa(UserDatas) +
        "?ReturnUrl=" +
        Url;

      // a.href =
      //   this.api.ReturnWebUrl() +
      //   "/agents/check/" +
      //   btoa(UserDatas) +
      //   "/" +
      //   btoa(GetUserType) +
      //   "/login?ReturnUrl=" +
      //   Url;
    }

    // alert(a);
    // return false;
    a.click();
  }

  CertificateDow() {
    const formData = new FormData();
    formData.append("login_type", this.api.GetUserType());
    formData.append("login_id", this.api.GetUserData("Id"));

    this.api.IsLoading();
    this.api.HttpPostType("Certificate/IssueCertificateLife", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == true) {
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  getAgentData() {
    const formData = new FormData();
    formData.append("loginId", this.api.GetUserData("Id"));
    formData.append("loginCode", this.api.GetUserData("Code"));
    formData.append("loginType", this.api.GetUserType());
    formData.append("type", "Reporting_Manager_Id");

    formData.append("user_id", this.api.GetUserData("Id"));

    this.api
      .HttpPostType("Dashboard/getAgentData", formData)
      .then((result: any) => {
        if (result["status"] == true) {
          this.lobData = result["Data"];
          //   //   //   console.log(this.lobData, '1234567');
        }
      });
  }

  initiateDownload(OTP_mass: any, SendType: any) {
    this.NewSendType = SendType;
    var timeSec = 60;
    const formData = new FormData();
    // formData.append("Mobile", '7976929440');
    // formData.append("Name", 'Yuvraj Singh');
    // formData.append("Email", 'ys0219599@gmail.com');
    formData.append("OTP_mass", OTP_mass);
    formData.append("type", this.NewSendType);
    this.api.IsLoading();
    this.api.HttpPostType("Profile/otpSend", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.api.Toast("Success", result["msg"]);
          if (OTP_mass == "Sent") {
            const Openbutton = document.getElementById("OpenOtpModel");
            Openbutton.click();
          }
          clearInterval(this.timerId);
          this.timerId = setInterval(() => {
            timeSec--;
            document.getElementById("ResendOtpButton").innerHTML =
              "" + timeSec + " Sec";
            // timeSec;
            // document.getElementById('ResendOtpButton').disabled='true';
            // $("#ResendOtpButton").prop('disabled', true);
            this.ResendOtpButton = true;
            if (timeSec == 1) {
              timeSec = 60;
              document.getElementById("ResendOtpButton").innerHTML = "Resend";
              clearInterval(this.timerId);
              $("#ResendOtpButton").prop("disabled", false);
              this.ResendOtpButton = false;
            }
          }, 1000);
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  // NewSendType

  verifyOTP() {
    const formData = new FormData();
    formData.append("otp", this.enteredOTP);
    this.api.IsLoading();
    if (this.NewSendType == "Certificate") {
      this.api.HttpPostType("MyPos/DonwloadCertificate", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.enteredOTP = "";
            this.downloadDocument(result["Certificate"]);
            const Closebutton = document.getElementById("ClodeOtpModel");
            Closebutton.click();
          } else {
            this.api.Toast("Warning", result["msg"]);
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
    } else {
      this.api.HttpPostType("MyPos/DonwloadAgreement", formData).then(
        (result: any) => {
          this.api.HideLoading();
          if (result["status"] == 1) {
            this.enteredOTP = "";
            this.downloadDocument(result["Certificate"]);
            const Closebutton = document.getElementById("ClodeOtpModel");
            Closebutton.click();
          } else {
            this.api.Toast("Warning", result["msg"]);
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
  }

  downloadDocument(url) {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.substring(url.lastIndexOf("/") + 1); // Extract filename from URL
    link.style.display = "none"; // Make sure it doesn't affect the UI
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ViewDocument(url) {
  //   window.open(url, "", "left=100,top=50,width=800%,height=600");
  // }

  Conversational_Settings(agentCode: any, mobile: any, email: any) {
    const dialogRef = this.dialog.open(ConversationalSettingsComponent, {
      width: "50%",
      // height: "80%",
      disableClose: true,
      data: { agentCode: agentCode, mobile: mobile, email: email },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.Reload();
    });
  }

  // new
  //  setWhatsAppHref(Number:any): any {
  //   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //   const phoneNumber = '7976929440';
  //   const text = ''; // Add any default text if needed
  //   if (isMobile) {
  //    return `whatsapp://send?phone=${phoneNumber}&text=${text}`;
  //   } else {
  //     return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${text}`;
  //   }
  // }
  setWhatsAppHref(): any {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.WhatsAppCheck = true;
    } else {
      this.WhatsAppCheck = false;
    }
  }

  //BEGIN::MARK ATTENDANCE FUNCTIONS

  markAttendance() {
    // Detect platform based on user agent
    let platform = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "web";

    const confirmationMessage =
      this.attendanceMarkButtonText == "Mark"
        ? "You are about to mark your attendance for the first time. Are you sure you want to proceed?"
        : this.attendanceMarkButtonText == "Out"
        ? "You are about to mark yourself out for the day. Are you sure you want to proceed?"
        : "You are about to mark your attendance again. Are you sure you want to continue?";

    let Confirms = confirm(confirmationMessage);
    if (Confirms === true) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Success callback - permission granted, location available
            const lat = position.coords.latitude;
            const long = position.coords.longitude;

            this.getClientIp().then((ip) => {
              const formData = new FormData();
              formData.append("user_id", this.LoginUserId);
              formData.append("lat", lat.toString());
              formData.append("long", long.toString());
              formData.append("platform", platform); // Use detected platform
              formData.append("ip_address", ip);
              this.api.IsLoading();
              this.api
                .HttpPostType("hrms/AttendanceManagement/mark_attendance", formData)
                .then(
                  (result) => {
                    this.api.HideLoading();
                    if (result["status"] === "success") {
                      this.attendanceInTime = this.formatTimeToAMPM(
                        result["in_time"]
                      );
                      this.attendanceOutTime = this.formatTimeToAMPM(
                        result["out_time"]
                      );
                      if (result["in_time"] && result["out_time"]) {
                        this.attendanceMarkButtonText = "In";
                      } else {
                        this.attendanceMarkButtonText = "Out";
                      }
                      this.api.Toast("Success", result["message"]);
                      this.api.markAttendance(true);
                    } else {
                      this.api.Toast("Warning", result["message"]);
                    }
                  },
                  (err) => {
                    this.api.HideLoading();
                    this.api.Toast(
                      "Warning",
                      "Network Error: " + err.name + " (" + err.statusText + ")"
                    );
                  }
                );
            }).catch((err) => {
              this.api.HideLoading();
              this.api.Toast("Warning", "Failed to fetch IP address: " + err);
            });


          },
          (error) => {
            // Error callback - location access denied or unavailable
            switch (error.code) {
              case error.PERMISSION_DENIED:
                this.api.Toast(
                  "Warning",
                  "User denied the request for Geolocation."
                );
                break;
              case error.POSITION_UNAVAILABLE:
                this.api.Toast(
                  "Warning",
                  "Location information is unavailable."
                );
                break;
              case error.TIMEOUT:
                this.api.Toast(
                  "Warning",
                  "The request to get user location timed out."
                );
                break;
              default:
                this.api.Toast("Warning", "An unknown error occurred.");
                break;
            }
          }
        );
      } else {
        // Geolocation not supported by browser
        this.api.Toast(
          "Warning",
          "Geolocation is not supported by this browser."
        );
      }
    }
  }

  getAttendanceMarkTime() {
    this.api.IsLoading();
    this.api
      .HttpGetType(
        "hrms/AttendanceManagement/getMarkAttendanceCurrent?User_Id=" +
          this.api.GetUserData("Id") +
          "&User_Type=" +
          this.api.GetUserType()
      )
      .then((result: any) => {
        this.api.HideLoading();
        if (result["status"] == "success") {
          this.attendanceInTime = this.formatTimeToAMPM(
            result["data"]["in_time"]
          );
          this.attendanceOutTime = this.formatTimeToAMPM(
            result["data"]["out_time"]
          );
          if (result["data"]["in_time"] && result["data"]["out_time"]) {
            this.attendanceMarkButtonText = "In";
          } else {
            this.attendanceMarkButtonText = "Out";
          }
        } else {
        }
      })
      .catch((err: any) => {
        this.api.HideLoading();
        this.api.Toast(
          "Warning",
          "Network Error: " + err.name + " (" + err.statusText + ")"
        );
      });
  }

  formatTimeToAMPM(timeString: string): string {
    // Check for null or empty string and return blank
    if (!timeString || timeString.trim() === "") return "";
    const [hours, minutes] = timeString.split(":").map(Number);
    // Handle cases where hours or minutes are NaN
    if (isNaN(hours) || isNaN(minutes)) return "";
    const isPM = hours >= 12;
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const ampm = isPM ? "PM" : "AM";
    return `${formattedHours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;
  }

  getClientIp(): Promise<string> {
    return new Promise((resolve, reject) => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                resolve(data.ip);
            })
            .catch(err => {
                reject(err);
            });
    });
  }
  //END::MARK ATTENDANCE FUNCTIONS
}
