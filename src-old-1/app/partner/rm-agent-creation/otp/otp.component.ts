import { Component, OnInit, Inject } from "@angular/core";
import { RmAgentCreationComponent } from "../rm-agent-creation.component";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "src/app/providers/api.service";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.css"],
})
export class OtpComponent implements OnInit {
  otpForm: FormGroup;
  otpSent: boolean = false;
  otpError: string = "";
  showOTPInput = false;
  timerId: any;
  ResendOtpButton = true;
  number: any;
  verified = false;

  constructor(
    private dialogRef: MatDialogRef<RmAgentCreationComponent>,
    public http: HttpClient,
    public api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.number = this.data.number;
    this.otpForm = new FormGroup({
      otp: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\+91\d{10}$/),
      ]),
    });
    this.otpForm = this.formBuilder.group({
      otp: ["", Validators.required],
      showotp: ["", Validators.required],
    });
  }

  ngOnInit() {}

  resendotp(): void {
    const formData = new FormData();
    var timeSec = 60;
    this.ResendOtpButton = false;
    formData.append("User_Id", this.api.GetUserId());
    formData.append("mobile", this.number);

    this.api.IsLoading();
    this.api.HttpPostTypeBms("sr/RMAgentReport/resendotp", formData).then(
      (result) => {
        this.api.HideLoading();
        clearInterval(this.timerId);

        if (result["status"] == 1) {
          //   //   //   console.log("OTP sent:", result["otp"]);
          this.showOTPInput = true;
          this.api.Toast("Success", result["msg"]);
          this.otpSent = true;

          this.timerId = setInterval(() => {
            timeSec--;
            ////   //   console.log(timeSec);
            this.ResendOtpButton = true;
            if (timeSec <= 0) {
              clearInterval(this.timerId);
              this.ResendOtpButton = false;
            }
          }, 1000);
        } else {
          this.api.Toast("Warning", result["msg"]);
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", err.message);
      }
    );
  }

  verifyOTP(): void {
    const formData = new FormData();
    formData.append("User_Id", this.api.GetUserId());
    formData.append("otp", this.otpForm.get("showotp").value);

    this.api.IsLoading();
    this.api.HttpPostTypeBms("sr/RMAgentReport/verifyotp", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.verified = true;
          this.api.Toast("Success", "OTP matched!");
          this.CloseModel();
        } else {
          this.api.Toast("Warning", "OTP not matched. Please enter OTP again.");
          this.verified = false;
        }
      },
      (err) => {
        this.api.HideLoading();
        this.api.Toast("Warning", err.message);
      }
    );
  }

  CloseModel(): void {
    this.dialogRef.close({
      Status: this.verified,
    });
  }
}
