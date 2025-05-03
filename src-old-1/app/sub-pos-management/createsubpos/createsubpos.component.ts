import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "../../providers/api.service";

@Component({
  selector: "app-createsubpos",
  templateUrl: "./createsubpos.component.html",
  styleUrls: ["./createsubpos.component.css"],
})
export class CreatesubposComponent implements OnInit {
  AddForm: FormGroup;
  isSubmitted: boolean;
  ShowSubmit: boolean = false;
  ShowSubmitOtp: boolean = false;
  buttonOtp = true;
  ResendOtpButton = false;
  timerId: any;
  buttondisabled = true;
  constructor(
    public api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.AddForm = this.formBuilder.group({
      quantities: this.formBuilder.array([]),
    });

    this.checkAbelity();
  }

  ngOnInit() {
    this.addQuantity();
  }

  quantities(): FormArray {
    return this.AddForm.get("quantities") as FormArray;
  }

  newQuantity(): FormGroup {
    return this.formBuilder.group({
      Mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[6-9]{1}[0-9]{9}$"),
        ],
      ],
      Otp: ["", [Validators.pattern("^[0-9]{6}$")]],
    });
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
    this.ShowSubmitOtp = true;
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }
  get FC() {
    return this.AddForm.controls;
  }

  checkAbelity() {
    const formData = new FormData();

    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());

    this.api.IsLoading();
    this.api.HttpPostType("Subpos/CheckAbility", formData).then(
      (result) => {
        this.api.HideLoading();
        if (result["Status"] == true) {
          // this.api.Toast("Success", result["Message"]);
          this.buttondisabled = false;
        } else {
          this.api.Toast("Warning", result["Message"]);
          this.router.navigate(["Pos/view-manage-request"]);
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

  SendOtp() {
    var timeSec = 60;

    this.isSubmitted = true;
    // // console.log(this.AddForm.controls.quantities['controls'][0].controls.Mobile.errors);

    if (this.AddForm.invalid) {
      return;
    } else {
      // console.log(this.AddForm.value);
      var fields = this.AddForm.value;
      const formData = new FormData();

      formData.append("Data", JSON.stringify(fields["quantities"]));
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());
      formData.append("Type", "Add");

      this.api.IsLoading();
      this.api.HttpPostType("Subpos/SendOtp", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.buttonOtp = false;
            this.ShowSubmitOtp = false;
            this.ShowSubmit = true;
            this.checkAbelity();

            clearInterval(this.timerId);

            // this.api.Toast("Success", result["msg"]);
            this.timerId = setInterval(() => {
              timeSec--;
              document.getElementById("ResendOtpButton").innerHTML =
                "Resend in " + timeSec;
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

            this.api.Toast("Success", result["Message"]);

            // this.router.navigate(['Pos/view-manage-request']);
          } else {
            this.api.Toast("Warning", result["Message"]);
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
  }

  onSubmit() {
    this.isSubmitted = true;
    // // console.log(this.AddForm.controls.quantities['controls'][0].controls.Mobile.errors);

    if (this.AddForm.invalid) {
      return;
    } else {
      // console.log(this.AddForm.value);

      var fields = this.AddForm.value;
      const formData = new FormData();

      formData.append("Data", JSON.stringify(fields["quantities"]));
      formData.append("User_Id", this.api.GetUserData("Id"));
      formData.append("User_Type", this.api.GetUserType());

      this.api.IsLoading();
      this.api.HttpPostType("Subpos/ApprovedSubpos", formData).then(
        (result) => {
          this.api.HideLoading();
          if (result["Status"] == true) {
            this.api.Toast("Success", result["Message"]);
            this.checkAbelity();

            this.router.navigate(["Pos/view-manage-request"]);
          } else {
            this.api.Toast("Warning", result["Message"]);
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
  }

  ResendOTP() {
    var timeSec = 60;

    // this.ForgetPasswordForm.get("Username").enable();

    // console.log(this.AddForm.value);

    var fields = this.AddForm.value;
    const formData = new FormData();

    formData.append("Data", JSON.stringify(fields["quantities"]));
    formData.append("User_Id", this.api.GetUserData("Id"));
    formData.append("User_Type", this.api.GetUserType());
    formData.append("Type", "ResendOTP");

    this.api.HttpPostType("Subpos/SendOtp", formData).then((result: any) => {
      if (result["Status"] == true) {
        clearInterval(this.timerId);

        this.timerId = setInterval(() => {
          timeSec--;
          document.getElementById("ResendOtpButton").innerHTML =
            "Resend in " + timeSec;
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
        this.api.Toast("Warning", result["msg"]);
      }
    });
  }

  // onSubmit() {

  //   this.isSubmitted = true;
  //   // // console.log(this.AddForm.controls.quantities['controls'][0].controls.Mobile.errors);

  //   if (this.AddForm.invalid) {
  //     return;
  //   }
  //   else {

  //     // console.log(this.AddForm.value);

  //     var fields = this.AddForm.value;
  //     const formData = new FormData();

  //     formData.append('Data', JSON.stringify(fields['quantities']));
  //     formData.append('User_Id', this.api.GetUserData('Id'));
  //     formData.append('User_Type', this.api.GetUserType());

  //     this.api.IsLoading();
  //     this.api.HttpPostType('Subpos/Add', formData).then((result:any) => {
  //       this.api.HideLoading();
  //       if (result['Status'] == true) {

  //         this.api.Toast('Success', result['Message']);

  //         this.router.navigate(['Pos/view-manage-request']);

  //       }
  //       else {
  //         this.api.Toast('Warning', result['Message']);
  //       }
  //     }, (err) => {

  //       this.api.HideLoading();
  //       this.api.Toast('Warning', 'Network Error : ' + err.name + '(' + err.statusText + ')');

  //     });

  //   }

  // }
}
