import { Component, OnInit } from "@angular/core";
import { BmsapiService } from "../../providers/bmsapi.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
@Component({
  selector: "app-checkgrid",
  templateUrl: "./checkgrid.component.html",
  styleUrls: ["./checkgrid.component.css"],
})
export class CheckgridComponent implements OnInit {
  url: string = "";
  urlSafe: SafeResourceUrl;

  constructor(public api: BmsapiService, public sanitizer: DomSanitizer) {}

  ngOnInit() {
    var UserType = this.api.GetUserData("Type") == "employee" ? 0 : 1;

    this.url =
      "https://checkgrid.in?user_id=" +
      this.api.GetUserData("User_Id") +
      "&UserType=" +
      UserType +
      "&source=crm";

    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

  /* 1  
    this.api.IsLoading();
    this.api.Call('../v2/pay-in/Grid/Login_via_app?user_code='+this.api.GetUserData('Code')).then((result:any) => {
    this.api.HideLoading();
      if(result['status'] == true){
        
      //alert(result['redirect_Url']);

       this.url = result['redirect_Url'];
       this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

      }else{
        //alert(result['Message']);
      }
    }, (err) => { 
      // Error log
      this.api.HideLoading();
       
      //alert(err.message);
    });
    */
  }
}
