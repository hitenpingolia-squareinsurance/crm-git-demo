import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../providers/api.service";
import * as $ from "jquery";
//import * as AdminLte from 'admin-lte';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  public searchText: string = "";
  public foundMenuItems = [];

  treeValue: string = "tree";

  Menus: any = [];
  RightsMenus: any = [];
  ValueSidebar: number;
  MainNavigation: any;
  RightsNavigation: any;
  ManegerNavigation: any;
  EhrNavigation: any;
  currentUrl: any;
  route: any;
  urlSegment: any;
  urlSegmentRoot: any;
  urlSegmentSub: any;
  CopyPasteRights: any;
  LoginType: string;
  LoginId: any;
  FetchData: any;
  RmData: any;
  TeleRmData: any;
  CurrentUrl1: string;
  RedicrctBackYypes: string;
  MainNavigation2: any;
  RightsNavigation2: any;
  ManegerNavigation2: any;

  eHRNavigation2: any;
  eHRNavigation: any;

  UsseeersType: any;
  UserLoginType: any;
  DataArr: any;
  ProfileImage: any;
  DataArMenus: any;
  SidebarCssClass: string = "";

  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.UserLoginType = this.api.GetUserData("Type");
    this.LoginType = this.api.GetUserType();

    this.ValueSidebar = 1;
  }

  ngOnInit() {
    this.CurrentUrl1 = window.location.pathname;

    this.currentUrl = this.router.url;
    var splitted = this.currentUrl.split("/");
    if (typeof splitted[2] != "undefined") {
      this.urlSegment = splitted[2];
    }

    if (typeof splitted[1] != "undefined") {
      this.urlSegmentRoot = splitted[1];
    }

    if (typeof splitted[3] != "undefined") {
      this.urlSegmentSub = splitted[3];
    }
    this.StyleCss(this.api.DataRightsGetNavigationNumber());
    // this.StopCutCopyPaste(0);
    this.showProfile();

    if (this.api.GetUserData("Code") == "SIBAdmin") {
      this.GetMenu();
    } else {
      this.NewMenusData();
    }
  }
  ngAfterViewInit(): void {}

  StyleCss(type: number) {
    if (type == 1) {
      this.ValueSidebar = 1;
      $(".menu_heading").css("display", "block");
      $(".menu_heading_two").css("display", "none");
      $(".menu_heading_three").css("display", "none");
      $(".menu_heading_four").css("display", "none");

      // if (this.api.DataRightsGetNavigation() == "Rights") {
      //   // this.router.navigateByUrl("/dashboard");
      //   this.api.DataRightsNavigation("Default");
      // }
      // console.log(1);
    } else if (type == 2) {
      this.ValueSidebar = 2;

      // $(".ActiveMenuHeight").css('height', '300px');

      $(".menu_heading").css("display", "none");
      $(".menu_heading_two").css("display", "block");
      $(".menu_heading_three").css("display", "none");
      $(".menu_heading_four").css("display", "none");

      // if (this.api.DataRightsGetNavigation() == "Default") {
      //   // this.router.navigateByUrl("/dashboard");
      //   this.api.DataRightsNavigation("Rights");
      // }
      // console.log(2);
    } else if (type == 3) {
      this.ValueSidebar = 3;
      $(".menu_heading").css("display", "none");
      $(".menu_heading_two").css("display", "none");
      $(".menu_heading_four").css("display", "none");

      $(".menu_heading_three").css("display", "block");

      // console.log(3);
    } else if (type == 4) {
      this.ValueSidebar = 4;
      $(".menu_heading").css("display", "none");
      $(".menu_heading_two").css("display", "none");
      $(".menu_heading_three").css("display", "none");
      $(".menu_heading_four").css("display", "block");

      // console.log(3);
    }
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
            console.log(this.ProfileImage);
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
          var data = JSON.parse(
            this.api.decryptText(JSON.parse(result[0].body).response)
          );

          console.log(data);

          // var data = JSON.parse(result[0].body);
          if (data.status == 1) {
            // this.SidebarCssClass = "crm_sidebar_agent";
            this.MainNavigation = data.MainNavigation;
            this.MainNavigation2 = data.MainNavigation;
            this.RightsNavigation = data.ExtraRights;
            this.RightsNavigation2 = data.ExtraRights;
            this.ManegerNavigation = data.ManagerRights;
            this.ManegerNavigation2 = data.ManagerRights;
            this.CopyPasteRights = data.CopyPasteRights;

            this.eHRNavigation = data.eHRRights;
            this.eHRNavigation2 = data.eHRRights;

            if (this.RightsNavigation == "" && this.ManegerNavigation == "") {
              // alert('RightsNavigation');
              this.SidebarCssClass = "crm_sidebar_agent";
            }

            console.log(data);

            this.api.HideLoading();

            this.DataArMenus = data.data;

            console.log(this.DataArMenus);
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

  GetMenu() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("FCM_Token", this.api.GetFcmToken());

    //this.api.IsLoading();
    this.api.HttpPostType("Permission/Menus", formData).then(
      (result: any) => {
        //this.api.HideLoading();

        // console.log(result);

        if (result["status"] == 1) {
          this.MainNavigation = result["MainNavigation"];
          this.MainNavigation2 = result["MainNavigation"];
          this.RightsNavigation = result["ExtraRights"];
          this.RightsNavigation2 = result["ExtraRights"];
          this.ManegerNavigation = result["ManagerRights"];
          this.ManegerNavigation2 = result["ManagerRights"];
          this.eHRNavigation = result["eHRRights"];
          this.eHRNavigation2 = result["eHRRights"];

          this.CopyPasteRights = result["CopyPasteRights"];
          this.StopCutCopyPaste();

          //this.api.Toast('Success',result['msg']);
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
  OpenMenu(value: any) {
    // this.StopCutCopyPaste(value);
  }
  OpenPage(url) {
    //this.router.navigate([url]);
  }

  ClickMenu(Routess: any) {
    this.api.IsLoading();
    this.router.navigateByUrl("/" + Routess);
    this.api.HideLoading();
  }
  StopCutCopyPaste() {
    // alert(value);
    if (this.CopyPasteRights == 0) {
      // alert(this.CopyPasteRights);
      $("body").bind("cut copy", function (event) {
        event.preventDefault();
      });
      $("body").on("contextmenu", function (e) {
        return false;
      });
      $(document).keydown(function (event) {
        if (event.keyCode == 123) {
          // Prevent F12
          return false;
        } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
          // Prevent Ctrl+Shift+I
          return false;
        }
      });
      document.addEventListener("keyup", function (e) {
        var keyCode = e.keyCode ? e.keyCode : e.which;
        if (keyCode == 44) {
          // alert(keyCode);
          return false;
        }
      });
    }
  }

  // handleSearchTextChange(event: Event) {
  //   this.searchText = (event.target as HTMLInputElement).value; // Update the search text from the input

  //   this.foundMenuItems = [];
  //   const MENU: any = ""; // Initialize your MENU variable

  //   // alert(this.searchText);

  //   if (this.searchText) {
  //     this.searchText = this.searchText;
  //     this.findMenuItems(this.MainNavigation2);
  //     return;
  //   } else {
  //     this.searchText = "";
  //     // this.dropdown.isOpen = false;
  //   }
  // }

  // handleSearchTextChange(event) {
  //   // var SearchValue =  this.
  //   const SearchValue = document.getElementById("SearchSideBarValue")?.value;

  //   this.foundMenuItems = [];
  //   var MENU: any = "";
  //   alert(event);
  //   alert(SearchValue);
  //   console.log(event);
  //   console.log(SearchValue);

  //   // if (event.target.value) {
  //   //   this.searchText = event.target.value;
  //   //   this.findMenuItems(MENU);
  //   //   return;
  //   // } else {
  //   //   this.searchText = "";
  //   //   // this.dropdown.isOpen = false;
  //   // }
  // }

  // handleIconClick() {
  //   this.searchText = "";
  //   // this.dropdown.isOpen = false;
  // }

  // handleMenuItemClick() {
  //   this.searchText = "";
  //   // this.dropdown.isOpen = false;
  // }

  // findMenuItems(menu) {
  //   if (!this.searchText) {
  //     return;
  //   }
  //   var menuItem: any = "";

  //   menu.forEach((menuItem) => {
  //     // console.log(menuItem);
  //     this.MainNavigation = [];
  //     if (menuItem.Name.toLowerCase().includes(this.searchText.toLowerCase())) {
  //  //console.log(menuItem);
  //       return this.MainNavigation.push(menuItem);
  //     } else {
  //       this.MainNavigation = this.MainNavigation2;
  //     }
  //   });

  //   // if (this.foundMenuItems.length > 0) {
  //   //   // this.dropdown.isOpen = true;
  //   // }
  // }

  // boldString(str, substr) {
  //   return str.replaceAll(
  //     this.capitalizeFirstLetter(substr),
  //     `<strong class="text-light">${this.capitalizeFirstLetter(
  //       substr
  //     )}</strong>`
  //   );
  // }

  // capitalizeFirstLetter(string) {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // }
}
