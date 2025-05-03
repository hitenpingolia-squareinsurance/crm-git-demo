import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ApiService } from "../providers/api.service";
import { MatDialogRef } from '@angular/material/dialog';
import { PmsOtpService } from '../providers/pmsotp.service';

@Component({
  selector: 'app-pms-otp-popup',
  templateUrl: './pms-otp-popup.component.html'
})
export class PmsOtpPopupComponent {

  pmsOTPForm: FormGroup;
  ForgetPasswordForm: FormGroup;
  isSubmitted = false;
  OtpVisible:boolean =false;
  private otpVerifiedKey = 'otpVerified';
  private otpVerifiedTimestampKey = 'otpVerifiedTimestamp';
  loginUserMobileNo:any;
  buttonValue :any= "Send OTP";

  constructor(
    private dialogRef: MatDialogRef<PmsOtpPopupComponent>,
    private pmsotpService: PmsOtpService,
    public api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {

    this.loginUserMobileNo = this.api.GetUserData("Mobile");

    this.pmsOTPForm = this.formBuilder.group({
      pms_otp: [{ value:'', disabled: true }, [Validators.required, Validators.minLength(6), Validators.maxLength(6), this.noWhitespaceValidator()]],
      MobileNo:[{ value: this.loginUserMobileNo, disabled: true }, [Validators.required]],
    });

  }


  ngOnInit() {

  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }
  
  get formControls() {
    return this.pmsOTPForm.controls;
  }
  
  closeDialog() {
    this.dialogRef.close(false);
  }

  processedOTP(){
    if(!this.OtpVisible && this.buttonValue=='Send OTP'){
      this.sendOTP()
    }else{
      this.verifyOtp();
    }
  }

  handleInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;
    inputValue = inputValue.replace(/\D/g, ''); // Remove non-digit characters
    this.pmsOTPForm.patchValue({ pms_otp: inputValue }); // Update the form control value
  }

  sendOTP() {
    this.api.IsLoading();
    const formData = new FormData();
    formData.append("UserCode", this.api.GetUserData("Code"));
    formData.append("MobileNo", this.api.GetUserData("MobileNo"));
    this.api.HttpPostType("Profile/posOTPSend", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          
          this.buttonValue = "Verify";
          this.OtpVisible = true;
          this.pmsOTPForm.get("pms_otp").setValidators([
            Validators.required, 
            Validators.minLength(6), Validators.maxLength(6), 
            this.noWhitespaceValidator()
          ]);
          this.pmsOTPForm.get("pms_otp").updateValueAndValidity();
          this.pmsOTPForm.get("pms_otp").enable();

          this.api.Toast("Success", result["msg"]);
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  verifyOtp(){
    this.isSubmitted = true;
    if (this.pmsOTPForm.invalid) {
      return;
    }
    this.api.IsLoading();
    var fields = this.pmsOTPForm.value;
    const formData = new FormData();
    formData.append("UserCode", this.api.GetUserData("Code"));
    formData.append("mobile", this.api.GetUserData("Mobile"));
    formData.append("pms_otp", fields["pms_otp"]);
    this.api.HttpPostType("Profile/verifyPosOTP", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["status"] == 1) {
          this.isSubmitted = false;
          this.api.Toast("Success", result["msg"]);

          this.buttonValue = "Send OTP";
          this.OtpVisible = false;
          this.pmsOTPForm.get("pms_otp").disable();
  
          //localStorage.setItem(this.otpVerifiedKey, 'true');
          //localStorage.setItem(this.otpVerifiedTimestampKey, Date.now().toString());
          window.dispatchEvent(new Event('otpVerified')); // Trigger custom event
          this.dialogRef.close(true);
        } else {
          this.api.Toast("Warning", result["msg"]);
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

  closePmsModel(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/dashboard']);
  }

}
