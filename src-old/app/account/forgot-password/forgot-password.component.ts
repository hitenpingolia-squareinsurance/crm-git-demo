import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiService } from "../../providers/api.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  loginForm: FormGroup;
  ForgetPasswordForm: FormGroup;
  isSubmitted = false;
  loadAPI: Promise<any>;
  Types: string = "";
  Id: any = 0;
  loginpoupup = "block";
  ForgetPasswordPoupup = "none";
  ForgetOtpInput = true;
  PasswordVisible = 0;
  OtpVisible = 0;
  buttonVallue = "Send OTP";
  userType: FormGroup;
  timerId: any;
  ResendOtpButton = true;
  Action: any;
  GetMobile: any;
  Readonly: any;

  disableCloseButton: boolean = false;
  loginPasswordCheckStatus: string | "1";
  isPasswordVisible = false;
  isPasswordVisibleconfirm = false;

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public api: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.ForgetPasswordForm = this.formBuilder.group({
      MobileNo: ["", Validators.required],
      ForgetOtp: [{ value: "", disabled: true }, Validators.required],
      ChangePassword: [{ value: "", disabled: true }, Validators.required],
      ConfrimPassword: [{ value: "", disabled: true }, Validators.required],
      //RememberMe: ['']
    });

    this.userType = this.data.LoginType;
    this.Action = this.data.Action;

    if (this.Action == "Change Password") {
      this.GetMobile = this.api.GetUserData("Mobile");

      this.ForgetPasswordForm.get("MobileNo").setValue(this.GetMobile);
    }
  }

  ngOnInit() {
    this.loginPasswordCheckStatus = localStorage.getItem(
      "password_change_status"
    );
    // Disable the close button if status is 0
    if (this.loginPasswordCheckStatus === "0") {
      this.disableCloseButton = true;
    } else if (this.loginPasswordCheckStatus === "2") {
      this.disableCloseButton = true;
    }
  }

  CloseModel(): void {
    localStorage.setItem("password_change_status", "1");
    if (!this.disableCloseButton) {
      this.dialogRef.close({
        Status: "Model Close",
      });
    } else {
      this.disableCloseButton = false;
      this.dialogRef.close({
        Status: "Model Close",
      });
    }
  }

  preventClose(event: Event) {
    if (this.disableCloseButton) {
      event.stopPropagation(); // Stop event from closing modal
    }
  }

  get formControls() {
    return this.ForgetPasswordForm.controls;
  }

  ForgetPassword(buttonVallue: any) {
    this.isSubmitted = true;
    // console.log(this.ForgetPasswordForm.invalid);
    if (this.ForgetPasswordForm.invalid) {
      return;
    } else {
      var timeSec = 60;
      var fields = this.ForgetPasswordForm.value;
      const formData = new FormData();

      formData.append("UserType", this.data.LoginType);
      formData.append("MobileNo", fields["MobileNo"]);
      formData.append("ForgetOtp", fields["ForgetOtp"]);
      formData.append("ChangePassword", fields["ChangePassword"]);
      formData.append("ConfrimPassword", fields["ConfrimPassword"]);
      formData.append("type", buttonVallue);

      this.ResendOtpButton = true;

      this.api.HttpPostType("TrainingExam/Forgetpassword", formData).then(
        (result) => {
          clearInterval(this.timerId);

          if (result["status"] == 1) {
            this.buttonVallue = "Verify";
            this.OtpVisible = 1;

            this.ForgetPasswordForm.get("ForgetOtp").setValidators([
              Validators.required,
            ]);


            this.ForgetPasswordForm.get("ForgetOtp").updateValueAndValidity();
            this.ForgetPasswordForm.get("ForgetOtp").enable();
            this.api.ToastBeforeLogin("Success", result["msg"]);

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
          } else if (result["status"] == 2) {
            this.buttonVallue = "Change Password";
            this.OtpVisible = 0;
            this.PasswordVisible = 1;
            this.ForgetPasswordForm.get("ForgetOtp").setValidators([
              Validators.required,
            ]);
            this.ForgetPasswordForm.get("ForgetOtp").updateValueAndValidity();
            this.ForgetPasswordForm.get("ForgetOtp").enable();

            this.ForgetPasswordForm.get("ChangePassword").setValidators([
              Validators.required,
            ]);
            this.ForgetPasswordForm.get(
              "ChangePassword"
            ).updateValueAndValidity();
            this.ForgetPasswordForm.get("ChangePassword").enable();
            this.ForgetPasswordForm.get("ConfrimPassword").setValidators([
              Validators.required,
            ]);
            this.ForgetPasswordForm.get(
              "ConfrimPassword"
            ).updateValueAndValidity();
            this.ForgetPasswordForm.get("ConfrimPassword").enable();
            this.api.ToastBeforeLogin("Success", result["msg"]);
          } else if (result["status"] == 3) {
            this.api.ToastBeforeLogin("Success", result["msg"]);
            this.CloseModel();
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
    }
  }

  ResendOTP() {
    var timeSec = 60;

    // this.ForgetPasswordForm.get("Username").enable();

    var fields = this.ForgetPasswordForm.value;
    const formData = new FormData();

    formData.append("type", this.data.LoginType);
    formData.append("username", fields["MobileNo"]);
    formData.append("OtpType", "ForgetPassword");

    this.api.HttpPostType("auth/ResendOtp", formData).then((result: any) => {
      if (result["status"] == "1") {
        clearInterval(this.timerId);

        this.api.ToastBeforeLogin("Success", result["msg"]);
        this.timerId = setInterval(() => {
          timeSec--;
          document.getElementById("ResendOtpButton").innerHTML = "" + timeSec;

          // Resend in timeSec;
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

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  togglePasswordVisibilityConfirm() {
    this.isPasswordVisibleconfirm = !this.isPasswordVisibleconfirm;
  }
}
