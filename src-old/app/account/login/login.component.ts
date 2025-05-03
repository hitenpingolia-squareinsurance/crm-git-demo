import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";
import { MatDialog } from "@angular/material/dialog";
import { ForgotPasswordComponent } from "./../forgot-password/forgot-password.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  addUserForm: FormGroup;

  ForgetPasswordForm: FormGroup;
  isSubmitted = false;
  loadAPI: Promise<any>;
  Types: string = "";
  Id: any = 0;
  loginpoupup = "block";
  ForgetPasswordPoupup = "none";
  buttonVallue = "Proceed";
  buttonVallueLogin = "Switch to Password Login";
  OtpVisible = 0;
  PasswordVisible = 0;
  timerId: any;
  ResendOtpButton = true;
  SubmitButton = false;
  EmitraCheckFalg: any = 0;
  currentYear: any;
  support: any;
  primaryId: any;
  constructor(
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    const Types = this.activatedRoute.snapshot.paramMap.get("Type");
    if (
      Types == "agent" ||
      Types == "sp" ||
      Types == "user" ||
      Types == "employee"
    ) {
    } else {
      this.api.ToastBeforeLogin("Warning", "Login Method is not valid");
    }

    this.loginForm = this.formBuilder.group({
      Type: [Types, Validators.required],
      Username: ["", [Validators.required, Validators.pattern("^[a-zA-Z0-9]")]],
      Password: ["", Validators.required],
      //RememberMe: ['']
    });

    this.addUserForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("[a-zA-Z ]*$")]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
          ),
        ],
      ],
      pincode: ["", [Validators.required, Validators.pattern("[0-9]{6}")]],
      //RememberMe: ['']
    });

    this.Types = this.activatedRoute.snapshot.paramMap.get("Type");
    this.Id = this.activatedRoute.snapshot.paramMap.get("Id");

    if (
      this.Types == "agent" ||
      this.Types == "sp" ||
      this.Types == "user" ||
      this.Types == "employee"
    ) {
      this.SwtichToLogin();
    } else {
      this.api.ToastBeforeLogin("Warning", "Login Method is not valid");
    }

    if (this.Id != 0) {
      this.SwtichToLogin();
    }

    this.loginForm = this.formBuilder.group({
      Type: [this.Types, Validators.required],
      Username: [
        "",
        [Validators.required, Validators.pattern("^[a-zA-Z0-9]*$")],
      ],
      Password: [{ value: "", disabled: true }, Validators.required],
      LoginOtp: [{ value: "", disabled: true }, Validators.required],
    });
  }

  ngOnInit() {
    // this.currentYear = new Date().getFullYear();

    let currentYear_full = new Date().getFullYear();
    this.currentYear = currentYear_full.toString().slice(-2);
    if (this.api.CheckLoginStatus() == "TRUE") {
      this.router.navigateByUrl("/dashboard");
    } else {
      //this.router.navigateByUrl('/login');
      // window.location.href=this.api.ReturnWebUrl();
    }
    var queryString = location.search;

    var splits = queryString.split("**");

    var ID = atob(decodeURIComponent(splits[0].replace("?id=", "")));
    var PWSD = atob(decodeURIComponent(splits[1].replace("pwsd%3D", "")));

    if (ID == "" || PWSD == "") {
    } else {
      this.api.IsLoading();
      this.loginForm.get("Username").setValue(ID);
      this.loginForm.get("Password").setValue(PWSD);
      this.EmitraCheckFalg = 1;

      setTimeout(function () {
        document.getElementById("clickswitchpasws").click();
        document.getElementById("ProceedButtonValueGetByID").click();
      }, 2000);
    }
  }

  ViewPassword() {
    if (
      this.buttonVallue == "Proceed" ||
      (this.buttonVallue == "Login" &&
        this.buttonVallueLogin == "Switch to Password Login")
    ) {
      // alert(this.buttonVallue);
      // alert(this.buttonVallueLogin);
      this.buttonVallue = "Login";
      this.PasswordVisible = 1;
      this.loginForm.get("Password").enable();
      this.loginForm.get("LoginOtp").disable();
      this.OtpVisible = 0;
      this.buttonVallueLogin = "Switch to OTP Login";
      // $("#ResendOtpButton").prop('disabled', true);
      this.ResendOtpButton = true;
    } else {
      this.buttonVallue = "Proceed";
      this.PasswordVisible = 0;

      this.loginForm.get("Password").disable();

      this.buttonVallueLogin = "Switch to Password Login";
      // $("#ResendOtpButton").prop('disabled', true);
      this.ResendOtpButton = true;
    }
  }

  get formControls() {
    return this.loginForm.controls;
  }

  login() {
    this.loginForm.get("Username").enable();
    var timeSec = 60;

    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      // alert(this.buttonVallue+' '+this.buttonVallueLogin);
      var fields = this.loginForm.value;
      const formData = new FormData();

      formData.append("type", fields["Type"]);
      formData.append("username", fields["Username"]);
      formData.append("password", fields["Password"]);
      formData.append("LoginOtp", fields["LoginOtp"]);

      if (
        this.buttonVallue == "Proceed" &&
        this.buttonVallueLogin == "Switch to Password Login"
      )
        formData.append("ButtonValue", "Send Otp");
      else if (
        this.buttonVallue == "Login" &&
        this.buttonVallueLogin == "Switch to Password Login"
      )
        formData.append("ButtonValue", "Verify");
      else formData.append("ButtonValue", this.buttonVallue);

      this.ResendOtpButton = true;
      this.SubmitButton = true;

      if (this.buttonVallue == "Proceed") {
        this.api.HttpPostType("auth/LoginSendOtp", formData).then(
          (result) => {

            clearInterval(this.timerId);
            this.SubmitButton = false;

            if (result["status"] == 1) {
              this.buttonVallue = "Login";
              this.OtpVisible = 1;
              this.loginForm.get("Username").disable();
              this.loginForm.get("LoginOtp").enable();
              this.api.ToastBeforeLogin("Success", result["msg"]);
              // setInterval(()=> {
              // }
              this.support = result["support"];

              this.primaryId = result["id"];

              this.timerId = setInterval(() => {
                timeSec--;
                document.getElementById("ResendOtpButton").innerHTML =
                  "" + timeSec;

                // timeSec;
                // document.getElementById('ResendOtpButton').disabled='true';
                // $("#ResendOtpButton").prop('disabled', true);
                
                this.ResendOtpButton = true;

                if (timeSec == 1) {
                  timeSec = 60;
                  document.getElementById("ResendOtpButton").innerHTML =
                    "Resend";
                  clearInterval(this.timerId);
                  $("#ResendOtpButton").prop("disabled", false);
                  this.ResendOtpButton = false;
                }
              }, 1000);
            } else {
              this.api.ToastBeforeLogin("Warning", result["msg"]);
              this.api.HideLoading();
            }
          },
          (err) => {
            this.api.HideLoading();
            this.api.ToastBeforeLogin(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
      } else {
        var flags = this.EmitraCheckFalg;
        formData.append("EmitraCheckFalg", flags);

        this.api.IsLoading();
        this.api.HttpPostTypeLogin("auth/login", formData).then(
          (result) => {
            this.SubmitButton = false;

            if (result["status"] == 1) {
              // console.log(result);

              //   //   //   console.log(this.support);

              if (this.support == 1) {
                this.api.HideLoading();
                document.getElementById("clickbtn").click();
              } else {
                this.api.SetDashboardLoginPoupupValue(1);
                localStorage.setItem("LoadingDashboardPoupup", "1");
                localStorage.setItem("LoginType", result["login_type"]);
                localStorage.setItem("LoginIdSet", result["data"]["Id"]);
                localStorage.setItem("Token", result["token"]);
                localStorage.setItem(
                  "password_change_status",
                  result["password_change_status"]
                );
                localStorage.setItem(
                  "UserData",
                  JSON.stringify(result["data"])
                );
                localStorage.removeItem("LoginExpiredStatus");
                localStorage.setItem("LoginExpiredStatus", "FALSE");

                localStorage.setItem("Logged_In", "TRUE");
                this.api.changeMessage({ IsLoggedIn: "TRUE" });
                if (
                  result["login_type"] == "agent" &&
                  result["data"]["pos_status"] == "2"
                ) {
                  localStorage.setItem("Prime_Status", result["PrimeStatus"]);
                  localStorage.setItem("GemsStatus", result["GemsStatus"]);
                }

                if (result["login_type"] == "agent") {
                  localStorage.setItem("LifeStatus", result["Life_Status"]);
                }
                if (result["login_type"] == "agent")
                  localStorage.setItem("Login_Token", result["login_token"]);

                let LoginTypes = result["login_type"];
                const UserDatas = result["data"]["Id"];

                if (
                  result["login_type"] == "sp" ||
                  result["login_type"] == "user" ||
                  result["login_type"] == "agent"
                ) {
                  let a = document.createElement("a");
                  a.target = "";
                  if (
                    location.origin == "http://localhost:4200" ||
                    location.origin == "http://localhost:4500"
                  ) {
                    if (LoginTypes == "user") {
                      LoginTypes = "agent";
                    }

                    a.href =
                      this.api.ReturnWebUrl() +
                      "/redirecting-session-users/" +
                      LoginTypes +
                      "/" +
                      btoa(UserDatas) +
                      "?ReturnUrl=" +
                      location.origin;
                  } else {
                    a.href =
                      this.api.ReturnWebUrl() +
                      "/redirecting-session-users/" +
                      LoginTypes +
                      "/" +
                      btoa(UserDatas) +
                      "/?ReturnUrl=https://crm.squareinsurance.in";
                  }
                  a.click();
                } else {
                  let a = document.createElement("a");
                  a.target = "";

                  if (
                    location.origin == "http://localhost:4200" ||
                    location.origin == "http://localhost:4500"
                  ) {
                    a.href =
                      this.api.ReturnWebUrl() +
                      "/redirecting-session-users/employee/" +
                      btoa(UserDatas) +
                      "?ReturnUrl=" +
                      location.origin;
                  } else {
                    a.href =
                      this.api.ReturnWebUrl() +
                      "/redirecting-session-users/employee/" +
                      btoa(UserDatas) +
                      "?ReturnUrl=https://crm.squareinsurance.in";
                  }
                  //=https://crm.squareinsurance.in/
                  // a.href = this.api.ReturnWebUrl() + '/Prequotes/SetSessionEmployee/login/' + btoa(UserDatas) + '?ReturnUrl=http://localhost:4200/dashboard';
                  a.click();
                }
              }

              //  this.router.navigate(['dashboard']);
            } else {
              this.SubmitButton = false;

              this.api.ToastBeforeLogin("Warning", result["msg"]);
              this.api.HideLoading();
            }
          },
          (err) => {
            this.SubmitButton = false;

            this.api.HideLoading();
            this.api.ToastBeforeLogin(
              "Warning",
              "Network Error : " + err.name + "(" + err.statusText + ")"
            );
          }
        );
      }
    }
  }

  ResendOTP() {
    var timeSec = 60;

    this.loginForm.get("Username").enable();

    var fields = this.loginForm.value;
    const formData = new FormData();

    formData.append("type", fields["Type"]);
    formData.append("username", fields["Username"]);
    formData.append("OtpType", "Login");

    this.api.HttpPostType("auth/ResendOtp", formData).then((result: any) => {
      if (result["status"] == "1") {
        clearInterval(this.timerId);

        this.api.ToastBeforeLogin("Success", result["msg"]);
        this.timerId = setInterval(() => {
          timeSec--;
          document.getElementById("ResendOtpButton").innerHTML = "" + timeSec;
          // document.getElementById('ResendOtpButton').disabled='true';
          $("#ResendOtpButton").prop("disabled", true);
          this.ResendOtpButton = true;

          if (timeSec == 1) {
            timeSec = 60;
            document.getElementById("ResendOtpButton").innerHTML = "Resend";
            clearInterval(this.timerId);
            $("#ResendOtpButton").prop("disabled", false);
            this.ResendOtpButton = false;
          }
        }, 1000);
      } //ok
      else {
        this.api.ToastBeforeLogin("Warning", result["msg"]);
      }
    });
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
          //"assets/bower_components/fastclick/lib/fastclick.js",
          "assets/dist/js/adminlte.min.js",
          //"assets/bower_components/jquery-sparkline/dist/jquery.sparkline.min.js",
          //"assets/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js",
          //"assets/plugins/jvectormap/jquery-jvectormap-world-mill-en.js",
          //"assets/bower_components/jquery-slimscroll/jquery.slimscroll.min.js",
          //"assets/bower_components/chart.js/Chart.js",
          //"assets/dist/js/pages/dashboard2.js",
          //"assets/dist/js/demo.js"
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
        //node.async = false;
        node.charset = "utf-8";
        document.getElementsByTagName("body")[0].appendChild(node);
      }
    }
  }

  SwtichToLogin() {
    //alert(this.Id);

    const formData = new FormData();

    formData.append("type", this.Types);
    formData.append("username", "");
    formData.append("Id", this.Id);
    formData.append("password", "");
    formData.append("LoginType", "SwtichToLogin");

    this.api.IsLoading();
    this.api.HttpPostType("auth/SwtichToLogin", formData).then(
      (result) => {
        this.api.HideLoading();

        if (result["status"] == 1) {
          this.api.ToastBeforeLogin("Success", result["msg"]);
          this.api.SetDashboardLoginPoupupValue(1);
          localStorage.setItem("LoginType", result["login_type"]);
          localStorage.setItem("Token", result["token"]);
          localStorage.setItem("UserData", JSON.stringify(result["data"]));
          localStorage.setItem("Logged_In", "TRUE");
          this.api.changeMessage({ IsLoggedIn: "TRUE" });

          if (result["login_type"] == "agent")
            localStorage.setItem("Login_Token", result["login_token"]);

          const LoginTypes = result["login_type"];
          const UserDatas = result["data"]["Id"];

          if (
            result["login_type"] == "sp" ||
            result["login_type"] == "user" ||
            result["login_type"] == "agent"
          ) {
            //  var myWindow;
            //  myWindow=window.open(this.api.ReturnWebUrl()+"/Agents/SetAndGetFunctionFRomCRM/"+LoginTypes+'/'+UserDatas,"", "width=1,height=1,top=1000");
            //  setTimeout(function(){
            // 	myWindow.close();
            // 	 },600);
          }

          this.router.navigate(["dashboard"]);
        } else {
          //alert(result['message']);
          // this.api.ToastBeforeLogin('Warning',result['msg']);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.ToastBeforeLogin(
          "Warning",
          "Network Error : " + err.name + "(" + err.statusText + ")"
        );
      }
    );
  }

  ForgetPassword(Type: any, Action: any) {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: "auto",
      height: "auto",
      disableClose: true,
      data: { LoginType: Type, Action: Action },
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  get formControls2() {
    return this.addUserForm.controls;
  }

  AddUserDetails() {
    this.isSubmitted = true;
    if (this.addUserForm.invalid) {
      return;
    } else {
      var fields = this.addUserForm.value;

      const formData = new FormData();

      formData.append("user_id", this.primaryId);
      formData.append("user_type", this.api.GetUserType());
      formData.append("name", fields["name"]);
      formData.append("email", fields["email"]);
      formData.append("pincode", fields["pincode"]);

      this.api.IsLoading();
      this.api.HttpPostType("Dashboard/UserMoreDetailsUpdate", formData).then(
        (result) => {
          this.api.HideLoading();
          // console.log(result);
          if (result["status"] == 1) {
            // this.api.Toast("Success", 'Please login again!');
            document.getElementById("clickbtn").click();
            this.support = 0;
            // this.router.navigateByUrl('/Logoutweb');

            this.buttonVallue = "Login";
            document.getElementById("ProceedButtonValueGetByID").click();
            // this.login();
          } else {
            const msg = "msg";
            this.api.Toast("Warning", result["msg"]);

            //alert(result['message']);
          }
        },
        (err) => {
          // Error log
          // // console.log(err);
          this.api.HideLoading();
          const newLocal = "Warning";
          this.api.Toast(
            newLocal,
            "Network Error : " + err.name + "(" + err.statusText + ")"
          );
          //this.api.ErrorMsg('Network Error :- ' + err.message);
        }
      );
    }
  }
}
