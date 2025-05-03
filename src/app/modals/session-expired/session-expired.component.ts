import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../providers/api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-session-expired",
  templateUrl: "./session-expired.component.html",
  styleUrls: ["./session-expired.component.css"],
})
export class SessionExpiredComponent implements OnInit {
  LoginForm: FormGroup;
  isSubmitted = false;
  InputType: string = "text";
  myWindow: any;

  constructor(
    public dialogRef: MatDialogRef<SessionExpiredComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public api: ApiService,
    private router: Router
  ) {
    this.api.HideLoading();

    this.LoginForm = this.formBuilder.group({
      Password: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    // localStorage.setItem("LoginExpiredStatus", "FALSE");
    //  localStorage.setItem("SessionExpired_State", "TRUE");
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: "SessionModelClose",
    });
  }

  get FC() {
    return this.LoginForm.controls;
  }

  Relogin() {
    this.isSubmitted = true;
    if (this.LoginForm.invalid) {
      this.api.ToastBeforeLogin("Error", "Please enter password !");
      return;
    } else {
      var fields = this.LoginForm.value;
      const formData = new FormData();

      formData.append("type", this.api.GetUserData("Type"));
      formData.append("username", this.api.GetUserData("Code"));
      formData.append("password", fields["Password"]);

      this.api.IsLoading();
      this.api.HttpPostType("auth/login", formData).then(
        (result) => {
          this.api.HideLoading();

          if (result["status"] == 1) {
            this.api.ToastBeforeLogin("Success", result["msg"]);

            localStorage.setItem("LoginType", result["login_type"]);
            localStorage.setItem("Token", result["token"]);

            localStorage.removeItem("LoginExpiredStatus");
            localStorage.setItem("LoginExpiredStatus", "FALSE");

            localStorage.setItem("SessionExpired_State", "FALSE");

            localStorage.setItem("UserData", JSON.stringify(result["data"]));
            localStorage.setItem("Logged_In", "TRUE");

            let currentUrl = this.router.url;
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = "reload";
            this.router.navigate([currentUrl]);

            this.CloseModel();
          } else {
            //alert(result['message']);
            this.api.ToastBeforeLogin("Warning", result["msg"]);
          }
        },
        (err) => {
          // Error log
          //// console.log(err);
          this.api.HideLoading();
          this.api.ToastBeforeLogin(
            "Warning",
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }

  Logout() {
    this.api.IsLoading();

    this.myWindow = window.open(
      "https://www.squareinsurance.in/uat/sbiLive/Agents/logout/Crm",
      "",
      "width=200,height=100"
    );

    setTimeout(() => {
      localStorage.removeItem("LoginType");
      localStorage.removeItem("Token");
      localStorage.removeItem("UserData");
      localStorage.setItem("Logged_In", "FALSE");

      this.api.changeMessage({ IsLoggedIn: "FALSE" });
      this.api.HideLoading();
      this.myWindow.close();
      this.CloseModel();
      this.router.navigate(["/login"]);
    }, 2000);
  }
}
